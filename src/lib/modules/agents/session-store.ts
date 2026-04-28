import type { CoreMessage } from "./types";
import { getRedis, isRedisConfigured } from "@/lib/external/upstash/redis";
import { getWsEncryptionKey } from "@/lib/env";
import type { SessionState } from "./types";

const SESSION_TTL = 7 * 24 * 3600;
const DEDUP_TTL = 3600;
const LONG_MEMORY_TTL = 365 * 24 * 3600;
const MAX_HISTORY = 50;

function dKey(wamid: string): string { return `wa:dedup:${wamid}`; }
function sKey(phone: string): string { return `wa:session:${phone}`; }
function qKey(phone: string): string { return `wa:queue:${phone}`; }
function lKey(phone: string): string { return `wa:longmemory:${phone}`; }

// ─── In-memory fallback ────────────────────────────────

const memStore = new Map<string, string>();
const memQueues = new Map<string, string[]>();

function memSet(key: string, value: string): void { memStore.set(key, value); }
function memGet(key: string): string | undefined { return memStore.get(key); }
function memDel(key: string): void { memStore.delete(key); memQueues.delete(key); }
function memLPush(key: string, value: string): void {
  const q = memQueues.get(key) || [];
  q.unshift(value);
  memQueues.set(key, q);
}
function memLIndex(key: string, index: number): string | undefined {
  const q = memQueues.get(key);
  return q ? q[index] : undefined;
}
function memLRange(key: string, start: number, end: number): string[] {
  const q = memQueues.get(key);
  if (!q) return [];
  return q.slice(start, end === -1 ? undefined : end + 1);
}

async function getR() {
  if (!isRedisConfigured()) throw new Error("Redis no configurado");
  return getRedis();
}

function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> { return fn().catch(() => fb); }

let _encKey: CryptoKey | null = null;
async function getEncKey(): Promise<CryptoKey> {
  if (_encKey) return _encKey;
  _encKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(getWsEncryptionKey()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return _encKey;
}

export async function anonymizePhone(phone: string): Promise<string> {
  const secret = getWsEncryptionKey();
  if (!secret) return phone;
  const key = await getEncKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(phone));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("").substring(0, 16);
}

// ─── Session ─────────────────────────────────────────

export async function getSession(phone: string): Promise<SessionState | null> {
  if (!isRedisConfigured()) {
    const raw = memGet(sKey(phone));
    return raw ? JSON.parse(raw) : null;
  }
  return safe(async () => {
    const raw = await (await getR()).get<string>(sKey(phone));
    return raw ? JSON.parse(raw) : null;
  }, null);
}

export async function createSession(phone: string, name?: string): Promise<void> {
  const data = JSON.stringify({
    phone, name, history: [], createdAt: Date.now(), lastActivity: Date.now(),
  });
  if (!isRedisConfigured()) { memSet(sKey(phone), data); return; }
  const r = await getR();
  await r.setex(sKey(phone), SESSION_TTL, data);
}

export async function addToHistory(phone: string, msg: CoreMessage): Promise<void> {
  if (!isRedisConfigured()) {
    const raw = memGet(sKey(phone));
    if (!raw) return;
    const s: SessionState = JSON.parse(raw);
    s.history.push(msg);
    s.lastActivity = Date.now();
    if (s.history.length > MAX_HISTORY) s.history = s.history.slice(-MAX_HISTORY);
    memSet(sKey(phone), JSON.stringify(s));
    return;
  }
  await safe(async () => {
    const r = await getR();
    const raw = await r.get<string>(sKey(phone));
    if (!raw) return;
    const s: SessionState = JSON.parse(raw);
    s.history.push(msg);
    s.lastActivity = Date.now();
    if (s.history.length > MAX_HISTORY) s.history = s.history.slice(-MAX_HISTORY);
    await r.setex(sKey(phone), SESSION_TTL, JSON.stringify(s));
  }, undefined);
}

export async function getMyHistory(phone: string): Promise<CoreMessage[]> {
  if (!isRedisConfigured()) {
    const raw = memGet(sKey(phone));
    return raw ? JSON.parse(raw).history : [];
  }
  return safe(async () => {
    const raw = await (await getR()).get<string>(sKey(phone));
    return raw ? JSON.parse(raw).history : [];
  }, []);
}

// ─── Queue ──────────────────────────────────────────────

export async function pushMsg(phone: string, text: string): Promise<void> {
  if (!isRedisConfigured()) { memLPush(qKey(phone), text); return; }
  const r = await getR();
  await r.lpush(qKey(phone), text);
}

export async function peekLatest(phone: string): Promise<string | null> {
  if (!isRedisConfigured()) return memLIndex(qKey(phone), 0) || null;
  return safe(async () => {
    const r = await getR();
    return r.lindex(qKey(phone), 0) as Promise<string | null>;
  }, null);
}

export async function drainAll(phone: string): Promise<string[]> {
  if (!isRedisConfigured()) {
    const items = memLRange(qKey(phone), 0, -1);
    memDel(qKey(phone));
    return items.reverse();
  }
  return safe(async () => {
    const r = await getR();
    const items = await r.lrange(qKey(phone), 0, -1) as string[];
    await r.del(qKey(phone));
    return items.reverse();
  }, []);
}

// ─── Rate Limit ─────────────────────────────────────────

const rateLimitMap = new Map<string, number>();

export async function checkRateLimit(key: string, windowSec: number): Promise<boolean> {
  if (!isRedisConfigured()) {
    const now = Date.now();
    const expires = rateLimitMap.get(key);
    if (expires && now < expires) return false;
    rateLimitMap.set(key, now + windowSec * 1000);
    return true;
  }
  return safe(async () => {
    const r = await getR();
    const ok = await r.setnx(key, Date.now().toString());
    if (ok) await r.expire(key, windowSec);
    return ok === 1;
  }, true);
}

// ─── Long-term Memory (1 year) ───────────────────────────

export async function saveLongMemory(phone: string, data: Record<string, unknown>): Promise<void> {
  if (!isRedisConfigured()) {
    const key = lKey(phone);
    const raw = memGet(key);
    const existing: Record<string, unknown> = raw ? JSON.parse(raw) : {};
    Object.assign(existing, data);
    memSet(key, JSON.stringify(existing));
    return;
  }
  await safe(async () => {
    const r = await getR();
    let existing: Record<string, unknown> = {};
    const raw = await r.get<string>(lKey(phone));
    if (raw) existing = JSON.parse(raw);
    Object.assign(existing, data);
    await r.setex(lKey(phone), LONG_MEMORY_TTL, JSON.stringify(existing));
  }, undefined);
}

export async function getLongMemory(phone: string): Promise<Record<string, unknown>> {
  if (!isRedisConfigured()) {
    const raw = memGet(lKey(phone));
    return raw ? JSON.parse(raw) : {};
  }
  return safe(async () => {
    const r = await getR();
    const raw = await r.get<string>(lKey(phone));
    return raw ? JSON.parse(raw) : {};
  }, {});
}

export async function deleteLongMemory(phone: string): Promise<void> {
  if (!isRedisConfigured()) { memDel(lKey(phone)); return; }
  await safe(async () => {
    const r = await getR();
    await r.del(lKey(phone));
  }, undefined);
}

// ─── Delete All Memory ────────────────────────────────────

export async function deleteAllMemory(phone: string): Promise<string[]> {
  const keys = [sKey(phone), lKey(phone), qKey(phone)];
  if (!isRedisConfigured()) {
    for (const k of keys) memDel(k);
    return keys;
  }
  return safe(async () => {
    const r = await getR();
    await r.del(...keys);
    return keys;
  }, []);
}

// ─── Dedup ────────────────────────────────────────────

const dedupSet = new Set<string>();

export async function isDuplicate(wamid: string): Promise<boolean> {
  if (!isRedisConfigured()) {
    if (dedupSet.has(wamid)) return true;
    dedupSet.add(wamid);
    setTimeout(() => dedupSet.delete(wamid), DEDUP_TTL * 1000);
    return false;
  }
  return safe(async () => {
    const r = await getR();
    const ex = await r.get<string>(dKey(wamid));
    if (ex) return true;
    await r.setex(dKey(wamid), DEDUP_TTL, "1");
    return false;
  }, false);
}

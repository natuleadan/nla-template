import { Redis } from "@upstash/redis";
import { isDev, getKvUrl, getKvToken } from "@/lib/env";

let client: Redis | null = null;

export function isRedisConfigured(): boolean {
  return !!(getKvUrl() && getKvToken());
}

export function getRedis(): Redis {
  if (!client) {
    const url = getKvUrl();
    const token = getKvToken();
    if (!url || !token) {
      const msg = "Redis requires KV_REST_API_URL and KV_REST_API_TOKEN";
      if (isDev) console.warn("[UPSTASH] " + msg);
      throw new Error(msg);
    }
    client = new Redis({ url, token, readYourWrites: true });
  }
  return client;
}

// ─── Hash helpers ───────────────────────────────────────

export async function hashSet(key: string, field: string, value: string): Promise<void> {
  const r = getRedis();
  await r.hset(key, { [field]: value });
}

export async function hashGet(key: string, field: string): Promise<string | null> {
  const r = getRedis();
  const val = await r.hget(key, field);
  return val !== null && val !== undefined ? String(val) : null;
}

export async function hashGetAll(key: string): Promise<Record<string, string>> {
  const r = getRedis();
  const data = await r.hgetall(key);
  if (!data) return {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) {
    result[k] = String(v ?? "");
  }
  return result;
}

export async function hashDel(key: string, field: string): Promise<void> {
  const r = getRedis();
  await r.hdel(key, field);
}

// ─── Set helpers ────────────────────────────────────────

export async function setAdd(key: string, value: string): Promise<void> {
  const r = getRedis();
  await r.sadd(key, value);
}

export async function setRemove(key: string, value: string): Promise<void> {
  const r = getRedis();
  await r.srem(key, value);
}

export async function setIsMember(key: string, value: string): Promise<boolean> {
  const r = getRedis();
  return (await r.sismember(key, value)) === 1;
}

export async function setMembers(key: string): Promise<string[]> {
  const r = getRedis();
  return r.smembers(key);
}

// ─── List helpers ───────────────────────────────────────

export async function listPush(key: string, value: string): Promise<void> {
  const r = getRedis();
  await r.lpush(key, value);
}

export async function listRange(key: string, start = 0, end = -1): Promise<string[]> {
  const r = getRedis();
  return r.lrange(key, start, end);
}

// ─── String helpers ─────────────────────────────────────

export async function strSet(key: string, value: string): Promise<void> {
  const r = getRedis();
  await r.set(key, value);
}

export async function strGet(key: string): Promise<string | null> {
  const r = getRedis();
  const val = await r.get(key);
  return val !== null && val !== undefined ? String(val) : null;
}

export async function strIncrBy(key: string, amount: number): Promise<number> {
  const r = getRedis();
  return r.incrby(key, amount);
}

// ─── Counter (autoincrement) ────────────────────────────

export async function nextId(counterKey: string): Promise<number> {
  const r = getRedis();
  return r.incr(counterKey);
}

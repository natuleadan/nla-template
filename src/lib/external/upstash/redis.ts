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
    client = new Redis({ url, token });
  }
  return client;
}

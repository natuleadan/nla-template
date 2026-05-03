import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getRedis, isRedisConfigured } from "./client";
import { getRateLimitMax } from "@/lib/env";

const cache = new Map<string, number>();
const maxReqs = getRateLimitMax();

export const chatRateLimit = new Ratelimit({
  redis: isRedisConfigured() ? getRedis() : ({} as Redis),
  limiter: Ratelimit.slidingWindow(maxReqs, "1 m"),
  ephemeralCache: cache,
  prefix: "ratelimit:chat",
});

export const whatsappSendRateLimit = new Ratelimit({
  redis: isRedisConfigured() ? getRedis() : ({} as Redis),
  limiter: Ratelimit.slidingWindow(maxReqs, "1 m"),
  ephemeralCache: cache,
  prefix: "ratelimit:whatsapp",
});

export const apiGlobalRateLimit = new Ratelimit({
  redis: isRedisConfigured() ? getRedis() : ({} as Redis),
  limiter: Ratelimit.slidingWindow(50, "1 h"),
  ephemeralCache: cache,
  prefix: "ratelimit:global",
});

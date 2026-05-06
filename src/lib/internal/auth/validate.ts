import { timingSafeEqual, pbkdf2Sync } from "node:crypto";
import { getApiKey } from "@/lib/env";

export function validateApiKey(request: Request): boolean {
  const provided = request.headers.get("x-api-key");
  const expected = getApiKey();
  if (!provided || !expected) return false;
  try {
    const a = pbkdf2Sync(provided, "agents-lite-api-key", 1, 32, "sha512");
    const b = pbkdf2Sync(expected, "agents-lite-api-key", 1, 32, "sha512");
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

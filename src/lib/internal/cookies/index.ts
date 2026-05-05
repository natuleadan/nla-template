import { cookies } from "next/headers";
import { isProduction } from "@/lib/env";

const COOKIE_PREFIX = "str_";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export function getCookieName(key: string): string {
  return `${COOKIE_PREFIX}${key}`;
}

export async function getCookie(key: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(getCookieName(key));
  return cookie?.value;
}

export async function setCookie(
  key: string,
  value: string,
  maxAge: number = COOKIE_MAX_AGE,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(getCookieName(key), value, {
    maxAge,
    httpOnly: false,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteCookie(key: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(getCookieName(key));
}

export async function getCookieConsent(): Promise<CookieConsent | null> {
  const consentJson = await getCookie("consent");
  if (!consentJson) return null;

  try {
    return JSON.parse(consentJson) as CookieConsent;
  } catch {
    return null;
  }
}

export async function setCookieConsent(
  consent: Omit<CookieConsent, "timestamp">,
): Promise<void> {
  const fullConsent: CookieConsent = {
    ...consent,
    timestamp: new Date().toISOString(),
  };

  await setCookie("consent", JSON.stringify(fullConsent));
}

export async function acceptAllCookies(): Promise<void> {
  await setCookieConsent({
    necessary: true,
    analytics: true,
    marketing: true,
  });
}

export async function rejectAllCookies(): Promise<void> {
  await setCookieConsent({
    necessary: true,
    analytics: false,
    marketing: false,
  });
}

export async function hasAcceptedCookies(): Promise<boolean> {
  const consent = await getCookieConsent();
  return consent !== null;
}

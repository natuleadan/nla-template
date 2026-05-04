"use client";

import notificationService from "../notification";
import { getConfig } from "@/lib/locale/config";

function getUiCookie() {
  const lang =
    typeof document !== "undefined"
      ? document.documentElement.lang || "en"
      : "en";
  return getConfig(lang).ui.cookie;
}

const COOKIE_PREFIX = "str_";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export interface StorageItem {
  key: string;
  value: string;
  timestamp: string;
}

export function getCookieName(key: string): string {
  return `${COOKIE_PREFIX}${key}`;
}

export function setCookie(
  key: string,
  value: string,
  maxAge: number = COOKIE_MAX_AGE,
): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + maxAge * 1000);

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${getCookieName(key)}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${secure}`;
}

export function getCookie(key: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const name = getCookieName(key) + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return undefined;
}

export function deleteCookie(key: string): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${getCookieName(key)}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax${secure}`;
}

export function getCookieConsent(): CookieConsent | null {
  const consentJson = getCookie("consent");
  if (!consentJson) return null;

  try {
    return JSON.parse(consentJson) as CookieConsent;
  } catch {
    return null;
  }
}

export function setCookieConsent(
  consent: Omit<CookieConsent, "timestamp">,
): void {
  const fullConsent: CookieConsent = {
    ...consent,
    timestamp: new Date().toISOString(),
  };

  setCookie("consent", JSON.stringify(fullConsent));
}

export function getLocalStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(getCookieName(key));
}

export function setLocalStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getCookieName(key), value);
}

export function deleteLocalStorage(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getCookieName(key));
}

export function getAllLocalStorage(): StorageItem[] {
  if (typeof window === "undefined") return [];

  const items: StorageItem[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(COOKIE_PREFIX)) {
      const value = localStorage.getItem(key);
      if (value) {
        items.push({
          key: key.replace(COOKIE_PREFIX, ""),
          value,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }
  return items;
}

export function clearAllLocalStorage(): void {
  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(COOKIE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

export function acceptAllCookiesClient(): void {
  setCookieConsent({
    necessary: true,
    analytics: true,
    marketing: true,
  });
  notificationService.success(getUiCookie().accepted);
}

export function rejectAllCookiesClient(): void {
  setCookieConsent({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  notificationService.info(getUiCookie().onlyNecessary);
}

export function saveCustomCookiePreferences(
  analytics: boolean,
  marketing: boolean,
): void {
  setCookieConsent({
    necessary: true,
    analytics,
    marketing,
  });
  notificationService.success(getUiCookie().saved);
}

export function getStorageType(
  key: string,
): "cookie" | "localStorage" | "both" | "none" {
  const cookieName = getCookieName(key);
  const lsKey = getCookieName(key);

  if (typeof window !== "undefined") {
    const hasCookie = document.cookie.includes(cookieName);
    const hasLs = localStorage.getItem(lsKey) !== null;

    if (hasCookie && hasLs) return "both";
    if (hasCookie) return "cookie";
    if (hasLs) return "localStorage";
  }

  return "none";
}

export function hasAcceptedCookiesClient(): boolean {
  const consent = getCookieConsent();
  return consent !== null;
}

export function hasAcceptedAnalyticsClient(): boolean {
  const consent = getCookieConsent();
  return consent?.analytics ?? false;
}

export function hasAcceptedMarketingClient(): boolean {
  const consent = getCookieConsent();
  return consent?.marketing ?? false;
}

export function getCookieStats() {
  const consent = getCookieConsent();
  return {
    hasAccepted: consent !== null,
    hasAnalytics: consent?.analytics ?? false,
    hasMarketing: consent?.marketing ?? false,
    cookieCount:
      typeof document !== "undefined" ? document.cookie.split(";").length : 0,
    localStorageCount: typeof window !== "undefined" ? localStorage.length : 0,
  };
}

const PHONE_COOKIE_KEY = "phone";
const PHONE_COOKIE_MAX_AGE = 60 * 15;

export function getSavedPhone(): string | undefined {
  return getCookie(PHONE_COOKIE_KEY);
}

export function savePhone(phone: string): void {
  setCookie(PHONE_COOKIE_KEY, phone, PHONE_COOKIE_MAX_AGE);
}

export function hasValidPhoneCookie(): boolean {
  const phone = getSavedPhone();
  return !!phone;
}

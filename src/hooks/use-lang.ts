"use client";

import { createContext, useContext } from "react";
import { LOCALES } from "@/lib/locale/locales";

export const LangContext = createContext<string>(LOCALES[0] || "en");

export function useLang(): string {
  return useContext(LangContext);
}

export function detectLang(pathname: string): string {
  const match = pathname.match(
    new RegExp(`^/(${LOCALES.join("|")})(/|$)`),
  );
  return match?.[1] || LOCALES[0] || "en";
}

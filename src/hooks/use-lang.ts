"use client";

import { createContext, useContext } from "react";

export const LangContext = createContext<string>("en");

export function useLang(): string {
  return useContext(LangContext);
}

export function detectLang(pathname: string): string {
  if (pathname.startsWith("/es")) return "es";
  if (pathname.startsWith("/en")) return "en";
  return "en";
}

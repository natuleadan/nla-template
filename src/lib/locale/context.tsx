"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";

const LangContext = createContext<string>("en");

function detectLang(pathname: string): string {
  if (pathname.startsWith("/es")) return "es";
  if (pathname.startsWith("/en")) return "en";
  return "en";
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lang = detectLang(pathname);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang(): string {
  return useContext(LangContext);
}

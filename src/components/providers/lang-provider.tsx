"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LangContext, detectLang } from "@/hooks/use-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lang = detectLang(pathname);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

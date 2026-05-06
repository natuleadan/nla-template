"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { LangContext, detectLang } from "@/hooks/use-lang";
import { isRtlLocale } from "@/lib/locale/rtl";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lang = detectLang(pathname);

  useLayoutEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtlLocale(lang) ? "rtl" : "ltr";
  }, [lang]);

  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

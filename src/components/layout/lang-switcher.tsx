"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/locale/context";

export function LangSwitcher() {
  const lang = useLang();
  const pathname = usePathname();
  const newLang = lang === "en" ? "es" : "en";
  const rest = pathname.replace(/^\/(en|es)/, "") || "/";

  return (
    <Button variant="ghost" size="sm" asChild className="font-semibold min-w-10">
      <Link href={`/${newLang}${rest}`} scroll={false}>
        {newLang.toUpperCase()}
      </Link>
    </Button>
  );
}

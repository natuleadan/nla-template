"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconLanguage, IconCheck } from "@tabler/icons-react";
import { useLang } from "@/lib/locale/context";
import { SUPPORTED_LOCALES } from "@/lib/locale/seo";

export function LangSwitcher() {
  const lang = useLang();
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|es)/, "") || "/";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Switch language">
          <IconLanguage className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-24">
        {SUPPORTED_LOCALES.map((locale) => (
          <DropdownMenuItem key={locale} asChild>
            <Link
              href={`/${locale}${rest}`}
              scroll={false}
              className="flex items-center gap-2 justify-between w-full"
            >
              <span className={lang === locale ? "font-semibold" : ""}>
                {locale.toUpperCase()}
              </span>
              {lang === locale && <IconCheck className="size-4 shrink-0" />}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
import { getConfig } from "@/lib/locale/config";
import { SUPPORTED_LOCALES } from "@/lib/locale/seo";
import { getLocalizedSlug } from "@/lib/locale/get-localized-slug";

export function LangSwitcher() {
  const lang = useLang();
  const pathname = usePathname();
  const cfg = getConfig(lang);
  const rest = pathname.replace(/^\/(en|es)/, "") || "/";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={cfg.ui.navbar.langAriaLabel}
        >
          <IconLanguage className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-24">
        {SUPPORTED_LOCALES.map((locale) => {
          const translatedSlug = getLocalizedSlug(pathname, locale);
          const defaultHref = `/${locale}${rest}`;
          const href = translatedSlug
            ? `/${locale}/${pathname.match(/^\/(en|es)\/(store|news|pages)\//)?.[2]}/${translatedSlug}`
            : defaultHref;

          return (
            <DropdownMenuItem key={locale} asChild>
              <Link
                href={href}
                scroll={false}
                className="flex items-center gap-2 justify-between w-full"
              >
                <span className={lang === locale ? "font-semibold" : ""}>
                  {locale.toUpperCase()}
                </span>
                {lang === locale && <IconCheck className="size-4 shrink-0" />}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  IconBrandWhatsapp,
  IconBarbell,
  IconMenu2,
  IconHome,
  IconBuildingStore,
  IconNews,
  IconCalendar,
  IconFiles,
  IconMail,
} from "@tabler/icons-react";
import { GlobalSearch } from "@/components/layout/global-search";
import { NavDropdown } from "@/components/layout/navbar-dropdown";
import { useKeyboardNav } from "@/hooks/use-keyboard-nav";
import { LangSwitcher } from "@/components/layout/lang-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLang } from "@/hooks/use-lang";
import { getConfig } from "@/lib/locale/config";
import { useWhatsApp } from "@/hooks/use-whatsapp";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: IconHome,
  store: IconBuildingStore,
  news: IconNews,
  calendar: IconCalendar,
  files: IconFiles,
  mail: IconMail,
};

  const iconSizes: Record<string, string> = {
  store: "size-5",
  news: "size-5",
  calendar: "size-5",
  files: "size-5",
};

export function Navbar() {
  const lang = useLang();
  const cfg = getConfig(lang);
  const { nav, ui, brand } = cfg;

  const l = (href: string) => (href === "/" ? `/${lang}` : `/${lang}${href}`);

  const [menuOpen, setMenuOpen] = useState(false);
  const { openWhatsApp } = useWhatsApp();

  const shortcuts = nav.items.map((item, i) => ({
    key: String(i + 1),
    href: item.href,
  }));
  useKeyboardNav(lang, shortcuts);

  const handleWhatsAppClick = () => {
    openWhatsApp({
      message: brand.whatsappMessage(brand.name),
      title: ui.navbar.whatsappTitle,
    });
  };

  return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/${lang}`}
              className="flex items-center gap-3 text-2xl font-bold tracking-tight"
            >
              <IconBarbell className="size-8" />
              <span>{brand.name}</span>
            </Link>
          </div>

          <nav
            className="hidden lg:flex flex-1 justify-end items-center gap-1"
            aria-label={ui.navbar.desktopAriaLabel}
          >
            {nav.items.map((item, idx) => {
              const IconComp = iconMap[item.icon];
              if ("type" in item) {
                return (
                  <NavDropdown
                    key={item.href}
                    label={item.label}
                    href={l(item.href)}
                    type={item.type}
                    icon={item.icon}
                    variant="dropdown"
                  />
                );
              }
              return (
                <Link
                  key={item.href}
                  href={l(item.href)}
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors duration-200 inline-flex items-center gap-1.5"
                  aria-keyshortcuts={String(idx + 1)}
                >
                  {IconComp && <IconComp className={iconSizes[item.icon] || "size-5"} />}
                  {item.label}
                </Link>
              );
            })}
            <GlobalSearch />
            <LangSwitcher />
            <ThemeToggle />
            <Button
              onClick={handleWhatsAppClick}
              size="sm"
              className="gap-2 ml-2"
            >
              <IconBrandWhatsapp className="size-5" data-icon="inline-start" />
              <span className="hidden sm:inline">
                {nav.buttons.whatsappDesktop}
              </span>
              <span className="sm:hidden">{nav.buttons.whatsappMobile}</span>
            </Button>
          </nav>

          <nav
            className="hidden md:flex lg:hidden flex-1 justify-end items-center gap-0.5"
            aria-label={ui.navbar.desktopAriaLabel}
          >
            {nav.items.map((item, idx) => {
              const IconComp = iconMap[item.icon];
              if ("type" in item) {
                return (
                  <NavDropdown
                    key={item.href}
                    label={item.label}
                    href={l(item.href)}
                    type={item.type}
                    icon={item.icon}
                    variant="dropdown"
                    compact
                  />
                );
              }
              return (
                <Link
                  key={item.href}
                  href={l(item.href)}
                  className="group p-2.5 text-sm font-medium rounded-lg hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors duration-200 inline-flex items-center gap-1"
                  aria-keyshortcuts={String(idx + 1)}
                >
                  {IconComp && <IconComp className={`${iconSizes[item.icon] || "size-5"} shrink-0`} />}
                  <span className="max-w-0 group-hover:max-w-40 focus-within:max-w-40 overflow-hidden transition-all duration-200 whitespace-nowrap">
                    <span className="pl-1">{item.label}</span>
                  </span>
                </Link>
              );
            })}
            <GlobalSearch />
            <LangSwitcher />
            <ThemeToggle />
            <Button
              onClick={handleWhatsAppClick}
              size="icon"
              variant="ghost"
              aria-label={ui.navbar.whatsappAriaLabel}
            >
              <IconBrandWhatsapp className="size-5" />
            </Button>
          </nav>

          <div className="flex md:hidden items-center gap-1">
            <GlobalSearch />
            <LangSwitcher />
            <ThemeToggle />
            <Button
              onClick={handleWhatsAppClick}
              size="icon"
              variant="ghost"
              aria-label={ui.navbar.whatsappAriaLabel}
            >
              <IconBrandWhatsapp className="size-5" />
            </Button>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={ui.navbar.menuAriaLabel}
                >
                  <IconMenu2 className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72" closeLabel={ui.navbar.closeAria}>
                <SheetTitle className="sr-only">{brand.name}</SheetTitle>
                <SheetDescription className="sr-only">
                  {ui.mobileMenuDescription}
                </SheetDescription>
                <nav
                  className="flex flex-col gap-1 mt-8"
                  aria-label={ui.navbar.mobileNavAriaLabel}
                >
                  {nav.items.map((item) => {
                    const IconComp = iconMap[item.icon];
                    if ("type" in item) {
                      return (
                        <NavDropdown
                          key={item.href}
                          label={item.label}
                          href={l(item.href)}
                          type={item.type}
                          icon={item.icon}
                          variant="accordion"
                          onNav={() => setMenuOpen(false)}
                        />
                      );
                    }
                    return (
                      <Link
                        key={item.href}
                        href={l(item.href)}
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-3 text-base font-medium rounded-lg hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors inline-flex items-center gap-2"
                      >
                        {IconComp && <IconComp className={iconSizes[item.icon] || "size-5"} />}
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
  );
}

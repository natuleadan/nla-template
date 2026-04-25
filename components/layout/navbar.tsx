"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { IconBrandWhatsapp, IconBarbell, IconMenu2 } from "@tabler/icons-react";
import { getWhatsappNumber } from "@/lib/config/env";
import notificationService from "@/lib/modules/notification";
import { brand, nav, ui } from "@/lib/config/site";

const WHATSAPP_NUMBER = getWhatsappNumber();

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleWhatsAppClick = async () => {
    notificationService.info(ui.openingWhatsApp);

    try {
      await fetch("/api/v1/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: brand.whatsappProductId,
          productName: brand.whatsappProductName,
          price: 0,
        }),
      });
    } catch (e) {
      console.error("Error:", e);
    }

    const urlWhatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(brand.whatsappMessage)}`;
    window.open(urlWhatsapp, "_blank");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-3 text-2xl font-bold tracking-tight">
            <IconBarbell className="size-8" />
            <span>{brand.name}</span>
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 justify-end items-center gap-1">
          {nav.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Button 
            onClick={handleWhatsAppClick} 
            size="sm" 
            className="gap-2 ml-2"
          >
            <IconBrandWhatsapp className="size-4" data-icon="inline-start" />
            <span className="hidden sm:inline">{nav.buttons.whatsappDesktop}</span>
            <span className="sm:hidden">{nav.buttons.whatsappMobile}</span>
          </Button>
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <Button 
            onClick={handleWhatsAppClick} 
            size="icon"
            variant="outline"
          >
            <IconBrandWhatsapp className="size-5" />
          </Button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <IconMenu2 className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">{brand.name}</SheetTitle>
              <nav className="flex flex-col gap-2 mt-8">
                {nav.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 text-base font-medium rounded-lg hover:bg-muted transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconBrandWhatsapp, IconBarbell } from "@tabler/icons-react";
import { getWhatsappNumber } from "@/lib/config/env";
import notificationService from "@/lib/modules/notification";

const WHATSAPP_NUMBER = getWhatsappNumber();

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/terminos", label: "Términos" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/datos", label: "Datos" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const handleWhatsAppClick = async () => {
    notificationService.info("Abriendo WhatsApp...");
    
    const mensaje = `Hola! Quiero información sobre los productos`;
    const urlWhatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

    try {
      await fetch("/api/v1/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "consulta-header",
          productName: "Consulta desde header",
          price: 0,
        }),
      });
    } catch (e) {
      console.error("Error:", e);
    }

    window.open(urlWhatsapp, "_blank");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-3 text-2xl font-bold tracking-tight">
            <IconBarbell className="size-8" />
            <span>Acme Inc</span>
          </Link>
        </div>

        <nav className="flex-1 justify-end flex items-center gap-1">
          {navItems.map((item) => (
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
            <span className="hidden sm:inline">Comprar por WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}

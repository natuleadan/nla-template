"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WhatsAppProvider } from "@/components/whatsapp-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <WhatsAppProvider>
          {children}
          <Toaster />
          <CookieBanner />
        </WhatsAppProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

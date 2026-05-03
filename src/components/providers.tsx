"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WhatsAppProvider } from "@/components/whatsapp-provider";
import { DialogProvider } from "@/components/ui/dialog-provider";

export function Providers({
  children,
  defaultCountryCode,
  ycloudEnabled,
}: {
  children: React.ReactNode;
  defaultCountryCode?: string;
  ycloudEnabled?: boolean;
}) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <DialogProvider>
          <WhatsAppProvider
            defaultCountryCode={defaultCountryCode}
            ycloudEnabled={ycloudEnabled}
          >
            {children}
            <Toaster />
            <CookieBanner />
          </WhatsAppProvider>
        </DialogProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

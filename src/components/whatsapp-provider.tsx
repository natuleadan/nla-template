"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { WhatsAppDialog } from "@/components/ui/whatsapp-dialog";
import {
  getSavedPhone,
  hasValidPhoneCookie,
} from "@/lib/modules/cookies/client";
import notificationService from "@/lib/modules/notification";
import { useLang } from "@/lib/locale/context";
import { getConfig } from "@/lib/locale/config";
import { getWhatsappNumber } from "@/lib/env.public";
import { whatsappSendAction } from "@/lib/actions/whatsapp-send";

export interface WhatsAppOptions {
  message: string;
  title?: string;
  productId?: string;
  productName?: string;
  showPreview?: boolean;
  onSuccess?: () => void;
}

interface WhatsAppContextValue {
  openWhatsApp: (options: WhatsAppOptions) => void;
}

const WhatsAppContext = createContext<WhatsAppContextValue | null>(null);

export function useWhatsApp(): WhatsAppContextValue {
  const ctx = useContext(WhatsAppContext);
  if (!ctx) {
    throw new Error("useWhatsApp must be used within a WhatsAppProvider");
  }
  return ctx;
}

interface WhatsAppProviderProps {
  children: ReactNode;
  defaultCountryCode?: string;
  ycloudEnabled?: boolean;
}

async function sendDirectly(
  to: string,
  message: string,
  _lang: string,
  productId?: string,
  productName?: string,
): Promise<{ success: boolean; rateLimit?: boolean }> {
  const result = await whatsappSendAction({
    to,
    message,
    productId,
    productName,
  });
  return {
    success: result.success,
    rateLimit: !result.success && result.rateLimit,
  };
}

export function WhatsAppProvider({
  children,
  defaultCountryCode = "EC",
  ycloudEnabled = false,
}: WhatsAppProviderProps) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const t = cfg.ui.whatsapp;
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<WhatsAppOptions | null>(null);

  const openWhatsApp = useCallback(
    async (opts: WhatsAppOptions) => {
      if (!ycloudEnabled) {
        const phone = getWhatsappNumber();
        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(opts.message)}`;
        window.open(waUrl, "_blank");
        opts.onSuccess?.();
        return;
      }

      if (hasValidPhoneCookie()) {
        const savedPhone = getSavedPhone();
        if (savedPhone) {
          const toastId = notificationService.loading(t.dialog.sending, { duration: 10000 });
          const { success, rateLimit } = await sendDirectly(
            savedPhone,
            opts.message,
            lang,
            opts.productId,
            opts.productName,
          );

          if (success) {
            notificationService.dismiss(toastId);
            notificationService.success(t.notification.success);
            opts.onSuccess?.();
            return;
          }

          notificationService.dismiss(toastId);
          notificationService.error(
            rateLimit ? t.notification.rateLimit : t.notification.error,
          );
          if (rateLimit) return;
        }
      }

      setOptions(opts);
      setOpen(true);
    },
    [
      ycloudEnabled,
      lang,
      t.notification.success,
      t.notification.error,
      t.notification.rateLimit,
      t.dialog.sending,
    ],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setOptions(null);
  }, []);

  return (
    <WhatsAppContext.Provider value={{ openWhatsApp }}>
      {children}
      <WhatsAppDialog
        open={open}
        onOpenChange={handleClose}
        options={options}
        defaultCountryCode={defaultCountryCode}
        ycloudEnabled={ycloudEnabled}
      />
    </WhatsAppContext.Provider>
  );
}

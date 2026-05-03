"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { WhatsAppDialog } from "@/components/ui/whatsapp-dialog";
import {
  getSavedPhone,
  hasValidPhoneCookie,
} from "@/lib/modules/cookies/client";
import notificationService from "@/lib/modules/notification";
import { useLang } from "@/lib/locale/context";
import { getConfig } from "@/lib/locale/config";

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
}

async function sendDirectly(
  to: string,
  message: string,
  productId?: string,
  productName?: string,
): Promise<boolean> {
  try {
    const res = await fetch("/api/v1/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, message, productId, productName }),
    });

    return res.ok;
  } catch {
    return false;
  }
}

export function WhatsAppProvider({
  children,
  defaultCountryCode = "EC",
}: WhatsAppProviderProps) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const t = cfg.ui.whatsapp;
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<WhatsAppOptions | null>(null);

  const openWhatsApp = useCallback(
    async (opts: WhatsAppOptions) => {
      if (hasValidPhoneCookie()) {
        const savedPhone = getSavedPhone();
        if (savedPhone) {
          const loadingId = toast.loading(t.dialog.sending);

          const success = await sendDirectly(
            savedPhone,
            opts.message,
            opts.productId,
            opts.productName,
          );

          toast.dismiss(loadingId);

          if (success) {
            notificationService.success(t.notification.success);
            opts.onSuccess?.();
            return;
          } else {
            notificationService.error(t.notification.error);
          }
        }
      }

      setOptions(opts);
      setOpen(true);
    },
    [t.notification.success, t.notification.error, t.dialog.sending],
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
      />
    </WhatsAppContext.Provider>
  );
}

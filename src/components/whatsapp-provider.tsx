"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { WhatsAppDialog } from "@/components/ui/whatsapp-dialog";

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

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<WhatsAppOptions | null>(null);

  const openWhatsApp = useCallback((opts: WhatsAppOptions) => {
    setOptions(opts);
    setOpen(true);
  }, []);

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
      />
    </WhatsAppContext.Provider>
  );
}

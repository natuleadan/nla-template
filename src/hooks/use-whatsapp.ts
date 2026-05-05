"use client";

import { createContext, useContext, type ReactNode } from "react";

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

export { WhatsAppContext };
export type { WhatsAppContextValue };

import {
  getYcloudApiKey,
  getWhatsappNumber,
  getAdminPhone,
  isDev,
} from "@/lib/env";
import {
  Configuration,
  WhatsappMessagesApi,
  WhatsappMessageType,
} from "@ycloud-cpaas/ycloud-sdk-node";

async function sendRaw(to: string, message: string): Promise<boolean> {
  const apiKey = getYcloudApiKey();
  const from = getWhatsappNumber();
  if (!apiKey || !from || !to) return false;
  try {
    await new WhatsappMessagesApi(new Configuration({ apiKey })).sendDirectly({
      from,
      to,
      type: WhatsappMessageType.Text,
      text: { body: message },
    });
    return true;
  } catch (err) {
    if (isDev) console.error("[WHATSAPP] Send error:", err);
    return false;
  }
}

export async function sendWhatsApp(
  to: string,
  message: string,
): Promise<boolean> {
  const fullPhone = to.startsWith("+") ? to : `+${to}`;
  return sendRaw(fullPhone, message);
}

export async function notifyAdmin(message: string): Promise<boolean> {
  const admin = getAdminPhone();
  if (!admin) return false;
  return sendRaw(`+${admin}`, message);
}

export async function notifyCustomer(
  phone: string,
  message: string,
): Promise<boolean> {
  if (!phone) return false;
  const fullPhone = phone.startsWith("+") ? phone : `+${phone}`;
  return sendRaw(fullPhone, message);
}

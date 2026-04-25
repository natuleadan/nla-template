import { DynamicPage } from "@/components/layout/dynamic-page";

export const metadata = {
  title: "Contacto - Acme Inc",
  description: "Contacta con Acme Inc para consultas y soporte.",
};

export default function ContactoPage() {
  return <DynamicPage pageName="contacto" />;
}
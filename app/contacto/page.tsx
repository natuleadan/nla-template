import { DynamicPage } from "@/components/layout/dynamic-page";
import { pages, brand } from "@/lib/config/site";

export const metadata = {
  title: `${pages.contacto.title} - ${brand.name}`,
  description: pages.contacto.description,
};

export default function ContactoPage() {
  return <DynamicPage pageName="contacto" />;
}

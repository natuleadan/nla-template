import { DynamicPage } from "@/components/layout/dynamic-page";
import { pages, brand } from "@/lib/config/site";

export const metadata = {
  title: `${pages.privacidad.title} - ${brand.name}`,
  description: pages.privacidad.description,
};

export default function PrivacidadPage() {
  return <DynamicPage pageName="privacidad" />;
}

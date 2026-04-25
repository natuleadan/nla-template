import { DynamicPage } from "@/components/layout/dynamic-page";
import { pages, brand } from "@/lib/config/site";

export const metadata = {
  title: `${pages.datos.title} - ${brand.name}`,
  description: pages.datos.description,
};

export default function DatosPage() {
  return <DynamicPage pageName="datos" />;
}

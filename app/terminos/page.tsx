import { DynamicPage } from "@/components/layout/dynamic-page";
import { pages, brand } from "@/lib/config/site";

export const metadata = {
  title: `${pages.terminos.title} - ${brand.name}`,
  description: pages.terminos.description,
};

export default function TerminosPage() {
  return <DynamicPage pageName="terminos" />;
}

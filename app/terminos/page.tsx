import { DynamicPage } from "@/components/layout/dynamic-page";

export const metadata = {
  title: "Términos y Condiciones - NLA Template",
  description: "Términos y condiciones de uso conforme a la legislación ecuatoriana.",
};

export default function TerminosPage() {
  return <DynamicPage pageName="terminos" />;
}
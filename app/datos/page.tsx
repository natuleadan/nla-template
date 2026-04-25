import { DynamicPage } from "@/components/layout/dynamic-page";

export const metadata = {
  title: "Tratamiento de Datos - NLA Template",
  description: "Información sobre tratamiento de datos personales conforme a LOPDP.",
};

export default function DatosPage() {
  return <DynamicPage pageName="datos" />;
}
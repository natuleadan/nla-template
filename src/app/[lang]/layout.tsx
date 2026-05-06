import { getDir, isSupported } from "@/lib/locale/locales";
import { redirect } from "next/navigation";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isSupported(lang)) redirect(`/${lang}`);

  const dir = getDir(lang);

  return <div dir={dir}>{children}</div>;
}

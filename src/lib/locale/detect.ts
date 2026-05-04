import { headers } from "next/headers";
import { cookies } from "next/headers";

export async function detectLocale(): Promise<string> {
  const headersList = await headers();
  const cookiesList = await cookies();

  const cookieLocale = cookiesList.get("NEXT_LOCALE")?.value;
  if (cookieLocale === "en" || cookieLocale === "es") return cookieLocale;

  const pathname = headersList.get("next-url") || "";
  const match = pathname.match(/^\/(en|es)(\/|$)/);
  if (match) return match[1];

  const acceptLanguage = headersList.get("accept-language") || "";
  if (acceptLanguage.startsWith("en")) return "en";

  return "es";
}

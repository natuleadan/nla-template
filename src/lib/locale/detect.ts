import { headers } from "next/headers";
import { cookies } from "next/headers";
import { LOCALES } from "./locales";

export async function detectLocale(): Promise<string> {
  const headersList = await headers();
  const cookiesList = await cookies();

  const cookieLocale = cookiesList.get("NEXT_LOCALE")?.value;
  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale))
    return cookieLocale;

  const pathname = headersList.get("next-url") || "";
  const match = pathname.match(new RegExp(`^/(${LOCALES.join("|")})(/|$)`));
  if (match) return match[1];

  const acceptLanguage = headersList.get("accept-language") || "";
  const lang = acceptLanguage.split("-")[0]?.split(",")[0];
  if (lang && (LOCALES as readonly string[]).includes(lang)) return lang;

  return LOCALES[0] || "en";
}

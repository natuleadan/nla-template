export const SUPPORTED_LOCALES = ["en", "es"] as const;

export function getAlternateLanguages(
  currentLang: string,
  pathOrAlternates: string | Record<string, string>,
  baseUrl: string,
): Record<string, string> {
  const alternates: Record<string, string> = {};

  if (typeof pathOrAlternates === "string") {
    const cleanPath = pathOrAlternates.startsWith("/")
      ? pathOrAlternates
      : `/${pathOrAlternates}`;
    for (const lang of SUPPORTED_LOCALES) {
      alternates[lang] = `${baseUrl}/${lang}${cleanPath}`;
    }
  } else {
    for (const lang of SUPPORTED_LOCALES) {
      const p = pathOrAlternates[lang];
      if (p) alternates[lang] = `${baseUrl}${p.startsWith("/") ? p : `/${p}`}`;
    }
  }

  const defaultLang = currentLang || SUPPORTED_LOCALES[0];
  alternates["x-default"] =
    alternates[defaultLang] || `${baseUrl}/${SUPPORTED_LOCALES[0]}/`;
  return alternates;
}

const SUPPORTED_LOCALES = ["en", "es"] as const;

export function getAlternateLanguages(
  currentLang: string,
  path: string,
  baseUrl: string,
): Record<string, string> {
  const alternates: Record<string, string> = {};
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  for (const lang of SUPPORTED_LOCALES) {
    alternates[lang] = `${baseUrl}/${lang}${cleanPath}`;
  }
  alternates["x-default"] = `${baseUrl}/${SUPPORTED_LOCALES[0]}${cleanPath}`;
  return alternates;
}

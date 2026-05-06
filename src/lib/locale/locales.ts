export const LOCALES = ["en", "es", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const RTL_LOCALES = ["ar", "he", "fa", "ur"] as const;

export const DIRECTION: Record<string, "ltr" | "rtl"> = {
  en: "ltr",
  es: "ltr",
  ar: "rtl",
  he: "rtl",
  fa: "rtl",
  ur: "rtl",
};

export function isSupported(locale: string): locale is Locale {
  return (LOCALES as readonly string[]).includes(locale);
}

export function getDir(locale: string): "ltr" | "rtl" {
  return DIRECTION[locale] || "ltr";
}

export function isRtlLocale(locale: string): boolean {
  return (RTL_LOCALES as readonly string[]).includes(locale);
}

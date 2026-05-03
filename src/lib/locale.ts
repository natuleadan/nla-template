export function t<T>(obj: { es: T; en: T }, locale: "es" | "en"): T {
  return obj[locale];
}

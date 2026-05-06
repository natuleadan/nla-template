import { LOCALES } from "./locales";
import * as esConfig from "@/lib/config/es";
import * as enConfig from "@/lib/config/en";
import * as arConfig from "@/lib/config/ar";

const configs = { es: esConfig, en: enConfig, ar: arConfig };

type ConfigMap = typeof configs;

export function getConfig<T = ConfigMap[keyof ConfigMap]>(
  locale = "en",
): T {
  const fallback = (LOCALES[0] || "en") as keyof ConfigMap;
  const key: keyof ConfigMap = locale in configs ? (locale as keyof ConfigMap) : fallback;
  return configs[key] as T;
}

export function getLocaleFromLang(lang: string): string {
  const map: Record<string, string> = { es: "es_ES", en: "en_US", ar: "ar_SA" };
  return map[lang] || `${lang}_${lang.toUpperCase()}`;
}

export function getDateLocale(lang: string): string {
  const map: Record<string, string> = { en: "en-US", es: "es-ES", ar: "ar-SA" };
  return map[lang] || `${lang}-${lang.toUpperCase()}`;
}

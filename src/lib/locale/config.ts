import * as esConfig from "@/lib/config/es";
import * as enConfig from "@/lib/config/en";

const configs = { es: esConfig, en: enConfig };

export function getConfig<T = typeof esConfig>(locale = "en"): T {
  const key = locale in configs ? locale : "en";
  return configs[key as keyof typeof configs] as unknown as T;
}

export function getLocaleFromLang(lang: string): string {
  return lang === "es" ? "es_ES" : "en_US";
}

export function getDateLocale(lang: string): string {
  return lang === "en" ? "en-US" : "es-ES";
}

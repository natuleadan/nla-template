import { redirect, notFound } from "next/navigation";

export async function resolveSlug<T>(
  slug: string,
  lang: string,
  find: (slug: string, locale: string) => Promise<T | null>,
  prefix = "",
): Promise<{ data: T; locale: string }> {
  const data = await find(slug, lang);
  if (data) return { data, locale: lang };

  const alt = lang === "en" ? "es" : "en";
  const altData = await find(slug, alt);
  if (altData) {
    redirect(`/${alt}${prefix}/${slug}`);
  }

  notFound();
}

import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { HomeJsonLd } from "@/components/metadata/home-jsonld";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";
import { getConfig, getLocaleFromLang } from "@/lib/locale/config";
import { getAlternateLanguages } from "@/lib/locale/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const cfg = getConfig(lang);
  const baseUrl = getBaseUrl();

  return {
    alternates: getAlternateLanguages(lang, "/", baseUrl),
    title: { absolute: brand.name },
    description: cfg.brand.description,
    openGraph: {
      siteName: brand.name,
      type: "website",
      url: `${baseUrl}/${lang}`,
      images: [{ url: `${baseUrl}/opengraph-image`, width: 1200, height: 630, alt: brand.name }],
      locale: getLocaleFromLang(lang),
    },
    twitter: {
      card: "summary_large_image",
      images: [{ url: `${baseUrl}/twitter-image`, width: 1200, height: 600, alt: brand.name }],
    },
    other: { "og:logo": `${baseUrl}/design/logo.svg` },
    keywords: cfg.brand.metadata.keywords,
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <>
      <HomeJsonLd locale={lang} homeLabel={getConfig(lang).nav.items[0].label} />
      <Hero />
    </>
  );
}

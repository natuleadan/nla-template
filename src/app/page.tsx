import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { HomeJsonLd } from "@/components/metadata/home-jsonld";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";

export const metadata: Metadata = {
  title: {
    absolute: brand.name,
  },
  description: brand.description,
  openGraph: {
    siteName: brand.name,
    type: "website",
    url: getBaseUrl(),
    images: [{ url: `${getBaseUrl()}/opengraph-image`, width: 1200, height: 630, alt: brand.name }],
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: `${getBaseUrl()}/twitter-image`, width: 1200, height: 600, alt: brand.name }],
  },
  other: {
    "og:logo": `${getBaseUrl()}/design/logo.svg`,
  },
  keywords: ["tienda", "suplementos", "alimentos", "gym", "entrenamiento"],
};

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <Hero />
    </>
  );
}

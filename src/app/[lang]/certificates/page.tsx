import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CertificateSearch } from "@/components/certificates/certificate-search";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";
import { getAlternateLanguages } from "@/lib/locale/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const cfg = getConfig(lang);
  const baseUrl = getBaseUrl();
  const title = `${cfg.pages.certificates.title} | ${brand.name}`;
  const description = cfg.pages.certificates.description;

  return {
    alternates: getAlternateLanguages(lang, "/certificates", baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: brand.name,
      type: "website",
      url: `${baseUrl}/${lang}/certificates`,
      images: [
        {
          url: `${baseUrl}/${lang}/certificates/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: lang === "es" ? "es_ES" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: `${baseUrl}/${lang}/certificates/twitter-image`,
          width: 1200,
          height: 600,
          alt: title,
        },
      ],
    },
    other: { "og:logo": `${baseUrl}/design/logo.svg` },
  };
}

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const cfg = getConfig(lang);
  const baseUrl = getBaseUrl();
  const page = cfg.pages.certificates;
  const labels = {
    title: page.title,
    placeholder: page.placeholder,
    button: page.button,
    notFound: page.notFound,
    error: page.error,
    hours: page.hours,
    expires: page.expires,
    indefinite: page.indefinite,
    expired: page.expired,
    type_aprobacion: page.type_aprobacion,
    type_asistencia: page.type_asistencia,
    type_participacion: page.type_participacion,
    filterAll: page.filterAll,
    filterType: page.filterType,
    missing: page.missing,
    loading: page.loading,
    noResults: page.noResults,
    defaultFilename: page.defaultFilename,
    resultsSummary: page.resultsSummary,
    invalidId: page.invalidId,
    rateLimit: page.rateLimit,
    serviceUnavailable: page.serviceUnavailable,
    fetchError: page.fetchError,
    invalidResponse: page.invalidResponse,
    networkError: page.networkError,
  };

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: cfg.nav.items[0].label, item: `${baseUrl}/${lang}` },
          { name: page.title, item: `${baseUrl}/${lang}/certificates` },
        ]}
      />
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <PageHeader title={page.title} description={page.description} />
        <div className="mt-8">
          <CertificateSearch labels={labels} />
        </div>
      </div>
    </>
  );
}

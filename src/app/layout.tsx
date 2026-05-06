import { Suspense } from "react";
import type { Metadata } from "next";
import { Roboto, Noto_Sans_Arabic } from "next/font/google";
import { getBaseUrl, getIndexingEnabled, getYcloudEnabled } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";
import { VercelMetricsGuard } from "@/components/analytics/vercel-metrics-guard";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BrandColorScript } from "@/components/layout/brand-color-script";
import { LangProvider } from "@/components/providers/lang-provider";
import { DirectionSync } from "@/components/providers/direction-sync";

const fontSans = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const fontArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const indexing = getIndexingEnabled();
  const cfg = getConfig("es");

  return {
    metadataBase: new URL(baseUrl),
    title: cfg.brand.name,
    description: cfg.brand.description,
    icons: { icon: "/icon", apple: "/apple-icon" },
    robots: { index: indexing, follow: indexing },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cfg = getConfig("es");

  return (
    <html
      lang="es"
      dir="ltr"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontArabic.variable}`}
    >
      <head>
        <BrandColorScript />
      </head>
      <body className="antialiased flex min-h-screen flex-col bg-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:rounded-md"
        >
          {cfg.ui.skipToContent}
        </a>
        <Suspense>
          <LangProvider>
            <Providers ycloudEnabled={getYcloudEnabled()}>
              <DirectionSync>
                <VercelMetricsGuard />
                <div className="flex min-h-screen flex-col">
                  <Suspense>
                    <Navbar />
                  </Suspense>
                  <main
                    id="main-content"
                    className="flex-1 flex flex-col"
                    tabIndex={-1}
                  >
                    <Suspense>{children}</Suspense>
                  </main>
                  <Suspense>
                    <Footer />
                  </Suspense>
                </div>
              </DirectionSync>
            </Providers>
          </LangProvider>
        </Suspense>
      </body>
    </html>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { getBaseUrl, getIndexingEnabled, getYcloudEnabled } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";
import { VercelMetricsGuard } from "@/components/analytics/vercel-metrics-guard";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BrandColorScript } from "@/components/layout/brand-color-script";
import { LangProvider } from "@/lib/locale/context";

const fontSans = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const indexing = getIndexingEnabled();

  return {
    metadataBase: new URL(baseUrl),
    title: getConfig("es").brand.name,
    description: getConfig("es").brand.description,
    icons: { icon: "/icon", apple: "/apple-icon" },
    robots: { index: indexing, follow: indexing },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cfg = getConfig("es");
  return (
    <html lang="es" suppressHydrationWarning className={fontSans.variable}>
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
            </Providers>
          </LangProvider>
        </Suspense>
      </body>
    </html>
  );
}

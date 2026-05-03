import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { getBaseUrl, getIndexingEnabled, VERCEL_ENV } from "@/lib/env";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BrandColorScript } from "@/components/layout/brand-color-script";
import { brand, ui } from "@/lib/config/site";

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
    title: brand.metadata.titleSuffix(brand.name),
    description: brand.description,
    icons: {
      icon: "/icon",
      apple: "/apple-icon",
    },
    robots: {
      index: indexing,
      follow: indexing,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          {ui.skipToContent}
        </a>
        <Providers>
          {VERCEL_ENV === "production" && <Analytics />}
          {VERCEL_ENV === "production" && <SpeedInsights />}
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

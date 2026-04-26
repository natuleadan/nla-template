import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { getBaseUrl } from "@/lib/config/env";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BrandColorScript } from "@/components/layout/brand-color-script";
import { brand } from "@/lib/config/site";

const baseUrl = getBaseUrl();

const fontSans = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: `${brand.name} - Tienda de Suplementos y Alimentos`,
  description: brand.description,
  openGraph: {
    siteName: brand.name,
    type: "website",
    url: baseUrl,
    images: [{ url: `${baseUrl}/opengraph-image`, width: 1200, height: 630, alt: brand.name }],
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: `${baseUrl}/twitter-image`, width: 1200, height: 600, alt: brand.name }],
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
        <Providers>
          <Analytics />
          <SpeedInsights />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

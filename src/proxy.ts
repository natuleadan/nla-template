import Negotiator from "negotiator";
import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "es"] as const;
const DEFAULT_LOCALE = "en";

export type Locale = (typeof LOCALES)[number];

function isStaticRoute(pathname: string): boolean {
  return (
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next") ||
    pathname === "/icon" ||
    pathname === "/apple-icon" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.ts" ||
    pathname === "/llms.txt" ||
    /\.(jpg|jpeg|png|gif|svg|ico|webp|woff|woff2|ttf|eot|json)$/i.test(pathname)
  );
}

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language") || "";
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguage },
  }).languages();

  const detected = languages[0]?.split("-")[0];
  if (detected && LOCALES.includes(detected as any)) {
    return detected;
  }
  return DEFAULT_LOCALE;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticRoute(pathname)) {
    return undefined;
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && LOCALES.includes(firstSegment as any)) {
    return undefined;
  }

  const locale = getLocale(request);
  const restOfPath = firstSegment ? "/" + segments.slice(1).join("/") : pathname;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${restOfPath === "/" ? "" : restOfPath}`;

  const response = NextResponse.redirect(url);
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

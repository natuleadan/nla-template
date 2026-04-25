import { headers, cookies } from "next/headers"
import { cacheLife, cacheTag } from "next/cache"

export interface GeoLocation {
  country: string
  region: string
  city: string
  latitude?: string
  longitude?: string
  timezone?: string
}

export interface UserGeoData {
  location: GeoLocation
  userAgent: string
  anonymousId: string
  ipAddress: string
  referer?: string
  language?: string
  platform?: string
  timestamp: string
}

const ANON_ID_COOKIE_NAME = "tienda_anon_id"
const ANON_ID_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function generateAnonymousId(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  return `anon_${timestamp}_${randomPart}`
}

function getAnonymousIdFromCookie(): string | undefined {
  const cookieStore = cookies()
  const anonCookie = cookieStore.get(ANON_ID_COOKIE_NAME)
  return anonCookie?.value
}

export async function getOrCreateAnonymousId(): Promise<string> {
  const existingId = getAnonymousIdFromCookie()
  if (existingId) {
    return existingId
  }
  return generateAnonymousId()
}

export async function getUserCountry(): Promise<string> {
  const headersList = await headers()
  return (
    headersList.get("x-vercel-ip-country") ||
    headersList.get("cf-ipcountry") ||
    headersList.get("x-country-code") ||
    "unknown"
  )
}

export async function getUserRegion(): Promise<string> {
  const headersList = await headers()
  return headersList.get("x-vercel-ip-country-region") || "unknown"
}

export async function getUserCity(): Promise<string> {
  const headersList = await headers()
  return headersList.get("x-vercel-ip-city") || "unknown"
}

export async function getUserLatitude(): Promise<string | undefined> {
  const headersList = await headers()
  return headersList.get("x-vercel-ip-latitude") || undefined
}

export async function getUserLongitude(): Promise<string | undefined> {
  const headersList = await headers()
  return headersList.get("x-vercel-ip-longitude") || undefined
}

export async function getUserTimezone(): Promise<string | undefined> {
  const headersList = await headers()
  return headersList.get("x-vercel-ip-timezone") || undefined
}

export async function getUserAgent(): Promise<string> {
  const headersList = await headers()
  return headersList.get("user-agent") || "unknown"
}

export async function getReferer(): Promise<string | undefined> {
  const headersList = await headers()
  return headersList.get("referer") || undefined
}

export async function getAcceptLanguage(): Promise<string | undefined> {
  const headersList = await headers()
  return headersList.get("accept-language") || undefined
}

export async function getIpAddress(): Promise<string> {
  const headersList = await headers()
  return (
    headersList.get("x-real-ip") ||
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("cf-connecting-ip") ||
    headersList.get("x-vercel-id") ||
    "unknown"
  )
}

export async function getLocation(): Promise<GeoLocation> {
  const [country, region, city, latitude, longitude, timezone] = await Promise.all([
    getUserCountry(),
    getUserRegion(),
    getUserCity(),
    getUserLatitude(),
    getUserLongitude(),
    getUserTimezone(),
  ])

  return {
    country,
    region,
    city,
    latitude,
    longitude,
    timezone,
  }
}

export async function getPlatform(): Promise<string> {
  const userAgent = await getUserAgent()
  
  if (userAgent.includes("Windows")) return "Windows"
  if (userAgent.includes("Mac")) return "macOS"
  if (userAgent.includes("Linux")) return "Linux"
  if (userAgent.includes("Android")) return "Android"
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS"
  
  return "unknown"
}

export async function getLanguage(): Promise<string> {
  const acceptLanguage = await getAcceptLanguage()
  if (!acceptLanguage) return "unknown"
  
  const primaryLang = acceptLanguage.split(",")[0]
  return primaryLang.split("-")[0]
}

export async function getFullGeoData(): Promise<UserGeoData> {
  const [location, userAgent, ipAddress, referer, language, platform] = await Promise.all([
    getLocation(),
    getUserAgent(),
    getIpAddress(),
    getReferer(),
    getLanguage(),
    getPlatform(),
  ])

  const anonymousId = await getOrCreateAnonymousId()

  return {
    location,
    userAgent,
    anonymousId,
    ipAddress,
    referer,
    language,
    platform,
    timestamp: new Date().toISOString(),
  }
}

async function getUserLocationCached() {
  'use cache'
  cacheLife('minutes', 5)
  cacheTag('geo-location')
  return getFullGeoData()
}

export async function getGeoDataForApi(): Promise<UserGeoData> {
  return getUserLocationCached()
}

export function getGeoHeaders(): Record<string, string> {
  return {
    "X-GymFood-Anon-ID": "set-by-server",
  }
}
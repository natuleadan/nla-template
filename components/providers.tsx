"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { CookieBanner } from "@/components/ui/cookie-banner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster />
      <CookieBanner />
    </ThemeProvider>
  )
}

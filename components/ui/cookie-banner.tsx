"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { IconCookie } from "@tabler/icons-react"
import {
  acceptAllCookiesClient,
  rejectAllCookiesClient,
  hasAcceptedCookiesClient,
  saveCustomCookiePreferences,
} from "@/lib/modules/cookies/client"

interface CookieBannerProps {
  onAccept?: () => void
  onReject?: () => void
}

export function CookieBanner({ onAccept, onReject }: CookieBannerProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(true)

  useEffect(() => {
    async function checkConsent() {
      if (typeof window === "undefined") return
      const hasConsent = hasAcceptedCookiesClient()
      if (!hasConsent) {
        setShowBanner(true)
      }
    }
    checkConsent()
  }, [])

  const handleAcceptAll = () => {
    acceptAllCookiesClient()
    setShowBanner(false)
    onAccept?.()
  }

  const handleRejectAll = () => {
    rejectAllCookiesClient()
    setShowBanner(false)
    onReject?.()
  }

  const handleSavePreferences = () => {
    saveCustomCookiePreferences(analytics, marketing)
    setShowBanner(false)
    onAccept?.()
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconCookie className="size-5" />
            <CardTitle className="text-lg">Política de Cookies</CardTitle>
          </div>
          <CardDescription>
            Utilizamos cookies para mejorar tu experiencia. Puedes aceptar todas las cookies o personalizar tus preferencias.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="necessary" className="flex flex-col">
              <span>Necesarias</span>
              <span className="text-xs text-muted-foreground">Siempre activas</span>
            </Label>
            <Switch id="necessary" checked disabled />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="analytics" className="flex flex-col">
              <span>Analíticas</span>
              <span className="text-xs text-muted-foreground">Nos ayudan a mejorar</span>
            </Label>
            <Switch 
              id="analytics" 
              checked={analytics} 
              onCheckedChange={setAnalytics}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing" className="flex flex-col">
              <span>Marketing</span>
              <span className="text-xs text-muted-foreground">Personalización de anuncios</span>
            </Label>
            <Switch 
              id="marketing" 
              checked={marketing} 
              onCheckedChange={setMarketing}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRejectAll}
            className="flex-1"
          >
            Rechazar
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleSavePreferences}
            className="flex-1"
          >
            Guardar
          </Button>
          <Button 
            size="sm" 
            onClick={handleAcceptAll}
            className="flex-1"
          >
            Aceptar todo
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CookieBanner

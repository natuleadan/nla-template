"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { IconCookie } from "@tabler/icons-react";
import {
  acceptAllCookiesClient,
  rejectAllCookiesClient,
  hasAcceptedCookiesClient,
  saveCustomCookiePreferences,
  getCookieConsent,
} from "@/lib/modules/cookies/client";

interface CookieBannerProps {
  onAccept?: () => void;
  onReject?: () => void;
}

export function CookieBanner({ onAccept, onReject }: CookieBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showCookieButton, setShowCookieButton] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    async function checkConsent() {
      if (typeof window === "undefined") return;
      const hasConsent = hasAcceptedCookiesClient();
      if (!hasConsent) {
        setShowBanner(true);
      } else {
        setShowCookieButton(true);
      }
    }
    checkConsent();
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookiesClient();
    setShowBanner(false);
    setShowCookieButton(true);
    onAccept?.();
  };

  const handleRejectAll = () => {
    rejectAllCookiesClient();
    setShowBanner(false);
    setShowCookieButton(true);
    onReject?.();
  };

  const handleSavePreferences = () => {
    saveCustomCookiePreferences(analytics, marketing);
    setShowBanner(false);
    setShowCookieButton(true);
    onAccept?.();
  };

  const handleOpenCookieSettings = () => {
    const consent = getCookieConsent();
    if (consent) {
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
    }
    setShowCookieButton(false);
    setShowBanner(true);
  };

  if (!showBanner && !showCookieButton) return null;

  return (
    <>
      {showCookieButton && (
        <Button
          size="icon"
          className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg transition-all hover:scale-110 h-12 w-12"
          onClick={handleOpenCookieSettings}
        >
          <IconCookie className="size-6" />
        </Button>
      )}

      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-50 sm:max-w-md sm:left-4 sm:right-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconCookie className="size-5" />
            <CardTitle className="text-lg">Política de Cookies</CardTitle>
          </div>
          <CardDescription>
            Utilizamos cookies para mejorar tu experiencia. Puedes aceptar todas
            las cookies o personalizar tus preferencias.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="necessary" className="flex flex-col items-start">
              <span>Necesarias</span>
              <span className="text-xs text-muted-foreground">
                Siempre activas
              </span>
            </Label>
            <Switch id="necessary" checked disabled />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="analytics" className="flex flex-col items-start">
              <span>Analíticas</span>
              <span className="text-xs text-muted-foreground">
                Nos ayudan a mejorar
              </span>
            </Label>
            <Switch id="analytics" checked={analytics} onCheckedChange={setAnalytics} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="marketing" className="flex flex-col items-start">
              <span>Marketing</span>
              <span className="text-xs text-muted-foreground">
                Personalización de anuncios
              </span>
            </Label>
            <Switch id="marketing" checked={marketing} onCheckedChange={setMarketing} />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 w-full">
          <Button variant="outline" size="sm" onClick={handleRejectAll} className="w-full sm:flex-1">
            Rechazar
          </Button>
          <Button variant="outline" size="sm" onClick={handleSavePreferences} className="w-full sm:flex-1">
            Guardar
          </Button>
          <Button size="sm" onClick={handleAcceptAll} className="w-full sm:flex-1">
            Aceptar todo
          </Button>
        </CardFooter>
      </Card>
      </div>
      )}
    </>
  );
}

export default CookieBanner;

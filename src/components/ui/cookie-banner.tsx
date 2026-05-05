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
} from "@/lib/internal/cookies/client";
import { notifyCookieConsentWebhook } from "@/lib/internal/cookies/webhook.service";
import { useLang } from "@/hooks/use-lang";
import { getConfig } from "@/lib/locale/config";

interface CookieBannerProps {
  onAccept?: () => void;
  onReject?: () => void;
}

export function CookieBanner({ onAccept, onReject }: CookieBannerProps) {
  const lang = useLang();
  const cfg = getConfig(lang);
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
    notifyCookieConsentWebhook({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    onAccept?.();
  };

  const handleRejectAll = () => {
    rejectAllCookiesClient();
    setShowBanner(false);
    setShowCookieButton(true);
    notifyCookieConsentWebhook({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    onReject?.();
  };

  const handleSavePreferences = () => {
    saveCustomCookiePreferences(analytics, marketing);
    setShowBanner(false);
    setShowCookieButton(true);
    notifyCookieConsentWebhook({ necessary: true, analytics, marketing });
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
                <CardTitle className="text-lg">{cfg.ui.cookie.title}</CardTitle>
              </div>
              <CardDescription>{cfg.ui.cookie.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="necessary"
                  className="flex flex-col items-start"
                >
                  <span>{cfg.ui.cookie.necessary}</span>
                  <span className="text-xs text-muted-foreground">
                    {cfg.ui.cookie.alwaysActive}
                  </span>
                </Label>
                <Switch id="necessary" checked disabled />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="analytics"
                  className="flex flex-col items-start"
                >
                  <span>{cfg.ui.cookie.analytics}</span>
                  <span className="text-xs text-muted-foreground">
                    {cfg.ui.cookie.analyticsHelper}
                  </span>
                </Label>
                <Switch
                  id="analytics"
                  checked={analytics}
                  onCheckedChange={setAnalytics}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="marketing"
                  className="flex flex-col items-start"
                >
                  <span>{cfg.ui.cookie.marketing}</span>
                  <span className="text-xs text-muted-foreground">
                    {cfg.ui.cookie.marketingHelper}
                  </span>
                </Label>
                <Switch
                  id="marketing"
                  checked={marketing}
                  onCheckedChange={setMarketing}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
                className="w-full sm:flex-1"
              >
                {cfg.ui.cookie.reject}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSavePreferences}
                className="w-full sm:flex-1"
              >
                {cfg.ui.cookie.save}
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="w-full sm:flex-1"
              >
                {cfg.ui.cookie.acceptAll}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

export default CookieBanner;

"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { VERCEL_ENV } from "@/lib/env.public";
import { getCookieConsent } from "@/lib/modules/cookies/client";
import { useEffect, useState } from "react";

export function VercelMetricsGuard() {
  const [consentedAnalytics, setConsentedAnalytics] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent) {
      setConsentedAnalytics(consent.analytics);
    }
  }, []);

  if (VERCEL_ENV !== "production") return null;

  return (
    <>
      <Analytics
        beforeSend={(event) => {
          if (!consentedAnalytics) return null;
          return event;
        }}
      />
      <SpeedInsights
        beforeSend={(event) => {
          if (!consentedAnalytics) return null;
          return event;
        }}
      />
    </>
  );
}

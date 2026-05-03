"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/locale/context";
import { getConfig } from "@/lib/locale/config";

export function Copyright({ brandName }: { brandName: string }) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <p className="mt-4 text-sm text-muted-foreground">
      {cfg.ui.copyright(year, brandName)}
    </p>
  );
}

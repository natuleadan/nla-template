"use client";

import { useLang } from "@/hooks/use-lang";
import { getDir } from "@/lib/locale/locales";
import { DirectionProvider } from "@/components/ui/direction";

export function DirectionSync({ children }: { children: React.ReactNode }) {
  const lang = useLang();
  const dir = getDir(lang);

  return (
    <DirectionProvider dir={dir} direction={dir}>
      {children}
    </DirectionProvider>
  );
}

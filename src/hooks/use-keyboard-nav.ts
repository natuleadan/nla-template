"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Shortcut {
  key: string;
  href: string;
}

export function useKeyboardNav(lang: string, shortcuts: Shortcut[]) {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      const s = shortcuts.find((s) => s.key === e.key);
      if (s) {
        e.preventDefault();
        router.push(`/${lang}${s.href}`);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [lang, shortcuts, router]);
}

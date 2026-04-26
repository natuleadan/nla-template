"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/config/utils";

interface ProseProps {
  html: string;
  className?: string;
}

export function Prose({ html, className }: ProseProps) {
  const [sanitized, setSanitized] = useState(html);

  useEffect(() => {
    let cancelled = false;
    import("isomorphic-dompurify").then((mod) => {
      if (!cancelled) setSanitized(mod.default.sanitize(html));
    });
    return () => { cancelled = true; };
  }, [html]);

  return (
    <div
      className={cn("prose-html space-y-3", className)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export function CurrentTime() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm font-normal shrink-0">
      <span className="inline-block size-2 rounded-full bg-green-500 animate-pulse shrink-0" />
      <span className="font-mono tabular-nums">
        {time.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
    </Badge>
  );
}

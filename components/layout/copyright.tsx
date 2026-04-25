"use client";

import { useState, useEffect } from "react";

export function Copyright({ brandName }: { brandName: string }) {
  const [year, setYear] = useState(2026);
  
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <p className="mt-4 text-sm text-muted-foreground">
      © {year} {brandName}. Todos los derechos reservados.
    </p>
  );
}

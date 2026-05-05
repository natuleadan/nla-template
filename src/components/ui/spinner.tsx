"use client";

import { cn } from "@/lib/utils";
import { IconLoader } from "@tabler/icons-react";
import { useLang } from "@/hooks/use-lang";
import { getConfig } from "@/lib/locale/config";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const lang = useLang();
  const cfg = getConfig(lang);
  return (
    <IconLoader
      role="status"
      aria-label={cfg.ui.spinner.ariaLabel}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };

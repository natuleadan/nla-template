"use client";

import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconSun, IconMoon, IconDeviceDesktop, IconCheck } from "@tabler/icons-react";
import { useLang } from "@/lib/locale/context";
import { getConfig } from "@/lib/locale/config";

const THEME_MODES = [
  { value: "system", label: "System", icon: IconDeviceDesktop },
  { value: "light", label: "Light", icon: IconSun },
  { value: "dark", label: "Dark", icon: IconMoon },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const lang = useLang();
  const cfg = getConfig(lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={cfg.ui.navbar.themeAriaLabel}>
          <IconSun className="size-5 hidden dark:block" />
          <IconMoon className="size-5 block dark:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        {THEME_MODES.map((mode) => {
          const Icon = mode.icon;
          return (
            <DropdownMenuItem
              key={mode.value}
              onClick={() => setTheme(mode.value)}
              className="flex items-center gap-2 justify-between"
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4" />
                <span className={theme === mode.value ? "font-semibold" : ""}>
                  {mode.label}
                </span>
              </span>
              {theme === mode.value && <IconCheck className="size-4 shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

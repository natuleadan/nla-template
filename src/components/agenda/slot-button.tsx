"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/config/utils";
import type { AgendaSlot } from "@/lib/modules/agenda";

interface SlotButtonProps {
  slot: AgendaSlot;
  dayName: string;
  onClick: (slot: AgendaSlot) => void;
  disabled?: boolean;
}

export function SlotButton({ slot, dayName, onClick, disabled }: SlotButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onClick(slot)}
      aria-disabled={disabled}
      className={cn(
        "w-full justify-center text-xs sm:text-sm transition-colors",
        disabled
          ? "opacity-40 cursor-not-allowed line-through hover:bg-transparent hover:text-inherit pointer-events-auto"
          : "hover:border-primary hover:text-primary",
      )}
      aria-label={`${dayName} a las ${slot.time}${slot.type ? ` — ${slot.type}` : ""}${disabled ? " — no disponible" : ""}`}
    >
      {slot.time}
    </Button>
  );
}

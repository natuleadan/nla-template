"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/config/utils";
import { agenda } from "@/lib/config/site";
import type { AgendaSlot } from "@/lib/modules/agenda";

interface SlotButtonProps {
  slot: AgendaSlot;
  dayName: string;
  onClick: (slot: AgendaSlot) => void;
}

export function SlotButton({ slot, dayName, onClick }: SlotButtonProps) {
  if (!slot.available) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onClick(slot)}
      className={cn(
        "w-full justify-center text-xs sm:text-sm",
        "hover:border-primary hover:text-primary",
        "transition-colors",
      )}
    >
      {slot.time}
    </Button>
  );
}

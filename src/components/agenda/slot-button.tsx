"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/config/utils";
import type { AgendaSlot } from "@/lib/modules/agenda";
import { agenda } from "@/lib/config/site";

interface SlotButtonProps {
  slot: AgendaSlot;
  dayName: string;
  onClick: (slot: AgendaSlot) => void;
  disabled?: boolean;
}

const typeColors = [
  "bg-primary/10 border-primary/30 hover:bg-primary/15",
  "bg-primary/5 border-primary/20 hover:bg-primary/10",
  "bg-primary/[0.07] border-primary/25 hover:bg-primary/[0.12]",
  "bg-primary/15 border-primary/40 hover:bg-primary/20",
];

function getTypeIndex(type?: string): number {
  if (!type) return 0;
  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    hash = type.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % typeColors.length;
}

export function SlotButton({ slot, dayName, onClick, disabled }: SlotButtonProps) {
  const colorClass = typeColors[getTypeIndex(slot.type)];

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onClick(slot)}
      aria-disabled={disabled}
      className={cn(
        "group relative w-full justify-center text-xs sm:text-sm transition-all overflow-hidden",
        disabled
          ? "opacity-40 cursor-not-allowed line-through hover:bg-transparent hover:text-inherit pointer-events-auto"
          : colorClass,
      )}
      aria-label={`${dayName} a las ${slot.time}${slot.type ? ` — ${slot.type}` : ""}${disabled ? agenda.slotButton.unavailable : ""}`}
    >
      {slot.type ? (
        <>
          <span className="transition-opacity duration-200 group-hover:opacity-0">
            {slot.time}
          </span>
          <span className="absolute inset-0 flex items-center justify-center px-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100 truncate">
            {slot.type}
          </span>
        </>
      ) : (
        slot.time
      )}
    </Button>
  );
}

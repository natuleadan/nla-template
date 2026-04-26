"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IconInfoCircle } from "@tabler/icons-react";
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
    <div className="flex items-center gap-1">
      {slot.type && !disabled && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-default"
              aria-label={`Tipo: ${slot.type}`}
            >
              <IconInfoCircle className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <span>{slot.type}</span>
          </TooltipContent>
        </Tooltip>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onClick(slot)}
        aria-disabled={disabled}
        className={cn(
          "flex-1 justify-center text-xs sm:text-sm transition-colors",
          disabled
            ? "opacity-40 cursor-not-allowed line-through hover:bg-transparent hover:text-inherit pointer-events-auto"
            : "hover:border-primary hover:text-primary",
        )}
        aria-label={`${dayName} a las ${slot.time}${slot.type ? ` — ${slot.type}` : ""}${disabled ? " — no disponible" : ""}`}
      >
        {slot.time}
      </Button>
    </div>
  );
}

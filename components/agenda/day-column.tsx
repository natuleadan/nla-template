"use client";

import { SlotButton } from "./slot-button";
import { SlotDialog } from "./slot-dialog";
import { Badge } from "@/components/ui/badge";
import { agenda } from "@/lib/config/site";
import { cn } from "@/lib/config/utils";
import { useState, useEffect } from "react";
import type { AgendaSlot, AgendaDay } from "@/lib/modules/agenda";

interface DayColumnProps {
  day: AgendaDay;
  date: Date;
  initialDay?: string;
  initialTime?: string;
}

export function DayColumn({ day, date, initialDay, initialTime }: DayColumnProps) {
  const [selectedSlot, setSelectedSlot] = useState<AgendaSlot | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  useEffect(() => {
    if (initialDay && initialTime && day.name === initialDay) {
      const slot = day.slots.find((s) => s.time === initialTime && s.available);
      if (slot) {
        setSelectedSlot(slot);
        setDialogOpen(true);
      }
    }
  }, [initialDay, initialTime, day]);

  const handleSlotClick = (slot: AgendaSlot) => {
    setSelectedSlot(slot);
    setDialogOpen(true);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-3 rounded-lg border min-w-[130px] flex-1",
        isToday && "border-primary bg-primary/5",
      )}
    >
      <div className="flex flex-col items-center gap-1 mb-2">
        <Badge variant="default" className="text-xs px-2 py-0 max-w-full truncate">
          {day.name}
        </Badge>
        <p className={cn("text-2xl font-bold leading-none", isToday && "text-primary")}>
          {date.getDate()}
        </p>
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        {day.slots.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            {agenda.calendar.closed}
          </p>
        ) : (
          day.slots
            .filter((s) => s.available)
            .map((slot) => (
              <SlotButton
                key={slot.time}
                slot={slot}
                dayName={day.name}
                onClick={handleSlotClick}
              />
            ))
        )}
      </div>
      <SlotDialog
        slot={selectedSlot}
        dayName={day.name}
        date={date}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

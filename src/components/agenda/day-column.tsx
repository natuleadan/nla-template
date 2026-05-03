"use client";

import { SlotButton } from "./slot-button";
import { SlotDialog } from "./slot-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/config/utils";
import { useLang } from "@/lib/locale/context";
import { getConfig } from "@/lib/locale/config";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import type { AgendaSlot, AgendaDay } from "@/lib/modules/agenda";

interface DayColumnProps {
  day: AgendaDay;
  date: Date;
  targetDay?: string;
  targetTime?: string;
  autoOpenDialog: boolean;
}

function isSlotExpired(slot: AgendaSlot, date: Date, isPastDay: boolean): boolean {
  if (!slot.available || isPastDay) return true;
  if (!isTodayDate(date)) return false;
  const now = new Date();
  const cutoff = new Date(now.getTime() + 30 * 60 * 1000);
  const [h, m] = slot.time.split(":").map(Number);
  const slotDate = new Date(date);
  slotDate.setHours(h, m, 0, 0);
  return slotDate.getTime() <= cutoff.getTime();
}

function isTodayDate(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function isPastDay(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

export function DayColumn({ day, date, targetDay, targetTime, autoOpenDialog }: DayColumnProps) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const [selectedSlot, setSelectedSlot] = useState<AgendaSlot | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  useEffect(() => {
    if (!autoOpenDialog) return;
    if (targetDay && targetTime) {
      const slot = day.slots.find((s) => s.time === targetTime && s.available);
      if (slot) setSelectedSlot(slot);
    }
    setDialogOpen(true);
  }, [autoOpenDialog, targetDay, targetTime, day]);

  const handleSlotClick = (slot: AgendaSlot) => {
    if (isSlotExpired(slot, date, isPastDay(date))) {
      toast.error(cfg.agenda.slot.slotUnavailable);
      return;
    }
    setSelectedSlot(slot);
    setDialogOpen(true);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-3 rounded-lg border",
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
            {cfg.agenda.calendar.closed}
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
                disabled={isSlotExpired(slot, date, isPastDay(date))}
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

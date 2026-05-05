"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DayColumn } from "./day-column";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useLang } from "@/hooks/use-lang";
import { getConfig, getDateLocale } from "@/lib/locale/config";
import { getWeekMax } from "@/lib/env";
import type { AgendaDay } from "@/lib/modules/agenda";

interface WeeklyCalendarProps {
  days: AgendaDay[];
}

function getWeekStartDate(weekOffset: number): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatDate(date: Date, locale = "es"): string {
  return date.toLocaleDateString(getDateLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDatesForWeek(monday: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  return dates;
}

export function WeeklyCalendar({ days }: WeeklyCalendarProps) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const [weekOffset, setWeekOffset] = useState(0);
  const searchParams = useSearchParams();
  const initialDay = searchParams.get("dia") || undefined;
  const initialTime = searchParams.get("hora") || undefined;
  const initialProduct = searchParams.get("producto") || undefined;

  const weekStart = useMemo(() => getWeekStartDate(weekOffset), [weekOffset]);
  const weekDates = useMemo(() => getDatesForWeek(weekStart), [weekStart]);

  const targetDayName = useMemo(() => {
    if (initialDay) return initialDay;
    if (initialProduct) {
      const firstAvail = days.find((d) => d.slots.some((s) => s.available));
      return firstAvail?.name;
    }
    return undefined;
  }, [initialDay, initialProduct, days]);

  const maxWeeks = getWeekMax();
  const canGoNext = weekOffset < maxWeeks - 1;
  const canGoPrev = weekOffset > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWeekOffset((p) => p - 1)}
          disabled={!canGoPrev}
          className="gap-2 shrink-0"
          aria-label={cfg.agenda.calendar.previousWeek}
        >
          <IconChevronLeft className="size-4" />
          <span className="hidden sm:inline">
            {cfg.agenda.calendar.previousWeek}
          </span>
        </Button>
        <p
          className="text-sm font-medium text-muted-foreground text-center truncate min-w-0 px-2"
          aria-live="polite"
          aria-atomic="true"
        >
          {cfg.agenda.calendar.weekOf(formatDate(weekStart, lang))}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWeekOffset((p) => p + 1)}
          disabled={!canGoNext}
          className="gap-2 shrink-0"
          aria-label={cfg.agenda.calendar.nextWeek}
        >
          <span className="hidden sm:inline">
            {cfg.agenda.calendar.nextWeek}
          </span>
          <IconChevronRight className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
        {days.map((day, idx) => (
          <DayColumn
            key={day.dayOfWeek}
            day={day}
            date={weekDates[idx]}
            targetDay={targetDayName}
            targetTime={initialTime}
            autoOpenDialog={day.name === targetDayName}
          />
        ))}
      </div>
    </div>
  );
}

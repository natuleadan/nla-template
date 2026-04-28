"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconBrandWhatsapp, IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";
import { getBaseUrl } from "@/lib/env";
import { agenda, categoryBadge, ui } from "@/lib/config/site";
import { useWhatsApp } from "@/components/whatsapp-provider";
import { getWeekDays } from "@/lib/modules/agenda";
import { getAppointmentTypes, getSlotsByType } from "@/lib/agenda-utils";
import type { AgendaSlot } from "@/lib/modules/agenda";
import type { AgendaSlotInfo } from "@/lib/agenda-utils";

interface SlotDialogProps {
  slot: AgendaSlot | null;
  dayName: string;
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ProductOption {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
}

import { dayNames } from "@/lib/config/site/agenda";

function formatFullDate(dayName: string, time: string): string {
  const now = new Date();
  const todayDayOfWeek = now.getDay();
  const targetDay = dayNames[dayName];
  if (targetDay === undefined) return `${dayName} ${time}`;

  let diff = targetDay - todayDayOfWeek;
  if (diff < 0) diff += 7;
  const d = new Date(now);
  d.setDate(d.getDate() + diff);

  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function SlotDialog({ slot, dayName, date, open, onOpenChange }: SlotDialogProps) {
  const searchParams = useSearchParams();
  const { openWhatsApp } = useWhatsApp();
  const [message, setMessage] = useState(searchParams.get("mensaje") || "");
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState(slot?.type || searchParams.get("tipo") || "");
  const [availableSlots, setAvailableSlots] = useState<AgendaSlotInfo[]>([]);
  const [pickedSlotOverride, setPickedSlotOverride] = useState<AgendaSlotInfo | null | undefined>(undefined);

  useEffect(() => {
    setMessage(searchParams.get("mensaje") || "");
    setSelectedProduct("");
    setPickedSlotOverride(undefined);
    const tipo = searchParams.get("tipo");
    if (tipo) setSelectedType(tipo);
  }, [open, searchParams]);

  const urlSlot = useMemo<AgendaSlotInfo | null>(() => {
    const d = searchParams.get("dia");
    const h = searchParams.get("hora");
    const t = searchParams.get("tipo");
    if (d && h) {
      return { dayName: d, dayNumber: 0, monthName: "", time: h, type: t || "" };
    }
    if (slot && dayName) {
      const now = new Date();
      const targetDay = dayNames[dayName];
      const today = now.getDay();
      let diff = targetDay - today;
      if (diff < 0) diff += 7;
      const slotDate = new Date(now);
      slotDate.setDate(now.getDate() + diff);
      return {
        dayName,
        dayNumber: slotDate.getDate(),
        monthName: slotDate.toLocaleDateString("es-ES", { month: "short" }).replace(".", ""),
        time: slot.time,
        type: slot.type || "",
      };
    }
    return null;
  }, [slot, dayName, searchParams]);

  const pickedSlot = pickedSlotOverride !== undefined ? pickedSlotOverride : urlSlot;

  useEffect(() => {
    if (!open) return;
    getWeekDays().then((days) => {
      const allTypes = getAppointmentTypes(days);
      setTypes(allTypes);
      const tipo = slot?.type || searchParams.get("tipo") || allTypes[0] || "";
      if (tipo) {
        setSelectedType(tipo);
        setPickedSlotOverride(undefined);
        const slots = getSlotsByType(days, tipo);
        setAvailableSlots(slots);
      }
    });
  }, [open, slot, dayName, searchParams]);

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/products?limit=100");
      const data = await res.json();
      setProducts((data.products || []).map((p: { id: string; name: string; slug: string; price: number; category: string }) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        category: p.category,
      })));
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    if (open) loadProducts();
  }, [open, loadProducts]);

  const productSlugFromUrl = searchParams.get("producto") || "";
  useEffect(() => {
    if (productSlugFromUrl && products.length > 0) {
      const match = products.find((p) => p.slug === productSlugFromUrl);
      if (match) setSelectedProduct(match.id);
    }
  }, [productSlugFromUrl, products]);

  const handleTypeChange = async (type: string) => {
    setSelectedType(type);
    setPickedSlotOverride(null);
    const days = await getWeekDays();
    const slots = getSlotsByType(days, type);
    setAvailableSlots(slots);
  };

  const handlePickSlot = (s: AgendaSlotInfo) => {
    setPickedSlotOverride(s);
  };

  if (!pickedSlot && !availableSlots.length && !selectedType) {
    const initial = slot?.type || searchParams.get("tipo") || "";
    if (!initial) {
      const dayLabel = date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{agenda.slot.dialogTitle}</DialogTitle>
              <DialogDescription>
                {agenda.slot.dialogDescription}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <p className="text-sm font-medium capitalize">{dayLabel}</p>
              {types.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">{agenda.slot.typeLabel}</label>
                  <Select value={selectedType} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={agenda.slot.typePlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {agenda.slot.cancel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }
  }

  if (!pickedSlot && selectedType) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedType}</DialogTitle>
            <DialogDescription>
              {agenda.slot.timeDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger>
              <SelectValue placeholder={agenda.slot.typePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableSlots.length > 0 ? (
              <div className="grid gap-2 max-h-64 overflow-y-auto">
                {availableSlots.map((s, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="justify-start h-auto py-2.5"
                    onClick={() => handlePickSlot(s)}
                  >
                    <span className="text-sm">
                      <span className="font-medium">{s.dayName} {s.dayNumber} {s.monthName}</span>{" "}
                      <span className="text-muted-foreground">{s.time} h</span>
                    </span>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {agenda.slot.noSlots}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {agenda.slot.cancel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (!pickedSlot) return null;

  const selected = products.find((p) => p.id === selectedProduct);

  const baseUrl = typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : getBaseUrl();

  const fullDate = formatFullDate(pickedSlot.dayName, pickedSlot.time);

  const shareUrl = `${baseUrl}/agenda?dia=${encodeURIComponent(pickedSlot.dayName)}&hora=${encodeURIComponent(pickedSlot.time)}&tipo=${encodeURIComponent(selectedType)}${selected ? `&producto=${encodeURIComponent(selected.slug)}` : ""}${message.trim() ? `&mensaje=${encodeURIComponent(message.trim())}` : ""}`;

  const handleConsultar = () => {
    let mensaje = agenda.slot.whatsappTemplate(fullDate, pickedSlot.time, selectedType);
    if (selected) {
      mensaje += `\n\n${agenda.slot.productInterest}: ${selected.name} ($${selected.price.toFixed(2)})`;
    }
    if (message.trim()) {
      mensaje += `\n\n${message.trim()}`;
    }
    openWhatsApp({ message: mensaje, title: agenda.slot.dialogTitle });
    onOpenChange(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(ui.share.toastSuccess);
    } catch {
      toast.error(ui.share.toastError);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{agenda.slot.dialogTitle}</DialogTitle>
          <DialogDescription>
            {agenda.slot.dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="py-2 space-y-3">
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger>
               <SelectValue placeholder={agenda.slot.typePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {types.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
            <p className="font-medium">{fullDate}</p>
            <p className="text-muted-foreground">
              {pickedSlot.time} horas &mdash; {selectedType}
            </p>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => setPickedSlotOverride(null)}
            >
              {agenda.slot.changeSlot}
            </Button>
          </div>
          <div className="space-y-2">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={agenda.slot.productPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selected && (
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Badge variant={selected.category === "suplemento" ? "default" : selected.category === "servicio" ? "outline" : "secondary"} className="text-xs">
                    {categoryBadge[selected.category] || selected.category}
                  </Badge>
                </div>
                <span className="text-sm font-semibold">
                  ${selected.price.toFixed(2)}
                </span>
              </div>
            )}
          </div>
          <Textarea
            placeholder={agenda.slot.messagePlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>
        <DialogFooter className="sm:[&>button]:flex-1">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {agenda.slot.cancel}
          </Button>
          <Button variant="outline" onClick={handleCopyLink} className="gap-2">
            <IconCopy className="size-4" />
            {agenda.slot.share}
          </Button>
          <Button onClick={handleConsultar} className="gap-2" disabled={message.trim().length < 10}>
            <IconBrandWhatsapp className="size-4" />
            {agenda.slot.consult}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
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
import { getWhatsappNumber, getBaseUrl } from "@/lib/config/env";
import notificationService from "@/lib/modules/notification";
import { agenda, ui } from "@/lib/config/site";
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

function formatFullDate(dayName: string, time: string): string {
  const now = new Date();
  const todayDayOfWeek = now.getDay();
  const dayMap: Record<string, number> = {
    Domingo: 0, Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6,
  };
  const targetDay = dayMap[dayName];
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
  const [message, setMessage] = useState(searchParams.get("mensaje") || "");
  const [products, setProducts] = useState<ProductOption[]>([]);
  const initialProductSlug = searchParams.get("producto") || "";
  const [selectedProduct, setSelectedProduct] = useState("");

  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState(slot?.type || searchParams.get("tipo") || "");
  const [availableSlots, setAvailableSlots] = useState<AgendaSlotInfo[]>([]);
  const [pickedSlot, setPickedSlot] = useState<AgendaSlotInfo | null>(
    slot && dayName ? { dayName, time: slot.time, type: slot.type || "" } : null,
  );

  useEffect(() => {
    if (slot && dayName) {
      setPickedSlot({ dayName, time: slot.time, type: slot.type || "" });
      if (slot.type) setSelectedType(slot.type);
    }
  }, [slot, dayName]);

  useEffect(() => {
    if (!open) return;
    getWeekDays().then((days) => {
      const t = getAppointmentTypes(days);
      setTypes(t);

      const initial = selectedType || slot?.type || searchParams.get("tipo") || "";
      if (initial) {
        setSelectedType(initial);
        const slots = getSlotsByType(days, initial);
        setAvailableSlots(slots);
      }
    });
  }, [open, slot, dayName, selectedType, searchParams]);

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

  useEffect(() => {
    if (initialProductSlug && products.length > 0) {
      const match = products.find((p) => p.slug === initialProductSlug);
      if (match) setSelectedProduct(match.id);
    }
  }, [initialProductSlug, products]);

  const handleTypeChange = async (type: string) => {
    setSelectedType(type);
    setPickedSlot(null);
    const days = await getWeekDays();
    const slots = getSlotsByType(days, type);
    setAvailableSlots(slots);
  };

  const handlePickSlot = (s: AgendaSlotInfo) => {
    setPickedSlot(s);
  };

  if (!pickedSlot && !availableSlots.length && !selectedType) {
    const initial = slot?.type || searchParams.get("tipo") || "";
    if (!initial) {
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
              {types.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de cita</label>
                  <Select value={selectedType} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de cita" />
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
              Selecciona un horario disponible
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de cita" />
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
                      <span className="font-medium">{s.dayName}</span>{" "}
                      <span className="text-muted-foreground">{s.time} h</span>
                    </span>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay horarios disponibles
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
    notificationService.info(ui.openingWhatsApp);
    let mensaje = agenda.slot.whatsappTemplate(fullDate, pickedSlot.time, selectedType);
    if (selected) {
      mensaje += `\n\nProducto de interés: ${selected.name} ($${selected.price.toFixed(2)})`;
    }
    if (message.trim()) {
      mensaje += `\n\n${message.trim()}`;
    }
    const urlWhatsapp = `https://wa.me/${getWhatsappNumber()}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, "_blank");
    onOpenChange(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Enlace copiado al portapapeles");
    } catch {
      toast.error("Error al copiar el enlace");
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
              <SelectValue placeholder="Tipo de cita" />
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
              onClick={() => setPickedSlot(null)}
            >
              Cambiar horario
            </Button>
          </div>
          <div className="space-y-2">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar producto (opcional)" />
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
                  <Badge variant={selected.category === "suplemento" ? "default" : "secondary"} className="text-xs">
                    {selected.category === "suplemento" ? "Suplemento" : "Alimento"}
                  </Badge>
                </div>
                <span className="text-sm font-semibold">
                  ${selected.price.toFixed(2)}
                </span>
              </div>
            )}
          </div>
          <Textarea
            placeholder="Escribe tu mensaje o consulta..."
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
            Compartir
          </Button>
          <Button onClick={handleConsultar} className="gap-2" disabled={message.trim().length < 10}>
            <IconBrandWhatsapp className="size-4" />
            Consultar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

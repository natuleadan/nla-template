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
import type { AgendaSlot } from "@/lib/modules/agenda";

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

function formatFullDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
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

  if (!slot) return null;

  const selected = products.find((p) => p.id === selectedProduct);

  const baseUrl = typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : getBaseUrl();

  const fullDate = formatFullDate(date);

  const shareUrl = `${baseUrl}/agenda?dia=${encodeURIComponent(dayName)}&hora=${encodeURIComponent(slot.time)}${slot.type ? `&tipo=${encodeURIComponent(slot.type)}` : ""}${selected ? `&producto=${encodeURIComponent(selected.slug)}` : ""}${message.trim() ? `&mensaje=${encodeURIComponent(message.trim())}` : ""}`;

  const handleConsultar = () => {
    notificationService.info(ui.openingWhatsApp);
    let mensaje = agenda.slot.whatsappTemplate(fullDate, slot.time, slot.type);
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
          <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
            <p className="font-medium">{fullDate}</p>
            <p className="text-muted-foreground">
              {slot.time} horas{slot.type ? <> &mdash; {slot.type}</> : null}
            </p>
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

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  IconShare,
  IconBrandX,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconMail,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface ShareDialogProps {
  url: string;
  label?: string;
  title?: string;
  description?: string;
  price?: number;
}

export function ShareDialog({ url, label = "Compartir", title, description, price }: ShareDialogProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado al portapapeles");
    } catch {
      toast.error("Error al copiar el enlace");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <IconShare className="size-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            Copia el enlace o comparte en redes sociales
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Copia el enlace para compartir:
            </p>
            <div
              className="bg-muted p-3 rounded-md cursor-pointer select-all text-sm break-all hover:bg-muted/80 transition-colors"
              onClick={handleCopy}
              role="button"
              tabIndex={0}
              aria-label="Copiar enlace al portapapeles"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCopy();
              }}
            >
              {url}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Compartir en redes:
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, "_blank")}
                aria-label="Compartir en X"
              >
                <IconBrandX className="size-4" />
                <span className="text-xs">X</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")}
                aria-label="Compartir en Facebook"
              >
                <IconBrandFacebook className="size-4" />
                <span className="text-xs">FB</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")}
                aria-label="Compartir en LinkedIn"
              >
                <IconBrandLinkedin className="size-4" />
                <span className="text-xs">IN</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => {
                  const parts: string[] = [];
                  if (title) parts.push(title);
                  if (price !== undefined) parts.push(`$${price.toFixed(2)}`);
                  if (description) parts.push(description);
                  parts.push(url);
                  window.open(`mailto:?subject=${encodeURIComponent(title ? `Compartir: ${title}` : "Compartir enlace")}&body=${encodeURIComponent(parts.join("\n\n"))}`);
                }}
                aria-label="Compartir por correo"
              >
                <IconMail className="size-4" />
                <span className="text-xs">ML</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

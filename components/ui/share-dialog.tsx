"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  IconShare,
  IconBrandX,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface ShareDialogProps {
  url: string;
  label?: string;
}

export function ShareDialog({ url, label = "Compartir" }: ShareDialogProps) {
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
              >
                <IconBrandX className="size-4" />
                <span className="text-xs">X</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")}
              >
                <IconBrandFacebook className="size-4" />
                <span className="text-xs">FB</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")}
              >
                <IconBrandLinkedin className="size-4" />
                <span className="text-xs">IN</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => window.open(`https://www.instagram.com/`, "_blank")}
              >
                <IconBrandInstagram className="size-4" />
                <span className="text-xs">IG</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

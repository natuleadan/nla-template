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
import { useLang } from "@/lib/locale/context";
import { getConfig } from "@/lib/locale/config";

interface ShareDialogProps {
  url: string;
  label?: string;
  title?: string;
  description?: string;
  price?: number;
}

export function ShareDialog({ url, label, title, description, price }: ShareDialogProps) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const resolvedLabel = label || cfg.ui.share.label;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(cfg.ui.share.toastSuccess);
    } catch {
      toast.error(cfg.ui.share.toastError);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <IconShare className="size-4" />
          {resolvedLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{resolvedLabel}</DialogTitle>
          <DialogDescription>
            {cfg.ui.share.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {cfg.ui.share.copyLabel}
            </p>
            <div
              className="bg-muted p-3 rounded-md cursor-pointer select-all text-sm break-all hover:bg-muted/80 transition-colors"
              onClick={handleCopy}
              role="button"
              tabIndex={0}
              aria-label={cfg.ui.share.copyAriaLabel}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCopy();
              }}
            >
              {url}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {cfg.ui.share.socialLabel}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, "_blank")}
                aria-label={cfg.ui.share.twitter}
              >
                <IconBrandX className="size-4" />
                <span className="text-xs">X</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")}
                aria-label={cfg.ui.share.facebook}
              >
                <IconBrandFacebook className="size-4" />
                <span className="text-xs">FB</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")}
                aria-label={cfg.ui.share.linkedin}
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
                  window.open(`mailto:?subject=${encodeURIComponent(title ? cfg.ui.share.emailSubject(title) : cfg.ui.share.emailSubjectFallback)}&body=${encodeURIComponent(parts.join("\n\n"))}`);
                }}
                aria-label={cfg.ui.share.email}
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

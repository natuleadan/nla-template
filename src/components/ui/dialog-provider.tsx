"use client";

import * as React from "react";
import {
  DialogService,
  type DialogOptions,
} from "@/lib/internal/dialog/service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function DialogRenderer({ dialogs }: { dialogs: Map<string, DialogOptions> }) {
  return (
    <>
      {Array.from(dialogs.values()).map((dialog) => (
        <DialogWrapper key={dialog.id} dialog={dialog} />
      ))}
    </>
  );
}

function DialogWrapper({ dialog }: { dialog: DialogOptions }) {
  const handleBackdropClick = (open: boolean) => {
    if (!open && dialog.closeOnBackdrop !== false) {
      DialogService.close(dialog.id!);
    }
  };

  const handleButtonClick = async (onClick?: () => void | Promise<void>) => {
    if (onClick) await onClick();
    DialogService.close(dialog.id!);
  };

  return (
    <Dialog open onOpenChange={handleBackdropClick}>
      <DialogContent
        className={
          dialog.size === "sm"
            ? "sm:max-w-sm"
            : dialog.size === "lg"
              ? "sm:max-w-lg"
              : dialog.size === "xl"
                ? "sm:max-w-4xl"
                : dialog.size === "wide"
                  ? "sm:max-w-6xl"
                  : dialog.size === "full"
                    ? "sm:max-w-full"
                    : "sm:max-w-md"
        }
      >
        <DialogHeader>
          <DialogTitle>{dialog.title}</DialogTitle>
          {dialog.description && (
            <DialogDescription>{dialog.description}</DialogDescription>
          )}
        </DialogHeader>

        {dialog.customContent && (
          <div className="py-2">{dialog.customContent}</div>
        )}

        {dialog.buttons && dialog.buttons.length > 0 && (
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            {dialog.buttons.map((button, idx) => (
              <Button
                key={idx}
                variant={
                  button.variant === "destructive"
                    ? "destructive"
                    : button.variant === "primary"
                      ? "default"
                      : "outline"
                }
                disabled={button.disabled || button.loading}
                onClick={() => handleButtonClick(button.onClick)}
              >
                {button.loading && (
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                )}
                {button.label}
              </Button>
            ))}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogs, setDialogs] = React.useState<Map<string, DialogOptions>>(
    new Map(),
  );

  React.useEffect(() => {
    const unsubscribe = DialogService.subscribe((updatedDialogs) => {
      setDialogs(new Map(updatedDialogs));
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      {children}
      <DialogRenderer dialogs={dialogs} />
    </>
  );
}

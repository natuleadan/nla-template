"use client";

import * as React from "react";
import { DialogService, type DialogOptions } from "./service";

export function useDialog() {
  const [dialogs, setDialogs] = React.useState<Map<string, DialogOptions>>(new Map());

  React.useEffect(() => {
    const unsubscribe = DialogService.subscribe((updatedDialogs) => {
      setDialogs(new Map(updatedDialogs));
    });
    return () => unsubscribe();
  }, []);

  return {
    show: (options: DialogOptions): string => DialogService.show(options),
    close: (dialogId: string): void => DialogService.close(dialogId),
    closeAll: (): void => DialogService.closeAll(),
    dialogs,
  };
}

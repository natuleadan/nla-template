export type DialogSize = "sm" | "md" | "lg" | "xl" | "wide" | "full";
export type ButtonVariant = "primary" | "outline" | "destructive";

export interface DialogButton {
  label: string;
  variant?: ButtonVariant;
  onClick?: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

export interface DialogOptions {
  id?: string;
  title: string;
  description?: string;
  size?: DialogSize;
  buttons?: DialogButton[];
  closeOnBackdrop?: boolean;
  customContent?: React.ReactNode;
}

export class DialogService {
  private static listeners: Set<(dialogs: Map<string, DialogOptions>) => void> = new Set();
  private static dialogs: Map<string, DialogOptions> = new Map();
  private static dialogCounter = 0;

  static show(options: DialogOptions): string {
    const id = options.id || `dialog-${this.dialogCounter++}`;
    this.dialogs.set(id, { ...options, id });
    this.notify();
    return id;
  }

  static close(dialogId: string): void {
    this.dialogs.delete(dialogId);
    this.notify();
  }

  static closeAll(): void {
    this.dialogs.clear();
    this.notify();
  }

  static getAll(): Map<string, DialogOptions> {
    return new Map(this.dialogs);
  }

  static subscribe(listener: (dialogs: Map<string, DialogOptions>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notify(): void {
    this.listeners.forEach((listener) => listener(this.getAll()));
  }
}

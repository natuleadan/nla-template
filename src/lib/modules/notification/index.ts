"use client";

import { toast, type ToasterProps } from "sonner";

export type NotificationType =
  | "success"
  | "error"
  | "info"
  | "warning"
  | "loading";

export interface NotificationOptions {
  duration?: number;
  id?: string;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface PromiseMsgs<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: Error) => string);
}

export const notificationService = {
  success: (message: string, options?: NotificationOptions) => {
    return toast.success(message, {
      duration: 4000,
      dismissible: true,
      ...options,
    });
  },

  error: (message: string, options?: NotificationOptions) => {
    return toast.error(message, {
      duration: 4000,
      dismissible: true,
      ...options,
    });
  },

  info: (message: string, options?: NotificationOptions) => {
    return toast.info(message, {
      duration: 4000,
      dismissible: true,
      ...options,
    });
  },

  warning: (message: string, options?: NotificationOptions) => {
    return toast.warning(message, {
      duration: 4000,
      dismissible: true,
      ...options,
    });
  },

  loading: (message: string, options?: NotificationOptions) => {
    return toast.loading(message, {
      duration: 4000,
      dismissible: true,
      ...options,
    });
  },

  promise: <T>(
    promise: () => Promise<T>,
    msgs: PromiseMsgs<T>,
    opts?: NotificationOptions,
  ) => {
    return toast.promise(promise, {
      loading: msgs.loading,
      success: msgs.success,
      error: msgs.error,
      duration: 4000,
      dismissible: true,
      ...opts,
    });
  },

  dismiss: (id?: string | number) => {
    if (id) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }
  },

  closeAll: () => {
    toast.dismiss();
  },

  custom: (
    message: string,
    type: NotificationType,
    options?: NotificationOptions,
  ) => {
    const methods: Record<
      NotificationType,
      (
        msg: string,
        opts?: Record<string, unknown>,
      ) => string | number | undefined
    > = {
      success: toast.success,
      error: toast.error,
      info: toast.info,
      warning: toast.warning,
      loading: toast.loading,
    };
    return methods[type](message, {
      duration: 4000,
      dismissible: true,
      ...options,
    });
  },
};

export default notificationService;

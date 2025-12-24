import { readonly, ref } from 'vue';

import { TOAST_DEFAULT_DURATION } from '@/constants/seo';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

const toasts = ref<Toast[]>([]);
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function createToastId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useToast() {
  const removeToast = (id: string): void => {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  const show = (type: ToastType, message: string, options?: { duration?: number }): string => {
    const id = createToastId();
    const duration = options?.duration ?? TOAST_DEFAULT_DURATION;

    const toast: Toast = { id, type, message, duration };
    toasts.value = [...toasts.value, toast];

    if (duration > 0) {
      const timer = setTimeout(() => {
        timers.delete(id);
        removeToast(id);
      }, duration);
      timers.set(id, timer);
    }

    return id;
  };

  return {
    toasts: readonly(toasts),
    show,
    success: (message: string, options?: { duration?: number }) =>
      show('success', message, options),
    error: (message: string, options?: { duration?: number }) => show('error', message, options),
    info: (message: string, options?: { duration?: number }) => show('info', message, options),
    removeToast,
  };
}

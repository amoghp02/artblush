export type ToastTone = "default" | "success";

export interface ToastDetail {
  message: string;
  tone?: ToastTone;
}

export const TOAST_EVENT = "artblush-toast";

export function toast(message: string, tone: ToastTone = "default") {
  window.dispatchEvent(
    new CustomEvent<ToastDetail>(TOAST_EVENT, {
      detail: { message, tone },
    }),
  );
}
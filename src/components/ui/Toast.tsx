import { type ReactNode, useEffect, useState } from "react";

export type ToastTone = "success" | "error" | "info";

export function Toast({
  message,
  tone = "success",
  onDismiss,
}: {
  message: string;
  tone?: ToastTone;
  onDismiss?: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const toneClasses =
    tone === "success"
      ? "border-success/30 text-success"
      : tone === "error"
        ? "border-destructive/30 text-destructive"
        : "border-border text-foreground";

  return (
    <div
      role="status"
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md border border-solid bg-card px-4 py-3 text-sm font-medium shadow-card transition-all duration-300 ${toneClasses} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3">
        <span>{message}</span>
        {onDismiss && (
          <button type="button" aria-label="Dismiss" onClick={onDismiss} className="p-0.5 hover:opacity-70">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function useToastAutoHide(message: string, timeout = 2500, onDismiss?: () => void) {
  const [tone, setTone] = useState<ToastTone>("success");
  useEffect(() => {
    if (!message) return;
    setTone("success");
    const t = window.setTimeout(() => onDismiss?.(), timeout);
    return () => window.clearTimeout(t);
  }, [message, timeout, onDismiss]);
  return { tone };
}

export function ToastHost({ children }: { children: ReactNode }) {
  return <div aria-live="polite">{children}</div>;
}
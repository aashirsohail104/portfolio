import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

function isSameShape<T>(initialValue: T, parsed: unknown): parsed is T {
  if (parsed === null) return initialValue === null;
  if (Array.isArray(initialValue)) return Array.isArray(parsed);
  if (typeof initialValue === "object") {
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed);
  }
  return typeof parsed === typeof initialValue;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return initialValue;
      const parsed: unknown = JSON.parse(raw);
      if (!isSameShape(initialValue, parsed)) {
        window.localStorage.removeItem(key);
        return initialValue;
      }
      return parsed;
    } catch {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* ignore storage access errors */
      }
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota / availability errors */
    }
  }, [key, value]);

  return [value, setValue];
}
import { useEffect } from "react";
import { setPageMeta, type PageMeta } from "./index";

export function usePageMeta(meta: PageMeta | null): void {
  useEffect(() => {
    if (meta) {
      setPageMeta(meta);
    }
  }, [meta]);
}
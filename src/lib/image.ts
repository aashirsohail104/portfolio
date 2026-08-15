import type { SyntheticEvent } from "react";

export const fallbackImage =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='#f1f5f9'/><g fill='#94a3b8'><rect x='150' y='120' width='100' height='130' rx='8'/><circle cx='200' cy='185' r='16'/></g></svg>`
  );

export function onImgError(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.src = fallbackImage;
}
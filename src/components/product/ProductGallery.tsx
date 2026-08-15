import { useCallback, useEffect, useRef, useState } from "react";

import { fallbackImage, onImgError } from "@/lib/image";

export function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const frameRef = useRef<HTMLDivElement>(null);

  const list = images.length > 0 ? images : [fallbackImage];
  const current = list[active] ?? fallbackImage;

  const next = useCallback(() => setActive((a) => (a + 1) % list.length), [list.length]);
  const prev = useCallback(() => setActive((a) => (a - 1 + list.length) % list.length), [list.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName ?? "";
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag) || target?.isContentEditable) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onMove = (e: React.MouseEvent) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    onImgError(e);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={frameRef}
        className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
      >
        <img
          src={current}
          alt={productName}
          onError={handleImageError}
          className={`size-full object-cover transition-transform duration-200 ${
            zoom ? "scale-[1.9]" : "scale-100"
          }`}
          style={
            zoom ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined
          }
        />

        {list.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={prev}
              className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-card backdrop-blur-sm transition-opacity hover:opacity-90"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={next}
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-card backdrop-blur-sm transition-opacity hover:opacity-90"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Product images">
          {list.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Image ${i + 1}`}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                i === active ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" onError={handleImageError} className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
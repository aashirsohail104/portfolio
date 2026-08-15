import type { Variant } from "@/lib/api/types";

export function VariantSelector({
  variants,
  selected,
  onSelect,
}: {
  variants: Variant[];
  selected: Variant | null;
  onSelect: (v: Variant) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Options">
      {variants.map((v) => {
        const active = selected?.name === v.name;
        return (
          <button
            key={v.name}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(v)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "border-brand bg-brand/10 text-brand"
                : "border-input text-foreground hover:border-foreground/40"
            }`}
          >
            {v.name}
          </button>
        );
      })}
    </div>
  );
}
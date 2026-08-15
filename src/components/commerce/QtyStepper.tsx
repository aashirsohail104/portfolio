export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  className = "",
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center rounded-md border border-input ${className}`}>
      <button
        type="button"
        aria-label="Decrease quantity"
        className="flex size-9 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 12h14" />
        </svg>
      </button>
      <span
        aria-live="polite"
        aria-label={`Quantity ${value}`}
        className="w-8 text-center text-sm font-medium tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="flex size-9 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useCommerce } from "@/context/CommerceContext";
import { hasDiscount } from "@/lib/logic/pricing";

export function FlashSaleBanner({ category = "Power Supplies" }: { category?: string }) {
  const { products } = useCommerce();
  const deals = useMemo(
    () =>
      products
        .filter((p) => p.category === category && hasDiscount({ price: p.price, oldPrice: p.oldPrice ?? null }))
        .slice(0, 4),
    [products, category]
  );

  const [secondsLeft, setSecondsLeft] = useState(7 * 24 * 3600);

  useEffect(() => {
    const t = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, []);

  if (deals.length === 0) return null;

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <section
      aria-label="Flash sale"
      className="relative overflow-hidden rounded-lg bg-brand px-6 py-6 text-brand-foreground sm:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"
      />
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-foreground/80">
            Deal of the day
          </p>
          <h2 className="mt-1 text-xl font-bold sm:text-2xl">Up to 30% off power supplies</h2>
          <p className="mt-1 text-sm text-brand-foreground/85">
            Limited-time pricing on selected {category.toLowerCase()}.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-wide text-brand-foreground/80">Ends in</p>
            <div className="mt-1 flex items-center gap-1.5" aria-label={`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds remaining`}>
              <TimerCell value={days} label="days" />
              <span className="font-bold">:</span>
              <TimerCell value={hours} label="hrs" />
              <span className="font-bold">:</span>
              <TimerCell value={minutes} label="min" />
              <span className="font-bold">:</span>
              <TimerCell value={seconds} label="sec" />
            </div>
          </div>
          <Link
            to="/catalog"
            className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-semibold text-brand shadow-card transition-opacity hover:opacity-90"
          >
            Shop deals
          </Link>
        </div>
      </div>
    </section>
  );
}

function TimerCell({ value, label }: { value: number; label: string }) {
  return (
    <span className="flex flex-col items-center rounded bg-white/15 px-2 py-1">
      <span className="font-mono text-lg font-bold leading-none tabular-nums">{String(value).padStart(2, "0")}</span>
      <span className="text-[10px] uppercase tracking-wide text-brand-foreground/80">{label}</span>
    </span>
  );
}
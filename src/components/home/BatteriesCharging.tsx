import { Link } from "react-router-dom";
import { Battery, BatteryCharging, Hexagon, PlugZap, Truck } from "lucide-react";

import { CategoryTileGrid } from "@/components/home/CategoryTileGrid";
import { SectionHeading } from "@/components/home/SectionHeading";

const TILE_NAMES = ["Battery Charger", "Lithium Batteries", "Cell", "Power Supply"];

const TILE_ICONS = {
  "Battery Charger": BatteryCharging,
  "Lithium Batteries": Battery,
  Cell: Hexagon,
  "Power Supply": PlugZap,
};

export function BatteriesCharging() {
  return (
    <section aria-labelledby="home-batteries-charging">
      <SectionHeading id="home-batteries-charging" title="Batteries & Charging" />
      <div className="mt-5">
        <CategoryTileGrid names={TILE_NAMES} icons={TILE_ICONS} />
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-xl border border-border bg-card p-6 shadow-premium sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-muted text-neon"
          >
            <Truck className="size-6" />
          </span>
          <div>
            <p className="text-sm font-semibold text-neon">Free delivery over Rs 5,000</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Orders above Rs 5,000 ship free to major cities across Pakistan.
            </p>
          </div>
        </div>
        <Link
          to="/catalog"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
        >
          Shop now
        </Link>
      </div>
    </section>
  );
}

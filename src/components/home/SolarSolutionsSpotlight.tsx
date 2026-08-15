import { Link } from "react-router-dom";
import { BatteryCharging, Gauge, Sun, Zap } from "lucide-react";

import { categoryHref } from "@/components/layout/categoryLinks";
import { CategoryTileGrid } from "@/components/home/CategoryTileGrid";
import type { Category } from "@/lib/api/types";

const SOLAR_LINK: Category = { name: "Solar Inverters", slug: "solar-inverters" };
const LITHIUM_LINK: Category = { name: "Lithium Batteries", slug: "lithium-batteries" };

const TILE_NAMES = [
  "Solar Inverters",
  "Lithium Batteries",
  "Solar Charge Controllers",
  "Charge Controller",
];

const TILE_ICONS = {
  "Solar Inverters": Sun,
  "Lithium Batteries": BatteryCharging,
  "Solar Charge Controllers": Gauge,
  "Charge Controller": Zap,
};

export function SolarSolutionsSpotlight() {
  return (
    <section aria-labelledby="home-solar-solutions">
      <div className="grid items-start gap-8 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
        <div>
          <h2
            id="home-solar-solutions"
            className="text-xl font-bold text-foreground sm:text-2xl"
          >
            Solar Solutions
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Rooftop-ready solar inverters, hybrid setups and long-life LiFePO4 batteries —
            dependable backup for homes and shops across Pakistan.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={categoryHref(SOLAR_LINK)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand px-6 text-base font-semibold text-brand-foreground shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              Explore Solar Inverters
            </Link>
            <Link
              to={categoryHref(LITHIUM_LINK)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-input bg-card px-6 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              View Lithium Batteries
            </Link>
          </div>
        </div>

        <CategoryTileGrid
          names={TILE_NAMES}
          icons={TILE_ICONS}
          className="grid gap-4 sm:grid-cols-2"
        />
      </div>
    </section>
  );
}

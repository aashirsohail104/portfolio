import { Cable, Cpu, ShieldCheck } from "lucide-react";

import { CategoryTileGrid } from "@/components/home/CategoryTileGrid";
import { SectionHeading } from "@/components/home/SectionHeading";

const TILE_NAMES = ["Solar Accessories", "Breakers & Protection", "Module"];

const TILE_ICONS = {
  "Solar Accessories": Cable,
  "Breakers & Protection": ShieldCheck,
  Module: Cpu,
};

export function SolarAccessoriesProtection() {
  return (
    <section aria-labelledby="home-solar-accessories">
      <SectionHeading id="home-solar-accessories" title="Solar Accessories & Protection" />
      <div className="mt-5">
        <CategoryTileGrid
          names={TILE_NAMES}
          icons={TILE_ICONS}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        />
      </div>
    </section>
  );
}

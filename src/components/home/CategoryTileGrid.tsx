import { Sun, type LucideIcon } from "lucide-react";

import { useCommerce } from "@/context/CommerceContext";
import { CategoryTile } from "@/components/home/CategoryTile";
import { countProductsByCategory, findCategories } from "@/components/home/homeSections";
import { Skeleton } from "@/components/ui/Skeleton";

export function CategoryTileGrid({
  names,
  icons,
  className = "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
  skeletonCount = 4,
}: {
  names: string[];
  icons: Record<string, LucideIcon>;
  className?: string;
  skeletonCount?: number;
}) {
  const { products, categories, loading } = useCommerce();
  const tiles = findCategories(categories, names);

  if (loading && categories.length === 0) {
    return (
      <div className={className}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (tiles.length === 0) return null;

  return (
    <div className={className}>
      {tiles.map((cat) => (
        <CategoryTile
          key={cat.slug}
          category={cat}
          count={countProductsByCategory(products, cat.name)}
          icon={icons[cat.name] ?? Sun}
        />
      ))}
    </div>
  );
}

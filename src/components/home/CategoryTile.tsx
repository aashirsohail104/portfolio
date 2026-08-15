import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { categoryHref } from "@/components/layout/categoryLinks";
import type { Category } from "@/lib/api/types";

export function CategoryTile({
  category,
  count,
  icon: Icon,
}: {
  category: Category;
  count: number;
  icon: LucideIcon;
}) {
  return (
    <Link
      to={categoryHref(category)}
      className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-card-hover"
    >
      <span
        aria-hidden="true"
        className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-muted text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground"
      >
        <Icon className="size-5" />
      </span>
      <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-brand">
        {category.name}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {count} {count === 1 ? "product" : "products"}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand">
        Shop
        <ArrowRight
          aria-hidden="true"
          className="size-3.5 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

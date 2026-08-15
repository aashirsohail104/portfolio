import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useCommerce } from "@/context/CommerceContext";
import { categoryHref } from "./categoryLinks";
import { siteInfo } from "./siteInfo";
import { onImgError } from "@/lib/image";
import type { Category, Product } from "@/lib/api/types";
import productsData from "@data/products.json";

const FEATURED_SLUG = "galaxy-ultra-plus-4kw-pv5600-hybrid-solar-inverter";
const products = productsData as unknown as Product[];
const featuredProduct = products.find((p) => p.slug === FEATURED_SLUG) ?? null;

export function CategoryNav() {
  const { categories } = useCommerce();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <nav className="hidden border-t border-border lg:block" aria-label="Categories">
      <div ref={wrapRef} className="container-page relative flex h-12 items-center gap-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors ${
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`
          }
        >
          <HomeIcon />
          Home
        </NavLink>
        <NavLink
          to="/catalog"
          className={({ isActive }) =>
            `inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors ${
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`
          }
        >
          <GridIcon />
          Catalog
        </NavLink>
        {categories.length > 0 && (
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-haspopup="true"
            aria-controls="categories-menu"
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors ${
              open ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <LayersIcon />
            All Categories
            <ChevronIcon className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        )}
        <div className="ml-auto hidden items-center gap-1.5 text-xs text-muted-foreground xl:flex">
          <TruckIcon />
          {siteInfo.delivery}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="categories-menu"
              role="region"
              aria-label="All categories"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setOpen(false)}
              className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-premium"
            >
              <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((cat) => (
                    <CategoryBlock key={cat.slug} category={cat} />
                  ))}
                </div>
                {featuredProduct && <FeaturedTile product={featuredProduct} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

function CategoryBlock({ category }: { category: Category }) {
  const subs = category.subCategories ?? [];
  return (
    <div>
      <Link
        to={categoryHref(category)}
        className="font-display text-sm font-semibold text-foreground transition-colors hover:text-brand"
      >
        {category.name}
      </Link>
      {subs.length > 0 && (
        <ul className="mt-2 space-y-1.5 border-l border-border pl-3">
          {subs.map((sub) => (
            <li key={sub.slug}>
              <Link
                to={categoryHref(category, sub)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {sub.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FeaturedTile({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative flex min-h-44 flex-col justify-end overflow-hidden rounded-lg bg-muted lg:min-h-full"
    >
      <img
        src={product.image}
        alt=""
        loading="lazy"
        decoding="async"
        onError={onImgError}
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="relative bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4">
        <span className="inline-flex items-center rounded-full bg-neon px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
          Featured
        </span>
        <p className="mt-2 line-clamp-2 text-sm font-semibold text-white">{product.productName}</p>
        <p className="mt-1 text-xs font-medium text-white/70">Shop now</p>
      </div>
    </Link>
  );
}

function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 17h-9m-2-8h12v8m4-1h2v-4l-3-3h-3" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

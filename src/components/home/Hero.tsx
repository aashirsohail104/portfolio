import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { categoryHref } from "@/components/layout/categoryLinks";
import { PriceTag } from "@/components/commerce/PriceTag";
import { onImgError } from "@/lib/image";
import type { Category, Product } from "@/lib/api/types";
import productsData from "@data/products.json";

const FEATURED_SLUG = "galaxy-ultra-plus-4kw-pv5600-hybrid-solar-inverter";

const SOLAR_CATEGORY: Category = { name: "Solar Inverters", slug: "solar-inverters" };
const INVERTER_CATEGORY: Category = { name: "Inverter", slug: "inverter" };

const SOLAR_HREF = categoryHref(SOLAR_CATEGORY);
const INVERTER_HREF = categoryHref(INVERTER_CATEGORY);

const TRUST_CHIPS = ["Genuine Products", "Nationwide Delivery", "Warranty Support"];

const products = productsData as unknown as Product[];
const featured = products.find((p) => p.slug === FEATURED_SLUG) ?? null;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export function Hero() {
  const reduceMotion = useReducedMotion();
  const anim = (delay: number) => (reduceMotion ? {} : fadeUp(delay));

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-background to-muted/40 px-6 py-12 shadow-premium sm:px-10 lg:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-brand/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-neon/10 blur-3xl"
      />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="max-w-2xl">
          <motion.p
            {...anim(0.2)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            <span aria-hidden="true" className="size-2 rounded-full bg-neon" />
            Solar • Inverter • UPS Solutions
          </motion.p>

          <motion.h1
            {...anim(0.2)}
            id="hero-heading"
            className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl"
          >
            Power Your Home.
            <span className="text-gradient block">Power Your Future.</span>
          </motion.h1>

          <motion.p
            {...anim(0.4)}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Genuine solar inverters, premium battery chargers and power supplies for dependable
            backup across Pakistan.
          </motion.p>

          <motion.div {...anim(0.6)} className="mt-8 flex flex-wrap gap-3">
            <Link
              to={SOLAR_HREF}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand px-6 text-base font-semibold text-brand-foreground shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.98]"
            >
              Explore Solar Solutions
            </Link>
            <Link
              to={INVERTER_HREF}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-input bg-card px-6 text-base font-semibold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
            >
              Shop Inverters
            </Link>
          </motion.div>

          <motion.ul {...anim(0.6)} className="mt-8 flex flex-wrap gap-2">
            {TRUST_CHIPS.map((label) => (
              <li
                key={label}
                className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card"
              >
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        {featured && (
          <motion.div {...anim(0.4)} className="relative">
            <Link
              to={`/product/${featured.slug}`}
              className={`group block overflow-hidden rounded-3xl bg-card/80 shadow-premium backdrop-blur transition-shadow hover:shadow-card-hover ${
                reduceMotion ? "" : "animate-float"
              }`}
            >
              <div className="relative bg-muted">
                <img
                  src={featured.image}
                  alt={featured.productName}
                  loading="eager"
                  decoding="async"
                  onError={onImgError}
                  className="aspect-square size-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground">
                  Featured
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-foreground/90 text-background"
                >
                  <ArrowUpRight className="size-5" />
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                  {featured.category}
                </p>
                <p className="mt-1 line-clamp-2 text-lg font-semibold leading-snug text-foreground group-hover:text-brand">
                  {featured.productName}
                </p>
                <div className="mt-2">
                  <PriceTag price={featured.price} oldPrice={featured.oldPrice ?? null} size="lg" />
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

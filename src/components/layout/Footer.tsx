import { Link } from "react-router-dom";
import { Clock, MapPin, MessageCircle, Phone, Truck } from "lucide-react";

import { categoryHref } from "./categoryLinks";
import { siteInfo } from "./siteInfo";
import type { Category } from "@/lib/api/types";

const SHOP_CATEGORIES: Category[] = [
  { name: "Battery Charger", slug: "battery-charger" },
  { name: "Solar Inverters", slug: "solar-inverters" },
  { name: "Inverter", slug: "inverter" },
  { name: "Lithium Batteries", slug: "lithium-batteries" },
  { name: "Power Supply", slug: "power-supply" },
];

const ACCOUNT_LINKS: { label: string; href: string }[] = [
  { label: "Cart", href: "/cart" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Compare", href: "/compare" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-semibold text-foreground">{siteInfo.name}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Premium battery chargers, power supplies, charge controllers and inverters — authentic specs,
            genuine products.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <Truck aria-hidden="true" className="size-4 shrink-0 text-neon" />
            {siteInfo.delivery}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <a
              href={siteInfo.waHref}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
              className="grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
            </a>
            <a
              href={siteInfo.telHref}
              aria-label="Call Anas Electronics"
              className="grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand"
            >
              <Phone className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <nav aria-label="Shop">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/catalog" className="text-muted-foreground transition-colors hover:text-foreground">
                All products
              </Link>
            </li>
            {SHOP_CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  to={categoryHref(category)}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Account">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Account</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {ACCOUNT_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Contact and support">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Contact</h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
              <span className="text-muted-foreground">{siteInfo.address}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
              <a href={siteInfo.telHref} className="text-muted-foreground transition-colors hover:text-foreground">
                {siteInfo.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MessageCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
              <a
                href={siteInfo.waHref}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                WhatsApp us
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
              <span className="text-muted-foreground">{siteInfo.workingHours}</span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-1 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteInfo.name}. Demo storefront.
          </p>
          <p>Product data courtesy of SmartEshop.pk.</p>
        </div>
      </div>
    </footer>
  );
}

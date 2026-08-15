import { useEffect, useRef, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useCommerce } from "@/context/CommerceContext";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { SearchBar } from "@/components/search/SearchBar";
import { categoryHref } from "./categoryLinks";
import type { Category } from "@/lib/api/types";

export function MobileDrawer({
  open,
  onClose,
  focusSearch = false,
}: {
  open: boolean;
  onClose: () => void;
  focusSearch?: boolean;
}) {
  const { categories, cartCount, wishlistCount, compareCount, openCart } = useCommerce();
  const panelRef = useRef<HTMLElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const location = useLocation();

  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const locationKey = `${location.pathname}${location.search}`;
  const prevKey = useRef(locationKey);
  useEffect(() => {
    if (prevKey.current !== locationKey) {
      prevKey.current = locationKey;
      onClose();
    }
  }, [locationKey, onClose]);

  useEffect(() => {
    if (!open || !focusSearch) return;
    const input = searchWrapRef.current?.querySelector<HTMLInputElement>("input[type='search']");
    input?.focus();
  }, [open, focusSearch]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.aside
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-card shadow-drawer focus:outline-none z-50"
            initial={{ x: reduceMotion ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: reduceMotion ? 0 : "100%" }}
            transition={{ type: "tween", duration: reduceMotion ? 0 : 0.3 }}
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="font-display text-lg font-semibold text-foreground">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <CloseIcon />
              </button>
            </header>

            <div ref={searchWrapRef} className="px-5 pt-4">
              <SearchBar placeholder="Search products…" />
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Menu">
              <ul className="space-y-1">
                <li>
                  <DrawerLink to="/" onClose={onClose}>
                    Home
                  </DrawerLink>
                </li>
                <li>
                  <DrawerLink to="/catalog" onClose={onClose}>
                    Catalog
                  </DrawerLink>
                </li>
              </ul>

              {categories.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</p>
                  <ul className="mt-3 space-y-3">
                    {categories.map((cat) => (
                      <CategoryGroup key={cat.slug} category={cat} onClose={onClose} />
                    ))}
                  </ul>
                </div>
              )}
            </nav>

            <footer className="border-t border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <DrawerIconLink to="/wishlist" count={wishlistCount} label="Wishlist" onClose={onClose}>
                  <HeartIcon />
                </DrawerIconLink>
                <DrawerIconLink to="/compare" count={compareCount} label="Compare" onClose={onClose}>
                  <CompareIcon />
                </DrawerIconLink>
                <button
                  type="button"
                  onClick={() => {
                    openCart();
                    onClose();
                  }}
                  aria-label={`Open cart, ${cartCount} items`}
                  className="relative inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-border text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <CartIcon />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="grid min-w-5 place-items-center rounded-full bg-brand px-1.5 text-xs font-bold text-brand-foreground">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </footer>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function CategoryGroup({ category, onClose }: { category: Category; onClose: () => void }) {
  const subs = category.subCategories ?? [];
  return (
    <li>
      <Link
        to={categoryHref(category)}
        onClick={onClose}
        className="block text-sm font-semibold text-foreground hover:text-brand"
      >
        {category.name}
      </Link>
      {subs.length > 0 && (
        <ul className="mt-1.5 space-y-1.5 border-l border-border pl-3">
          {subs.map((sub) => (
            <li key={sub.slug}>
              <Link
                to={categoryHref(category, sub)}
                onClick={onClose}
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                {sub.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function DrawerLink({ to, onClose, children }: { to: string; onClose: () => void; children: ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="block rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-brand"
    >
      {children}
    </Link>
  );
}

function DrawerIconLink({
  to,
  count,
  label,
  onClose,
  children,
}: {
  to: string;
  count: number;
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      aria-label={`${label}, ${count} items`}
      className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
      <span>{label}</span>
      {count > 0 && (
        <span className="grid min-w-5 place-items-center rounded-full bg-muted px-1.5 text-xs font-semibold text-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 6h16M8 12h8m-5 6h2" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 6h15l-1.7 8.5a2 2 0 0 1-2 1.5H8.2a2 2 0 0 1-2-1.5L4.3 3.5A1.2 1.2 0 0 0 3 2.5" />
      <circle cx="9" cy="21" r="1" />
      <circle cx="17" cy="21" r="1" />
    </svg>
  );
}

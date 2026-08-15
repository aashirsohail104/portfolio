import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { useCommerce } from "@/context/CommerceContext";
import { SearchBar } from "@/components/search/SearchBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "./AnnouncementBar";
import { CategoryNav } from "./CategoryNav";
import { MobileDrawer } from "./MobileDrawer";
import { siteInfo } from "./siteInfo";

export function Header() {
  const { cartCount, wishlistCount, compareCount, openCart } = useCommerce();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <AnnouncementBar />

      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Anas Electronics home">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-bold text-brand-foreground">
            AE
          </span>
          <span className="hidden font-display text-lg font-semibold tracking-tight sm:block">
            Anas Electronics
          </span>
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-0.5" aria-label="Primary">
          <a
            href={siteInfo.telHref}
            className="hidden h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground xl:inline-flex"
            aria-label={`Call ${siteInfo.phone}`}
          >
            <PhoneIcon />
            <span className="hidden 2xl:inline">{siteInfo.phone}</span>
          </a>
          <CountLink to="/wishlist" count={wishlistCount} label="Wishlist" icon="heart" className="hidden md:inline-flex" />
          <CountLink to="/compare" count={compareCount} label="Compare" icon="compare" className="hidden md:inline-flex" />
          <button
            type="button"
            onClick={() => {
              setSearchOpen(true);
              setMenuOpen(true);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Search"
            aria-haspopup="dialog"
            aria-controls="mobile-menu"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            onClick={openCart}
            className="relative inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            aria-label={`Open cart, ${cartCount} items`}
          >
            <CartIcon />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-brand px-1.5 text-xs font-bold text-brand-foreground">
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchOpen(false);
              setMenuOpen(true);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <MenuIcon />
          </button>
        </nav>
      </div>

      <CategoryNav />

      <MobileDrawer
        open={menuOpen}
        focusSearch={searchOpen}
        onClose={() => {
          setMenuOpen(false);
          setSearchOpen(false);
        }}
      />
      <CartDrawer />
    </header>
  );
}

function CountLink({
  to,
  count,
  label,
  icon,
  className = "",
}: {
  to: string;
  count: number;
  label: string;
  icon: "heart" | "compare";
  className?: string;
}) {
  return (
    <NavLink
      to={to}
      aria-label={`${label}, ${count} items`}
      className={({ isActive }) =>
        `h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors ${
          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
        } ${className}`
      }
    >
      {icon === "heart" ? <HeartIcon /> : <CompareIcon />}
      <span className="hidden lg:inline">{label}</span>
      {count > 0 && (
        <span className="grid min-w-5 place-items-center rounded-full bg-muted px-1.5 text-xs font-semibold text-foreground">
          {count}
        </span>
      )}
    </NavLink>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c1 .3 1.9.5 2.9.6a2 2 0 0 1 1.6 2Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 6h15l-1.7 8.5a2 2 0 0 1-2 1.5H8.2a2 2 0 0 1-2-1.5L4.3 3.5A1.2 1.2 0 0 0 3 2.5" />
      <circle cx="9" cy="21" r="1" />
      <circle cx="17" cy="21" r="1" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 6h16M8 12h8m-5 6h2" />
    </svg>
  );
}

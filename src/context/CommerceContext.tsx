import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product, Category } from "@/lib/api/types";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useCompare } from "@/hooks/useCompare";
import { Toast, type ToastTone } from "@/components/ui/Toast";

interface ToastState {
  message: string;
  tone: ToastTone;
  id: number;
}

export interface CommerceContextValue {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  cart: ReturnType<typeof useCart>;
  wishlist: ReturnType<typeof useWishlist>;
  compare: ReturnType<typeof useCompare>;
  cartCount: number;
  wishlistCount: number;
  compareCount: number;
  showToast: (message: string, tone?: ToastTone) => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CommerceContext = createContext<CommerceContextValue | null>(null);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const { products, categories, loading, error } = useProducts();
  const cart = useCart(products);
  const wishlist = useWishlist();
  const compare = useCompare();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const showToast = useCallback((message: string, tone: ToastTone = "success") => {
    setToast({ message, tone, id: Date.now() });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const value = useMemo<CommerceContextValue>(
    () => ({
      products,
      categories,
      loading,
      error,
      cart,
      wishlist,
      compare,
      cartCount: cart.itemCount,
      wishlistCount: wishlist.items.length,
      compareCount: compare.items.length,
      showToast,
      cartOpen,
      openCart,
      closeCart,
    }),
    [products, categories, loading, error, cart, wishlist, compare, showToast, cartOpen, openCart, closeCart]
  );

  return (
    <CommerceContext.Provider value={value}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          tone={toast.tone}
          onDismiss={dismissToast}
        />
      )}
    </CommerceContext.Provider>
  );
}

export function useCommerce(): CommerceContextValue {
  const ctx = useContext(CommerceContext);
  if (!ctx) throw new Error("useCommerce must be used within a CommerceProvider");
  return ctx;
}
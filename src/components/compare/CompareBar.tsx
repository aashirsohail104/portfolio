import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { useCommerce } from "@/context/CommerceContext";
import { onImgError } from "@/lib/image";

export function CompareBar() {
  const { products, compare } = useCommerce();
  const items = compare.items
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2"
      >
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-drawer">
          <div className="flex -space-x-2 overflow-hidden">
            {items.map((p) => (
              <img
                key={p.id}
                src={p.image}
                alt=""
                onError={onImgError}
                className="h-10 w-10 rounded-full border-2 border-card object-cover"
              />
            ))}
          </div>
          <p className="flex-1 text-sm text-foreground">
            <span className="font-semibold">{items.length}</span>
            {items.length === 1 ? " product" : " products"} selected
          </p>
          <button
            type="button"
            onClick={() => items.forEach((p) => compare.remove(p.id))}
            className="text-sm text-muted-foreground hover:text-destructive"
          >
            Clear
          </button>
          <Link
            to="/compare"
            className="inline-flex h-9 items-center justify-center rounded-md bg-brand px-4 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            Compare now
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
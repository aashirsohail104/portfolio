import {
  wishlistAdd,
  wishlistHas,
  wishlistRemove,
  wishlistToggle,
  type WishlistItem,
} from "@/lib/logic/wishlist";
import { useLocalStorage } from "./useLocalStorage";

export function useWishlist() {
  const [items, setItems] = useLocalStorage<WishlistItem[]>(
    "anas-elec.wishlist.v1",
    []
  );

  const toggle = (productId: string) =>
    setItems((current) => wishlistToggle(current, productId));
  const add = (productId: string) =>
    setItems((current) => wishlistAdd(current, productId));
  const remove = (productId: string) =>
    setItems((current) => wishlistRemove(current, productId));
  const has = (productId: string) => wishlistHas(items, productId);

  return { items, toggle, add, remove, has, productCount: items.length };
}
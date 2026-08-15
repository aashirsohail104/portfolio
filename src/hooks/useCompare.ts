import {
  compareAdd,
  compareHas,
  compareRemove,
  COMPARE_MAX,
} from "@/lib/logic/compare";
import { useLocalStorage } from "./useLocalStorage";

export function useCompare() {
  const [items, setItems] = useLocalStorage<string[]>(
    "anas-elec.compare.v1",
    []
  );

  const add = (productId: string) =>
    setItems((current) => compareAdd(current, productId, COMPARE_MAX));
  const remove = (productId: string) =>
    setItems((current) => compareRemove(current, productId));
  const has = (productId: string) => compareHas(items, productId);

  return { items, add, remove, has, productCount: items.length };
}
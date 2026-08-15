import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLocalStorage } from "@/hooks/useLocalStorage";

class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null;
  }

  get length(): number {
    return this.store.size;
  }
}

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  Object.defineProperty(window, "localStorage", {
    value: storage,
    configurable: true,
    writable: true,
  });
});

describe("useLocalStorage", () => {
  it("initializes from the initial value when the key is absent", () => {
    const { result } = renderHook(() => useLocalStorage<number>("count", 0));
    expect(result.current[0]).toBe(0);
  });

  it("lazily reads a stored JSON value", () => {
    storage.setItem("cart", JSON.stringify([{ productId: "p1" }]));
    const { result } = renderHook(() =>
      useLocalStorage<{ productId: string }[]>("cart", [])
    );
    expect(result.current[0]).toEqual([{ productId: "p1" }]);
  });

  it("persists updates to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage<string>("name", "a"));
    act(() => {
      result.current[1]("b");
    });
    expect(result.current[0]).toBe("b");
    expect(JSON.parse(storage.getItem("name") as string)).toBe("b");
  });

  it("supports the function updater form", () => {
    const { result } = renderHook(() => useLocalStorage<number>("count", 5));
    act(() => {
      result.current[1]((prev) => prev + 2);
    });
    expect(result.current[0]).toBe(7);
    expect(JSON.parse(storage.getItem("count") as string)).toBe(7);
  });

  it("discards corrupt JSON and clears the key", () => {
    storage.setItem("bad", "{not valid json");
    const { result } = renderHook(() => useLocalStorage<number>("bad", 3));
    expect(result.current[0]).toBe(3);
    expect(storage.getItem("bad")).toBe(JSON.stringify(3));
  });

  it("discards a stored value of the wrong type and clears the key", () => {
    storage.setItem("num", JSON.stringify({ x: 1 }));
    const { result } = renderHook(() => useLocalStorage<number>("num", 3));
    expect(result.current[0]).toBe(3);
    expect(storage.getItem("num")).toBe(JSON.stringify(3));
  });

  it("discards a stored object when the initial value is an array", () => {
    storage.setItem("arr", JSON.stringify({ a: 1 }));
    const { result } = renderHook(() => useLocalStorage<number[]>("arr", []));
    expect(result.current[0]).toEqual([]);
    expect(storage.getItem("arr")).toBe(JSON.stringify([]));
  });
});
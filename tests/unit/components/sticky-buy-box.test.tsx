import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Product } from "@/lib/api/types";
import fixtures from "@test/fixtures/products.json";
import { StickyBuyBox } from "@/components/product/StickyBuyBox";

const order = vi.hoisted(() => ({
  add: vi.fn(),
  showToast: vi.fn(),
}));

vi.mock("@/context/CommerceContext", () => ({
  useCommerce: () => ({
    products: [],
    categories: [],
    loading: false,
    error: null,
    cart: {
      items: [],
      add: order.add,
      increment: vi.fn(),
      decrement: vi.fn(),
      remove: vi.fn(),
      setQuantity: vi.fn(),
      clear: vi.fn(),
      itemCount: 0,
      subtotal: 0,
    },
    wishlist: { items: [], toggle: vi.fn(), add: vi.fn(), remove: vi.fn(), has: () => false, productCount: 0 },
    compare: { items: [], add: vi.fn(), remove: vi.fn(), has: () => false, productCount: 0 },
    cartCount: 0,
    wishlistCount: 0,
    compareCount: 0,
    showToast: order.showToast,
    cartOpen: false,
    openCart: vi.fn(),
    closeCart: vi.fn(),
  }),
}));

const products = fixtures as unknown as Product[];
const smps = products.find((p) => p.id === "professional-12v-smps-10a-20a-30a")!;
const soldOut = products.find((p) => p.id === "suoer-sua-2000c-inverter-charger")!;

const price = (n: number) => "Rs." + n.toLocaleString("en-PK");

describe("StickyBuyBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders price, stock status and warranty", () => {
    render(<StickyBuyBox product={smps} />);
    expect(screen.getByText(price(1690))).toBeInTheDocument();
    expect(screen.getByText(/in stock/i)).toBeInTheDocument();
    expect(screen.getByText(/official brand warranty/i)).toBeInTheDocument();
  });

  it("shows a variant selector for variant products and prices the selected variant", () => {
    render(<StickyBuyBox product={smps} />);
    const option = screen.getByRole("radio", { name: "12V 20A" });
    expect(option).toBeInTheDocument();
    act(() => option.click());
    expect(screen.getByText(price(2290))).toBeInTheDocument();
  });

  it("renders a Notify me button for sold-out products", () => {
    render(<StickyBuyBox product={soldOut} />);
    expect(screen.getByText("Notify me")).toBeInTheDocument();
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it("adds the selected variant line via the cart add action", () => {
    render(<StickyBuyBox product={smps} />);
    act(() => screen.getByRole("radio", { name: "12V 20A" }).click());
    act(() => screen.getByRole("button", { name: /add .* to cart/i }).click());
    expect(order.add).toHaveBeenCalledWith({
      productId: smps.id,
      variantName: "12V 20A",
    });
  });
});
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useProductDetail } from "@/hooks/useProductDetail";

describe("useProductDetail", () => {
  it("loads the product and resolves related products by slug", async () => {
    const { result } = renderHook(() =>
      useProductDetail("professional-12v-smps-10a-20a-30a")
    );
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.product?.id).toBe(
      "professional-12v-smps-10a-20a-30a"
    );
    expect(result.current.related.length).toBeGreaterThan(0);
    expect(result.current.related[0].slug).toBe(
      result.current.product?.relatedProducts[0]
    );
  });

  it("returns null product with no error for an unknown slug", async () => {
    const { result } = renderHook(() => useProductDetail("no-such-slug"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.related).toEqual([]);
  });
});
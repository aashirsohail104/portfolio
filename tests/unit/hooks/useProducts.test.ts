import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useProducts } from "@/hooks/useProducts";

describe("useProducts", () => {
  it("starts loading and resolves the catalog", async () => {
    const { result } = renderHook(() => useProducts());
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.products.length).toBeGreaterThanOrEqual(20);
    expect(result.current.categories.length).toBeGreaterThanOrEqual(5);
  });
});
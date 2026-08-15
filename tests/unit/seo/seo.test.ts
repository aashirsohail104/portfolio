import { beforeEach, describe, expect, it } from "vitest";
import { BASE_URL, setPageMeta } from "@/lib/seo";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/schema";
import type { Product } from "@/lib/api/types";

type ProductLd = {
  name: string;
  image: string;
  sku: string;
  offers: {
    price: number;
    priceCurrency: string;
    url: string;
    availability: string;
    itemCondition: string;
  };
  brand?: { "@type": string; name: string };
};

type BreadcrumbLd = {
  itemListElement: { position: number; name: string; item: string }[];
};

function headEl(selector: string): HTMLElement {
  const el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    throw new Error(`No element matching "${selector}" in <head>`);
  }
  return el;
}

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p-100",
    slug: "mppt-solar-charger-100a",
    category: "charge-controllers",
    productName: "MPPT Solar Charge Controller 100A",
    shortDescription: "High-efficiency MPPT solar charge controller for off-grid systems.",
    fullDescription:
      "A robust 100A MPPT solar charge controller with advanced tracking for off-grid systems.",
    stockStatus: "in_stock",
    price: 12500,
    image: "/images/products/mppt-100a.jpg",
    relatedProducts: [],
    ...overrides,
  };
}

describe("setPageMeta", () => {
  beforeEach(() => {
    document.head.querySelectorAll("meta, link").forEach((el) => el.remove());
    document.title = "";
  });

  it("sets document.title and the description meta content", () => {
    setPageMeta({ title: "Battery Charger Catalog", description: "All premium chargers." });

    expect(document.title).toBe("Battery Charger Catalog");
    expect(headEl('meta[name="description"]')).toHaveAttribute(
      "content",
      "All premium chargers."
    );
  });

  it("upserts the canonical link with BASE_URL + path and keeps a single link element", () => {
    setPageMeta({ title: "Catalog", description: "d", canonicalPath: "/catalog" });

    let canonicals = document.head.querySelectorAll('link[rel="canonical"]');
    expect(canonicals).toHaveLength(1);
    expect(headEl('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${BASE_URL}/catalog`
    );

    setPageMeta({ title: "Chargers", description: "d2", canonicalPath: "/catalog/chargers" });

    canonicals = document.head.querySelectorAll('link[rel="canonical"]');
    expect(canonicals).toHaveLength(1);
    expect(headEl('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${BASE_URL}/catalog/chargers`
    );
  });

  it("sets og:url to BASE_URL + canonicalPath", () => {
    setPageMeta({ title: "Product", description: "d", canonicalPath: "/product/abc" });

    expect(headEl('meta[property="og:url"]')).toHaveAttribute(
      "content",
      `${BASE_URL}/product/abc`
    );
  });

  it("defaults og:image to the absolute BASE_URL og-image and og:type to website", () => {
    setPageMeta({ title: "Home", description: "d" });

    expect(headEl('meta[property="og:image"]')).toHaveAttribute(
      "content",
      `${BASE_URL}/og-image.png`
    );
    expect(headEl('meta[property="og:type"]')).toHaveAttribute("content", "website");
  });

  it("adds meta[name=robots] for noIndex and removes it otherwise", () => {
    setPageMeta({ title: "Admin", description: "d", noIndex: true });

    expect(headEl('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");

    setPageMeta({ title: "Public", description: "d2" });

    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });
});

describe("productJsonLd", () => {
  it("builds a Product JSON-LD with PKR currency and in-stock availability", () => {
    const product = makeProduct();
    const url = `${BASE_URL}/product/${product.slug}`;
    const ld = productJsonLd(product, url) as unknown as ProductLd;

    expect(ld.name).toBe(product.productName);
    expect(ld.image).toBe(product.image);
    expect(ld.sku).toBe(product.id);
    expect(ld.offers.price).toBe(product.price);
    expect(ld.offers.priceCurrency).toBe("PKR");
    expect(ld.offers.url).toBe(url);
    expect(ld.offers.availability).toBe("https://schema.org/InStock");
    expect(ld.offers.itemCondition).toBe("https://schema.org/NewCondition");
  });

  it("uses OutOfStock availability for sold out products and includes the brand", () => {
    const product = makeProduct({
      stockStatus: "sold_out",
      brand: "Anas Power",
    });
    const ld = productJsonLd(product, `${BASE_URL}/product/${product.slug}`) as unknown as ProductLd;

    expect(ld.offers.availability).toBe("https://schema.org/OutOfStock");
    expect(ld.brand).toEqual({ "@type": "Brand", name: "Anas Power" });
  });
});

describe("breadcrumbJsonLd", () => {
  it("emits one itemListElement per item with sequential positions", () => {
    const items = [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Catalog", url: `${BASE_URL}/catalog` },
      { name: "Chargers", url: `${BASE_URL}/catalog/chargers` },
    ];
    const ld = breadcrumbJsonLd(items) as unknown as BreadcrumbLd;

    expect(ld.itemListElement).toHaveLength(items.length);
    ld.itemListElement.forEach((entry, index) => {
      expect(entry.position).toBe(index + 1);
      expect(entry.name).toBe(items[index].name);
      expect(entry.item).toBe(items[index].url);
    });
  });

  it("handles an empty items array", () => {
    const ld = breadcrumbJsonLd([]) as unknown as BreadcrumbLd;
    expect(ld.itemListElement).toEqual([]);
  });
});
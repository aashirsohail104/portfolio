import productsData from "@data/products.json";
import categoriesData from "@data/categories.json";
import siteData from "@data/site.json";
import type { Catalog, CatalogSource, Category, Product } from "./types";

const products = productsData as unknown as Product[];
const categories = categoriesData as unknown as Category[];
const site = siteData as unknown as {
  version?: string;
  schemaVersion?: string;
  source?: { name?: string; url?: string; lastUpdated?: string };
};

function assertProducts(): void {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error(
      "Catalog data layer is corrupt: data/products.json is not a valid, non-empty product list."
    );
  }
}

function assertCategories(): void {
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error(
      "Catalog data layer is corrupt: data/categories.json is not a valid, non-empty category list."
    );
  }
}

export function findProduct(products: Product[], slug: string): Product | null {
  return products.find((p) => p.slug === slug) ?? null;
}

export function relatedProducts(
  products: Product[],
  product: Product
): Product[] {
  return product.relatedProducts
    .map((slug) => findProduct(products, slug))
    .filter((p): p is Product => p !== null);
}

export function findCategory(
  categories: Category[],
  slug: string
): Category | null {
  return categories.find((c) => c.slug === slug) ?? null;
}

function buildCatalog(): Catalog {
  assertProducts();
  assertCategories();
  const source: CatalogSource = {
    name: site.source?.name ?? "",
    url: site.source?.url ?? "",
    lastUpdated: site.source?.lastUpdated ?? "",
  };
  return {
    version: site.version ?? site.schemaVersion ?? "1.0.0",
    source,
    products,
    categories,
  };
}

export async function getCatalog(): Promise<Catalog> {
  return buildCatalog();
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  assertProducts();
  return findProduct(products, slug);
}

export async function getRelatedProducts(
  product: Product
): Promise<Product[]> {
  assertProducts();
  return relatedProducts(products, product);
}

export async function getCategories(): Promise<Category[]> {
  assertCategories();
  return categories;
}
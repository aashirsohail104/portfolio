export type StockStatus = "in_stock" | "sold_out";

export interface Variant {
  name: string;
  price: number;
  oldPrice?: number | null;
  stockStatus: StockStatus;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  category: string;
  subCategory?: string;
  brand?: string;
  productName: string;
  shortDescription: string;
  fullDescription: string;
  specifications?: Specification[];
  features?: string[];
  voltage?: string;
  chargingCurrent?: string;
  batteryCompatibility?: string;
  warranty?: string;
  stockStatus: StockStatus;
  price: number;
  oldPrice?: number | null;
  discount?: number;
  rating?: number;
  reviews?: number;
  image: string;
  galleryImages?: string[];
  tags?: string[];
  relatedProducts: string[];
  variants?: Variant[];
}

export interface Category {
  name: string;
  slug: string;
  subCategories?: { name: string; slug: string }[];
}

export interface CatalogSource {
  name: string;
  url: string;
  lastUpdated: string;
}

export interface Catalog {
  version: string;
  source?: CatalogSource;
  products: Product[];
  categories: Category[];
}
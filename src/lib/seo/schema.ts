import type { Product } from "@/lib/api/types";

export function breadcrumbJsonLd(items: { name: string; url: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productJsonLd(product: Product, productUrl: string): object {
  const availability =
    product.stockStatus === "in_stock"
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.productName,
    image: product.image,
    description: product.shortDescription,
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "PKR",
      url: productUrl,
      availability,
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  if (product.brand) {
    jsonLd.brand = { "@type": "Brand", name: product.brand };
  }

  return jsonLd;
}
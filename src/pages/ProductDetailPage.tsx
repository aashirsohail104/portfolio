import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { StickyBuyBox } from "@/components/product/StickyBuyBox";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { ProductFeatures, ProductFullDescription } from "@/components/product/ProductFeatures";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { QuickView } from "@/components/product/QuickView";
import { useProductDetail } from "@/hooks/useProductDetail";
import { usePageMeta } from "@/lib/seo/usePageMeta";
import { setJsonLd, BASE_URL } from "@/lib/seo";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/schema";
import type { Product } from "@/lib/api/types";

const JSONLD_IDS = ["product", "breadcrumbs"] as const;

function removeJsonLd() {
  for (const id of JSONLD_IDS) {
    document.getElementById(`jsonld-${id}`)?.remove();
  }
}

export default function ProductDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { product, related, loading, error } = useProductDetail(slug);
  const [qv, setQv] = useState<Product | null>(null);

  const notFound = !loading && (error !== null || product === null);

  usePageMeta(
    notFound
      ? {
          title: "Product not found | Anas Electronics",
          description: "The product you are looking for could not be found.",
          noIndex: true,
        }
      : product
        ? {
            title: `${product.productName} | Anas Electronics`,
            description: product.shortDescription,
            canonicalPath: `/product/${product.slug}`,
            ogImage: product.image,
            ogType: "product",
          }
        : null
  );

  useEffect(() => {
    if (!product) return;
    removeJsonLd();
    setJsonLd([
      {
        id: "product",
        data: productJsonLd(product, `${BASE_URL}/product/${product.slug}`),
      },
      {
        id: "breadcrumbs",
        data: breadcrumbJsonLd([
          { name: "Home", url: `${BASE_URL}/` },
          { name: product.category, url: `${BASE_URL}/catalog` },
          { name: product.productName, url: `${BASE_URL}/product/${product.slug}` },
        ]),
      },
    ]);
    return removeJsonLd;
  }, [product?.id, product]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-8">
        <EmptyState
          title="Product not found"
          message={error ?? "The product you are looking for could not be found."}
          actionHref="/catalog"
          actionLabel="Browse catalog"
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { name: "Home", to: "/" },
          { name: product.category, to: "/catalog" },
          { name: product.productName },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductGallery
          images={[product.image, ...(product.galleryImages ?? [])]}
          productName={product.productName}
        />
        <StickyBuyBox product={product} />
      </div>

      <div className="mt-8">
        <ProductFullDescription product={product} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductSpecs product={product} />
        <ProductFeatures product={product} />
      </div>

      <div className="mt-12">
        <RelatedProducts related={related} loading={loading} onQuickView={setQv} />
      </div>

      <QuickView product={qv} open={!!qv} onClose={() => setQv(null)} />
    </div>
  );
}
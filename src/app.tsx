import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import { Spinner } from "@/components/ui/Spinner";

const HomePage = lazy(() => import("@/pages/HomePage"));
const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));
const ComparePage = lazy(() => import("@/pages/ComparePage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageFallback />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="catalog"
          element={
            <Suspense fallback={<PageFallback />}>
              <CatalogPage />
            </Suspense>
          }
        />
        <Route
          path="product/:slug"
          element={
            <Suspense fallback={<PageFallback />}>
              <ProductDetailPage />
            </Suspense>
          }
        />
        <Route
          path="cart"
          element={
            <Suspense fallback={<PageFallback />}>
              <CartPage />
            </Suspense>
          }
        />
        <Route
          path="checkout"
          element={
            <Suspense fallback={<PageFallback />}>
              <CheckoutPage />
            </Suspense>
          }
        />
        <Route
          path="wishlist"
          element={
            <Suspense fallback={<PageFallback />}>
              <WishlistPage />
            </Suspense>
          }
        />
        <Route
          path="compare"
          element={
            <Suspense fallback={<PageFallback />}>
              <ComparePage />
            </Suspense>
          }
        />
        <Route
          path="search"
          element={
            <Suspense fallback={<PageFallback />}>
              <SearchPage />
            </Suspense>
          }
        />
        <Route
          path="contact"
          element={
            <Suspense fallback={<PageFallback />}>
              <ContactPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner />
    </div>
  );
}

function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">The page you are looking for does not exist.</p>
    </div>
  );
}
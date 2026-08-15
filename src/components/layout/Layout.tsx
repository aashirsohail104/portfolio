import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { CompareBar } from "@/components/compare/CompareBar";
import { CommerceProvider } from "@/context/CommerceContext";

export default function Layout() {
  return (
    <CommerceProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-foreground"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <CompareBar />
    </CommerceProvider>
  );
}
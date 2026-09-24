"use client";

import { MotionConfig } from "motion/react";
import type React from "react";
import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "./Header";
import { MobileMenu } from "./MobileMenu";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchOverlay } from "./SearchOverlay";
import { Toast } from "./Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <Header />
        <MobileMenu />
        {children}
        <CartDrawer />
        <SearchOverlay />
        <Toast />
      </CartProvider>
    </MotionConfig>
  );
}

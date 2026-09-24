"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { ProductVisual } from "@/components/visual/ProductVisual";

export function Toast() {
  const { toast, dismissToast, openDrawer } = useCart();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[72px] z-[60] flex justify-center px-3 md:bottom-0 md:top-auto md:justify-end md:p-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto flex w-full max-w-[400px] items-center gap-3 rounded-[14px] bg-ink p-2.5 pr-3 text-ivory shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]"
          >
            {toast.product ? (
              <div className="relative shrink-0">
                <ProductVisual product={toast.product} variant="thumb" className="size-12 rounded-[8px]" />
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-amber text-ink">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              </div>
            ) : (
              <span className="grid size-10 place-items-center rounded-full bg-amber text-ink">
                <Check className="size-4" strokeWidth={3} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.92rem] font-semibold">{toast.title}</p>
              {toast.description && <p className="text-[0.8rem] text-ivory/60">{toast.description}</p>}
            </div>
            <button type="button" onClick={() => { dismissToast(); openDrawer(); }} className="h-10 shrink-0 rounded-[8px] bg-ivory/10 px-3 text-[0.82rem] font-semibold transition-colors hover:bg-ivory/15 active:scale-95">
              Ansehen
            </button>
            <button type="button" onClick={dismissToast} aria-label="Hinweis schließen" className="grid size-8 shrink-0 place-items-center rounded-full text-ivory/50 hover:text-ivory">
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

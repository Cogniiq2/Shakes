"use client";

import { AnimatePresence, motion, useDragControls } from "motion/react";
import { ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { CartLineItem, CartTotals, LeergutToggle } from "./CartParts";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setDesktop(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return desktop;
}

export function CartDrawer() {
  const { drawerOpen, closeDrawer, lines, count } = useCart();
  const desktop = useIsDesktop();
  const panelRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  useEffect(() => {
    if (!drawerOpen) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => panelRef.current?.focus(), 50);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [drawerOpen, closeDrawer]);

  const panelMotion = desktop
    ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }
    : { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            type="button"
            aria-label="Warenkorb schließen"
            className="absolute inset-0 cursor-default bg-ink/40 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeDrawer}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Warenkorb"
            {...panelMotion}
            transition={{ duration: 0.6, ease: EASE }}
            drag={desktop ? false : "y"}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) closeDrawer();
            }}
            className="absolute inset-x-0 bottom-0 flex h-[92dvh] flex-col rounded-t-[20px] bg-ivory shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.35)] outline-none md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[460px] md:rounded-none md:rounded-l-[20px]"
          >
            <div className="flex touch-none justify-center pt-2.5 md:hidden" aria-hidden onPointerDown={(e) => dragControls.start(e)}>
              <span className="h-1 w-10 rounded-full bg-ink/15" />
            </div>
            <div className="flex touch-none items-center justify-between border-b border-line px-5 pb-4 pt-3 md:touch-auto md:px-7 md:pt-6" onPointerDown={(e) => !desktop && dragControls.start(e)}>
              <div>
                <h2 className="text-[1.35rem] font-semibold tracking-[-0.02em]">Ihr Warenkorb</h2>
                <p className="mt-0.5 text-[0.82rem] text-muted">{count === 0 ? "Noch keine Artikel" : `${count} ${count === 1 ? "Artikel" : "Artikel"} · Lieferung in Bayreuth & Umgebung`}</p>
              </div>
              <button type="button" onClick={closeDrawer} aria-label="Schließen" className="grid size-11 place-items-center rounded-full transition-colors hover:bg-ink/5 active:scale-90">
                <X className="size-5" strokeWidth={1.8} />
              </button>
            </div>

            {lines.length === 0 ? (
              <EmptyCart onClose={closeDrawer} />
            ) : (
              <>
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 md:px-7">
                  <ul className="divide-y divide-line">
                    <AnimatePresence initial={false}>
                      {lines.map((l) => (
                        <CartLineItem key={l.slug} line={l} onNavigate={closeDrawer} />
                      ))}
                    </AnimatePresence>
                  </ul>
                  <LeergutToggle className="mb-6 mt-1" />
                </div>
                <div className="border-t border-line bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 md:px-7">
                  <CartTotals />
                  <div className="mt-5 grid gap-2.5">
                    <Button href="/bestellen" size="lg" arrow onClick={closeDrawer} className="w-full">
                      Weiter zur Bestellung
                    </Button>
                    <Button href="/warenkorb" variant="quiet" size="sm" onClick={closeDrawer} className="w-full text-muted">
                      Warenkorb ansehen
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function EmptyCart({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <div className="relative grid size-24 place-items-center rounded-full bg-stone">
        <ShoppingBag className="size-9 text-bottle" strokeWidth={1.4} />
        <span className="absolute -right-1 top-3 size-3 rounded-full bg-amber" />
      </div>
      <h3 className="mt-7 text-[1.5rem] font-semibold tracking-[-0.02em]">Noch ziemlich leer hier.</h3>
      <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-muted">Entdecken Sie unser Sortiment und stellen Sie Ihre Lieferung zusammen.</p>
      <Button href="/sortiment" arrow className="mt-8" onClick={onClose}>
        Zum Sortiment
      </Button>
      <a href={site.phone.href} className="mt-5 text-[0.85rem] text-muted link-underline">
        Lieber persönlich bestellen: {site.phone.display}
      </a>
    </div>
  );
}

"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Phone, Search, User } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { mainNav, site } from "@/lib/site";
import { EASE } from "@/components/ui/Reveal";

const items = [...mainNav, { href: "/kontakt", label: "Kontakt" }];

export function MobileMenu() {
  const { menuOpen, setMenuOpen, setSearchOpen } = useCart();

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, setMenuOpen]);

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menü"
          className="grain fixed inset-0 z-40 flex flex-col bg-bottle text-ivory xl:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div aria-hidden className="pointer-events-none absolute -right-24 top-1/3 size-[420px] rounded-full bg-amber/10 blur-3xl" />
          <nav aria-label="Mobile Navigation" className="container-x relative z-10 flex flex-1 flex-col overflow-y-auto pb-8 pt-[104px]">
            <ul className="flex flex-col">
              {items.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 + i * 0.05, duration: 0.6, ease: EASE }}
                  className="border-b border-ivory/10"
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center justify-between py-[0.9rem] text-[1.85rem] font-semibold tracking-[-0.03em] transition-colors active:text-amber sm:text-[2.4rem]"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="size-6 text-ivory/35 transition-all group-hover:text-amber group-active:translate-x-0.5" strokeWidth={1.6} />
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
              className="mt-auto pt-10"
            >
              <Link
                href="/sortiment"
                onClick={() => setMenuOpen(false)}
                className="flex h-14 w-full items-center justify-center rounded-[12px] bg-amber text-[0.85rem] font-bold uppercase tracking-[0.12em] text-ink transition-transform active:scale-[0.98]"
              >
                Jetzt bestellen
              </Link>
              <a
                href={site.phone.href}
                className="mt-3 flex h-14 w-full items-center justify-center gap-2.5 rounded-[12px] border border-ivory/20 text-base font-semibold tabular-nums transition-colors active:bg-ivory/5"
              >
                <Phone className="size-[18px]" strokeWidth={1.8} />
                {site.phone.display}
              </a>
              <div className="mt-6 flex items-center justify-between gap-4 text-sm text-ivory/60">
                <p>
                  Mo–Do 08:00–18:00
                  <br />
                  Fr 08:00–11:30
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setSearchOpen(true);
                    }}
                    aria-label="Suche öffnen"
                    className="grid size-11 place-items-center rounded-full border border-ivory/15 text-ivory active:bg-ivory/10"
                  >
                    <Search className="size-[18px]" strokeWidth={1.8} />
                  </button>
                  <Link href="/konto" onClick={() => setMenuOpen(false)} aria-label="Kundenkonto" className="grid size-11 place-items-center rounded-full border border-ivory/15 text-ivory active:bg-ivory/10">
                    <User className="size-[18px]" strokeWidth={1.8} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

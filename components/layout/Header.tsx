"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/format";

/** Seiten mit dunkler Hero-Fläche – Header startet hell */
const DARK_HERO = ["/firmen-gastronomie"];

export function Header() {
  const pathname = usePathname();
  const { count, openDrawer, setSearchOpen, menuOpen, setMenuOpen, bump, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const darkHero = DARK_HERO.includes(pathname) && !scrolled && !menuOpen;
  const light = darkHero || menuOpen;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-bottle focus:px-4 focus:py-3 focus:text-ivory">
        Zum Inhalt springen
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter,height] duration-500 ease-[var(--ease-premium)]",
          scrolled && !menuOpen
            ? "bg-paper/82 shadow-[0_1px_0_rgba(21,25,23,0.07),0_12px_32px_-24px_rgba(21,25,23,0.35)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent",
        )}
      >
        <div className={cn("container-x flex items-center justify-between gap-6 transition-[height] duration-500 ease-[var(--ease-premium)]", scrolled ? "h-[68px]" : "h-[76px] lg:h-[92px]")}>
          <Logo light={light} />

          <nav aria-label="Hauptnavigation" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex h-10 items-center whitespace-nowrap rounded-md px-3 text-[0.9rem] font-semibold transition-colors duration-300 2xl:px-3.5",
                        light ? "text-ivory/80 hover:text-ivory" : "text-ink/70 hover:text-ink",
                        active && (light ? "text-ivory" : "text-ink"),
                      )}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="nav-indicator"
                          className={cn("absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full", light ? "bg-amber" : "bg-amber")}
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <IconButton label="Suche öffnen" light={light} onClick={() => setSearchOpen(true)} className="hidden sm:inline-flex">
              <Search className="size-[20px]" strokeWidth={1.8} />
            </IconButton>
            <IconButton label="Kundenkonto" light={light} href="/konto" className="hidden sm:inline-flex">
              <User className="size-[20px]" strokeWidth={1.8} />
            </IconButton>
            <IconButton label={`Warenkorb, ${count} Artikel`} light={light} onClick={openDrawer}>
              <ShoppingBag className="size-[20px]" strokeWidth={1.8} />
              <AnimatePresence>
                {ready && count > 0 && (
                  <motion.span
                    key={bump}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: [1.35, 1], opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-amber px-1 text-[0.66rem] font-bold tabular-nums text-ink"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </IconButton>
            <div className="ml-2 hidden lg:block">
              <Button href="/sortiment" variant={light ? "amber" : "primary"} size="sm" className="h-11 px-5 text-[0.78rem] uppercase tracking-[0.06em]" magnetic>
                Jetzt bestellen
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
              className={cn(
                "relative ml-0.5 grid size-11 place-items-center rounded-full transition-colors xl:hidden",
                light ? "text-ivory hover:bg-ivory/10" : "text-ink hover:bg-ink/5",
              )}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={menuOpen ? "x" : "m"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.22 }}
                >
                  {menuOpen ? <X className="size-[22px]" strokeWidth={1.8} /> : <Menu className="size-[22px]" strokeWidth={1.8} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

function IconButton({ children, label, light, onClick, href, className }: { children: React.ReactNode; label: string; light?: boolean; onClick?: () => void; href?: string; className?: string }) {
  const cls = cn(
    "relative inline-grid size-11 place-items-center rounded-full transition-[background-color,color,transform] duration-300 active:scale-90",
    light ? "text-ivory hover:bg-ivory/10" : "text-ink hover:bg-ink/[0.06]",
    className,
  );
  if (href)
    return (
      <Link href={href} aria-label={label} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

"use client";

import type React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getProduct, type Product } from "@/data/products";

/**
 * Warenkorb – reiner Frontend-Prototyp (React State + localStorage).
 * Die Schnittstelle (add / setQty / remove / clear) ist so gewählt,
 * dass sie später gegen eine Server-Session getauscht werden kann.
 */

export interface CartLine {
  slug: string;
  qty: number;
}

export interface ResolvedLine extends CartLine {
  product: Product;
  lineTotal: number | null;
  lineDeposit: number;
}

interface Toast {
  id: number;
  title: string;
  description?: string;
  product?: Product;
}

interface CartContextValue {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  deposit: number;
  total: number;
  onRequestCount: number;
  hasEmpties: boolean;
  setHasEmpties: (v: boolean) => void;
  add: (slug: string, qty?: number, opts?: { silent?: boolean; openDrawer?: boolean }) => void;
  addMany: (items: CartLine[]) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  ready: boolean;

  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;

  toast: Toast | null;
  dismissToast: () => void;
  bump: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "schakes.cart.v1";
const MAX_QTY = 30;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [hasEmpties, setHasEmpties] = useState(false);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [bump, setBump] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { lines?: CartLine[]; hasEmpties?: boolean };
        if (Array.isArray(parsed.lines)) setRaw(parsed.lines.filter((l) => getProduct(l.slug) && l.qty > 0));
        if (typeof parsed.hasEmpties === "boolean") setHasEmpties(parsed.hasEmpties);
      }
    } catch {
      /* Speicher nicht verfügbar – Warenkorb bleibt flüchtig */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines: raw, hasEmpties }));
    } catch {
      /* ignore */
    }
  }, [raw, hasEmpties, ready]);

  const showToast = useCallback((t: Omit<Toast, "id">) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ ...t, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  const add = useCallback<CartContextValue["add"]>(
    (slug, qty = 1, opts) => {
      const product = getProduct(slug);
      if (!product) return;
      setRaw((prev) => {
        const existing = prev.find((l) => l.slug === slug);
        if (existing) return prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
        return [...prev, { slug, qty: Math.min(MAX_QTY, qty) }];
      });
      setBump((b) => b + 1);
      if (opts?.openDrawer) setDrawerOpen(true);
      else if (!opts?.silent) showToast({ title: `${product.name}`, description: qty > 1 ? `${qty} × zum Warenkorb hinzugefügt` : "Zum Warenkorb hinzugefügt", product });
    },
    [showToast],
  );

  const addMany = useCallback((items: CartLine[]) => {
    setRaw((prev) => {
      const next = [...prev];
      for (const it of items) {
        if (!getProduct(it.slug)) continue;
        const i = next.findIndex((l) => l.slug === it.slug);
        if (i >= 0) next[i] = { ...next[i], qty: Math.min(MAX_QTY, next[i].qty + it.qty) };
        else next.push({ ...it });
      }
      return next;
    });
    setBump((b) => b + 1);
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setRaw((prev) => (qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))));
    setBump((b) => b + 1);
  }, []);

  const remove = useCallback((slug: string) => setRaw((prev) => prev.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines: ResolvedLine[] = raw
      .map((l) => {
        const product = getProduct(l.slug)!;
        return {
          ...l,
          product,
          lineTotal: product.price === null ? null : product.price * l.qty,
          lineDeposit: (product.deposit ?? 0) * l.qty,
        };
      })
      .filter((l) => l.product);
    const subtotal = lines.reduce((s, l) => s + (l.lineTotal ?? 0), 0);
    const deposit = lines.reduce((s, l) => s + l.lineDeposit, 0);
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      deposit,
      total: subtotal + deposit,
      onRequestCount: lines.filter((l) => l.lineTotal === null).length,
      hasEmpties,
      setHasEmpties,
      add,
      addMany,
      setQty,
      remove,
      clear,
      ready,
      drawerOpen,
      openDrawer: () => {
        setMenuOpen(false);
        setSearchOpen(false);
        setDrawerOpen(true);
      },
      closeDrawer: () => setDrawerOpen(false),
      searchOpen,
      setSearchOpen,
      menuOpen,
      setMenuOpen,
      toast,
      dismissToast: () => setToast(null),
      bump,
    };
  }, [raw, hasEmpties, add, addMany, setQty, remove, clear, ready, drawerOpen, searchOpen, menuOpen, toast, bump]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

"use client";

import { useId } from "react";
import { Bottle } from "./Bottle";
import { getProduct } from "@/data/products";
import { cn } from "@/lib/format";

/**
 * Illustrierte Stillleben für Zielgruppen-Kacheln.
 * REAL BUSINESS PHOTO RECOMMENDED HERE: Sobald echte Fotos (Lieferung, Büro, Gastronomie)
 * vorliegen, können diese Szenen 1:1 durch <Image> ersetzt werden.
 */

type SceneKind = "home" | "office" | "gastro" | "warehouse";

const SCENES: Record<SceneKind, { bg: string; light: string; surface: string; items: Array<{ slug?: string; glass?: { fill: string; h: number }; x: number; h: number; z?: number }> }> = {
  home: {
    bg: "#EDE5D6",
    light: "radial-gradient(60% 55% at 75% 20%, rgba(255,247,230,0.95), transparent 70%)",
    surface: "#D9CCB5",
    items: [
      { slug: "adelholzener-classic", x: 22, h: 72 },
      { slug: "bayreuther-hell", x: 40, h: 64, z: 2 },
      { glass: { fill: "#E6B25A", h: 26 }, x: 56, h: 26, z: 3 },
      { slug: "libella-orange", x: 70, h: 62 },
      { slug: "spezi-original", x: 85, h: 58 },
    ],
  },
  office: {
    bg: "#DDE3E0",
    light: "radial-gradient(70% 60% at 20% 10%, rgba(255,255,255,0.95), transparent 70%)",
    surface: "#C7CFCB",
    items: [
      { slug: "gerolsteiner-sprudel", x: 20, h: 70 },
      { slug: "adelholzener-naturell", x: 36, h: 70, z: 2 },
      { glass: { fill: "#D8E7EA", h: 24 }, x: 52, h: 24, z: 3 },
      { glass: { fill: "#E1B45E", h: 22 }, x: 64, h: 22, z: 3 },
      { slug: "adelholzener-apfelschorle", x: 80, h: 70 },
    ],
  },
  gastro: {
    bg: "#16302A",
    light: "radial-gradient(55% 50% at 50% 30%, rgba(200,138,56,0.45), transparent 70%)",
    surface: "#0D1F1A",
    items: [
      { slug: "schmitt-silvaner-trocken", x: 20, h: 58 },
      { slug: "maisels-weisse-original", x: 38, h: 76, z: 2 },
      { glass: { fill: "#E8A33C", h: 34 }, x: 55, h: 34, z: 3 },
      { slug: "augustiner-hell", x: 71, h: 66 },
      { slug: "moenchshof-kellerbier", x: 86, h: 64 },
    ],
  },
  warehouse: {
    bg: "#E6E0D5",
    light: "radial-gradient(60% 50% at 30% 10%, rgba(255,250,240,0.9), transparent 70%)",
    surface: "#CFC6B6",
    items: [
      { slug: "kulmbacher-lager-hell", x: 18, h: 64 },
      { slug: "moenchshof-kellerbier", x: 32, h: 64 },
      { slug: "bayreuther-hell", x: 46, h: 64, z: 2 },
      { slug: "eku-pils", x: 60, h: 64 },
      { slug: "jever-pils", x: 74, h: 64 },
      { slug: "augustiner-hell", x: 88, h: 64 },
    ],
  },
};

export function Scene({ kind, className }: { kind: SceneKind; className?: string }) {
  const s = SCENES[kind];
  const dark = kind === "gastro";
  return (
    <div className={cn("relative isolate overflow-hidden", className)} style={{ background: s.bg }} aria-hidden>
      <div className="absolute inset-0 -z-10" style={{ background: s.light }} />
      {kind === "home" && <div className="absolute right-[8%] top-[6%] h-[46%] w-[34%] rounded-t-full border-[10px] border-b-0 border-white/40" />}
      {kind === "office" && (
        <div className="absolute left-[6%] top-[8%] grid h-[40%] w-[40%] grid-cols-3 gap-2 opacity-40">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="rounded-sm bg-white/70" />
          ))}
        </div>
      )}
      {dark && <div className="absolute inset-x-[10%] top-[10%] h-px bg-amber/30" />}
      <div className="absolute inset-x-0 bottom-0 h-[20%]" style={{ background: s.surface }} />
      <div className="absolute inset-x-0 bottom-[20%] h-px" style={{ background: dark ? "rgba(200,138,56,0.3)" : "rgba(0,0,0,0.08)" }} />
      {s.items.map((it, i) => {
        if (it.glass) return <DrinkGlass key={i} fill={it.glass.fill} style={{ left: `${it.x}%`, height: `${it.h}%`, zIndex: it.z ?? 1 }} />;
        const p = getProduct(it.slug!)!;
        return (
          <div key={i} className="absolute bottom-[17%] -translate-x-1/2" style={{ left: `${it.x}%`, height: `${it.h}%`, zIndex: it.z ?? 1 }}>
            <Bottle visual={p.visual} id={`scene-${kind}-${i}`} brand={p.brand} className="h-full w-auto" condensation={!dark} />
          </div>
        );
      })}
    </div>
  );
}

function DrinkGlass({ fill, style }: { fill: string; style: React.CSSProperties }) {
  const gid = `dg-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 60 100" className="absolute bottom-[17%] w-auto -translate-x-1/2" style={style}>
      <defs>
        <linearGradient id={gid} x1="0" x2="1">
          <stop offset="0" stopColor={fill} stopOpacity="0.75" />
          <stop offset="0.45" stopColor={fill} stopOpacity="1" />
          <stop offset="1" stopColor={fill} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path d="M6 4 L54 4 L49 94 Q48 99 43 99 L17 99 Q12 99 11 94 Z" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
      <path d="M9.5 26 L50.5 26 L48 93 Q47.5 96 43 96 L17 96 Q12.5 96 12 93 Z" fill={`url(#${gid})`} />
      <rect x="9.5" y="22" width="41" height="6" rx="2" fill="#fff" opacity="0.8" />
      <rect x="15" y="10" width="3" height="80" rx="1.5" fill="#fff" opacity="0.45" />
    </svg>
  );
}

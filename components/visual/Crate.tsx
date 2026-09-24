"use client";

import type { ProductVisual } from "@/data/products";
import { useId } from "react";
import { labelText, shade } from "./Bottle";

/** Frontalansicht eines Getränkekastens mit herausragenden Flaschenhälsen. */
export function Crate({ visual, id, brand, className }: { visual: ProductVisual; id: string; brand: string; className?: string }) {
  const uid = `c-${id}-${useId().replace(/:/g, "")}`;
  const clear = visual.glass === "clear";
  const glass = clear ? shade(visual.liquid ?? "#DCE9E6", -10) : visual.glass;
  const necks = [58, 102, 146, 190, 234];
  const swing = visual.shape === "swingtop";
  const screw = visual.shape === "water" || visual.shape === "juice" || visual.shape === "pet";
  return (
    <svg viewBox="0 0 320 290" className={className} role="img" aria-label={`${brand} Kasten`}>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={shade(visual.crate, 22)} />
          <stop offset="1" stopColor={shade(visual.crate, -26)} />
        </linearGradient>
        <linearGradient id={`${uid}-neck`} x1="0" x2="1">
          <stop offset="0" stopColor={shade(glass, -30)} />
          <stop offset="0.4" stopColor={shade(glass, 30)} />
          <stop offset="1" stopColor={shade(glass, -40)} />
        </linearGradient>
        <radialGradient id={`${uid}-sh`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="276" rx="150" ry="9" fill={`url(#${uid}-sh)`} />
      {/* Hintere Flaschenreihe */}
      {necks.map((x, i) => (
        <g key={`b${i}`} opacity="0.55" transform={`translate(${x + 22} 10)`}>
          <rect x="-10" y="30" width="20" height="80" rx="3" fill={`url(#${uid}-neck)`} />
          <rect x="-11" y="22" width="22" height="9" rx="2" fill={swing ? "#EDE8DC" : visual.cap} />
        </g>
      ))}
      {/* Vordere Flaschenreihe */}
      {necks.map((x, i) => (
        <g key={`f${i}`} transform={`translate(${x + 2} 30)`}>
          <rect x="-11" y="26" width="22" height="80" rx="3" fill={`url(#${uid}-neck)`} opacity={clear ? 0.85 : 1} />
          <rect x="-7" y="30" width="2.5" height="60" rx="1" fill="#fff" opacity="0.35" />
          {swing ? (
            <ellipse cx="0" cy="22" rx="12" ry="6" fill="#EDE8DC" />
          ) : (
            <rect x="-12" y={screw ? 12 : 17} width="24" height={screw ? 15 : 10} rx="2" fill={visual.cap} />
          )}
        </g>
      ))}
      {/* Kasten */}
      <path d="M 18 96 H 302 V 262 Q 302 272 292 272 H 28 Q 18 272 18 262 Z" fill={`url(#${uid}-body)`} />
      <rect x="18" y="96" width="284" height="10" fill={shade(visual.crate, 34)} />
      <rect x="116" y="116" width="88" height="20" rx="10" fill={shade(visual.crate, -60)} />
      <rect x="120" y="120" width="80" height="4" rx="2" fill="#000" opacity="0.25" />
      {[48, 80, 240, 272].map((x) => (
        <rect key={x} x={x} y="118" width="2" height="140" rx="1" fill="#000" opacity="0.12" />
      ))}
      <rect x="92" y="156" width="136" height="72" rx="6" fill={shade(visual.crate, 26)} opacity="0.85" />
      <rect x="92" y="156" width="136" height="72" rx="6" fill="none" stroke="#fff" strokeOpacity="0.25" />
      <text x="160" y="194" textAnchor="middle" fill="#fff" fontSize={Math.min(14, 118 / (labelText(brand).length * 0.8))} fontWeight="800" letterSpacing="1.4" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
        {labelText(brand).toUpperCase()}
      </text>
      <text x="160" y="212" textAnchor="middle" fill="#fff" opacity="0.75" fontSize="10" style={{ fontFamily: "var(--font-instrument), serif", fontStyle: "italic" }}>
        Mehrweg
      </text>
      <rect x="18" y="248" width="284" height="2" fill="#000" opacity="0.14" />
    </svg>
  );
}

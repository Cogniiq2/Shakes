"use client";

import type React from "react";
import { useId } from "react";
import type { BottleShape, ProductVisual } from "@/data/products";

/**
 * Stilisierte, art-direktierte Flaschen-Illustration.
 * Dient als hochwertige Darstellung, solange keine echten Produktfotos vorliegen.
 * viewBox: 100 × 300, Boden bei y = 300.
 */

export interface ShapeSpec {
  bodyW: number;
  bodyTop: number;
  shoulderTop: number;
  neckW: number;
  neckTop: number;
  cap: "crown" | "screw" | "swing" | "foil";
  capH: number;
  labelY: number;
  labelH: number;
  neckLabel?: boolean;
  scale: number; // relative Höhe im Vergleich (1 = 0,5 L Euro)
}

export const SHAPES: Record<Exclude<BottleShape, "bocksbeutel" | "pet">, ShapeSpec> = {
  euro: { bodyW: 62, bodyTop: 150, shoulderTop: 96, neckW: 24, neckTop: 44, cap: "crown", capH: 10, labelY: 176, labelH: 78, neckLabel: true, scale: 1 },
  longneck: { bodyW: 54, bodyTop: 150, shoulderTop: 84, neckW: 21, neckTop: 30, cap: "crown", capH: 9, labelY: 180, labelH: 70, neckLabel: true, scale: 0.86 },
  steinie: { bodyW: 62, bodyTop: 176, shoulderTop: 142, neckW: 26, neckTop: 110, cap: "crown", capH: 10, labelY: 196, labelH: 70, scale: 0.7 },
  weizen: { bodyW: 58, bodyTop: 118, shoulderTop: 62, neckW: 22, neckTop: 22, cap: "crown", capH: 10, labelY: 170, labelH: 88, neckLabel: true, scale: 1.12 },
  swingtop: { bodyW: 64, bodyTop: 150, shoulderTop: 98, neckW: 26, neckTop: 46, cap: "swing", capH: 14, labelY: 176, labelH: 80, scale: 1 },
  water: { bodyW: 60, bodyTop: 130, shoulderTop: 60, neckW: 22, neckTop: 22, cap: "screw", capH: 16, labelY: 168, labelH: 72, scale: 1.1 },
  juice: { bodyW: 66, bodyTop: 118, shoulderTop: 70, neckW: 30, neckTop: 36, cap: "screw", capH: 16, labelY: 162, labelH: 82, scale: 1.04 },
};

function shade(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function bottlePath(s: ShapeSpec): string {
  const cx = 50;
  const bw = s.bodyW / 2;
  const nw = s.neckW / 2;
  const r = 7;
  const d = s.bodyTop - s.shoulderTop;
  return [
    `M ${cx - nw} ${s.neckTop}`,
    `L ${cx - nw} ${s.shoulderTop}`,
    `C ${cx - nw} ${s.shoulderTop + d * 0.55} ${cx - bw} ${s.shoulderTop + d * 0.4} ${cx - bw} ${s.bodyTop}`,
    `L ${cx - bw} ${300 - r}`,
    `Q ${cx - bw} 300 ${cx - bw + r} 300`,
    `L ${cx + bw - r} 300`,
    `Q ${cx + bw} 300 ${cx + bw} ${300 - r}`,
    `L ${cx + bw} ${s.bodyTop}`,
    `C ${cx + bw} ${s.shoulderTop + d * 0.4} ${cx + nw} ${s.shoulderTop + d * 0.55} ${cx + nw} ${s.shoulderTop}`,
    `L ${cx + nw} ${s.neckTop}`,
    "Z",
  ].join(" ");
}

/** Temporäre Etikett-Beschriftung – kein Nachbau offizieller Etiketten. */
export function labelText(brand: string): string {
  return brand.length > 12 ? brand.split(" ")[0] : brand;
}

function labelFont(text: string, width: number): number {
  return Math.min(7.4, (width - 12) / (text.length * 0.78));
}

function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

interface BottleProps {
  visual: ProductVisual;
  id: string;
  brand?: string;
  title?: string;
  condensation?: boolean;
  className?: string;
  shadow?: boolean;
  style?: React.CSSProperties;
}

export function Bottle({ visual, id, brand, title, condensation = true, className, shadow = true, style }: BottleProps) {
  const rid = useId().replace(/:/g, "");
  if (visual.shape === "bocksbeutel") return <Bocksbeutel visual={visual} id={id} brand={brand} title={title} className={className} shadow={shadow} style={style} />;
  if (visual.shape === "pet") return <PetBottle visual={visual} id={id} brand={brand} title={title} className={className} shadow={shadow} style={style} />;

  const s = SHAPES[visual.shape];
  const uid = `b-${id}-${rid}`;
  const clear = visual.glass === "clear";
  const glass = clear ? "#E9F0EE" : visual.glass;
  const path = bottlePath(s);
  const bw = s.bodyW / 2;
  const rand = seeded(id);
  const drops = condensation
    ? Array.from({ length: 26 }, () => ({
        x: 50 - bw + 5 + rand() * (s.bodyW - 10),
        y: s.bodyTop + 8 + rand() * (300 - s.bodyTop - 20),
        r: 0.5 + rand() * 1.5,
        o: 0.25 + rand() * 0.45,
      })).filter((d) => d.y < s.labelY - 3 || d.y > s.labelY + s.labelH + 3)
    : [];
  const liquidTop = s.shoulderTop + 14;

  return (
    <svg viewBox="-6 -4 112 318" className={className} style={style} role="img" aria-label={title ?? brand ?? "Flasche"} preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={shade(glass, -38)} />
          <stop offset="0.18" stopColor={glass} />
          <stop offset="0.42" stopColor={shade(glass, 26)} />
          <stop offset="0.6" stopColor={glass} />
          <stop offset="1" stopColor={shade(glass, -46)} />
        </linearGradient>
        {clear && visual.liquid && (
          <linearGradient id={`${uid}-l`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={shade(visual.liquid, -40)} />
            <stop offset="0.35" stopColor={shade(visual.liquid, 10)} />
            <stop offset="0.65" stopColor={visual.liquid} />
            <stop offset="1" stopColor={shade(visual.liquid, -50)} />
          </linearGradient>
        )}
        <linearGradient id={`${uid}-lab`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={shade(visual.label, -34)} />
          <stop offset="0.3" stopColor={visual.label} />
          <stop offset="0.55" stopColor={shade(visual.label, 14)} />
          <stop offset="1" stopColor={shade(visual.label, -40)} />
        </linearGradient>
        <linearGradient id={`${uid}-cap`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={shade(visual.cap, -30)} />
          <stop offset="0.45" stopColor={shade(visual.cap, 30)} />
          <stop offset="1" stopColor={shade(visual.cap, -40)} />
        </linearGradient>
        <clipPath id={`${uid}-c`}>
          <path d={path} />
        </clipPath>
        <radialGradient id={`${uid}-sh`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {shadow && <ellipse cx="50" cy="302" rx={bw + 12} ry="6" fill={`url(#${uid}-sh)`} />}

      {/* Glaskörper */}
      <path d={path} fill={`url(#${uid}-g)`} opacity={clear ? 0.55 : 1} />
      {clear && visual.liquid && (
        <g clipPath={`url(#${uid}-c)`}>
          <rect x="0" y={liquidTop} width="100" height={300 - liquidTop} fill={`url(#${uid}-l)`} opacity="0.92" />
          <rect x="0" y={liquidTop} width="100" height="2" fill="#fff" opacity="0.35" />
        </g>
      )}

      {/* Etikett */}
      <g clipPath={`url(#${uid}-c)`}>
        <rect x="0" y={s.labelY} width="100" height={s.labelH} fill={`url(#${uid}-lab)`} />
        <rect x="0" y={s.labelY + 5} width="100" height="0.8" fill={visual.labelInk} opacity="0.35" />
        <rect x="0" y={s.labelY + s.labelH - 6} width="100" height="0.8" fill={visual.labelInk} opacity="0.35" />
        {s.neckLabel && (
          <rect x="0" y={s.shoulderTop - 6} width="100" height={Math.min(34, s.bodyTop - s.shoulderTop)} fill={`url(#${uid}-lab)`} opacity="0.96" />
        )}
      </g>
      {brand && (
        <g fill={visual.labelInk} textAnchor="middle" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
          <text x="50" y={s.labelY + s.labelH / 2 - 3} fontSize={labelFont(labelText(brand), s.bodyW)} fontWeight="800" letterSpacing="0.6">
            {labelText(brand).toUpperCase()}
          </text>
          {title && (
            <text x="50" y={s.labelY + s.labelH / 2 + 9} fontSize="6.2" fontWeight="500" opacity="0.85" style={{ fontFamily: "var(--font-instrument), serif", fontStyle: "italic" }}>
              {title.slice(0, 18)}
            </text>
          )}
        </g>
      )}

      {/* Lichtreflexe */}
      <g clipPath={`url(#${uid}-c)`}>
        <rect x={50 - bw + 6} y={s.shoulderTop} width="5" height={300 - s.shoulderTop - 10} rx="2.5" fill="#fff" opacity="0.32" />
        <rect x={50 - bw + 13} y={s.bodyTop + 10} width="1.6" height={300 - s.bodyTop - 30} rx="0.8" fill="#fff" opacity="0.22" />
        <rect x={50 + bw - 9} y={s.bodyTop} width="3" height={300 - s.bodyTop - 14} rx="1.5" fill="#fff" opacity="0.1" />
        <rect x={50 - s.neckW / 2 + 3} y={s.neckTop} width="2.5" height={s.shoulderTop - s.neckTop} rx="1.2" fill="#fff" opacity="0.35" />
        {drops.map((d, i) => (
          <g key={i} opacity={d.o}>
            <circle cx={d.x} cy={d.y} r={d.r} fill="#fff" opacity="0.55" />
            <circle cx={d.x - d.r * 0.3} cy={d.y - d.r * 0.3} r={d.r * 0.35} fill="#fff" />
          </g>
        ))}
      </g>

      {/* Mündung & Verschluss */}
      <rect x={50 - s.neckW / 2 - 1.5} y={s.neckTop - 1} width={s.neckW + 3} height="5" rx="2" fill={shade(glass, clear ? -30 : -12)} opacity={clear ? 0.6 : 1} />
      {s.cap === "crown" && (
        <g>
          <rect x={50 - s.neckW / 2 - 1.5} y={s.neckTop - s.capH} width={s.neckW + 3} height={s.capH} rx="1.5" fill={`url(#${uid}-cap)`} />
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x={50 - s.neckW / 2 + i * ((s.neckW + 1) / 7)} y={s.neckTop - 3} width="1" height="3" fill="#000" opacity="0.18" />
          ))}
        </g>
      )}
      {s.cap === "screw" && (
        <g>
          <rect x={50 - s.neckW / 2 - 1} y={s.neckTop - s.capH} width={s.neckW + 2} height={s.capH} rx="2" fill={`url(#${uid}-cap)`} />
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={50 - s.neckW / 2 + 1} y={s.neckTop - s.capH + 3 + i * 2.2} width={s.neckW - 2} height="0.6" fill="#000" opacity="0.14" />
          ))}
        </g>
      )}
      {s.cap === "swing" && (
        <g>
          <ellipse cx="50" cy={s.neckTop - 5} rx={s.neckW / 2 + 1} ry="6" fill={`url(#${uid}-cap)`} />
          <rect x={50 - s.neckW / 2 - 2} y={s.neckTop - 2} width={s.neckW + 4} height="3" rx="1.5" fill="#B8342C" />
          <path d={`M ${50 - s.neckW / 2 - 3} ${s.neckTop + 18} Q ${50 - s.neckW / 2 - 7} ${s.neckTop} ${50 - 4} ${s.neckTop - 9}`} stroke="#9aa0a0" strokeWidth="1.6" fill="none" />
          <path d={`M ${50 + s.neckW / 2 + 3} ${s.neckTop + 18} Q ${50 + s.neckW / 2 + 7} ${s.neckTop} ${50 + 4} ${s.neckTop - 9}`} stroke="#9aa0a0" strokeWidth="1.6" fill="none" />
        </g>
      )}
    </svg>
  );
}

function Bocksbeutel({ visual, id, brand, title, className, shadow, style }: Omit<BottleProps, "condensation">) {
  const uid = `bb-${id}-${useId().replace(/:/g, "")}`;
  const path = "M 43 20 L 43 96 C 43 110 12 124 12 190 C 12 262 26 300 50 300 C 74 300 88 262 88 190 C 88 124 57 110 57 96 L 57 20 Z";
  return (
    <svg viewBox="-6 -4 112 318" className={className} style={style} role="img" aria-label={title ?? brand ?? "Bocksbeutel"} preserveAspectRatio="xMidYMax meet">
      <defs>
        <radialGradient id={`${uid}-g`} cx="0.36" cy="0.55" r="0.75">
          <stop offset="0" stopColor={shade(visual.glass, 40)} />
          <stop offset="0.5" stopColor={visual.glass} />
          <stop offset="1" stopColor={shade(visual.glass, -30)} />
        </radialGradient>
        <radialGradient id={`${uid}-sh`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-c`}>
          <path d={path} />
        </clipPath>
      </defs>
      {shadow && <ellipse cx="50" cy="301" rx="44" ry="6" fill={`url(#${uid}-sh)`} />}
      <path d={path} fill={`url(#${uid}-g)`} />
      <g clipPath={`url(#${uid}-c)`}>
        <rect x="22" y="170" width="56" height="62" rx="3" fill={visual.label} />
        <rect x="26" y="175" width="48" height="0.8" fill={visual.labelInk} opacity="0.4" />
        <rect x="26" y="226" width="48" height="0.8" fill={visual.labelInk} opacity="0.4" />
        <ellipse cx="34" cy="170" rx="7" ry="60" fill="#fff" opacity="0.14" />
        <rect x="45" y="26" width="2.5" height="70" rx="1.2" fill="#fff" opacity="0.28" />
      </g>
      {brand && (
        <g fill={visual.labelInk} textAnchor="middle">
          <text x="50" y="198" fontSize="7" fontWeight="800" letterSpacing="0.8" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
            {brand.toUpperCase()}
          </text>
          {title && (
            <text x="50" y="211" fontSize="6.4" style={{ fontFamily: "var(--font-instrument), serif", fontStyle: "italic" }}>
              {title.split(" ")[0]}
            </text>
          )}
        </g>
      )}
      <rect x="41.5" y="4" width="17" height="28" rx="1.5" fill={visual.cap} />
      <rect x="41.5" y="28" width="17" height="2" fill="#000" opacity="0.15" />
    </svg>
  );
}

function PetBottle({ visual, id, brand, title, className, shadow, style }: Omit<BottleProps, "condensation">) {
  const uid = `pet-${id}-${useId().replace(/:/g, "")}`;
  const path = "M 43 22 L 43 44 C 43 64 20 70 20 100 L 20 136 C 20 142 24 144 24 150 C 24 156 20 158 20 164 L 20 290 Q 20 300 30 300 L 70 300 Q 80 300 80 290 L 80 164 C 80 158 76 156 76 150 C 76 144 80 142 80 136 L 80 100 C 80 70 57 64 57 44 L 57 22 Z";
  return (
    <svg viewBox="-6 -4 112 318" className={className} style={style} role="img" aria-label={title ?? brand ?? "PET-Flasche"} preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" x2="1">
          <stop offset="0" stopColor="#C9D8DC" />
          <stop offset="0.4" stopColor="#F4F8F8" />
          <stop offset="1" stopColor="#B7C8CD" />
        </linearGradient>
        <radialGradient id={`${uid}-sh`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-c`}>
          <path d={path} />
        </clipPath>
      </defs>
      {shadow && <ellipse cx="50" cy="301" rx="40" ry="6" fill={`url(#${uid}-sh)`} />}
      <path d={path} fill={`url(#${uid}-g)`} opacity="0.85" />
      <g clipPath={`url(#${uid}-c)`}>
        <rect x="0" y="96" width="100" height="210" fill={visual.liquid ?? "#E3EEF3"} opacity="0.5" />
        {[176, 214, 252].map((y) => (
          <rect key={y} x="0" y={y} width="100" height="1.2" fill="#9fb3b8" opacity="0.5" />
        ))}
        <rect x="0" y="180" width="100" height="56" fill={visual.label} />
        <rect x="26" y="60" width="4" height="230" rx="2" fill="#fff" opacity="0.5" />
      </g>
      {brand && (
        <text x="50" y="212" textAnchor="middle" fontSize="8" fontWeight="800" letterSpacing="0.8" fill={visual.labelInk} style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
          {brand.toUpperCase()}
        </text>
      )}
      <rect x="40" y="6" width="20" height="18" rx="2.5" fill={visual.cap} />
      <rect x="38" y="22" width="24" height="3" rx="1.5" fill={shade(visual.cap, -30)} />
    </svg>
  );
}

export { shade };

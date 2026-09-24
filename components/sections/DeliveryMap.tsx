"use client";

import { motion } from "motion/react";
import { deliveryAreas } from "@/lib/site";
import { cn } from "@/lib/format";

/**
 * Stilisierte Karte des Liefergebiets (keine Maps-API nötig).
 * Positionen sind grob an die reale Geografie angelehnt (Nord oben).
 */
export function DeliveryMap({ highlight, className, dark }: { highlight?: string[]; className?: string; dark?: boolean }) {
  const hq = deliveryAreas[0].map;
  const scheduled = deliveryAreas.filter((a) => a.tier === "scheduled");
  const route = `M ${hq.x} ${hq.y} C 240 210, 280 250, ${scheduled[0].map.x} ${scheduled[0].map.y} S 220 330, ${scheduled[1].map.x} ${scheduled[1].map.y} S 170 380, ${scheduled[2].map.x} ${scheduled[2].map.y} S 140 430, ${scheduled[3].map.x} ${scheduled[3].map.y}`;
  const ink = dark ? "#F6F3ED" : "#102A23";
  const hl = new Set(highlight ?? []);

  return (
    <svg viewBox="0 0 400 500" className={cn("h-auto w-full", className)} role="img" aria-label="Karte des Liefergebiets: Bayreuth, Bindlach und Heinersreuth regelmäßig; Creußen, Schnabelwaid, Zips und Pegnitz im Vier-Wochen-Rhythmus.">
      <defs>
        <radialGradient id="zone" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#C88A38" stopOpacity="0.32" />
          <stop offset="0.7" stopColor="#C88A38" stopOpacity="0.12" />
          <stop offset="1" stopColor="#C88A38" stopOpacity="0" />
        </radialGradient>
        <pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill={ink} opacity="0.12" />
        </pattern>
      </defs>
      <rect width="400" height="500" fill="url(#dots)" />
      {/* Höhenlinien */}
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M -20 ${60 + i * 95} C 80 ${30 + i * 95}, 160 ${110 + i * 95}, 240 ${70 + i * 95} S 360 ${40 + i * 95}, 420 ${90 + i * 95}`}
          fill="none"
          stroke={ink}
          strokeOpacity="0.07"
          strokeWidth="1"
        />
      ))}
      {/* Roter Main (angedeutet) */}
      <path d="M 300 20 C 260 70, 230 110, 205 140 S 150 170, 60 150" fill="none" stroke="#7FA39A" strokeOpacity="0.45" strokeWidth="2.2" strokeLinecap="round" />
      {/* A9 (angedeutet) */}
      <path d="M 330 10 C 300 120, 260 200, 250 300 S 200 420, 170 500" fill="none" stroke={ink} strokeOpacity="0.12" strokeWidth="5" strokeLinecap="round" />

      {/* Reguläres Liefergebiet */}
      <motion.ellipse cx="190" cy="112" rx="130" ry="92" fill="url(#zone)" initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} style={{ transformOrigin: "190px 112px" }} />
      <ellipse cx="190" cy="112" rx="130" ry="92" fill="none" stroke="#C88A38" strokeOpacity="0.55" strokeDasharray="2 5" />

      {/* Tour zu den Terminorten */}
      <motion.path d={route} fill="none" stroke="#C88A38" strokeWidth="1.8" strokeDasharray="5 6" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }} />

      {deliveryAreas.map((a, i) => {
        const primary = a.tier === "regular";
        const active = hl.has(a.name);
        const isHq = i === 0;
        const labelLeft = a.name === "Heinersreuth" || a.name === "Pegnitz" || a.name === "Zips";
        return (
          <motion.g key={a.name} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}>
            {(isHq || active) && <circle cx={a.map.x} cy={a.map.y} r="9" fill="#C88A38" className="animate-pulse-ring" />}
            <circle cx={a.map.x} cy={a.map.y} r={isHq ? 7 : primary ? 5.5 : 4} fill={active ? "#C88A38" : primary ? ink : dark ? "#102A23" : "#FCFBF8"} stroke={primary ? "none" : ink} strokeWidth="1.5" />
            {isHq && <circle cx={a.map.x} cy={a.map.y} r="2.4" fill="#C88A38" />}
            <text
              x={a.map.x + (labelLeft ? -12 : 12)}
              y={a.map.y + 4}
              textAnchor={labelLeft ? "end" : "start"}
              fill={ink}
              fontSize={primary ? 15 : 12}
              fontWeight={primary ? 700 : 500}
              opacity={primary || active ? 1 : 0.7}
              style={{ fontFamily: "var(--font-manrope), sans-serif", letterSpacing: "-0.01em" }}
            >
              {a.name}
            </text>
          </motion.g>
        );
      })}
      <text x="205" y="176" fill={ink} opacity="0.55" fontSize="9.5" fontWeight="700" letterSpacing="1.4" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
        TEICHWEG 14
      </text>
      {/* Nordpfeil */}
      <g transform="translate(366 454)" opacity="0.5">
        <path d="M0 -14 L5 4 L0 0 L-5 4 Z" fill={ink} />
        <text y="18" textAnchor="middle" fontSize="9" fontWeight="700" fill={ink} style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
          N
        </text>
      </g>
    </svg>
  );
}

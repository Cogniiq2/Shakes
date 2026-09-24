"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { DeliveryMap } from "./DeliveryMap";
import { DeliveryChecker } from "./DeliveryChecker";
import { deliveryAreas } from "@/lib/site";
import { cn } from "@/lib/format";

/** Liefergebiet-Seite: Karte + PLZ-Check + Ortsliste, gegenseitig verknüpft */
export function AreaExplorer() {
  const [hl, setHl] = useState<string[]>([]);
  const regular = deliveryAreas.filter((a) => a.tier === "regular");
  const scheduled = deliveryAreas.filter((a) => a.tier === "scheduled");

  const Row = ({ a }: { a: (typeof deliveryAreas)[number] }) => {
    const active = hl.includes(a.name);
    return (
      <li>
        <button
          type="button"
          onClick={() => setHl([a.name])}
          onMouseEnter={() => setHl([a.name])}
          className={cn("flex w-full items-center justify-between gap-4 border-b border-line py-4 text-left transition-colors", active && "text-bottle")}
        >
          <span className="flex items-center gap-3">
            <motion.span animate={{ scale: active ? 1.3 : 1 }} className={cn("size-2.5 rounded-full", a.tier === "regular" ? "bg-bottle" : "border-[1.5px] border-bottle", active && "bg-amber border-amber")} />
            <span className={cn("font-semibold tracking-[-0.02em]", a.tier === "regular" ? "text-[1.5rem]" : "text-[1.15rem]")}>{a.name}</span>
          </span>
          <span className="text-right text-[0.8rem] tabular-nums text-muted">{a.postcodes.join(" · ")}</span>
        </button>
      </li>
    );
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
      <div className="min-w-0 lg:col-span-6">
        <div className="relative overflow-hidden rounded-[20px] border border-line bg-paper p-4 sm:p-8 lg:sticky lg:top-28">
          <DeliveryMap highlight={hl} />
        </div>
      </div>
      <div className="min-w-0 lg:col-span-6">
        <DeliveryChecker onResult={setHl} />
        <div className="mt-14">
          <p className="eyebrow text-amber-deep">Regelmäßige Belieferung · Mo–Fr</p>
          <ul className="mt-3">
            {regular.map((a) => (
              <Row key={a.name} a={a} />
            ))}
          </ul>
        </div>
        <div className="mt-12">
          <p className="eyebrow text-amber-deep">Zusätzliche Tour · alle vier Wochen mittwochs</p>
          <ul className="mt-3">
            {scheduled.map((a) => (
              <Row key={a.name} a={a} />
            ))}
          </ul>
          <p className="mt-5 text-[0.88rem] leading-relaxed text-muted">Den nächsten Termin für Pegnitz, Zips, Schnabelwaid und Creußen nennen wir Ihnen gerne telefonisch.</p>
        </div>
      </div>
    </div>
  );
}

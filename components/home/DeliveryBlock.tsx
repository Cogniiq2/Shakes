"use client";

import { useState } from "react";
import { DeliveryMap } from "@/components/sections/DeliveryMap";
import { DeliveryChecker } from "@/components/sections/DeliveryChecker";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { deliveryAreas } from "@/lib/site";

export function DeliveryBlock({ showLink = true, headingLevel = "h2" }: { showLink?: boolean; headingLevel?: "h2" | "h3" }) {
  const [hl, setHl] = useState<string[]>([]);
  const H = headingLevel;
  const regular = deliveryAreas.filter((a) => a.tier === "regular");
  const scheduled = deliveryAreas.filter((a) => a.tier === "scheduled");
  return (
    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <Reveal className="order-2 lg:order-1 lg:col-span-6">
        <div className="relative overflow-hidden rounded-[20px] border border-line bg-paper p-4 sm:p-8">
          <DeliveryMap highlight={hl} />
          <div className="pointer-events-none absolute left-5 top-5 flex flex-col gap-2 text-[0.72rem] font-semibold sm:left-8 sm:top-8">
            <span className="inline-flex items-center gap-2"><span className="size-2.5 rounded-full bg-bottle" /> Regelmäßig Mo–Fr</span>
            <span className="inline-flex items-center gap-2"><span className="size-2.5 rounded-full border-[1.5px] border-bottle bg-paper" /> Alle vier Wochen mittwochs</span>
          </div>
        </div>
      </Reveal>
      <div className="order-1 lg:order-2 lg:col-span-6">
        <Reveal>
          <Eyebrow>Liefergebiet</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <H className="display-2 mt-6">
            Von Bayreuth <span className="serif-accent text-bottle">bis vor Ihre Tür.</span>
          </H>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="lede mt-6 max-w-[34rem] text-muted">Regelmäßige Lieferung in Bayreuth, Bindlach und Heinersreuth. Weitere Orte werden zu ausgewählten Liefertagen angefahren.</p>
        </Reveal>
        <Reveal delay={0.16} className="mt-9">
          <ul className="flex flex-wrap gap-x-7 gap-y-1">
            {regular.map((a) => (
              <li key={a.name} className="text-[1.9rem] font-semibold tracking-[-0.03em] sm:text-[2.2rem]">
                {a.name}
              </li>
            ))}
          </ul>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
            {scheduled.map((a) => (
              <li key={a.name} className="font-serif text-[1.35rem] italic text-muted">
                {a.name}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.2}>
          <DeliveryChecker className="mt-10 max-w-lg" onResult={setHl} />
        </Reveal>
        {showLink && (
          <Reveal delay={0.24} className="mt-8">
            <ArrowLink href="/liefergebiet">Liefergebiet ansehen</ArrowLink>
          </Reveal>
        )}
      </div>
    </div>
  );
}

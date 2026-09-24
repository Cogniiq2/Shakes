"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/format";

export interface FAQItem {
  q: string;
  a: React.ReactNode;
}

export function FAQAccordion({ items, className, dark }: { items: FAQItem[]; className?: string; dark?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className={cn("border-t", dark ? "border-ivory/15" : "border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={cn("border-b", dark ? "border-ivory/15" : "border-line")}>
            <h3>
              <button
                type="button"
                id={`${base}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className={cn("text-[1.05rem] font-semibold tracking-[-0.01em] transition-colors sm:text-[1.15rem]", dark ? "group-hover:text-amber" : "group-hover:text-bottle-700")}>{item.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 26 }}
                  className={cn("grid size-9 shrink-0 place-items-center rounded-full border transition-colors", isOpen ? "border-amber bg-amber text-ink" : dark ? "border-ivory/20" : "border-line")}
                >
                  <Plus className="size-4" strokeWidth={2} />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${base}-a${i}`}
                  role="region"
                  aria-labelledby={`${base}-q${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className={cn("max-w-2xl pb-7 pr-12 text-[0.98rem] leading-relaxed", dark ? "text-ivory/70" : "text-muted")}>{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/format";

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function QuantitySelector({ value, onChange, min = 1, max = 30, size = "md", label = "Menge", className }: Props) {
  const h = size === "lg" ? "h-14" : size === "md" ? "h-12" : "h-10";
  const w = size === "lg" ? "w-14" : size === "md" ? "w-11" : "w-10";
  return (
    <div role="group" aria-label={label} className={cn("inline-flex items-center rounded-[10px] border border-line bg-paper", h, className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Menge verringern"
        className={cn("grid h-full place-items-center rounded-l-[10px] text-ink transition-[background-color,transform] hover:bg-ink/[0.04] active:scale-90 disabled:opacity-30", w)}
      >
        <Minus className="size-4" strokeWidth={2} />
      </button>
      <span className="relative grid h-full min-w-8 place-items-center overflow-hidden px-1 text-[0.95rem] font-semibold tabular-nums" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={value} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Menge erhöhen"
        className={cn("grid h-full place-items-center rounded-r-[10px] text-ink transition-[background-color,transform] hover:bg-ink/[0.04] active:scale-90 disabled:opacity-30", w)}
      >
        <Plus className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
}

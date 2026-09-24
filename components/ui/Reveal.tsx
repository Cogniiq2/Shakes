"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type React from "react";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "article";
  once?: boolean;
  amount?: number;
}

/** Sanftes Einblenden beim Scrollen. Respektiert prefers-reduced-motion über MotionConfig. */
export function Reveal({ children, delay = 0, y = 24, className, as = "div", once = true, amount = 0.2 }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/** Container, dessen Kinder gestaffelt einblenden */
export function Stagger({ children, className, gap = 0.08, delay = 0, as = "div" }: { children: React.ReactNode; className?: string; gap?: number; delay?: number; as?: "div" | "ul" | "ol" | "dl" }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div", y = 22 }: { children: React.ReactNode; className?: string; as?: "div" | "li" | "article"; y?: number }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
      }}
    >
      {children}
    </Comp>
  );
}

/** Leichter Parallax (max. ~4 %) für große Bildflächen */
export function Parallax({ children, className, range = 40 }: { children: React.ReactNode; className?: string; range?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-range / 2, range / 2]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

export { EASE };

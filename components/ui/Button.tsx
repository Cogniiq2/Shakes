"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import type React from "react";
import { useRef } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "amber" | "outline" | "light" | "outline-light" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap font-semibold tracking-[-0.005em] transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-premium)] active:scale-[0.97] active:duration-100 disabled:opacity-45 disabled:active:scale-100";

const variants: Record<Variant, string> = {
  primary: "bg-bottle text-ivory hover:bg-bottle-700 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_10px_24px_-14px_rgba(16,42,35,0.7)]",
  amber: "bg-amber text-ink hover:bg-[#d49748] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_24px_-14px_rgba(168,111,37,0.8)]",
  outline: "border border-ink/15 bg-transparent text-ink hover:border-ink/40 hover:bg-ink/[0.03]",
  light: "bg-ivory text-bottle hover:bg-paper",
  "outline-light": "border border-ivory/25 text-ivory hover:border-ivory/60 hover:bg-ivory/[0.06]",
  quiet: "text-ink hover:bg-ink/[0.05]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[0.875rem] rounded-[8px]",
  md: "h-12 px-6 text-[0.9375rem] rounded-[10px]",
  lg: "h-14 px-7 text-base rounded-[12px]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  icon?: React.ReactNode;
  magnetic?: boolean;
  className?: string;
  children: React.ReactNode;
}

type LinkProps = CommonProps & { href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;
type BtnProps = CommonProps & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button(props: LinkProps | BtnProps) {
  const { variant = "primary", size = "md", arrow, icon, magnetic, className, children, ...rest } = props;
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (!magnetic || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 6);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <>
      {icon && <span className="-ml-0.5 inline-flex shrink-0 [&>svg]:size-[18px]">{icon}</span>}
      <span>{children}</span>
      {arrow && (
        <span className="relative -mr-1 inline-flex size-[18px] shrink-0 overflow-hidden">
          <ArrowRight className="absolute inset-0 size-[18px] transition-transform duration-500 ease-[var(--ease-premium)] group-hover/btn:translate-x-[140%]" strokeWidth={2} />
          <ArrowRight className="absolute inset-0 size-[18px] -translate-x-[140%] transition-transform duration-500 ease-[var(--ease-premium)] group-hover/btn:translate-x-0" strokeWidth={2} />
        </span>
      )}
    </>
  );

  const cls = cn(base, variants[variant], sizes[size], className);

  let el: React.ReactNode;
  if (props.href !== undefined) {
    const { href, external, ...anchorRest } = rest as LinkProps;
    const isNative = external || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");
    el = isNative ? (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...anchorRest}>
        {content}
      </a>
    ) : (
      <Link href={href} className={cls} {...anchorRest}>
        {content}
      </Link>
    );
  } else {
    const btnRest = rest as Omit<BtnProps, keyof CommonProps>;
    el = (
      <button type={btnRest.type ?? "button"} className={cls} {...btnRest}>
        {content}
      </button>
    );
  }

  if (!magnetic) return el;
  return (
    <motion.span ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} style={{ x: sx, y: sy }} className={cn("inline-flex", className?.includes("w-full") && "w-full sm:w-auto")}>
      {el}
    </motion.span>
  );
}

/** Textlink mit animiertem Pfeil */
export function ArrowLink({ href, children, className, light }: { href: string; children: React.ReactNode; className?: string; light?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group/al inline-flex items-center gap-2 text-[0.95rem] font-semibold",
        light ? "text-ivory" : "text-ink",
        className,
      )}
    >
      <span className="link-underline pb-0.5">{children}</span>
      <ArrowRight className="size-4 transition-transform duration-500 ease-[var(--ease-premium)] group-hover/al:translate-x-1" strokeWidth={2} />
    </Link>
  );
}

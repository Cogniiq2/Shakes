import type React from "react";
import { cn } from "@/lib/format";
import { Reveal } from "./Reveal";

export function Eyebrow({ children, className, light }: { children: React.ReactNode; className?: string; light?: boolean }) {
  return (
    <p className={cn("eyebrow inline-flex items-center gap-3", light ? "text-amber" : "text-amber-deep", className)}>
      <span aria-hidden className={cn("h-px w-6", light ? "bg-amber/70" : "bg-amber-deep/60")} />
      {children}
    </p>
  );
}

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  light?: boolean;
  size?: "2" | "3";
  className?: string;
  as?: "h1" | "h2" | "h3";
  action?: React.ReactNode;
}

export function SectionHeading({ eyebrow, title, lede, align = "left", light, size = "2", className, as: H = "h2", action }: Props) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12", align === "center" && "items-center text-center md:flex-col md:items-center", className)}>
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <Reveal>
            <Eyebrow light={light}>{eyebrow}</Eyebrow>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <H className={cn(size === "2" ? "display-2" : "display-3", "mt-5", light ? "text-ivory" : "text-ink")}>{title}</H>
        </Reveal>
        {lede && (
          <Reveal delay={0.12}>
            <p className={cn("lede mt-6 max-w-[40rem]", light ? "text-ivory/70" : "text-muted", align === "center" && "mx-auto")}>{lede}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.15} className="shrink-0">{action}</Reveal>}
    </div>
  );
}

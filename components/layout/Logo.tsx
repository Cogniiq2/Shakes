import Link from "next/link";
import { cn } from "@/lib/format";

/**
 * Temporäre typografische Wortmarke.
 * Hinweis: Sobald das offizielle Schake's-Bier-Logo als Vektor vorliegt, hier ersetzen.
 */
export function Logo({ light, compact, className }: { light?: boolean; compact?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="Schake's Bier – zur Startseite" className={cn("group/logo inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "font-serif text-[1.85rem] leading-none tracking-[-0.02em] transition-colors duration-500 sm:text-[2.05rem]",
          light ? "text-ivory" : "text-bottle",
        )}
      >
        Schake&rsquo;s
      </span>
      <span aria-hidden className={cn("h-7 w-px transition-colors duration-500", light ? "bg-ivory/30" : "bg-bottle/25")} />
      <span className="flex flex-col justify-center gap-[5px]">
        <span className={cn("text-[0.7rem] font-extrabold leading-none tracking-[0.34em] transition-colors duration-500", light ? "text-ivory" : "text-bottle")}>BIER</span>
        {!compact && (
          <span className={cn("hidden whitespace-nowrap text-[0.6rem] font-medium leading-none tracking-[0.06em] transition-colors duration-500 xs:block", light ? "text-ivory/60" : "text-muted")}>
            Getränkeheimdienst Bayreuth
          </span>
        )}
      </span>
    </Link>
  );
}

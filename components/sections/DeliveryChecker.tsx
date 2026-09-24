"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CalendarDays, Check, MapPin, Phone } from "lucide-react";
import { useId, useState } from "react";
import { checkPostcode, site, type PostcodeResult } from "@/lib/site";
import { cn } from "@/lib/format";

/** Frontend-Prototyp des PLZ-Checks – keine Backend-Anbindung. */
export function DeliveryChecker({ dark, onResult, className }: { dark?: boolean; onResult?: (areas: string[]) => void; className?: string }) {
  const id = useId();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<PostcodeResult | null>(null);
  const [shake, setShake] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = checkPostcode(value);
    setResult(r);
    if (r.status === "invalid") setShake((s) => s + 1);
    onResult?.(r.status === "regular" || r.status === "scheduled" ? r.areas.map((a) => a.name) : []);
  };

  return (
    <div className={className}>
      <form onSubmit={submit} noValidate>
        <label htmlFor={id} className={cn("text-[0.8rem] font-semibold", dark ? "text-ivory/70" : "text-muted")}>
          Liefern wir zu Ihnen?
        </label>
        <motion.div
          key={shake}
          animate={shake ? { x: [0, -8, 7, -5, 3, 0] } : {}}
          transition={{ duration: 0.4 }}
          className={cn(
            "mt-2 flex h-16 items-center gap-2 rounded-[14px] border p-2 pl-4 transition-colors focus-within:border-amber",
            dark ? "border-ivory/15 bg-ivory/[0.06]" : "border-line bg-paper",
          )}
        >
          <MapPin className={cn("size-5 shrink-0", dark ? "text-amber" : "text-amber-deep")} strokeWidth={1.8} />
          <input
            id={id}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            placeholder="PLZ eingeben"
            value={value}
            onChange={(e) => {
              setValue(e.target.value.replace(/\D/g, "").slice(0, 5));
              if (result) setResult(null);
            }}
            className={cn("h-full min-w-0 flex-1 bg-transparent text-[1.15rem] font-semibold tracking-[0.12em] tabular-nums outline-none placeholder:font-medium placeholder:tracking-normal", dark ? "text-ivory placeholder:text-ivory/40" : "text-ink placeholder:text-muted/70")}
          />
          <button
            type="submit"
            className={cn("inline-flex h-full shrink-0 items-center gap-2 rounded-[10px] px-4 text-[0.9rem] font-semibold transition-[background-color,transform] active:scale-95 sm:px-5", dark ? "bg-amber text-ink hover:bg-[#d49748]" : "bg-bottle text-ivory hover:bg-bottle-700")}
          >
            Prüfen
            <ArrowRight className="size-4" />
          </button>
        </motion.div>
      </form>

      <div aria-live="polite" className="min-h-[1px]">
        <AnimatePresence mode="wait">
          {result && result.status !== "invalid" && (
            <motion.div
              key={value + result.status}
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -6, height: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ResultCard result={result} dark={dark} />
            </motion.div>
          )}
          {result?.status === "invalid" && (
            <motion.p key="inv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cn("mt-3 text-[0.85rem]", dark ? "text-ivory/70" : "text-danger")}>
              Bitte geben Sie eine fünfstellige Postleitzahl ein.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {!result && (
        <p className={cn("mt-3 text-[0.8rem]", dark ? "text-ivory/45" : "text-muted/80")}>
          Zum Ausprobieren: 95444, 95463 oder 91257
        </p>
      )}
    </div>
  );
}

function ResultCard({ result, dark }: { result: PostcodeResult; dark?: boolean }) {
  if (result.status === "regular") {
    return (
      <div className={cn("mt-3 flex gap-4 rounded-[14px] p-4 sm:p-5", dark ? "bg-ivory text-ink" : "bg-bottle text-ivory")}>
        <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.1 }} className="grid size-10 shrink-0 place-items-center rounded-full bg-amber text-ink">
          <Check className="size-5" strokeWidth={2.6} />
        </motion.span>
        <div>
          <p className="text-[1.05rem] font-semibold">Perfekt – wir liefern in Ihr Gebiet.</p>
          <p className={cn("mt-1 text-[0.88rem] leading-relaxed", dark ? "text-muted" : "text-ivory/70")}>
            {result.areas.map((a) => a.name).join(", ")}: reguläre Belieferung Montag bis Freitag, in der Regel innerhalb von 1–2 Werktagen.
          </p>
          <Link href="/sortiment" className={cn("mt-3 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold", dark ? "text-bottle" : "text-amber")}>
            Jetzt Getränke auswählen <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }
  if (result.status === "scheduled") {
    return (
      <div className={cn("mt-3 flex gap-4 rounded-[14px] border p-4 sm:p-5", dark ? "border-ivory/15 bg-ivory/[0.06] text-ivory" : "border-line bg-paper")}>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-soft text-amber-deep">
          <CalendarDays className="size-5" strokeWidth={1.8} />
        </span>
        <div>
          <p className="text-[1.05rem] font-semibold">Wir kommen zu Ihnen – zu festen Terminen.</p>
          <p className={cn("mt-1 text-[0.88rem] leading-relaxed", dark ? "text-ivory/70" : "text-muted")}>
            {result.areas.map((a) => a.name).join(" / ")} wird alle vier Wochen mittwochs angefahren. Den nächsten Termin nennen wir Ihnen gern persönlich.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className={cn("mt-3 flex gap-4 rounded-[14px] border p-4 sm:p-5", dark ? "border-ivory/15 bg-ivory/[0.06] text-ivory" : "border-line bg-paper")}>
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", dark ? "bg-ivory/10" : "bg-stone")}>
        <Phone className="size-[18px]" strokeWidth={1.8} />
      </span>
      <div>
        <p className="text-[1.05rem] font-semibold">Diese PLZ liegt außerhalb unserer festen Touren.</p>
        <p className={cn("mt-1 text-[0.88rem] leading-relaxed", dark ? "text-ivory/70" : "text-muted")}>
          Sprechen Sie uns gern an – wir prüfen, was möglich ist.{" "}
          <a href={site.phone.href} className="font-semibold underline-offset-4 hover:underline">
            {site.phone.display}
          </a>
        </p>
      </div>
    </div>
  );
}

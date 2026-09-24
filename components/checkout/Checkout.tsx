"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Banknote, Building2, Check, ChevronDown, FileText, House, Lock, Pencil, Recycle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart, type ResolvedLine } from "@/components/cart/CartProvider";
import { CartLineItem, CartTotals, Switch } from "@/components/cart/CartParts";
import { EmptyCart } from "@/components/cart/CartDrawer";
import { ProductVisual } from "@/components/visual/ProductVisual";
import { Field, TextArea, focusFirstError, isEmail } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/Reveal";
import { checkPostcode, site } from "@/lib/site";
import { cn, formatEuro, formatPack } from "@/lib/format";

const STEPS = ["Warenkorb", "Lieferung", "Kontakt", "Übersicht"];

interface Data {
  type: "privat" | "firma";
  name: string;
  company: string;
  street: string;
  number: string;
  zip: string;
  city: string;
  floor: string;
  elevator: boolean;
  note: string;
  date: string;
  empties: boolean;
  email: string;
  phone: string;
  payment: "bar" | "rechnung";
}

const initial: Data = { type: "privat", name: "", company: "", street: "", number: "", zip: "", city: "Bayreuth", floor: "", elevator: false, note: "", date: "asap", empties: false, email: "", phone: "", payment: "bar" };

function workingDays(n: number): Date[] {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) out.push(new Date(d));
  }
  return out;
}

export function Checkout() {
  const cart = useCart();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<Data>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});
  const [done, setDone] = useState<{ id: string; lines: ResolvedLine[]; total: number; data: Data } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setData((d) => ({ ...d, empties: cart.hasEmpties })), [cart.hasEmpties]);
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [step, done]);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));
  };
  const input = (k: keyof Data) => ({
    value: data[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, e.target.value as never),
    error: errors[k],
  });

  const zipCheck = useMemo(() => (data.zip.length === 5 ? checkPostcode(data.zip) : null), [data.zip]);
  useEffect(() => {
    if (zipCheck && (zipCheck.status === "regular" || zipCheck.status === "scheduled")) {
      const name = zipCheck.areas[0].name;
      setData((d) => ({ ...d, city: name === "Zips" ? "Pegnitz" : name }));
    }
  }, [zipCheck]);

  const validate = (s: number) => {
    const e: typeof errors = {};
    if (s === 1) {
      if (!data.name.trim()) e.name = "Bitte geben Sie Ihren Namen an.";
      if (data.type === "firma" && !data.company.trim()) e.company = "Bitte geben Sie das Unternehmen an.";
      if (!data.street.trim()) e.street = "Bitte geben Sie die Straße an.";
      if (!data.number.trim()) e.number = "Nr. fehlt";
      if (!/^\d{5}$/.test(data.zip)) e.zip = "Fünfstellige PLZ";
      if (!data.city.trim()) e.city = "Bitte geben Sie den Ort an.";
    }
    if (s === 2) {
      if (!isEmail(data.email)) e.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
      if (data.phone.replace(/\D/g, "").length < 6) e.phone = "Für Rückfragen zur Lieferung benötigen wir Ihre Telefonnummer.";
    }
    setErrors(e);
    if (Object.keys(e).length) focusFirstError();
    return Object.keys(e).length === 0;
  };

  const go = (to: number) => {
    if (to > step && !validate(step)) return;
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setDone({ id: `SB-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`, lines: cart.lines, total: cart.total, data });
      cart.clear();
      cart.setHasEmpties(false);
      setSubmitting(false);
    }, 1200);
  };

  if (!cart.ready) return <div className="mt-10 h-[50vh] animate-pulse rounded-[18px] bg-stone/60" />;
  if (done) return <Confirmation done={done} />;
  if (cart.lines.length === 0)
    return (
      <div className="mt-10 rounded-[20px] border border-line bg-paper">
        <EmptyCart />
      </div>
    );

  const dates = workingDays(6);

  return (
    <div className="mt-8">
      <StepIndicator step={step} onGo={(i) => i < step && go(i)} />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-7">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -20 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {step === 0 && (
                <Panel title="Warenkorb prüfen" sub="Mengen anpassen oder Artikel entfernen.">
                  <ul className="divide-y divide-line border-y border-line">
                    <AnimatePresence initial={false}>
                      {cart.lines.map((l) => (
                        <CartLineItem key={l.slug} line={l} />
                      ))}
                    </AnimatePresence>
                  </ul>
                  <Link href="/sortiment" className="mt-5 inline-flex text-[0.9rem] font-semibold text-bottle hover:underline">
                    + Weitere Getränke hinzufügen
                  </Link>
                </Panel>
              )}

              {step === 1 && (
                <Panel title="Lieferung" sub="Wohin dürfen wir liefern?">
                  <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Kundenart">
                    {(
                      [
                        ["privat", "Privat", House],
                        ["firma", "Unternehmen", Building2],
                      ] as const
                    ).map(([v, label, Icon]) => (
                      <Choice key={v} active={data.type === v} onClick={() => set("type", v)} role="radio">
                        <Icon className="size-5" strokeWidth={1.7} />
                        <span className="font-semibold">{label}</span>
                      </Choice>
                    ))}
                  </div>
                  <div className="mt-7 grid grid-cols-6 gap-4">
                    <Field label="Vor- und Nachname" autoComplete="name" className="col-span-6" {...input("name")} />
                    <AnimatePresence initial={false}>
                      {data.type === "firma" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="col-span-6 overflow-hidden">
                          <Field label="Unternehmen" autoComplete="organization" {...input("company")} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Field label="Straße" autoComplete="address-line1" className="col-span-4" {...input("street")} />
                    <Field label="Nr." className="col-span-2" {...input("number")} />
                    <Field label="PLZ" inputMode="numeric" maxLength={5} autoComplete="postal-code" className="col-span-2" {...input("zip")} onChange={(e) => set("zip", e.target.value.replace(/\D/g, "").slice(0, 5))} />
                    <Field label="Ort" autoComplete="address-level2" className="col-span-4" {...input("city")} />
                  </div>
                  <AnimatePresence>
                    {zipCheck && zipCheck.status !== "invalid" && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn("mt-3 flex items-center gap-2 text-[0.85rem] font-semibold", zipCheck.status === "outside" ? "text-amber-deep" : "text-success")}>
                        {zipCheck.status === "regular" && (
                          <>
                            <Check className="size-4" strokeWidth={2.6} /> Perfekt – wir liefern in Ihr Gebiet.
                          </>
                        )}
                        {zipCheck.status === "scheduled" && <>Wir liefern zu festen Terminen (alle vier Wochen mittwochs) – wir bestätigen den Termin persönlich.</>}
                        {zipCheck.status === "outside" && <>Diese PLZ liegt außerhalb unserer Touren – wir prüfen Ihre Anfrage gerne persönlich.</>}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <details className="group mt-7 rounded-[12px] border border-line bg-paper">
                    <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-[0.92rem] font-semibold">
                      Zusätzliche Angaben <span className="font-normal text-muted">optional</span>
                      <ChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="grid gap-4 border-t border-line p-4 sm:grid-cols-2">
                      <Field label="Etage" optional placeholder="z. B. 2. OG" {...input("floor")} />
                      <div className="flex items-end">
                        <div className="flex h-[52px] w-full items-center justify-between rounded-[10px] border border-line bg-ivory px-4">
                          <span className="text-[0.92rem] font-semibold">Aufzug vorhanden</span>
                          <Switch checked={data.elevator} onChange={(v) => set("elevator", v)} label="Aufzug vorhanden" />
                        </div>
                      </div>
                      <TextArea label="Lieferhinweis" optional placeholder="z. B. Hinterhof, bitte klingeln bei …" className="sm:col-span-2" rows={3} {...input("note")} />
                    </div>
                  </details>

                  <h3 className="mt-10 text-[1.1rem] font-semibold">Wunschtermin</h3>
                  <p className="mt-1 text-[0.85rem] text-muted">Wir bestätigen den Liefertermin persönlich.</p>
                  <div className="no-scrollbar -mx-1 mt-4 flex gap-2.5 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
                    <DateCard active={data.date === "asap"} onClick={() => set("date", "asap")} top="Nächster" main="Termin" sub="1–2 Werktage" />
                    {dates.slice(1, 6).map((d) => {
                      const key = d.toISOString().slice(0, 10);
                      return (
                        <DateCard
                          key={key}
                          active={data.date === key}
                          onClick={() => set("date", key)}
                          top={d.toLocaleDateString("de-DE", { weekday: "short" })}
                          main={d.toLocaleDateString("de-DE", { day: "2-digit" })}
                          sub={d.toLocaleDateString("de-DE", { month: "short" })}
                        />
                      );
                    })}
                  </div>

                  <div className="mt-10 flex items-center justify-between gap-4 rounded-[12px] border border-line bg-paper p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-mist text-bottle">
                        <Recycle className="size-[18px]" strokeWidth={1.8} />
                      </span>
                      <div>
                        <p className="text-[0.95rem] font-semibold">Leergut bei Lieferung mitgeben?</p>
                        <p className="text-[0.82rem] text-muted">Die genaue Verrechnung erfolgt bei der Lieferung.</p>
                      </div>
                    </div>
                    <Switch
                      checked={data.empties}
                      onChange={(v) => {
                        set("empties", v);
                        cart.setHasEmpties(v);
                      }}
                      label="Ja, ich habe Leergut."
                    />
                  </div>
                </Panel>
              )}

              {step === 2 && (
                <Panel title="Kontakt" sub="Für Rückfragen und die Terminbestätigung.">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="E-Mail" type="email" autoComplete="email" {...input("email")} />
                    <Field label="Telefon" type="tel" autoComplete="tel" {...input("phone")} />
                  </div>
                  <h3 className="mt-10 text-[1.1rem] font-semibold">Zahlungsweise</h3>
                  <div className="mt-4 grid gap-3" role="radiogroup" aria-label="Zahlungsweise">
                    <Choice active={data.payment === "bar"} onClick={() => set("payment", "bar")} role="radio" wide>
                      <Banknote className="size-5" strokeWidth={1.7} />
                      <span className="flex-1 text-left">
                        <span className="block font-semibold">Bar bei Lieferung</span>
                        <span className="block text-[0.82rem] text-muted">Sie bezahlen bequem an der Haustür.</span>
                      </span>
                    </Choice>
                    <Choice active={data.payment === "rechnung"} onClick={() => set("payment", "rechnung")} role="radio" wide>
                      <FileText className="size-5" strokeWidth={1.7} />
                      <span className="flex-1 text-left">
                        <span className="block font-semibold">Rechnung nach Vereinbarung</span>
                        <span className="block text-[0.82rem] text-muted">Für Firmen- und Stammkunden nach persönlicher Absprache.</span>
                      </span>
                    </Choice>
                  </div>
                  <p className="mt-4 text-[0.78rem] text-muted">Prototyp: Die Zahlungsarten dienen der Darstellung und werden vor dem Livegang mit Schake&rsquo;s Bier abgestimmt.</p>
                </Panel>
              )}

              {step === 3 && (
                <Panel title="Bestellung prüfen" sub="Bitte kontrollieren Sie Ihre Angaben.">
                  <div className="divide-y divide-line rounded-[14px] border border-line bg-paper">
                    <Review label="Lieferadresse" onEdit={() => go(1)}>
                      {data.type === "firma" && <>{data.company}<br /></>}
                      {data.name}
                      <br />
                      {data.street} {data.number}
                      <br />
                      {data.zip} {data.city}
                      {(data.floor || data.elevator || data.note) && (
                        <span className="mt-1 block text-muted">
                          {[data.floor, data.elevator ? "Aufzug vorhanden" : "", data.note].filter(Boolean).join(" · ")}
                        </span>
                      )}
                    </Review>
                    <Review label="Wunschtermin" onEdit={() => go(1)}>
                      {data.date === "asap" ? "Nächster möglicher Termin (in der Regel 1–2 Werktage)" : new Date(data.date).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
                      <span className="block text-muted">Leergut: {data.empties ? "Ja, wird mitgegeben" : "Nein"}</span>
                    </Review>
                    <Review label="Kontakt" onEdit={() => go(2)}>
                      {data.email}
                      <br />
                      {data.phone}
                    </Review>
                    <Review label="Zahlung" onEdit={() => go(2)}>
                      {data.payment === "bar" ? "Bar bei Lieferung" : "Rechnung nach Vereinbarung"}
                    </Review>
                  </div>
                  <p className="mt-6 text-[0.82rem] leading-relaxed text-muted">
                    Mit dem Abschluss der Bestellung bestätigen Sie, dass alkoholhaltige Getränke nur an volljährige Personen übergeben werden. Es gelten die Hinweise zum{" "}
                    <Link href="/datenschutz" className="font-semibold text-ink underline underline-offset-2">
                      Datenschutz
                    </Link>
                    .
                  </p>
                </Panel>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <Button variant="quiet" onClick={() => go(step - 1)} icon={<ArrowLeft />}>
                Zurück
              </Button>
            ) : (
              <Button variant="quiet" href="/sortiment" icon={<ArrowLeft />}>
                Weiter einkaufen
              </Button>
            )}
            {step < 3 ? (
              <Button size="lg" onClick={() => go(step + 1)} className="w-full sm:w-auto">
                <span className="inline-flex items-center gap-2">
                  Weiter zu „{STEPS[step + 1]}“ <ArrowRight className="size-4" />
                </span>
              </Button>
            ) : (
              <Button size="lg" variant="amber" onClick={submit} disabled={submitting} className="w-full sm:w-auto" icon={submitting ? undefined : <Lock />}>
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <motion.span className="size-4 rounded-full border-2 border-ink/25 border-t-ink" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
                    Wird vorbereitet …
                  </span>
                ) : (
                  "Bestellung abschließen"
                )}
              </Button>
            )}
          </div>
        </div>

        <aside className="min-w-0 lg:col-span-5">
          <OrderSummary />
        </aside>
      </div>
    </div>
  );
}

function StepIndicator({ step, onGo }: { step: number; onGo: (i: number) => void }) {
  return (
    <nav aria-label="Bestellschritte">
      <ol className="relative grid grid-cols-4">
        <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-[17px] h-px bg-line" />
        <motion.span aria-hidden className="absolute left-[12.5%] top-[17px] h-px origin-left bg-bottle" initial={false} animate={{ width: `${(step / 3) * 75}%` }} transition={{ duration: 0.6, ease: EASE }} />
        {STEPS.map((s, i) => {
          const state = i < step ? "done" : i === step ? "current" : "todo";
          return (
            <li key={s} className="relative flex flex-col items-center">
              <button
                type="button"
                onClick={() => onGo(i)}
                disabled={i >= step}
                aria-current={state === "current" ? "step" : undefined}
                className={cn(
                  "relative z-10 grid size-[35px] place-items-center rounded-full border text-[0.85rem] font-bold tabular-nums transition-colors duration-500",
                  state === "done" && "border-bottle bg-bottle text-ivory hover:bg-bottle-700",
                  state === "current" && "border-bottle bg-ivory text-bottle ring-4 ring-bottle/10",
                  state === "todo" && "border-line bg-ivory text-muted",
                )}
              >
                {state === "done" ? <Check className="size-4" strokeWidth={2.8} /> : i + 1}
              </button>
              <span className={cn("mt-2.5 text-[0.75rem] font-semibold sm:text-[0.85rem]", state === "todo" ? "text-muted" : "text-ink")}>{s}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Panel({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="display-3">{title}</h2>
      <p className="mt-2 text-muted">{sub}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Choice({ active, onClick, children, role, wide }: { active: boolean; onClick: () => void; children: React.ReactNode; role: "radio"; wide?: boolean }) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 rounded-[12px] border p-4 text-[0.95rem] transition-all duration-300 active:scale-[0.99]",
        wide ? "w-full" : "h-16 justify-center",
        active ? "border-bottle bg-bottle/[0.04] shadow-[0_0_0_1px_var(--color-bottle)]" : "border-line bg-paper hover:border-ink/30",
      )}
    >
      {children}
      {active && (
        <motion.span layoutId={wide ? "pay-check" : "type-check"} className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-bottle text-ivory">
          <Check className="size-3" strokeWidth={3} />
        </motion.span>
      )}
    </button>
  );
}

function DateCard({ active, onClick, top, main, sub }: { active: boolean; onClick: () => void; top: string; main: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex min-w-[88px] shrink-0 flex-col items-center rounded-[12px] border px-3 py-3.5 transition-all duration-300 active:scale-95",
        active ? "border-bottle bg-bottle text-ivory" : "border-line bg-paper hover:border-ink/30",
      )}
    >
      <span className={cn("text-[0.72rem] font-bold uppercase tracking-[0.1em]", active ? "text-amber" : "text-muted")}>{top}</span>
      <span className="mt-1 text-[1.35rem] font-semibold tabular-nums leading-tight">{main}</span>
      <span className={cn("text-[0.75rem]", active ? "text-ivory/70" : "text-muted")}>{sub}</span>
    </button>
  );
}

function Review({ label, children, onEdit }: { label: string; children: React.ReactNode; onEdit: () => void }) {
  return (
    <div className="flex items-start justify-between gap-6 p-5">
      <div>
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
        <p className="mt-2 text-[0.95rem] leading-relaxed">{children}</p>
      </div>
      <button type="button" onClick={onEdit} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[8px] px-3 text-[0.82rem] font-semibold text-bottle hover:bg-bottle/5">
        <Pencil className="size-3.5" /> Ändern
      </button>
    </div>
  );
}

function OrderSummary() {
  const { lines, count } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[20px] border border-line bg-paper p-6 sm:p-7 lg:sticky lg:top-28">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between lg:pointer-events-none" aria-expanded={open}>
        <h2 className="text-[1.15rem] font-semibold">Ihre Bestellung · {count} Artikel</h2>
        <ChevronDown className={cn("size-5 text-muted transition-transform lg:hidden", open && "rotate-180")} />
      </button>
      <div className={cn("mt-5 space-y-3", !open && "hidden lg:block")}>
        {lines.map((l) => (
          <div key={l.slug} className="flex items-center gap-3">
            <div className="relative shrink-0">
              <ProductVisual product={l.product} variant="thumb" className="size-14 rounded-[8px]" />
              <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink text-[0.68rem] font-bold text-ivory">{l.qty}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9rem] font-semibold">{l.product.name}</p>
              <p className="text-[0.78rem] text-muted tabular-nums">{formatPack(l.product.packQuantity, l.product.bottleVolume)}</p>
            </div>
            <p className="text-[0.9rem] font-semibold tabular-nums">{l.lineTotal === null ? "auf Anfrage" : formatEuro(l.lineTotal)}</p>
          </div>
        ))}
      </div>
      <CartTotals className="mt-6 border-t border-line pt-6" />
    </div>
  );
}

function Confirmation({ done }: { done: { id: string; lines: ResolvedLine[]; total: number; data: Data } }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="mx-auto mt-10 max-w-3xl text-center">
      <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 }} className="mx-auto grid size-20 place-items-center rounded-full bg-bottle text-ivory">
        <Check className="size-9" strokeWidth={2.4} />
      </motion.div>
      <h1 className="display-1 mt-10">
        Vielen Dank.
        <span className="serif-accent block text-bottle">Ihre Bestellung ist vorbereitet.</span>
      </h1>
      <p className="lede mx-auto mt-7 max-w-xl text-muted">
        Wir melden uns zur Bestätigung des Liefertermins unter {done.data.phone || done.data.email}. Leergut aus unserem Sortiment nehmen wir gerne wieder mit.
      </p>
      <div className="mx-auto mt-12 max-w-xl rounded-[18px] border border-line bg-paper p-6 text-left">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <p className="text-[0.8rem] font-bold uppercase tracking-[0.12em] text-muted">Vorgang</p>
          <p className="font-semibold tabular-nums">{done.id}</p>
        </div>
        <ul className="divide-y divide-line">
          {done.lines.map((l) => (
            <li key={l.slug} className="flex justify-between gap-4 py-3 text-[0.92rem]">
              <span>
                {l.qty} × {l.product.name}
              </span>
              <span className="tabular-nums text-muted">{l.lineTotal === null ? "auf Anfrage" : formatEuro(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-line pt-4 font-semibold">
          <span>Gesamt inkl. Pfand</span>
          <span className="tabular-nums">{formatEuro(done.total)}</span>
        </div>
      </div>
      <p className="mt-8 text-[0.8rem] text-muted/80">Dies ist aktuell eine Demonstrationsansicht.</p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/" variant="outline">
          Zur Startseite
        </Button>
        <Button href="/konto" arrow>
          Zum Kundenkonto
        </Button>
      </div>
      <p className="mt-8 text-[0.85rem] text-muted">
        Fragen zur Bestellung?{" "}
        <a href={site.phone.href} className="font-semibold text-ink tabular-nums">
          {site.phone.display}
        </a>
      </p>
    </motion.div>
  );
}

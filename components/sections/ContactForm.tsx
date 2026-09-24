"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Consent, Field, Select, TextArea, focusFirstError, isEmail } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/Reveal";

const subjects = ["Bitte auswählen", "Bestellung", "Frage zum Sortiment", "Firmen & Gastronomie", "Liefergebiet & Liefertermin", "Leergut", "Sonstiges"];
type S = { name: string; email: string; phone: string; subject: string; message: string; consent: boolean };
const empty: S = { name: "", email: "", phone: "", subject: "", message: "", consent: false };

/** Kontaktformular – Frontend-Prototyp mit simuliertem Versand */
export function ContactForm() {
  const [v, setV] = useState<S>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof S, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const set = (k: keyof S) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!v.name.trim()) err.name = "Bitte geben Sie Ihren Namen an.";
    if (!isEmail(v.email)) err.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
    if (!v.subject) err.subject = "Bitte wählen Sie einen Betreff.";
    if (v.message.trim().length < 5) err.message = "Bitte schreiben Sie uns eine kurze Nachricht.";
    if (!v.consent) err.consent = "Bitte bestätigen Sie die Einwilligung.";
    setErrors(err);
    if (Object.keys(err).length) return focusFirstError();
    setStatus("sending");
    setTimeout(() => setStatus("done"), 1000);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status !== "done" ? (
        <motion.form key="f" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" value={v.name} onChange={set("name")} error={errors.name} autoComplete="name" />
          <Field label="E-Mail" type="email" value={v.email} onChange={set("email")} error={errors.email} autoComplete="email" />
          <Field label="Telefon" type="tel" optional value={v.phone} onChange={set("phone")} autoComplete="tel" />
          <Select label="Betreff" options={subjects} required value={v.subject} onChange={set("subject")} error={errors.subject} />
          <TextArea label="Nachricht" value={v.message} onChange={set("message")} error={errors.message} className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <Consent checked={v.consent} onChange={(c) => setV((s) => ({ ...s, consent: c }))} error={errors.consent} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
              {status === "sending" ? (
                <span className="inline-flex items-center gap-2">
                  <motion.span className="size-4 rounded-full border-2 border-ivory/30 border-t-ivory" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
                  Wird gesendet …
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Nachricht senden <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </div>
        </motion.form>
      ) : (
        <motion.div key="d" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="rounded-[18px] border border-line bg-ivory p-8 sm:p-10">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }} className="grid size-14 place-items-center rounded-full bg-bottle text-ivory">
            <Check className="size-7" strokeWidth={2.4} />
          </motion.span>
          <h3 className="mt-7 text-[1.8rem] font-semibold tracking-[-0.03em]">Danke, {v.name.split(" ")[0]}.</h3>
          <p className="mt-3 max-w-md text-[1rem] leading-relaxed text-muted">Ihre Nachricht ist bei uns angekommen. Wir melden uns persönlich bei Ihnen.</p>
          <p className="mt-5 text-[0.78rem] text-muted/80">Hinweis: Dies ist aktuell eine Demonstrationsansicht – es wurden keine Daten übertragen.</p>
          <button type="button" onClick={() => { setV(empty); setStatus("idle"); }} className="mt-8 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-bottle hover:underline">
            <RotateCcw className="size-4" /> Neue Nachricht
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

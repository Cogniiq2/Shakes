"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Consent, Field, Select, TextArea, isEmail } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

const types = ["Bitte auswählen", "Büro / Unternehmen", "Restaurant / Gaststätte", "Café / Bar", "Hotel / Pension", "Verein / Veranstaltung", "Sonstiges"];

type State = { company: string; contact: string; email: string; phone: string; type: string; message: string; consent: boolean };
const empty: State = { company: "", contact: "", email: "", phone: "", type: "", message: "", consent: false };

/** B2B-Anfrage – reiner Frontend-Prototyp mit simuliertem Erfolg */
export function LeadForm() {
  const [v, setV] = useState<State>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof State, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  // Vorauswahl über Anker (#anfrage-gastronomie / #anfrage-unternehmen)
  useEffect(() => {
    const apply = () => {
      if (window.location.hash === "#anfrage-gastronomie") setV((s) => ({ ...s, type: "Restaurant / Gaststätte" }));
      if (window.location.hash === "#anfrage-unternehmen") setV((s) => ({ ...s, type: "Büro / Unternehmen" }));
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const set = (k: keyof State) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!v.company.trim()) err.company = "Bitte geben Sie Ihr Unternehmen an.";
    if (!v.contact.trim()) err.contact = "Bitte geben Sie einen Ansprechpartner an.";
    if (!isEmail(v.email)) err.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
    if (!v.type) err.type = "Bitte wählen Sie die Art des Betriebs.";
    if (!v.consent) err.consent = "Bitte bestätigen Sie die Einwilligung.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setStatus("sending");
    setTimeout(() => setStatus("done"), 1100);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status !== "done" ? (
          <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }} className="grid gap-5 sm:grid-cols-2">
            <Field label="Unternehmen" value={v.company} onChange={set("company")} error={errors.company} autoComplete="organization" />
            <Field label="Ansprechpartner" value={v.contact} onChange={set("contact")} error={errors.contact} autoComplete="name" />
            <Field label="E-Mail" type="email" value={v.email} onChange={set("email")} error={errors.email} autoComplete="email" />
            <Field label="Telefon" type="tel" optional value={v.phone} onChange={set("phone")} autoComplete="tel" />
            <Select label="Art des Betriebs" options={types} required value={v.type} onChange={set("type")} error={errors.type} className="sm:col-span-2" />
            <TextArea label="Nachricht" optional value={v.message} onChange={set("message")} placeholder="Welche Getränke, ungefähre Mengen, gewünschter Rhythmus …" className="sm:col-span-2" />
            <div className="sm:col-span-2">
              <Consent checked={v.consent} onChange={(c) => setV((s) => ({ ...s, consent: c }))} error={errors.consent} />
            </div>
            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
                {status === "sending" ? (
                  <span className="inline-flex items-center gap-2">
                    <motion.span className="size-4 rounded-full border-2 border-ivory/30 border-t-ivory" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
                    Wird vorbereitet …
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Anfrage vorbereiten <ArrowRight className="size-4" />
                  </span>
                )}
              </Button>
              <p className="text-[0.82rem] text-muted">
                Lieber direkt sprechen?{" "}
                <a href={site.phone.href} className="font-semibold text-ink tabular-nums link-underline">
                  {site.phone.display}
                </a>
              </p>
            </div>
          </motion.form>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="flex flex-col items-start py-6">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.15 }} className="grid size-14 place-items-center rounded-full bg-amber text-ink">
              <Check className="size-7" strokeWidth={2.4} />
            </motion.span>
            <h3 className="mt-7 text-[1.9rem] font-semibold tracking-[-0.03em]">Vielen Dank, {v.contact.split(" ")[0]}.</h3>
            <p className="mt-3 max-w-md text-[1rem] leading-relaxed text-muted">
              Ihre Anfrage für {v.company} ist vorbereitet. Wir melden uns persönlich, um Sortiment, Mengen und Lieferrhythmus mit Ihnen abzustimmen.
            </p>
            <p className="mt-5 text-[0.78rem] text-muted/80">Hinweis: Dies ist aktuell eine Demonstrationsansicht – es wurden keine Daten übertragen.</p>
            <button type="button" onClick={() => { setV(empty); setStatus("idle"); }} className="mt-8 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-bottle hover:underline">
              <RotateCcw className="size-4" /> Neue Anfrage
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { ChevronDown } from "lucide-react";
import type React from "react";
import { useId } from "react";
import { cn } from "@/lib/format";

const control =
  "w-full rounded-[10px] border bg-paper px-4 text-[0.98rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/60 focus:border-bottle/50 focus:shadow-[0_0_0_4px_rgba(16,42,35,0.07)]";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  dark?: boolean;
}

function Wrap({ id, label, error, hint, optional, className, children, dark }: BaseProps & { id: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={cn("mb-2 flex items-baseline justify-between text-[0.85rem] font-semibold", dark ? "text-ivory/85" : "text-ink/85")}>
        {label}
        {optional && <span className={cn("text-[0.75rem] font-medium", dark ? "text-ivory/45" : "text-muted")}>optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[0.8rem] font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className={cn("mt-1.5 text-[0.78rem]", dark ? "text-ivory/45" : "text-muted")}>{hint}</p>
      ) : null}
    </div>
  );
}

export function Field({ label, error, hint, optional, className, dark, ...input }: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Wrap id={id} label={label} error={error} hint={hint} optional={optional} className={className} dark={dark}>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={cn(control, "h-[52px]", error ? "border-danger/60" : "border-line")} {...input} />
    </Wrap>
  );
}

export function TextArea({ label, error, hint, optional, className, dark, ...input }: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Wrap id={id} label={label} error={error} hint={hint} optional={optional} className={className} dark={dark}>
      <textarea id={id} aria-invalid={!!error} rows={5} className={cn(control, "min-h-[140px] resize-y py-3.5 leading-relaxed", error ? "border-danger/60" : "border-line")} {...input} />
    </Wrap>
  );
}

export function Select({ label, error, hint, optional, className, dark, options, ...input }: BaseProps & React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  const id = useId();
  return (
    <Wrap id={id} label={label} error={error} hint={hint} optional={optional} className={className} dark={dark}>
      <div className="relative">
        <select id={id} aria-invalid={!!error} className={cn(control, "h-[52px] cursor-pointer appearance-none pr-10", error ? "border-danger/60" : "border-line")} {...input}>
          {options.map((o) => (
            <option key={o} value={o === options[0] && input.required ? "" : o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
      </div>
    </Wrap>
  );
}

export function Consent({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer gap-3 text-[0.85rem] leading-relaxed text-muted">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 size-[18px] shrink-0 cursor-pointer accent-[#102A23]" />
        <span>
          Ich bin einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden. Details in der{" "}
          <a href="/datenschutz" className="font-semibold text-ink underline underline-offset-2">
            Datenschutzerklärung
          </a>
          .
        </span>
      </label>
      {error && <p className="mt-1.5 text-[0.8rem] font-medium text-danger">{error}</p>}
    </div>
  );
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

import type React from "react";
import { Breadcrumb } from "./Shared";
import { Eyebrow } from "@/components/ui/SectionHeading";

export function LegalLayout({ title, eyebrow, children, note }: { title: string; eyebrow: string; children: React.ReactNode; note?: React.ReactNode }) {
  return (
    <section className="pb-28 pt-[104px] lg:pt-[128px]">
      <div className="container-x">
        <Breadcrumb items={[{ label: title }]} />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <header className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h1 className="display-2 mt-6">{title}</h1>
              {note && <div className="mt-8 rounded-[12px] border border-amber/30 bg-amber-soft/40 p-4 text-[0.82rem] leading-relaxed text-ink/75">{note}</div>}
            </div>
          </header>
          <div className="legal max-w-[46rem] lg:col-span-7 lg:col-start-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

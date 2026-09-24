"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { Clock, MapPin, Phone, Recycle } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Bottle } from "@/components/visual/Bottle";
import { getProduct } from "@/data/products";
import { site } from "@/lib/site";
import { EASE } from "@/components/ui/Reveal";

const trust = [
  { icon: Clock, label: "1–2 Werktage" },
  { icon: Recycle, label: "Leergut-Rücknahme" },
  { icon: MapPin, label: "Bayreuth & Umgebung" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-[92px] lg:pt-[104px]">
      <div className="container-x grid items-center gap-10 pb-14 lg:grid-cols-12 lg:gap-8 lg:pb-20">
        <div className="relative z-10 lg:col-span-6 xl:col-span-6">
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.05 }} className="eyebrow inline-flex items-center gap-3 text-amber-deep">
            <span aria-hidden className="h-px w-6 bg-amber-deep/60" />
            Getränkeheimdienst Bayreuth
          </motion.p>
          <h1 className="display-1 mt-6 text-ink">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.95, ease: EASE, delay: 0.1 }}>
                Gute Getränke.
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <motion.span className="serif-accent block text-bottle" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.95, ease: EASE, delay: 0.2 }}>
                Direkt zu Ihnen.
              </motion.span>
            </span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.38 }} className="lede mt-7 max-w-[34rem] text-muted">
            Schake&rsquo;s Bier bringt Mineralwasser, regionale Biere, Erfrischungsgetränke, Wein und vieles mehr zuverlässig zu Ihnen nach Hause, ins Büro oder in die Gastronomie – in Bayreuth und Umgebung.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.48 }} className="mt-9 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
            <Button href="/sortiment" size="lg" arrow magnetic className="w-full sm:w-auto">
              Sortiment entdecken
            </Button>
            <Button href="/liefergebiet" size="lg" variant="outline" className="w-full sm:w-auto">
              Liefergebiet prüfen
            </Button>
          </motion.div>
          <motion.a
            href={site.phone.href}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="group mt-6 inline-flex items-center gap-2.5 text-[0.92rem] text-muted transition-colors hover:text-ink"
          >
            <span className="grid size-8 place-items-center rounded-full bg-stone text-bottle transition-colors group-hover:bg-bottle group-hover:text-ivory">
              <Phone className="size-3.5" strokeWidth={2} />
            </span>
            Lieber persönlich? <span className="font-semibold tabular-nums text-ink link-underline">{site.phone.display}</span>
          </motion.a>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.8 } } }}
            className="mt-10 grid grid-cols-3 gap-2 border-t border-line pt-6 sm:max-w-lg sm:gap-6"
          >
            {trust.map(({ icon: Icon, label }) => (
              <motion.li key={label} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
                <Icon className="size-[18px] shrink-0 text-amber-deep" strokeWidth={1.7} />
                <span className="text-[0.8rem] font-semibold leading-tight sm:text-[0.86rem]">{label}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="relative lg:col-span-6 xl:col-span-6">
          <HeroComposition />
        </div>
      </div>
    </section>
  );
}

/* ——— Signatur-Komposition: Flaschen in drei Tiefenebenen mit Pointer- und Scroll-Parallax ——— */

const LAYERS = [
  // depth: Stärke der Bewegung; x/bottom in % der Bühne; h: Höhe in % der Bühne
  { slug: "plose-naturale", x: 12, h: 60, depth: 0.35, delay: 0.55, blur: true },
  { slug: "maisels-weisse-original", x: 30, h: 70, depth: 0.6, delay: 0.45 },
  { slug: "bayreuther-hell", x: 50, h: 64, depth: 1, delay: 0.35, hero: true },
  { slug: "adelholzener-classic", x: 70, h: 70, depth: 0.7, delay: 0.5 },
  { slug: "spezi-original", x: 87, h: 57, depth: 0.4, delay: 0.6, blur: true },
];

function HeroComposition() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.8 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
      className="grain relative aspect-[4/4.1] w-full overflow-hidden rounded-[20px] bg-bottle sm:aspect-[4/3.6] lg:aspect-[4/4.6] xl:aspect-[4/4.3]"
    >
      {/* Licht */}
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(55% 45% at 52% 42%, rgba(200,138,56,0.42), transparent 70%), radial-gradient(90% 60% at 50% 110%, rgba(0,0,0,0.45), transparent 60%)" }} />
      <motion.div aria-hidden style={{ x: useTransform(sx, (v) => v * -18), y: useTransform(sy, (v) => v * -12) }} className="absolute left-1/2 top-[36%] size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/25 blur-[80px]" />

      {/* Hintergrund-Typografie */}
      <motion.p
        aria-hidden
        style={{ x: useTransform(sx, (v) => v * -10), y: scrollY }}
        className="absolute inset-x-0 top-[7%] select-none text-center font-serif text-[clamp(4.5rem,15vw,11.5rem)] italic leading-none tracking-[-0.03em] text-ivory/[0.07]"
      >
        Bayreuth
      </motion.p>

      {/* Tisch / Standfläche */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-[#0c211b] to-[#081712]" />
      <div aria-hidden className="absolute inset-x-0 bottom-[22%] h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent" />

      {/* Flaschen */}
      {LAYERS.map((l) => (
        <HeroBottle key={l.slug} layer={l} sx={sx} sy={sy} reduce={!!reduce} />
      ))}

      {/* Detail-Notizen */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}
        className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6"
      >
        <div className="rounded-[12px] border border-ivory/10 bg-ink/35 px-4 py-3 text-ivory backdrop-blur-md">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-amber">Leergut?</p>
          <p className="mt-1 font-serif text-[1.15rem] italic leading-tight sm:text-[1.3rem]">Nehmen wir gerne mit.</p>
        </div>
        <div className="hidden rounded-[12px] border border-ivory/10 bg-ink/35 px-4 py-3 text-right text-ivory backdrop-blur-md xs:block">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-ivory/55">Unabhängig</p>
          <p className="mt-1 text-[0.86rem] font-semibold leading-tight">Viele Hersteller.<br />Eine Lieferung.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeroBottle({ layer, sx, sy, reduce }: { layer: (typeof LAYERS)[number]; sx: MotionValue<number>; sy: MotionValue<number>; reduce: boolean }) {
  const p = getProduct(layer.slug)!;
  const x = useTransform(sx, (v) => v * 26 * layer.depth);
  const y = useTransform(sy, (v) => v * 14 * layer.depth);
  return (
    <div className="absolute bottom-[19%] -translate-x-1/2" style={{ left: `${layer.x}%`, height: `${layer.h}%`, zIndex: Math.round(layer.depth * 10) }}>
      <motion.div className="h-full" style={{ x, y }}>
      <motion.div
        className="h-full"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: layer.delay }}
      >
        <Bottle
          visual={p.visual}
          id={`hero-${p.slug}`}
          brand={p.brand}
          title={p.variety}
          className={layer.blur ? "h-full w-auto opacity-90 blur-[1.2px]" : "h-full w-auto drop-shadow-[0_30px_30px_rgba(0,0,0,0.35)]"}
        />
      </motion.div>
      </motion.div>
    </div>
  );
}

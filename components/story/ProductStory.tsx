"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { storyStops, type StoryStop } from "./storyData";
import { Bottle } from "@/components/visual/Bottle";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { EASE } from "@/components/ui/Reveal";
import { cn, formatEuro } from "@/lib/format";

const StoryCanvas = dynamic(() => import("./StoryCanvas"), { ssr: false });

const N = storyStops.length;

/** Treppenfunktion: Haltephasen pro Produkt, weiche Übergänge dazwischen */
function stair(p: number): number {
  const u = Math.min(Math.max(p, 0), 1) * (N - 1);
  const i = Math.min(Math.floor(u), N - 2);
  const local = u - i;
  const t = Math.min(Math.max((local - 0.28) / 0.44, 0), 1);
  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  return i + eased;
}

function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const set = () => setMatch(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, [query]);
  return match;
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function ProductStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const desktop = useMedia("(min-width: 1024px)");
  const layout = desktop ? "desktop" : "mobile";

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, stair);
  const f = useSpring(raw, { stiffness: 64, damping: 17, mass: 0.9, restDelta: 0.0005 });

  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  useMotionValueEvent(f, "change", (v) => {
    const next = Math.min(N - 1, Math.max(0, Math.round(v)));
    setActive((prev) => {
      if (prev !== next) setDir(next > prev ? 1 : -1);
      return next;
    });
  });

  // Lazy: Canvas erst laden, wenn die Sektion in die Nähe kommt
  const near = useInView(sectionRef, { margin: "100% 0px 100% 0px" });
  const onScreen = useInView(sectionRef, { margin: "0px 0px 0px 0px" });
  const stageSeen = useInView(stageRef, { once: true, amount: 0.45 });
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setWebgl(hasWebGL()), []);
  useEffect(() => {
    if (near) setMounted(true);
  }, [near]);

  // Kino-Einstieg: Licht, Flasche steigt auf, Rotation setzt sich
  const entered = useRef(0);
  const enterMv = useMotionValue(0);
  useEffect(() => {
    if (!stageSeen) return;
    const ctrl = animate(enterMv, 1, { duration: reduce ? 0.4 : 1.25, ease: EASE });
    const unsub = enterMv.on("change", (v) => (entered.current = v));
    return () => {
      ctrl.stop();
      unsub();
    };
  }, [stageSeen, enterMv, reduce]);

  // Pointer / Drag
  const pointer = useRef({ x: 0, y: 0, drag: 0 });
  const dragging = useRef<{ x: number; start: number } | null>(null);
  const onPointerMove = (e: React.PointerEvent) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    if (e.pointerType === "mouse") {
      pointer.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.current.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }
    if (dragging.current) {
      const delta = (e.clientX - dragging.current.x) / r.width;
      pointer.current.drag = Math.max(-0.5, Math.min(0.5, dragging.current.start + delta * 2.4));
    }
  };
  const endDrag = () => {
    dragging.current = null;
    pointer.current.drag = 0;
  };

  // Lichtstimmung
  const idx = storyStops.map((_, i) => i);
  const bg = useTransform(f, idx, storyStops.map((s) => s.env.bg));
  const glow = useTransform(f, idx, storyStops.map((s) => s.env.glow));
  const rim = useTransform(f, idx, storyStops.map((s) => s.env.rim));
  const background = useMotionTemplate`radial-gradient(46% 52% at ${desktop ? "40%" : "50%"} ${desktop ? "52%" : "38%"}, color-mix(in srgb, ${glow} 55%, transparent), transparent 72%), radial-gradient(30% 40% at ${desktop ? "40%" : "50%"} ${desktop ? "30%" : "22%"}, color-mix(in srgb, ${rim} 18%, transparent), transparent 70%), ${bg}`;
  const trackX = useTransform(f, [0, N - 1], ["0%", `${(100 * (N - 1)) / N}%`]);

  const stop = storyStops[active];
  const showPoster = webgl === false || !canvasReady;

  return (
    <section ref={sectionRef} aria-label="Ausgewählt für Bayreuth" className="relative h-[520svh] bg-bottle lg:h-[560vh]">
      <motion.div
        ref={stageRef}
        style={{ background }}
        className="grain sticky top-0 h-[100svh] overflow-hidden text-ivory"
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          pointer.current.x = 0;
          pointer.current.y = 0;
          endDrag();
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* Ebene 1 – Hintergrund-Typografie (0,7×) */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {storyStops.map((s, i) => (
            <BackgroundWord key={s.word} word={s.word} index={i} f={f} desktop={desktop} />
          ))}
        </div>

        {/* Ebene 2 – Linien & Metadaten (0,85×) */}
        <Midground f={f} desktop={desktop} />

        {/* Ebene 3 – 3D-Flaschen */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: stageSeen ? 1 : 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="absolute inset-x-0 bottom-[34%] top-[12%] touch-pan-y lg:inset-y-0 lg:bottom-0 lg:top-0"
          style={{ maskImage: "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)" }}
          onPointerDown={(e) => {
            dragging.current = { x: e.clientX, start: pointer.current.drag };
          }}
        >
          {/* Poster / Fallback: nie eine leere Fläche */}
          <div className={cn("absolute inset-0 transition-opacity duration-700", showPoster ? "opacity-100" : "opacity-0")}>
            {storyStops.map((s, i) => (
              <PosterBottle key={s.product.slug} stop={s} index={i} f={f} desktop={desktop} />
            ))}
          </div>
          {mounted && webgl && (
            <StoryCanvas
              stops={storyStops}
              progress={f}
              pointer={pointer}
              entered={entered}
              layout={layout}
              reducedMotion={reduce}
              active={onScreen}
              onReady={() => setCanvasReady(true)}
            />
          )}
        </motion.div>

        {/* Kopfzeile: Titel (mobil oben, Desktop unten links) + Fortschritt */}
        <div className="pointer-events-none absolute inset-x-0 top-0 pt-[84px] lg:pt-[104px]">
          <div className="container-x flex items-start justify-between gap-6">
            <motion.div className="max-w-[26rem]" initial={{ opacity: 0, y: 14 }} animate={stageSeen ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}>
              <StoryTitle />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={stageSeen ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="w-[92px] shrink-0 pt-1 sm:w-[180px]" aria-hidden>
              <div className="flex items-baseline justify-end gap-2 tabular-nums">
                <span className="relative inline-block h-[1.4em] overflow-hidden text-[1.05rem] font-semibold">
                  <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                    <motion.span
                      key={active}
                      custom={dir}
                      initial={{ y: dir > 0 ? "100%" : "-100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: dir > 0 ? "-100%" : "100%" }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="block"
                    >
                      {String(active + 1).padStart(2, "0")}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="text-[0.85rem] text-ivory/45">— {String(N).padStart(2, "0")}</span>
              </div>
              <div className="relative mt-3 h-px w-full bg-ivory/15">
                <motion.span style={{ left: trackX, width: `${100 / N}%` }} className="absolute -top-px h-[3px] rounded-full bg-amber" />
              </div>
            </motion.div>
          </div>
        </div>
        {/* Produkttext */}
        <div className="absolute inset-x-0 bottom-0 top-auto lg:inset-y-0 lg:left-[54%] lg:right-0 lg:flex lg:items-center">
          <div className="container-x lg:max-w-[40rem] lg:px-0 lg:pr-[clamp(20px,4.2vw,56px)]">
            <div className="grid pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pb-0">
              <AnimatePresence initial={false} custom={dir}>
                <StoryCopy key={stop.product.slug} stop={stop} dir={dir} visible={stageSeen} last={active === N - 1} />
              </AnimatePresence>
            </div>
          </div>
        </div>

      </motion.div>
    </section>
  );
}

function StoryTitle() {
  return (
    <div>
      <p className="eyebrow inline-flex items-center gap-3 text-amber">
        <span aria-hidden className="h-px w-6 bg-amber/70" />
        Die Auswahl
      </p>
      <h2 className="mt-3 text-[1.35rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.6rem] lg:text-[1.9rem]">
        Ausgewählt für <span className="font-serif text-[1.12em] font-normal italic">Bayreuth.</span>
      </h2>
      <p className="mt-2 hidden max-w-sm text-[0.92rem] leading-relaxed text-ivory/60 md:block">Regionale Klassiker und bekannte Marken – unabhängig zusammengestellt.</p>
    </div>
  );
}

function splitName(name: string): [string, string | null] {
  const map: Record<string, [string, string | null]> = {
    "Bayreuther Hell": ["Bayreuther", "Hell"],
    "Adelholzener Naturell": ["Adelholzener", "Naturell"],
    "Maisel's Weisse Original": ["Maisel's Weisse", "Original"],
    "Fritz-Kola": ["Fritz-Kola", null],
    "Spezi Original": ["Spezi", "Original"],
  };
  return map[name] ?? [name, null];
}

function StoryCopy({ stop, dir, visible, last }: { stop: StoryStop; dir: number; visible: boolean; last: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const p = stop.product;
  const [l1, l2] = splitName(p.name);
  const item = (i: number) => ({
    initial: { opacity: 0, x: dir * 36 },
    animate: visible ? { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE, delay: 0.22 + i * 0.06 } } : { opacity: 0 },
    exit: { opacity: 0, x: dir * -28, transition: { duration: 0.28, ease: EASE, delay: i * 0.02 } },
  });

  return (
    <motion.div className="relative col-start-1 row-start-1 self-end lg:self-center">
      <motion.p {...item(0)} className="eyebrow text-amber">
        {stop.kicker}
      </motion.p>
      <motion.p {...item(1)} className="mt-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-ivory/50 lg:mt-5">
        {p.brand}
      </motion.p>
      <motion.h3 {...item(2)} className="mt-1.5 text-[2.35rem] font-semibold leading-[0.95] tracking-[-0.04em] sm:text-[3rem] lg:mt-3 lg:text-[clamp(3.4rem,5.4vw,5.6rem)]">
        {l1}
        {l2 && <span className="serif-accent block text-ivory/90">{l2}</span>}
      </motion.h3>
      <motion.p {...item(3)} className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-ivory/70 lg:mt-6 lg:text-[1.1rem]">
        {stop.line}
      </motion.p>
      <motion.div {...item(4)} className="mt-4 flex items-end gap-6 lg:mt-8">
        {p.price !== null ? (
          <div>
            <p className="text-[1.6rem] font-semibold leading-none tracking-[-0.03em] tabular-nums lg:text-[2.1rem]">{formatEuro(p.price)}</p>
            <p className="mt-1.5 text-[0.8rem] text-ivory/55 tabular-nums">zzgl. {formatEuro(p.deposit ?? 0)} Pfand</p>
          </div>
        ) : (
          <p className="text-lg font-semibold">Preis auf Anfrage</p>
        )}
        <ul className="hidden flex-wrap gap-x-3 gap-y-1 pb-1 text-[0.78rem] text-ivory/55 sm:flex">
          {stop.meta.map((m, i) => (
            <li key={m} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="size-[3px] rounded-full bg-ivory/30" />}
              {m}
            </li>
          ))}
        </ul>
      </motion.div>
      <motion.div {...item(5)} className="mt-5 flex items-center gap-2.5 lg:mt-9">
        <Button href={`/sortiment/${p.slug}`} variant="light" arrow className="pointer-events-auto flex-1 sm:flex-none">
          Produkt ansehen
        </Button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            add(p.slug, 1);
            setAdded(true);
            setTimeout(() => setAdded(false), 1400);
          }}
          aria-label={`${p.name} in den Warenkorb`}
          className={cn("pointer-events-auto grid size-12 shrink-0 place-items-center rounded-[10px] border transition-colors", added ? "border-amber bg-amber text-ink" : "border-ivory/25 text-ivory hover:border-ivory/60")}
        >
          {added ? <Check className="size-[18px]" strokeWidth={2.6} /> : <Plus className="size-[18px]" strokeWidth={2} />}
        </motion.button>
      </motion.div>
      {last && (
        <motion.div {...item(6)} className="mt-4 lg:mt-6">
          <Link href="/sortiment" className="pointer-events-auto group inline-flex items-center gap-2 text-[0.92rem] font-semibold text-amber">
            <span className="link-underline">Gesamtes Sortiment entdecken</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}

function BackgroundWord({ word, index, f, desktop }: { word: string; index: number; f: MotionValue<number>; desktop: boolean }) {
  const x = useTransform(f, (v) => `${((index - v) * (desktop ? 38 : 60)).toFixed(2)}vw`);
  const opacity = useTransform(f, (v) => Math.max(0, 1 - Math.abs(index - v) * 1.3));
  return (
    <motion.p
      style={{ x, opacity }}
      className="absolute left-0 right-0 top-[20%] select-none whitespace-nowrap text-center font-serif text-[34vw] italic leading-none tracking-[-0.04em] text-ivory/[0.055] lg:top-[16%] lg:text-[min(21vw,24rem)] lg:pr-[22%]"
    >
      {word}
    </motion.p>
  );
}

function Midground({ f, desktop }: { f: MotionValue<number>; desktop: boolean }) {
  const rot = useTransform(f, (v) => v * 18);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <motion.div
        style={{ rotate: rot }}
        className={cn(
          "absolute aspect-square rounded-full border border-ivory/[0.07]",
          desktop ? "left-[40%] top-[52%] h-[70vh] -translate-x-1/2 -translate-y-1/2" : "left-1/2 top-[38%] w-[118vw] -translate-x-1/2 -translate-y-1/2",
        )}
      >
        <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/70" />
      </motion.div>
      <div className={cn("absolute bg-ivory/[0.06]", desktop ? "bottom-[16.5%] left-0 right-[46%] h-px" : "left-0 right-0 top-[61%] h-px")} />
    </div>
  );
}

/** SVG-Poster: identische Choreografie, bis WebGL bereit ist (oder als Fallback) */
function PosterBottle({ stop, index, f, desktop }: { stop: StoryStop; index: number; f: MotionValue<number>; desktop: boolean }) {
  const x = useTransform(f, (v) => {
    const d = index - v;
    const eased = Math.sign(d) * Math.pow(Math.abs(d), 1.25);
    return `${(eased * (desktop ? 36 : 62)).toFixed(2)}vw`;
  });
  const scale = useTransform(f, (v) => +(1 - Math.min(Math.abs(index - v), 1) * 0.26).toFixed(3));
  const rotate = useTransform(f, (v) => +((index - v) * 4).toFixed(2));
  const opacity = useTransform(f, (v) => (Math.abs(index - v) < 1.4 ? 1 : 0));
  const p = stop.product;
  return (
    <div className={cn("absolute flex -translate-x-1/2 justify-center", desktop ? "bottom-[16%] left-[40%] h-[60%]" : "bottom-[4%] left-1/2 h-[70%]")}>
      <motion.div style={{ x, scale, rotate, opacity }} className="flex h-full origin-bottom justify-center">
        <Bottle visual={p.visual} id={`poster-${p.slug}`} brand={p.brand} title={p.variety} className="h-full w-auto drop-shadow-[0_40px_40px_rgba(0,0,0,0.45)]" />
      </motion.div>
    </div>
  );
}

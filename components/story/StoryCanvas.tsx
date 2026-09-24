"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { StoryStop } from "./storyData";
import { bottleGeometry, dimsFor, labelTexture, liquidGeometry, LABEL_THETA, type BottleDims } from "./bottleGeometry";

export type Quality = "high" | "medium" | "low";

export interface StoryCanvasProps {
  stops: StoryStop[];
  progress: MotionValue<number>;
  pointer: React.RefObject<{ x: number; y: number; drag: number }>;
  entered: React.RefObject<number>;
  layout: "desktop" | "mobile";
  reducedMotion: boolean;
  active: boolean;
  onReady: () => void;
}

export default function StoryCanvas({ stops, progress, pointer, entered, layout, reducedMotion, active, onReady }: StoryCanvasProps) {
  const [quality, setQuality] = useState<Quality>(() => {
    // ?story=low|medium|high erzwingt eine Qualitätsstufe (Präsentation / Tests)
    const forced = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("story") : null;
    if (forced === "low" || forced === "medium" || forced === "high") return forced;
    return layout === "mobile" ? "medium" : "high";
  });
  const [dpr, setDpr] = useState(() => (quality === "low" ? 1 : layout === "mobile" ? 1.35 : 1.6));

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      camera={{ fov: 28, position: [0, 1.45, 9.6], near: 0.1, far: 40 }}
      onCreated={({ camera }) => {
        camera.lookAt(0, 1.3, 0);
        requestAnimationFrame(() => onReady());
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <PerformanceMonitor
        onDecline={() => {
          setDpr((d) => Math.max(1, d - 0.25));
          setQuality((q) => (q === "high" ? "medium" : "low"));
        }}
        flipflops={2}
        onFallback={() => setQuality("low")}
      />
      <Studio quality={quality} />
      <Rig layout={layout} />
      {stops.map((s, i) => (
        <StoryBottle key={s.product.slug} stop={s} index={i} progress={progress} pointer={pointer} entered={entered} layout={layout} quality={quality} reducedMotion={reducedMotion} />
      ))}
      <ContactShadows position={[0, 0, 0]} scale={14} far={3} blur={2.6} opacity={0.55} resolution={quality === "high" ? 512 : 256} color="#000000" />
    </Canvas>
  );
}

/** Kamera-Framing je Layout */
function Rig({ layout }: { layout: "desktop" | "mobile" }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (layout === "mobile") {
      cam.position.set(0, 1.42, 6.9);
      cam.fov = 30;
      cam.lookAt(0, 1.3, 0);
    } else {
      cam.position.set(0, 1.45, 9.6);
      cam.fov = 26;
      cam.lookAt(0, 1.32, 0);
    }
    cam.updateProjectionMatrix();
  }, [camera, layout, size]);
  return null;
}

/** Studio-Licht: Softboxen als Lightformer – kein externes HDR nötig */
function Studio({ quality }: { quality: Quality }) {
  return (
    <>
      <ambientLight intensity={0.28} />
      <directionalLight position={[-3, 6, 4]} intensity={1.4} color="#fff6e8" />
      <pointLight position={[0, 1.8, -2.4]} intensity={9} distance={8} color="#f2c27a" />
      <Environment resolution={quality === "low" ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={3.2} position={[-3.2, 2, 3]} rotation={[0, Math.PI / 3.2, 0]} scale={[1.1, 7, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.2} position={[3.4, 2, 2.4]} rotation={[0, -Math.PI / 3, 0]} scale={[0.7, 7, 1]} color="#fff3e2" />
        <Lightformer form="rect" intensity={1.4} position={[0, 6, 1]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={0.9} position={[0, 1.5, -5]} scale={[10, 3, 1]} color="#c88a38" />
      </Environment>
    </>
  );
}

function useFonts() {
  return useMemo(() => {
    if (typeof window === "undefined") return { sans: "sans-serif", serif: "serif" };
    const cs = getComputedStyle(document.body);
    return {
      sans: cs.getPropertyValue("--font-manrope").trim() || "sans-serif",
      serif: cs.getPropertyValue("--font-instrument").trim() || "serif",
    };
  }, []);
}

const damp = THREE.MathUtils.damp;
export const ANCHOR = 0.4;

function StoryBottle({
  stop,
  index,
  progress,
  pointer,
  entered,
  layout,
  quality,
  reducedMotion,
}: {
  stop: StoryStop;
  index: number;
  progress: MotionValue<number>;
  pointer: StoryCanvasProps["pointer"];
  entered: StoryCanvasProps["entered"];
  layout: "desktop" | "mobile";
  quality: Quality;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const product = stop.product;
  const d: BottleDims = useMemo(() => dimsFor(product), [product]);
  const segments = quality === "low" ? 64 : 112;
  const glassGeo = useMemo(() => bottleGeometry(d, segments), [d, segments]);
  const clear = product.visual.glass === "clear";
  const hasLiquid = clear && product.category !== "wasser";
  const liquidGeo = useMemo(() => (hasLiquid ? liquidGeometry(d, segments) : null), [d, segments, hasLiquid]);
  const fonts = useFonts();
  const [labelMap, setLabelMap] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let tex: THREE.CanvasTexture | null = null;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      tex = labelTexture(product, d, fonts);
      setLabelMap(tex);
    });
    return () => {
      cancelled = true;
      tex?.dispose();
    };
  }, [product, d, fonts]);

  useEffect(() => () => glassGeo.dispose(), [glassGeo]);
  useEffect(() => () => liquidGeo?.dispose(), [liquidGeo]);

  /**
   * Glas ohne Transmission-Pass: Der Canvas ist transparent über dem CSS-Hintergrund,
   * Transmission könnte diesen nicht „sehen“. Klarglas wird daher als zweischichtiges,
   * transparentes Material mit starken Umgebungsreflexen umgesetzt – realistischer und
   * deutlich performanter (kein zusätzlicher Render-Pass, auch auf Mobilgeräten).
   */
  const glass = useMemo(() => {
    const env = quality === "low" ? 1.6 : 2.1;
    if (clear) {
      return {
        front: { color: "#f4fbf9", roughness: 0.03, metalness: 0, transparent: true, opacity: 0.2, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: env * 1.25, depthWrite: false, side: THREE.FrontSide },
        back: { color: "#cfe3de", roughness: 0.08, metalness: 0, transparent: true, opacity: 0.22, envMapIntensity: env * 0.6, depthWrite: false, side: THREE.BackSide },
      };
    }
    const base = new THREE.Color(product.visual.glass);
    return {
      front: {
        color: base.clone().lerp(new THREE.Color("#b06a2a"), 0.18),
        emissive: base.clone().multiplyScalar(0.42),
        roughness: 0.09,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        sheen: 0.4,
        sheenColor: new THREE.Color("#e8a45a"),
        envMapIntensity: env,
        side: THREE.FrontSide,
      },
      back: null,
    };
  }, [quality, clear, product.visual.glass]);

  const cap = product.visual.shape === "water" || product.visual.shape === "juice" ? "screw" : "crown";

  // Animationszustand (ohne React-Re-Renders)
  const state = useRef({ rx: 0, ry: 0, drag: 0 });

  const viewport = useThree((st) => st.viewport);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    const inn = inner.current;
    if (!g || !inn) return;
    const f = progress.get();
    const dist = index - f; // <0: bereits vorbei (links), >0: kommt (rechts)
    const ad = Math.abs(dist);
    const visible = ad < 1.45;
    g.visible = visible;
    if (!visible) return;

    const enter = entered.current ?? 1;
    const mobile = layout === "mobile";
    // Desktop: Flasche bei 40 % der Breite, rechts davon die Typografie
    const anchorX = mobile ? 0 : viewport.width * (ANCHOR - 0.5);

    if (reducedMotion) {
      // Kein seitlicher Flug: dezentes Überblenden über Skalierung
      const s = THREE.MathUtils.clamp(1 - ad * 1.6, 0, 1);
      g.position.set(anchorX, 0, 0);
      g.scale.setScalar(Math.max(0.0001, 0.92 + 0.08 * s) * (s > 0.02 ? 1 : 0.0001));
      g.rotation.set(0, 0, 0);
    } else {
      // Nicht-linearer Pfad: raus nach links beschleunigt, rein von rechts gebremst
      const sign = Math.sign(dist);
      const eased = sign * Math.pow(ad, 1.25);
      const spread = mobile ? 3.6 : 5.8;
      const x = anchorX + eased * spread;
      const y = (mobile ? -0.25 : -0.1) * Math.min(ad, 1) + (1 - enter) * -0.7;
      const z = -Math.min(ad, 1.2) * 1.3;
      const s = 1 - Math.min(ad, 1) * 0.26;
      g.position.set(x, y, z);
      g.scale.setScalar(s);
      // leichte Drehung während des Wechsels (≈ 10–14°)
      g.rotation.y = dist * 0.24 + (1 - enter) * 0.14;
      g.rotation.z = -dist * 0.07;
    }

    // Pointer-Parallax + sanftes Schweben nur für die aktive Flasche
    const focus = Math.max(0, 1 - ad * 2);
    const p = pointer.current ?? { x: 0, y: 0, drag: 0 };
    const targetRy = focus * (p.x * 0.09 + p.drag);
    const targetRx = focus * (p.y * 0.05);
    state.current.ry = damp(state.current.ry, targetRy, 4, dt);
    state.current.rx = damp(state.current.rx, targetRx, 4, dt);
    inn.rotation.y = state.current.ry;
    inn.rotation.x = state.current.rx;
    inn.position.y = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.7 + index) * 0.022 * focus;
  });

  const labelArgs: [number, number, number, number, number, boolean, number, number] = [d.r * 1.008, d.r * 1.008, d.label.h, segments, 1, true, -LABEL_THETA / 2, LABEL_THETA];
  const neckFoil = product.visual.shape === "euro" || product.visual.shape === "longneck" || product.visual.shape === "weizen";

  return (
    <group ref={group} visible={false}>
      <group ref={inner}>
        {liquidGeo && (
          <mesh geometry={liquidGeo} renderOrder={0}>
            <meshPhysicalMaterial color={product.visual.liquid ?? "#3a1a0a"} emissive={new THREE.Color(product.visual.liquid ?? "#3a1a0a").multiplyScalar(0.25)} roughness={0.2} clearcoat={0.3} envMapIntensity={0.5} />
          </mesh>
        )}
        {glass.back && (
          <mesh geometry={glassGeo} renderOrder={1}>
            <meshPhysicalMaterial {...glass.back} />
          </mesh>
        )}
        <mesh geometry={glassGeo} renderOrder={2}>
          <meshPhysicalMaterial {...glass.front} />
        </mesh>
        {/* Etikett */}
        {labelMap && (
          <mesh position={[0, d.label.y, 0]} renderOrder={3}>
            <cylinderGeometry args={labelArgs} />
            <meshPhysicalMaterial map={labelMap} roughness={0.55} clearcoat={0.25} clearcoatRoughness={0.4} side={THREE.FrontSide} envMapIntensity={0.7} />
          </mesh>
        )}
        {/* Halsschleife */}
        {neckFoil && (
          <mesh position={[0, d.hShoulder + 0.12, 0]}>
            <cylinderGeometry args={[d.nr * 1.03, d.nr * 1.07, 0.26, segments, 1, true]} />
            <meshPhysicalMaterial color={product.visual.label} roughness={0.35} metalness={0.25} clearcoat={0.6} />
          </mesh>
        )}
        {/* Verschluss */}
        {cap === "crown" ? (
          <mesh position={[0, d.hNeck + 0.035, 0]}>
            <cylinderGeometry args={[d.nr * 1.16, d.nr * 1.2, 0.09, 48]} />
            <meshStandardMaterial color={product.visual.cap} metalness={0.75} roughness={0.28} envMapIntensity={1.2} />
          </mesh>
        ) : (
          <mesh position={[0, d.hNeck + 0.06, 0]}>
            <cylinderGeometry args={[d.nr * 1.1, d.nr * 1.1, 0.16, 48]} />
            <meshStandardMaterial color={product.visual.cap} metalness={0.15} roughness={0.42} />
          </mesh>
        )}
      </group>
    </group>
  );
}

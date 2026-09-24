import * as THREE from "three";
import { SHAPES, labelText, type ShapeSpec } from "@/components/visual/Bottle";
import type { Product } from "@/data/products";
import { formatPack } from "@/lib/format";

/**
 * Prozedurale Flaschengeometrie.
 * Die Proportionen stammen aus derselben Spezifikation wie die SVG-Illustrationen,
 * damit 2D- und 3D-Darstellung konsistent bleiben.
 *
 * OFFIZIELLE ASSETS: Sobald echte Produktmodelle (.glb, Draco-komprimiert) vorliegen,
 * können diese hier anstelle der Lathe-Geometrie geladen werden (useGLTF).
 */

const K = 0.01; // SVG-Einheit → Welt-Einheit

export interface BottleDims {
  spec: ShapeSpec;
  r: number;
  nr: number;
  hBody: number;
  hShoulder: number;
  hNeck: number;
  label: { y: number; h: number };
}

export function dimsFor(product: Product): BottleDims {
  const shape = product.visual.shape;
  const spec = SHAPES[(shape === "bocksbeutel" || shape === "pet" ? "water" : shape) as keyof typeof SHAPES];
  return {
    spec,
    r: (spec.bodyW / 2) * K,
    nr: (spec.neckW / 2) * K,
    hBody: (300 - spec.bodyTop) * K,
    hShoulder: (300 - spec.shoulderTop) * K,
    hNeck: (300 - spec.neckTop) * K,
    label: { y: (300 - (spec.labelY + spec.labelH / 2)) * K, h: spec.labelH * K },
  };
}

function cubic(p0: THREE.Vector2, p1: THREE.Vector2, p2: THREE.Vector2, p3: THREE.Vector2, steps: number): THREE.Vector2[] {
  const curve = new THREE.CubicBezierCurve(p0, p1, p2, p3);
  return curve.getPoints(steps).slice(1);
}

export function profile(d: BottleDims, scale = 1, fillTo?: number): THREE.Vector2[] {
  const r = d.r * scale;
  const nr = d.nr * scale;
  const pts: THREE.Vector2[] = [];
  const base = 0.012 * (2 - scale);
  pts.push(new THREE.Vector2(0.0005, base + 0.018));
  pts.push(new THREE.Vector2(r * 0.55, base + 0.012)); // leichte Bodenwölbung
  pts.push(new THREE.Vector2(r * 0.86, base));
  pts.push(...cubic(new THREE.Vector2(r * 0.86, base), new THREE.Vector2(r * 0.97, base), new THREE.Vector2(r, base + 0.02), new THREE.Vector2(r, base + 0.06), 8));
  // Körper in mehreren Stützpunkten für saubere Normalen
  const bodySteps = 6;
  for (let i = 1; i <= bodySteps; i++) pts.push(new THREE.Vector2(r, base + 0.06 + ((d.hBody - base - 0.06) * i) / bodySteps));
  const dH = d.hShoulder - d.hBody;
  pts.push(
    ...cubic(
      new THREE.Vector2(r, d.hBody),
      new THREE.Vector2(r, d.hBody + dH * 0.6),
      new THREE.Vector2(nr, d.hBody + dH * 0.45),
      new THREE.Vector2(nr, d.hShoulder),
      32,
    ),
  );
  if (fillTo !== undefined) {
    // Flüssigkeit: Profil endet mit flacher Oberfläche
    const out = pts.filter((p) => p.y <= fillTo);
    const last = out[out.length - 1];
    out.push(new THREE.Vector2(last.x, fillTo));
    out.push(new THREE.Vector2(0.0005, fillTo));
    return out;
  }
  pts.push(new THREE.Vector2(nr, d.hNeck - 0.06));
  // Mündung mit Wulst
  pts.push(new THREE.Vector2(nr * 1.1, d.hNeck - 0.045));
  pts.push(new THREE.Vector2(nr * 1.12, d.hNeck - 0.01));
  pts.push(new THREE.Vector2(nr * 1.02, d.hNeck));
  pts.push(new THREE.Vector2(0.0005, d.hNeck));
  return pts;
}

export function bottleGeometry(d: BottleDims, segments: number): THREE.LatheGeometry {
  const g = new THREE.LatheGeometry(profile(d), segments);
  g.computeVertexNormals();
  return g;
}

export function liquidGeometry(d: BottleDims, segments: number): THREE.LatheGeometry {
  const fill = d.hShoulder + (d.hNeck - d.hShoulder) * 0.3;
  const g = new THREE.LatheGeometry(profile(d, 0.93, fill), segments);
  g.computeVertexNormals();
  return g;
}

/** Winkelbreite des Etiketts (Front) */
export const LABEL_THETA = Math.PI * 1.05;

/**
 * Temporäres Etikett als Canvas-Textur.
 * Bewusst zurückhaltend gestaltet – keine Nachbildung offizieller Marken-Etiketten.
 * OFFIZIELLE ASSETS: Hier später die freigegebene Etikett-Grafik als Textur laden.
 */
export function labelTexture(product: Product, d: BottleDims, fonts: { sans: string; serif: string }): THREE.CanvasTexture {
  const arc = d.r * LABEL_THETA;
  const W = 1024;
  const H = Math.round((W * d.label.h) / arc);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const { label, labelInk } = product.visual;

  ctx.fillStyle = label;
  ctx.fillRect(0, 0, W, H);
  // feine Papierstruktur
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "rgba(255,255,255,0.08)");
  grad.addColorStop(1, "rgba(0,0,0,0.08)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = labelInk;
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, H * 0.09);
  ctx.lineTo(W, H * 0.09);
  ctx.moveTo(0, H * 0.91);
  ctx.lineTo(W, H * 0.91);
  ctx.stroke();
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, H * 0.12);
  ctx.lineTo(W, H * 0.12);
  ctx.moveTo(0, H * 0.88);
  ctx.lineTo(W, H * 0.88);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = labelInk;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const brand = labelText(product.brand).toUpperCase();
  const maxW = W * 0.62;
  let size = Math.min(H * 0.2, 96);
  ctx.font = `800 ${size}px ${fonts.sans}`;
  const tracking = size * 0.12;
  const measure = () => ctx.measureText(brand).width + tracking * (brand.length - 1);
  while (measure() > maxW && size > 20) {
    size -= 2;
    ctx.font = `800 ${size}px ${fonts.sans}`;
  }
  drawTracked(ctx, brand, W / 2, H * 0.42, size * 0.12);

  ctx.font = `italic 400 ${Math.round(size * 0.72)}px ${fonts.serif}`;
  ctx.globalAlpha = 0.9;
  ctx.fillText(product.variety, W / 2, H * 0.62);
  ctx.globalAlpha = 0.6;
  ctx.font = `600 ${Math.round(size * 0.28)}px ${fonts.sans}`;
  drawTracked(ctx, formatPack(1, product.bottleVolume).toUpperCase(), W / 2, H * 0.78, 4);
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function drawTracked(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, tracking: number) {
  const chars = [...text];
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + tracking * (chars.length - 1);
  let x = cx - total / 2;
  const prev = ctx.textAlign;
  ctx.textAlign = "left";
  chars.forEach((ch, i) => {
    ctx.fillText(ch, x, y);
    x += widths[i] + tracking;
  });
  ctx.textAlign = prev;
}

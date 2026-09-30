/**
 * Bereitet Produktfotos für die Website auf.
 *
 * Quelle:  assets/product-photos/<slug>.(png|webp|jpg)
 * Ziel:    public/products/<slug>.webp      (max. 1600 px hoch)
 *          public/products/<slug>-sm.webp   (600 px hoch, für Karten/Thumbnails)
 *          data/product-images.json         (Manifest mit Seitenverhältnis)
 *
 * Fotos mit transparentem Hintergrund werden nur beschnitten und skaliert.
 * Fotos auf hellem, gleichmäßigem Hintergrund werden freigestellt
 * (Region-Growing vom Bildrand aus, weiche Kante).
 *
 * Aufruf: npm run images
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets/product-photos";
const OUT = "public/products";
const MANIFEST = "data/product-images.json";

fs.mkdirSync(OUT, { recursive: true });

async function cutout(file) {
  const img = sharp(file).rotate().toColourspace("srgb");
  const meta = await img.metadata();
  const hasAlpha = meta.hasAlpha;
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  // Bereits freigestellt? (transparente Ecken)
  const cornerAlpha = [0, w - 1, (h - 1) * w, h * w - 1].map((i) => data[i * 4 + 3]);
  if (hasAlpha && cornerAlpha.every((a) => a < 10)) return { data, w, h };

  const lum = (i) => 0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2];
  const sat = (i) => Math.max(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]) - Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
  const diff = (a, b) => Math.abs(data[a * 4] - data[b * 4]) + Math.abs(data[a * 4 + 1] - data[b * 4 + 1]) + Math.abs(data[a * 4 + 2] - data[b * 4 + 2]);

  // Kanten-Barriere: starke Helligkeitssprünge (Glaskonturen) dürfen nicht „durchflutet“ werden
  const grad = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      grad[i] = Math.min(255, Math.max(diff(i, i - 1), diff(i, i + 1), diff(i, i - w), diff(i, i + w)));
    }
  const barrier = new Uint8Array(w * h);
  const R = 2;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (grad[y * w + x] <= 22) continue;
      for (let dy = -R; dy <= R; dy++)
        for (let dx = -R; dx <= R; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < w && ny < h) barrier[ny * w + nx] = 1;
        }
    }

  // Hintergrund: hell, farbneutral, weiche Verläufe – Region-Growing vom Rand
  const isBgLike = (i) => lum(i) > 170 && sat(i) < 16;
  const bg = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;
  const push = (i) => {
    if (!bg[i] && isBgLike(i)) {
      bg[i] = 1;
      queue[tail++] = i;
    }
  };
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }
  const grow = (allowBarrier) => {
    while (head < tail) {
      const i = queue[head++];
      const x = i % w;
      const y = (i / w) | 0;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const n = ny * w + nx;
        if (bg[n] || !isBgLike(n) || diff(i, n) >= 12) continue;
        if (barrier[n] && !allowBarrier) continue;
        bg[n] = 1;
        queue[tail++] = n;
      }
    }
  };
  grow(false);
  // Randsaum abtragen: bis zu R+1 Pixel in die Barriere hinein, nur hintergrundähnliche Pixel
  for (let k = 0; k <= R; k++) {
    const add = [];
    for (let i = 0; i < w * h; i++) {
      if (bg[i] || !barrier[i] || !isBgLike(i)) continue;
      const x = i % w, y = (i / w) | 0;
      if ((x > 0 && bg[i - 1]) || (x < w - 1 && bg[i + 1]) || (y > 0 && bg[i - w]) || (y < h - 1 && bg[i + w])) add.push(i);
    }
    for (const i of add) bg[i] = 1;
  }

  // Nur die größte zusammenhängende Form behalten (entfernt Staub/Dampf-Reste)
  const comp = new Int32Array(w * h).fill(-1);
  let best = -1, bestSize = 0, id = 0;
  for (let s0 = 0; s0 < w * h; s0++) {
    if (bg[s0] || comp[s0] >= 0) continue;
    let qh = 0, qt = 0, size = 0;
    queue[qt++] = s0;
    comp[s0] = id;
    while (qh < qt) {
      const i = queue[qh++];
      size++;
      const x = i % w, y = (i / w) | 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const n = ny * w + nx;
          if (!bg[n] && comp[n] < 0) {
            comp[n] = id;
            queue[qt++] = n;
          }
        }
    }
    if (size > bestSize) {
      bestSize = size;
      best = id;
    }
    id++;
  }
  for (let i = 0; i < w * h; i++) if (!bg[i] && comp[i] !== best) bg[i] = 1;
  // Kante um 1 px einziehen (entfernt JPEG-Lichtsaum)
  const edge = [];
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) continue;
    const x = i % w, y = (i / w) | 0;
    if ((x > 0 && bg[i - 1]) || (x < w - 1 && bg[i + 1]) || (y > 0 && bg[i - w]) || (y < h - 1 && bg[i + w])) edge.push(i);
  }
  for (const i of edge) bg[i] = 1;

  // Alpha-Maske + weiche Kante
  const mask = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) mask[i] = bg[i] ? 0 : 255;
  const soft = await sharp(mask, { raw: { width: w, height: h, channels: 1 } }).blur(0.9).extractChannel(0).raw().toBuffer();
  for (let i = 0; i < w * h; i++) data[i * 4 + 3] = Math.min(data[i * 4 + 3], soft[i]);
  return { data, w, h };
}

const manifest = {};
const files = fs.readdirSync(SRC).filter((f) => /\.(png|webp|jpe?g)$/i.test(f)).sort();
for (const f of files) {
  const slug = f.replace(/\.[^.]+$/, "");
  const { data, w, h } = await cutout(path.join(SRC, f));
  // Begrenzungsrahmen aus der Alpha-Maske
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[(y * w + x) * 4 + 3] > 12) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  const info = { width: x1 - x0 + 1, height: y1 - y0 + 1 };
  const cut = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: x0, top: y0, width: info.width, height: info.height })
    .png()
    .toBuffer();
  const base = sharp(cut);
  const lg = Math.min(1600, info.height);
  await base.clone().resize({ height: lg }).webp({ quality: 88, alphaQuality: 95, effort: 6 }).toFile(path.join(OUT, `${slug}.webp`));
  await base.clone().resize({ height: 600 }).webp({ quality: 84, alphaQuality: 92, effort: 6 }).toFile(path.join(OUT, `${slug}-sm.webp`));
  manifest[slug] = { src: `/products/${slug}.webp`, sm: `/products/${slug}-sm.webp`, aspect: +(info.width / info.height).toFixed(4) };
  console.log(`✓ ${slug}  ${info.width}×${info.height} → ${lg}px`);
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Manifest: ${Object.keys(manifest).length} Produkte → ${MANIFEST}`);

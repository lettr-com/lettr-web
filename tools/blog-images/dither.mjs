/*
 * The dither itself, shared by the blog art renderer (render.mjs) and the
 * homepage accordion art (accordion.mjs): place a sprite on a cell grid, stretch
 * its shading into a palette, and Bayer-dither it into the palette's ramp.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const here = new URL(".", import.meta.url).pathname;
const root = join(here, "../..");
// Blog sprites live with the tool and win over the homepage hero's originals in static/,
// which the blog still borrows where it has no redrawn version.
const SPRITE_DIRS = [join(here, "sprites"), join(root, "static/hero/sprites")];

const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28,
  52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7,
  39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
];

/** Supersampling when placing the sprite on the cell grid. */
const SS = 4;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/** Light field on the cell grid (0..1 per cell) and a hard object mask. */
export async function lightField(art, palette, { cols, rows, x, y, scale }) {
  const size = Math.round(rows * SS * scale);
  const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
  const file = SPRITE_DIRS.map((dir) => join(dir, `${art.object}.png`)).find((path) =>
    existsSync(path),
  );
  if (!file) throw new Error(`No sprite for ${art.object}`);
  const sprite = await sharp(file)
    .ensureAlpha()
    .resize(size, size, { fit: "contain", background: transparent })
    .rotate(art.rotate, { background: transparent })
    .png()
    .toBuffer({ resolveWithObject: true });
  const W = cols * SS;
  const H = rows * SS;
  // Pad the canvas so a sprite larger than the frame (tight thumbnails, steep
  // tilts) can be placed, then cut the frame back out.
  const pad = Math.max(sprite.info.width, sprite.info.height);
  const placed = await sharp({
    create: { width: W + pad * 2, height: H + pad * 2, channels: 4, background: transparent },
  })
    .composite([
      {
        input: sprite.data,
        left: Math.round(x * W - sprite.info.width / 2) + pad,
        top: Math.round(y * H - sprite.info.height / 2) + pad,
      },
    ])
    .png()
    .toBuffer();
  const { data } = await sharp(placed)
    .extract({ left: pad, top: pad, width: W, height: H })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const lum = new Float32Array(cols * rows);
  const mask = new Uint8Array(cols * rows);
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      let a = 0;
      let l = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const p = ((cy * SS + sy) * W + cx * SS + sx) * 4;
          const alpha = data[p + 3] / 255;
          a += alpha;
          l += (alpha * (data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114)) / 255;
        }
      }
      const i = cy * cols + cx;
      // Hard silhouette: a cell belongs to the object when it is mostly covered.
      if (a / (SS * SS) > 0.5) {
        mask[i] = 1;
        lum[i] = l / a;
      }
    }
  }

  // Stretch the object's own shading (2nd..98th percentile) into the palette's object band,
  // so every sprite uses the full ramp whatever colour it was drawn in.
  const values = lum.filter((_, i) => mask[i]).sort();
  const lo = values[Math.floor(values.length * 0.02)] ?? 0;
  const hi = values[Math.floor(values.length * 0.98)] ?? 1;
  const [bandLo, bandHi] = palette.object;
  const field = new Float32Array(cols * rows);
  for (let i = 0; i < field.length; i++) {
    if (!mask[i]) continue;
    const t = Math.min(1, Math.max(0, (lum[i] - lo) / (hi - lo || 1)));
    field[i] = bandLo + t * (bandHi - bandLo);
  }
  return { field, mask };
}

/**
 * Bayer 8x8 into the ramp. With `transparent`, ground cells are left clear so
 * the page can paint the ground and move the object over it on hover;
 * otherwise they take the ground colour exactly. `light(x, y)` adds to the
 * light field, which is how the sweep frames push a band of light through the
 * dither.
 */
export function dither(
  { field, mask },
  palette,
  cols,
  rows,
  { transparent = false, light = () => 0 } = {},
) {
  const ramp = palette.ramp.map(hex);
  const steps = ramp.length - 1;
  const spread = 0.9 / steps;
  const channels = transparent ? 4 : 3;
  const out = Buffer.alloc(cols * rows * channels);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      if (!mask[i]) {
        if (!transparent) out.set(ramp[palette.ground === 0 ? 0 : steps], i * 3);
        continue;
      }
      const threshold = (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64;
      const value = field[i] + light(x, y) + (threshold - 0.5) * spread;
      const level = Math.min(steps, Math.max(0, Math.round(value * steps)));
      out.set(ramp[level], i * channels);
      if (transparent) out[i * 4 + 3] = 255;
    }
  }
  return out;
}

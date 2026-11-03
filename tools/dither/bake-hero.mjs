#!/usr/bin/env node
/*
 * Homepage hero stills.
 *
 * Bakes the envelope field in src/lib/hero/envelopeField.ts into the images
 * HeroArtStatic.svelte shows. Each layout's sprites are placed at their designed
 * pose on a supersampled grid, averaged down to one pixel per dither cell, and
 * ordered-dithered (Bayer 8x8) into the hero palette with the same thresholds as
 * the live EnvelopeDither canvas. Writes static/hero/baked/:
 *
 *   field-desktop.png  427x143 cells of 3 px (reference frame 1280x430)
 *   field-mobile.png   195x160 cells of 2 px (reference frame 390x320)
 *   edge.png           256x4 cells of 6 px, the ragged top edge (DitherEdge's wave at rest)
 *   face.webp          the designer portrait, kept at full resolution
 *
 * The page scales the grids with image-rendering: pixelated, so each field is a
 * few KB. Output is deterministic; commit the files.
 *
 *   vp run hero:bake
 */

import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  bayer8,
  designCenter,
  heroFaceSource,
  heroGrid,
  heroLayouts,
  heroPalette,
  heroSpread,
  heroSpriteSources,
  heroStill,
  heroThresholds,
} from "../../src/lib/hero/envelopeField.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const staticDir = join(root, "static");
/** Supersampling when placing sprites on the cell grid. */
const SS = 4;
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const [inkR, inkG, inkB] = heroPalette[0];

/** One sprite, cropped like background-size: cover, scaled and rotated, as a PNG buffer. */
async function spriteLayer(sprite, k) {
  const file = join(staticDir, heroSpriteSources[sprite.kind]);
  const { width, height } = await sharp(file).metadata();
  const ratio = sprite.w / sprite.h;
  const sw = ratio >= 1 ? width : height * ratio;
  const sh = ratio >= 1 ? width / ratio : height;
  const scaled = await sharp(file)
    .ensureAlpha()
    .extract({
      left: Math.round((width - sw) / 2),
      top: Math.round((height - sh) / 2),
      width: Math.round(sw),
      height: Math.round(sh),
    })
    .resize(Math.round(sprite.w * k), Math.round(sprite.h * k), { fit: "fill" })
    .png()
    .toBuffer();
  return sharp(scaled)
    .rotate(sprite.rot, { background: transparent })
    .png()
    .toBuffer({ resolveWithObject: true });
}

async function bakeField(layout, file) {
  const { cols, rows } = heroGrid(layout);
  const W = cols * SS;
  const H = rows * SS;
  // supersampled px per reference px
  const k = SS / layout.cell;
  const layers = [];
  for (const sprite of layout.sprites) {
    if (sprite.kind === "face") continue;
    const { data, info } = await spriteLayer(sprite, k);
    const { cx, cy } = designCenter(sprite);
    layers.push({
      data,
      info,
      left: Math.round(cx * k - info.width / 2),
      top: Math.round(cy * k - info.height / 2),
    });
  }
  // Pad the canvas so sprites that hang over the frame can be placed, then cut the frame back out.
  const pad = Math.max(...layers.map((l) => Math.max(l.info.width, l.info.height)));
  const composed = await sharp({
    create: {
      width: W + pad * 2,
      height: H + pad * 2,
      channels: 3,
      background: { r: inkR, g: inkG, b: inkB },
    },
  })
    .composite(layers.map((l) => ({ input: l.data, left: l.left + pad, top: l.top + pad })))
    .png()
    .toBuffer();
  const { data } = await sharp(composed)
    .extract({ left: pad, top: pad, width: W, height: H })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(cols * rows * 3);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let lum = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const p = ((y * SS + sy) * W + x * SS + sx) * 3;
          lum += (data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114) / 255;
        }
      }
      lum /= SS * SS;
      const threshold = (bayer8[(y & 7) * 8 + (x & 7)] + 0.5) / 64;
      const v = lum + (threshold - 0.5) * heroSpread;
      let level = 0;
      while (level < heroThresholds.length && v > heroThresholds[level]) level++;
      out.set(heroPalette[level], (y * cols + x) * 3);
    }
  }
  await writePalettePng(out, cols, rows, 3, file);
}

/** DitherEdge's wave mode at t = 0: dark at the bottom, ragged towards the top. */
async function bakeEdge(file) {
  const cols = 256;
  const rows = 4;
  const out = Buffer.alloc(cols * rows * 4);
  for (let y = 0; y < rows; y++) {
    const base = (y + 0.5) / rows;
    for (let x = 0; x < cols; x++) {
      const wave =
        Math.sin(x * 0.11) * 0.18 + Math.sin(x * 0.047) * 0.16 + Math.sin(x * 0.23) * 0.06;
      const threshold = (bayer8[(y & 7) * 8 + (x & 7)] + 0.5) / 64;
      if (y === rows - 1 || base * 1.3 - 0.12 + wave > threshold) {
        out.set([inkR, inkG, inkB, 255], (y * cols + x) * 4);
      }
    }
  }
  await writePalettePng(out, cols, rows, 4, file);
}

async function writePalettePng(pixels, width, height, channels, file) {
  await sharp(pixels, { raw: { width, height, channels } })
    .png({
      palette: true,
      colours: heroPalette.length + 1,
      dither: 0,
      compressionLevel: 9,
      effort: 10,
    })
    .toFile(file);
}

const out = (url) => join(staticDir, url);
mkdirSync(out("/hero/baked"), { recursive: true });
await bakeField(heroLayouts.desktop, out(heroStill.field.desktop));
await bakeField(heroLayouts.mobile, out(heroStill.field.mobile));
await bakeEdge(out(heroStill.edge));
await sharp(out(heroFaceSource))
  .webp({ quality: 82, alphaQuality: 90 })
  .toFile(out(heroStill.face));
console.log("Baked the hero into static/hero/baked/");

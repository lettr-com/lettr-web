#!/usr/bin/env node
/*
 * Homepage accordion art.
 *
 * The right side of each open accordion row (AccordionGraphic.svelte) is one
 * sprite, dithered with the same code as the blog art and left clear so the
 * panel's ground shows through. Written to static/home/accordion/<id>.png at
 * 108x90 cells, one pixel per cell; the page shows them at 216x180 with
 * image-rendering: pixelated, so a dot is 2px.
 *
 * `x`, `y` and `scale` are as in artLayouts. The default crop runs the object
 * off the panel's bottom and right edges; objects that stop reading when cropped
 * get a smaller, centred placement.
 *
 *   vp run accordion:images
 */

import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { palettes } from "../../src/lib/blog/art.ts";
import { dither, lightField } from "./dither.mjs";

const here = new URL(".", import.meta.url).pathname;
const OUT = join(here, "../../static/home/accordion");
const CELLS = { cols: 108, rows: 90 };
const CROP = { scale: 1.3, x: 0.58, y: 0.58 };

const scenes = {
  "rest-smtp": { object: "envelope-open", rotate: -8, palette: "ink" },
  sdks: { object: "plug", rotate: 8, palette: "ink", x: 0.52 },
  webhooks: { object: "lightning", rotate: 8, palette: "ink" },
  synced: { object: "document", rotate: -8, palette: "plum" },
  multilingual: { object: "globe", rotate: 10, palette: "plum" },
  placeholders: {
    object: "name-badge",
    rotate: -6,
    palette: "plum",
    scale: 1.04,
    x: 0.54,
    y: 0.5,
  },
  onboarding: { object: "mailbox", rotate: -6, palette: "plum", y: 0.63 },
  security: { object: "padlock", rotate: 8, palette: "plum" },
  trial: { object: "clock", rotate: -8, palette: "plum" },
  segments: { object: "folder", rotate: -8, palette: "green", scale: 1.06, x: 0.54, y: 0.52 },
  campaigns: { object: "megaphone", rotate: -8, palette: "green" },
  analytics: { object: "bar-chart", rotate: -6, palette: "green", scale: 1.14, x: 0.55, y: 0.55 },
};

mkdirSync(OUT, { recursive: true });
for (const [id, { object, rotate, palette: name, ...placement }] of Object.entries(scenes)) {
  const palette = palettes[name];
  const layout = { ...CELLS, ...CROP, ...placement };
  const pixels = dither(
    await lightField({ object, rotate }, palette, layout),
    palette,
    CELLS.cols,
    CELLS.rows,
    {
      transparent: true,
    },
  );
  await sharp(pixels, { raw: { width: CELLS.cols, height: CELLS.rows, channels: 4 } })
    .png({ palette: true, colors: 8, compressionLevel: 9 })
    .toFile(join(OUT, `${id}.png`));
  console.log(id);
}

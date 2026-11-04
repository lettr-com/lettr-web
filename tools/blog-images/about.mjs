#!/usr/bin/env node
/*
 * About page art: the objects in the "Before." and "With Lettr." cards.
 *
 * Same dither as the accordion art (accordion.mjs), with the ground left clear
 * so the card's colour shows through. Written to static/about/<id>.png at 72x72
 * cells, one pixel per cell; the page scales them with image-rendering:
 * pixelated, so a dot is 4px at full size.
 *
 *   vp run about:images
 */

import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { palettes } from "../../src/lib/blog/art.ts";
import { dither, lightField } from "./dither.mjs";

const here = new URL(".", import.meta.url).pathname;
const OUT = join(here, "../../static/about");
const CELLS = { cols: 72, rows: 72, x: 0.5, y: 0.5, scale: 0.9 };

// Pink object on the crimson card. Plum shadows keep its lower edge off the ground.
const crimson = {
  ramp: ["#23020b", "#3a0716", "#ec104b", "#f9b7c9", "#fde7ed"],
  ground: 0,
  object: [0.2, 1],
};

const scenes = {
  before: { object: "stamp", rotate: -10, palette: palettes.ink },
  "with-lettr": { object: "envelope-sealed", rotate: 8, palette: crimson },
};

mkdirSync(OUT, { recursive: true });
for (const [id, { object, rotate, palette }] of Object.entries(scenes)) {
  const pixels = dither(
    await lightField({ object, rotate }, palette, CELLS),
    palette,
    CELLS.cols,
    CELLS.rows,
    { transparent: true },
  );
  await sharp(pixels, { raw: { width: CELLS.cols, height: CELLS.rows, channels: 4 } })
    .png({ palette: true, colors: 8, compressionLevel: 9 })
    .toFile(join(OUT, `${id}.png`));
  console.log(id);
}

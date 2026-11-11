#!/usr/bin/env node
/*
 * Integrations page art: the plug in the "Built a Lettr connector? Get listed."
 * card on /integrations/.
 *
 * Same dither as the About art (about.mjs), with the ground left clear so the
 * card's plum shows through. Written to static/integrations/<id>.png at 96x96
 * cells, one pixel per cell; the page scales it with image-rendering: pixelated,
 * so a dot is 4px at full size.
 *
 *   vp run integrations:images
 */

import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { dither, lightField } from "./dither.mjs";

const here = fileURLToPath(new URL(".", import.meta.url));
const OUT = join(here, "../../static/integrations");
const CELLS = { cols: 96, rows: 96, x: 0.5, y: 0.5, scale: 0.92 };

// Pink object on the plum card, as on the About page's crimson card.
const crimson = {
  ramp: ["#23020b", "#3a0716", "#ec104b", "#f9b7c9", "#fde7ed"],
  ground: 0,
  object: [0.2, 1],
};

const scenes = {
  plug: { object: "plug", rotate: -14, palette: crimson },
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

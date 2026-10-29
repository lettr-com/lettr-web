/*
 * The homepage hero's envelope field: the composition laid out in Paper and
 * the palette it is ordered-dithered into. HeroArtStatic shows it as still
 * images baked by tools/dither/bake-hero.mjs; EnvelopeDither renders the same
 * field live on a canvas. Change the layout here, then re-bake.
 */

export type HeroSpriteKind =
  | "envelope"
  | "face"
  | "at"
  | "stamp"
  | "megaphone"
  | "bell"
  | "mailbox";

export interface HeroSprite {
  kind: HeroSpriteKind;
  // top-left origin + size + clockwise rotation (deg), as laid out in Paper
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  phase: number;
  /** upward drift in reference px per second; 0 pins the sprite */
  speed: number;
  /** envelopes only: time (s) until the flap closes again */
  openUntil?: number;
  /** envelopes only: when it was last opened, for the little pop */
  openAt?: number;
}

export interface HeroLayout {
  /** Reference frame in CSS px; the hero box cover-fits it, centred. */
  w: number;
  h: number;
  /** Size of one dither cell in CSS px. */
  cell: number;
  sprites: HeroSprite[];
}

const env = (
  x: number,
  y: number,
  w: number,
  h: number,
  rot: number,
  phase: number,
  speed: number,
): HeroSprite => ({ kind: "envelope", x, y, w, h, rot, phase, speed });

const obj = (
  kind: HeroSpriteKind,
  x: number,
  y: number,
  size: number,
  rot: number,
  phase: number,
  speed: number,
): HeroSprite => ({ kind, x, y, w: size, h: size, rot, phase, speed });

export const heroLayouts: { desktop: HeroLayout; mobile: HeroLayout } = {
  desktop: {
    w: 1280,
    h: 430,
    cell: 3,
    sprites: [
      env(63, -114, 280.8, 366.2, 44.15, 0.4, 26),
      env(270.2, 143.7, 172.5, 172.5, 4.44, 1.9, 16),
      env(608, 76, 196.3, 256, -8.69, 4.4, 22),
      env(514, 324, 149.3, 194.6, 15, 2.6, 14),
      env(894.9, 203.5, 220, 220, -4.1, 0.9, 24),
      env(1123, -20, 220, 220, -15, 3.7, 28),
      { kind: "face", x: 144, y: 316, w: 60, h: 60, rot: 9.39, phase: 1.2, speed: 18 },
      obj("stamp", 372, 36, 84, 12, 2.2, 13),
      obj("megaphone", 780, 318, 96, -10, 0.7, 20),
      obj("bell", 706, 14, 86, 10, 3.5, 15),
      obj("mailbox", 1168, 300, 80, -6, 4.8, 12),
      obj("at", 452, 196, 70, -8, 2.9, 15),
    ],
  },
  mobile: {
    w: 390,
    h: 320,
    cell: 2,
    sprites: [
      env(40, -20, 190, 248, 44.15, 0.4, 20),
      env(190, 170, 150, 150, -4.1, 1.9, 14),
      env(235, 10, 120, 156, -8.69, 4.4, 22),
      env(100, 230, 76, 76, -30.58, 3.1, 10),
      { kind: "face", x: 24, y: 252, w: 56, h: 56, rot: 9.39, phase: 1.2, speed: 18 },
      obj("megaphone", 16, 120, 64, -14, 0.7, 16),
      obj("stamp", 296, 232, 58, 12, 2.2, 13),
      obj("at", 196, 282, 46, -8, 2.9, 12),
    ],
  },
};

/** Cells in a layout's dither grid; the baked stills are one pixel per cell. */
export function heroGrid(layout: HeroLayout): { cols: number; rows: number } {
  return { cols: Math.round(layout.w / layout.cell), rows: Math.round(layout.h / layout.cell) };
}

/** Paper rotates around the top-left corner; this recovers the sprite's centre. */
export function designCenter(s: HeroSprite): { cx: number; cy: number; rad: number } {
  const rad = (s.rot * Math.PI) / 180;
  return {
    cx: s.x + (s.w / 2) * Math.cos(rad) - (s.h / 2) * Math.sin(rad),
    cy: s.y + (s.w / 2) * Math.sin(rad) + (s.h / 2) * Math.cos(rad),
    rad,
  };
}

// ink, deep crimson, crimson, hot rose, rose, blush, paper
export const heroPalette: [number, number, number][] = [
  [35, 2, 11],
  [120, 8, 40],
  [200, 14, 66],
  [236, 16, 75],
  [244, 126, 156],
  [250, 206, 218],
  [247, 241, 243],
];
/** Luminance cuts between palette steps. */
export const heroThresholds = [0.1, 0.22, 0.34, 0.5, 0.68, 0.84];
/** How far the Bayer matrix pushes a cell's luminance before the cut. */
export const heroSpread = 0.1;

export const bayer8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28,
  52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7,
  39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
];

export const heroSpriteSources: Record<Exclude<HeroSpriteKind, "face">, string> = {
  envelope: "/hero/envelope.png",
  at: "/hero/sprites/at-sign.png",
  stamp: "/hero/objects/stamp.webp",
  megaphone: "/hero/objects/megaphone.webp",
  bell: "/hero/objects/bell.webp",
  mailbox: "/hero/objects/mailbox.webp",
};
export const heroFaceSource = "/hero/designer.png";

/** Files written by tools/dither/bake-hero.mjs. */
export const heroStill = {
  field: { desktop: "/hero/baked/field-desktop.png", mobile: "/hero/baked/field-mobile.png" },
  edge: "/hero/baked/edge.png",
  face: "/hero/baked/face.webp",
};

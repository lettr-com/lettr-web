/**
 * Blog art direction: which object a post shows, how it is coloured and how it
 * moves. Shared by the site (alt text, card grounds, hover motion) and the
 * offline renderer in tools/blog-images, which turns each post's `art` into its
 * cover, thumbnail and Open Graph images. Every colour here is a token from
 * src/styles/app.css.
 */

/**
 * Sprites live in tools/blog-images/sprites/ (drawn for the blog with
 * new-object.mjs, including redrawn envelope and stamp), falling back to the
 * homepage hero's originals in static/hero/sprites/ for key, check, paper
 * plane and @. Only the renderer reads them.
 */
export const blogObjects = [
  "key",
  "check",
  "envelope-open",
  "paper-plane",
  "stamp",
  "at-sign",
  "padlock",
  "shield",
  "server",
  "inbox-tray",
  "bell",
  "clock",
  "lightning",
  "document",
  "folder",
  "megaphone",
  "mailbox",
  "globe",
  "cursor",
  "bar-chart",
  "plug",
] as const;

export type BlogObject = (typeof blogObjects)[number];

/**
 * Each object moves its own way when its card is hovered, so the motion says
 * something about the object: a key locks, a plane takes off and comes back.
 * The keyframes live in app.css under `.art-<motion>`. `sweep` is the one that
 * is not a transform: a band of light passes through the dither, rendered
 * offline as frames (<variant>-sweep.png).
 */
export type ArtMotion =
  | "lock"
  | "pop"
  | "lift"
  | "swoosh"
  | "wiggle"
  | "swing"
  | "shake"
  | "ring"
  | "turn"
  | "click"
  | "spark"
  | "grow"
  | "blast"
  | "sweep";

export const objectMotion: Record<BlogObject, ArtMotion> = {
  key: "lock",
  check: "pop",
  "envelope-open": "lift",
  "paper-plane": "swoosh",
  "at-sign": "wiggle",
  stamp: "sweep",
  padlock: "shake",
  shield: "pop",
  server: "sweep",
  "inbox-tray": "lift",
  bell: "swing",
  clock: "ring",
  lightning: "sweep",
  document: "lift",
  folder: "lift",
  megaphone: "blast",
  mailbox: "pop",
  globe: "turn",
  cursor: "click",
  "bar-chart": "grow",
  plug: "spark",
};

/**
 * Where on the sprite (0..1 of its 384px tile) a burst of dither sprinkles
 * comes from, for the objects that throw them: a plug sparks at its prongs, a
 * cursor at its tip.
 */
export const objectSprinkles: Partial<
  Record<
    BlogObject,
    {
      x: number;
      y: number;
      /** Burst direction, degrees (0 = right, -90 = up). */ angle?: number;
      /** Width of the burst, degrees. */ arc?: number;
    }
  >
> = {
  plug: { x: 0.8, y: 0.17, angle: -45, arc: 120 },
  cursor: { x: 0.13, y: 0.1 },
  check: { x: 0.5, y: 0.45 },
  megaphone: { x: 0.92, y: 0.42, angle: -10, arc: 80 },
};

/**
 * The point (0..1 of the sprite) a motion pivots on, when it isn't the
 * centre: a bell swings from its hanger, a chart grows from its baseline.
 */
export const objectPivots: Partial<Record<BlogObject, { x: number; y: number }>> = {
  bell: { x: 0.5, y: 0.08 },
  "bar-chart": { x: 0.5, y: 0.97 },
};

/** The key sprite's blade runs this many degrees below horizontal; the lock motion levels it. */
export const keyAxis = 42;

export type PaletteName = "plum" | "green" | "ink" | "blush" | "paper";

export interface PostArt {
  object: BlogObject;
  /** Clockwise tilt in degrees; small values (-25..25) keep the silhouette readable. */
  rotate: number;
  /** Overrides the category's palette, to vary a run of same-category posts. */
  palette?: PaletteName;
}

export interface ArtPalette {
  /** Dither ramp, dark to light. */
  ramp: string[];
  /** 0 when the ground is the darkest ramp step, 1 when it is the lightest. */
  ground: 0 | 1;
  /** Range of the 0..1 light field the object's own shading is stretched into. */
  object: [number, number];
  /** Colour of the title and wordmark on the Open Graph image. */
  text: string;
}

const token = {
  plum: "#23020b",
  plumRaised: "#3a0716",
  primary: "#ec104b",
  primaryOutline: "#f9b7c9",
  primarySoft: "#fde7ed",
  background: "#f7f1f3",
  surface: "#111827",
  muted: "#1f2937",
  subtle: "#39485f",
  border: "#d1d5db",
  green: "#00c851",
  white: "#ffffff",
};

export const palettes: Record<PaletteName, ArtPalette> = {
  // Crimson object on plum, the homepage hero's ground.
  plum: {
    ramp: [token.plum, token.plumRaised, token.primary, token.primaryOutline, token.background],
    ground: 0,
    object: [0.3, 1.02],
    text: token.background,
  },
  // Green object on ink. There is no dark-green token, so the ground stays ink.
  green: {
    ramp: [token.surface, token.muted, token.green, token.background],
    ground: 0,
    object: [0.5, 1],
    text: token.background,
  },
  // Paper object on ink.
  ink: {
    ramp: [token.surface, token.muted, token.subtle, token.border, token.background],
    ground: 0,
    object: [0.4, 1.02],
    text: token.background,
  },
  // Crimson object on blush.
  blush: {
    ramp: [token.plumRaised, token.primary, token.primaryOutline, token.primarySoft],
    ground: 1,
    object: [0.08, 0.78],
    text: token.plum,
  },
  // Ink object on white; the page is already paper, so the card needs its own ground.
  paper: {
    ramp: [token.surface, token.subtle, token.border, token.white],
    ground: 1,
    object: [0.05, 0.8],
    text: token.surface,
  },
};

/** By default the ground follows the category, so the index reads by topic at a glance. */
export const categoryPalettes: Record<string, PaletteName> = {
  Product: "plum",
  Deliverability: "green",
  Engineering: "ink",
  Fundamentals: "blush",
  "Case study": "paper",
};

export function paletteFor(category: string, art?: PostArt): ArtPalette {
  return palettes[art?.palette ?? categoryPalettes[category] ?? "plum"];
}

/** Background colour of a post's art, painted behind the object layer. */
export function groundColor(category: string, art?: PostArt): string {
  const { ramp, ground } = paletteFor(category, art);
  return ground === 0 ? ramp[0] : ramp[ramp.length - 1];
}

/** The two brightest object colours on a dark ground (darkest on a light one), for sprinkles. */
export function sprinkleColors(category: string, art?: PostArt): [string, string] {
  const { ramp, ground } = paletteFor(category, art);
  return ground === 0 ? [ramp[ramp.length - 1], ramp[ramp.length - 2]] : [ramp[1], ramp[0]];
}

export type ArtVariant = "cover" | "square" | "thumb" | "strip" | "og";

/**
 * Cell grid and object placement for each rendered file: `x`/`y` place the
 * sprite's centre as fractions of the grid, `scale` sizes it against the grid
 * height. The site reads the same numbers to aim sprinkles at the object.
 */
export const artLayouts: Record<
  ArtVariant,
  { cols: number; rows: number; x: number; y: number; scale: number }
> = {
  cover: { cols: 200, rows: 112, x: 0.5, y: 0.5, scale: 0.66 },
  square: { cols: 96, rows: 96, x: 0.5, y: 0.5, scale: 0.6 },
  thumb: { cols: 48, rows: 48, x: 0.5, y: 0.5, scale: 0.86 },
  strip: { cols: 130, rows: 32, x: 0.76, y: 0.5, scale: 0.92 },
  // OG: object on the right third, title on the left.
  og: { cols: 200, rows: 105, x: 0.76, y: 0.5, scale: 0.7 },
};

/**
 * Where a point on the sprite (0..1 of its tile) lands in a rendered variant,
 * as percentages of its width and height, after the post's tilt.
 */
export function spritePoint(art: PostArt, variant: ArtVariant, point: { x: number; y: number }) {
  const { cols, rows, x, y, scale } = artLayouts[variant];
  const size = rows * scale;
  const dx = (point.x - 0.5) * size;
  const dy = (point.y - 0.5) * size;
  const angle = (art.rotate * Math.PI) / 180;
  const px = x * cols + dx * Math.cos(angle) - dy * Math.sin(angle);
  const py = y * rows + dx * Math.sin(angle) + dy * Math.cos(angle);
  return { left: (px / cols) * 100, top: (py / rows) * 100 };
}

const objectNames: Record<BlogObject, string> = {
  key: "key",
  check: "check mark",
  "envelope-open": "open envelope",
  "paper-plane": "paper plane",
  stamp: "postage stamp",
  "at-sign": "@ sign",
  padlock: "padlock",
  shield: "shield",
  server: "server stack",
  "inbox-tray": "inbox tray",
  bell: "notification bell",
  clock: "alarm clock",
  lightning: "lightning bolt",
  document: "document",
  folder: "folder",
  megaphone: "megaphone",
  mailbox: "mailbox",
  globe: "globe",
  cursor: "mouse cursor",
  "bar-chart": "bar chart",
  plug: "plug",
};

/** Alt text for decorative-but-meaningful cover art. */
export function artAlt(art: PostArt): string {
  return `Pixel-dithered ${objectNames[art.object]}`;
}

/** Root-relative paths of the rendered files for a post. */
export function artPaths(slug: string) {
  const base = `/blog/${slug}`;
  return {
    cover: `${base}/cover.png`,
    square: `${base}/square.png`,
    thumb: `${base}/thumb.png`,
    strip: `${base}/strip.png`,
    og: `${base}/og.png`,
  };
}

/** Frame strips for the sweep motion; only rendered for objects whose motion is `sweep`. */
export function sweepPaths(slug: string) {
  const base = `/blog/${slug}`;
  return {
    cover: `${base}/cover-sweep.png`,
    square: `${base}/square-sweep.png`,
    thumb: `${base}/thumb-sweep.png`,
  };
}

/** Frames per sweep strip; tools/blog-images renders this many. */
export const sweepFrames = 8;

export type EmailKind = "marketing" | "ecommerce" | "transactional";
export type HeaderLayout = "left" | "center" | "band";
export type HeroLayout = "band" | "plain";
export type Align = "left" | "center";
export type CtaStyle = "solid" | "outline" | "block";
export type CodeStyle = "box" | "tiles";
export type LogoMark = "triangle" | "circle" | "ring" | "square" | "diamond" | "none";

export interface Layout {
  header: HeaderLayout;
  hero: HeroLayout;
  align: Align;
  cta: CtaStyle;
  code: CodeStyle;
}

export interface BrandColors {
  /** Email background. */
  bg: string;
  /** Main text and headings. */
  ink: string;
  muted: string;
  line: string;
  accent: string;
  /** Text on top of the accent colour. */
  accentInk: string;
  /** Tinted fill used for product tiles and code boxes. */
  soft: string;
  /** Which colour the call-to-action button takes. */
  cta: "accent" | "ink";
}

export interface BrandFonts {
  display: string;
  displayWeight: number;
  displayCase?: "uppercase" | "none";
  displayItalic?: boolean;
  displayTracking: string;
  body: string;
  mono: string;
}

export interface BrandLogo {
  mark: LogoMark;
  text: string;
  /** Optional second line under the wordmark. */
  sub?: string;
  font: string;
  weight: number;
  tracking: string;
  italic?: boolean;
  size: number;
  /** Wordmark colour; defaults to the ink colour. */
  wordmark?: "accent" | "ink";
}

export interface MarketingCopy {
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  items: { name: string; price: string }[];
  suffix: string;
}

export interface EcommerceCopy {
  eyebrow: string;
  headline: string;
  sub: string;
  item: { name: string; meta: string; price: string };
  totalLabel: string;
  total: string;
  cta: string;
}

export interface TransactionalCopy {
  headline: string;
  body: string;
  /** Digits shown in the code block, spaces allowed. Omit for link-style emails. */
  code?: string;
  cta: string;
  note: string;
}

export interface Brand {
  id: string;
  name: string;
  colors: BrandColors;
  fonts: BrandFonts;
  logo: BrandLogo;
  footer: string;
  /** Layout options this brand may be shown with; the first value is the default. */
  layouts: {
    header: HeaderLayout[];
    hero: HeroLayout[];
    align: Align[];
    cta: CtaStyle[];
    code: CodeStyle[];
  };
  copy: {
    marketing: MarketingCopy;
    ecommerce: EcommerceCopy;
    transactional: TransactionalCopy;
  };
}

const SANS = '"Inter", system-ui, sans-serif';
const MONO = '"IBM Plex Mono", ui-monospace, monospace';

export const brands: Brand[] = [
  {
    id: "northwind",
    name: "Northwind Outdoor",
    colors: {
      bg: "#ffffff",
      ink: "#2b3a55",
      muted: "#5b6b84",
      line: "#e5e7eb",
      accent: "#2b3a55",
      accentInk: "#ffffff",
      soft: "#e3e9f2",
      cta: "accent",
    },
    fonts: {
      display: '"Space Grotesk", system-ui, sans-serif',
      displayWeight: 700,
      displayTracking: "-0.02em",
      body: SANS,
      mono: MONO,
    },
    logo: {
      mark: "triangle",
      text: "NORTHWIND",
      font: '"Space Grotesk", system-ui, sans-serif',
      weight: 700,
      tracking: "0.14em",
      size: 12,
    },
    footer: "Northwind Outdoor · Oslo",
    layouts: {
      header: ["left", "center"],
      hero: ["band", "plain"],
      align: ["left"],
      cta: ["solid", "block"],
      code: ["box"],
    },
    copy: {
      marketing: {
        eyebrow: "TRAIL SEASON",
        headline: "The ridge is calling.",
        body: "New shells, packs and boots for the first long weekend of spring. Free returns until June.",
        cta: "Shop the collection",
        items: [
          { name: "Ridge Shell", price: "$189" },
          { name: "Cedar Pack", price: "$96" },
        ],
        suffix: "Unsubscribe",
      },
      ecommerce: {
        eyebrow: "ORDER #NW-4412",
        headline: "Thanks for your order, Sarah.",
        sub: "We'll email you the moment it ships.",
        item: { name: "Ridge Shell", meta: "Size M · Qty 1", price: "$189" },
        totalLabel: "Total",
        total: "$189",
        cta: "Track your order",
      },
      transactional: {
        headline: "Reset your password",
        body: "Someone asked to reset the password for your Northwind account. This link works for 30 minutes.",
        cta: "Choose a new password",
        note: "Didn't ask for this? You can safely ignore the message.",
      },
    },
  },
  {
    id: "rosa",
    name: "Rosa Atelier",
    colors: {
      bg: "#ffffff",
      ink: "#1f2937",
      muted: "#6b7280",
      line: "#f3d5dd",
      accent: "#d90e45",
      accentInk: "#ffffff",
      soft: "#f7c6d3",
      cta: "accent",
    },
    fonts: {
      display: '"Playfair Display", Georgia, serif',
      displayWeight: 600,
      displayTracking: "0",
      body: SANS,
      mono: MONO,
    },
    logo: {
      mark: "none",
      text: "Rosa",
      sub: "ATELIER",
      font: '"Playfair Display", Georgia, serif',
      weight: 600,
      tracking: "-0.01em",
      italic: true,
      size: 26,
      wordmark: "accent",
    },
    footer: "Rosa Atelier · Lisbon",
    layouts: {
      header: ["center", "left"],
      hero: ["plain", "band"],
      align: ["left", "center"],
      cta: ["block", "solid"],
      code: ["box"],
    },
    copy: {
      marketing: {
        eyebrow: "NEW IN",
        headline: "Linen season, now open.",
        body: "Soft layers cut for warm evenings. Free shipping on orders over €100.",
        cta: "Shop new arrivals",
        items: [
          { name: "Wrap Dress", price: "€148" },
          { name: "Linen Shirt", price: "€96" },
        ],
        suffix: "Unsubscribe",
      },
      ecommerce: {
        eyebrow: "ORDER #RA-20418",
        headline: "Thanks for your order, Sarah.",
        sub: "Your parcel leaves our Lisbon studio tomorrow.",
        item: { name: "Linen Wrap Dress", meta: "Size M · Qty 1", price: "$148" },
        totalLabel: "Total",
        total: "$148",
        cta: "Track your order",
      },
      transactional: {
        headline: "Welcome to Rosa",
        body: "Confirm your email to save favourites and follow your orders.",
        cta: "Confirm email",
        note: "If this was not you, no action is needed.",
      },
    },
  },
  {
    id: "sprout",
    name: "Sprout",
    colors: {
      bg: "#ffffff",
      ink: "#0b2e1a",
      muted: "#4b5563",
      line: "#e5e7eb",
      accent: "#00c851",
      accentInk: "#0b2e1a",
      soft: "#e8f8ee",
      cta: "ink",
    },
    fonts: {
      display: '"Sora", system-ui, sans-serif',
      displayWeight: 600,
      displayTracking: "-0.02em",
      body: SANS,
      mono: MONO,
    },
    logo: {
      mark: "square",
      text: "sprout",
      font: '"Sora", system-ui, sans-serif',
      weight: 700,
      tracking: "-0.01em",
      size: 14,
    },
    footer: "Sprout Labs",
    layouts: {
      header: ["left", "band"],
      hero: ["plain", "band"],
      align: ["left", "center"],
      cta: ["block", "solid"],
      code: ["box", "tiles"],
    },
    copy: {
      marketing: {
        eyebrow: "PRODUCT UPDATE",
        headline: "Tasks now repeat themselves.",
        body: "Set a schedule once and Sprout creates the next one for you. Available on every plan.",
        cta: "See what's new",
        items: [
          { name: "Repeat tasks", price: "New" },
          { name: "Templates", price: "Updated" },
        ],
        suffix: "Manage preferences",
      },
      ecommerce: {
        eyebrow: "RECEIPT #S-0931",
        headline: "Thanks for your payment, Sarah.",
        sub: "Your Sprout Team plan is active.",
        item: { name: "Sprout Team", meta: "Monthly · 5 seats", price: "$45" },
        totalLabel: "Paid",
        total: "$45",
        cta: "View invoice",
      },
      transactional: {
        headline: "Confirm your email",
        body: "Use this code to finish creating your Sprout account. It expires in 10 minutes.",
        code: "482 913",
        cta: "Confirm email",
        note: "Didn't ask for this? You can safely ignore the message.",
      },
    },
  },
  {
    id: "kiln",
    name: "Kiln Coffee",
    colors: {
      bg: "#fffdf2",
      ink: "#111111",
      muted: "#55554a",
      line: "#111111",
      accent: "#ffe600",
      accentInk: "#111111",
      soft: "#fff3a0",
      cta: "ink",
    },
    fonts: {
      display: '"Archivo Black", system-ui, sans-serif',
      displayWeight: 400,
      displayCase: "uppercase",
      displayTracking: "0",
      body: MONO,
      mono: MONO,
    },
    logo: {
      mark: "circle",
      text: "KILN COFFEE",
      font: '"Archivo Black", system-ui, sans-serif',
      weight: 400,
      tracking: "0.06em",
      size: 13,
    },
    footer: "Kiln Coffee · Berlin",
    layouts: {
      header: ["center", "left"],
      hero: ["band", "plain"],
      align: ["center", "left"],
      cta: ["outline", "block"],
      code: ["box"],
    },
    copy: {
      marketing: {
        eyebrow: "New blend / batch 07",
        headline: "Spring blend. Drops Friday.",
        body: "Roasted Tuesday. Ground Wednesday. On your doorstep before the weekend starts.",
        cta: "GET THE BAG →",
        items: [
          { name: "Spring Blend", price: "€14" },
          { name: "Filter Pack", price: "€9" },
        ],
        suffix: "Unsubscribe",
      },
      ecommerce: {
        eyebrow: "Order KC-218",
        headline: "Your beans are roasting.",
        sub: "They ship tomorrow morning.",
        item: { name: "Spring Blend 250g", meta: "Whole bean · Qty 2", price: "€28" },
        totalLabel: "Total",
        total: "€28",
        cta: "TRACK THE BOX →",
      },
      transactional: {
        headline: "Verify your email",
        body: "Tap below and you're in. Then it's coffee all the way.",
        cta: "VERIFY EMAIL →",
        note: "Not you? Ignore this and nothing happens.",
      },
    },
  },
  {
    id: "maru",
    name: "Maru Home",
    colors: {
      bg: "#14110f",
      ink: "#f2e8d8",
      muted: "#a89f90",
      line: "#3a332c",
      accent: "#b08968",
      accentInk: "#14110f",
      soft: "#b08968",
      cta: "ink",
    },
    fonts: {
      display: '"DM Serif Display", Georgia, serif',
      displayWeight: 400,
      displayTracking: "0",
      body: SANS,
      mono: MONO,
    },
    logo: {
      mark: "ring",
      text: "MARU",
      font: '"Syne", system-ui, sans-serif',
      weight: 800,
      tracking: "0.12em",
      size: 14,
    },
    footer: "Maru Home · Copenhagen",
    layouts: {
      header: ["left", "center"],
      hero: ["plain"],
      align: ["left"],
      cta: ["outline", "solid"],
      code: ["box", "tiles"],
    },
    copy: {
      marketing: {
        eyebrow: "THE AUTUMN EDIT",
        headline: "Rooms that feel slower.",
        body: "Oak, wool and ceramics made to last. New pieces arrive every week.",
        cta: "Browse the edit",
        items: [
          { name: "Oak Side Table", price: "€220" },
          { name: "Wool Throw", price: "€95" },
        ],
        suffix: "Unsubscribe",
      },
      ecommerce: {
        eyebrow: "ARRIVES THURSDAY, 14 MAY",
        headline: "Your order is on its way.",
        sub: "Delivered by our own van, with a call ahead.",
        item: { name: "Oak Side Table", meta: "Natural · Qty 1", price: "€220" },
        totalLabel: "Total",
        total: "€220",
        cta: "Follow delivery",
      },
      transactional: {
        headline: "Confirm it's you",
        body: "Use this code to approve the new device on your Maru account.",
        code: "639 204",
        cta: "Approve device",
        note: "If this was not you, change your password now.",
      },
    },
  },
  {
    id: "lumen",
    name: "Lumen",
    colors: {
      bg: "#ffffff",
      ink: "#2e1065",
      muted: "#6b7280",
      line: "#ede9fe",
      accent: "#4c1d95",
      accentInk: "#ede9fe",
      soft: "#f5f3ff",
      cta: "accent",
    },
    fonts: {
      display: '"Syne", system-ui, sans-serif',
      displayWeight: 700,
      displayTracking: "-0.01em",
      body: SANS,
      mono: MONO,
    },
    logo: {
      mark: "diamond",
      text: "LUMEN",
      font: '"Syne", system-ui, sans-serif',
      weight: 700,
      tracking: "0.2em",
      size: 13,
    },
    footer: "Lumen · Amsterdam",
    layouts: {
      header: ["band", "left"],
      hero: ["plain", "band"],
      align: ["center", "left"],
      cta: ["solid", "block"],
      code: ["tiles", "box"],
    },
    copy: {
      marketing: {
        eyebrow: "JUST SHIPPED",
        headline: "Dark mode, finally.",
        body: "Lumen now follows your system theme and remembers it on every device.",
        cta: "Try it now",
        items: [
          { name: "Themes", price: "New" },
          { name: "Sync", price: "Faster" },
        ],
        suffix: "Unsubscribe",
      },
      ecommerce: {
        eyebrow: "INVOICE #LM-2207",
        headline: "Your plan is renewed.",
        sub: "Thanks for another year with Lumen.",
        item: { name: "Lumen Pro", meta: "Yearly · 1 seat", price: "$96" },
        totalLabel: "Paid",
        total: "$96",
        cta: "Download invoice",
      },
      transactional: {
        headline: "Your sign-in code",
        body: "Enter it within 5 minutes to sign in to Lumen.",
        code: "7 3 5 2 0 6",
        cta: "Open Lumen",
        note: "Signed in from Chrome on macOS, Amsterdam.",
      },
    },
  },
  {
    id: "harbor",
    name: "Harbor & Co",
    colors: {
      bg: "#fbf7ef",
      ink: "#123b42",
      muted: "#4f6d72",
      line: "#d9e8e6",
      accent: "#0e5a66",
      accentInk: "#fbf7ef",
      soft: "#d9e8e6",
      cta: "accent",
    },
    fonts: {
      display: '"Lora", Georgia, serif',
      displayWeight: 500,
      displayTracking: "-0.01em",
      body: SANS,
      mono: MONO,
    },
    logo: {
      mark: "ring",
      text: "Harbor & Co",
      font: '"Lora", Georgia, serif',
      weight: 500,
      tracking: "0",
      italic: true,
      size: 17,
    },
    footer: "Harbor & Co · Falmouth",
    layouts: {
      header: ["center", "left"],
      hero: ["plain", "band"],
      align: ["center", "left"],
      cta: ["solid", "outline"],
      code: ["box", "tiles"],
    },
    copy: {
      marketing: {
        eyebrow: "SUMMER ON THE WATER",
        headline: "Salt air, sorted.",
        body: "Sun-faded canvas and rope-handled bags, made for the dock and the beach.",
        cta: "Explore the range",
        items: [
          { name: "Dock Tote", price: "£64" },
          { name: "Sail Cap", price: "£28" },
        ],
        suffix: "Unsubscribe",
      },
      ecommerce: {
        eyebrow: "ORDER #HC-3081",
        headline: "Your parcel has set sail.",
        sub: "Expect it within three working days.",
        item: { name: "Dock Tote", meta: "Navy · Qty 1", price: "£64" },
        totalLabel: "Total",
        total: "£64",
        cta: "Track parcel",
      },
      transactional: {
        headline: "Your booking code",
        body: "Show this code at the harbour office when you arrive.",
        code: "HC 7421",
        cta: "View booking",
        note: "Need to change it? Reply to this email.",
      },
    },
  },
  {
    id: "blip",
    name: "Blip",
    colors: {
      bg: "#fff4e8",
      ink: "#1b1b3a",
      muted: "#5d5d7a",
      line: "#ffd9c9",
      accent: "#ff5a36",
      accentInk: "#1b1b3a",
      soft: "#ffd9c9",
      cta: "ink",
    },
    fonts: {
      display: '"Bricolage Grotesque", system-ui, sans-serif',
      displayWeight: 700,
      displayTracking: "-0.03em",
      body: SANS,
      mono: MONO,
    },
    logo: {
      mark: "circle",
      text: "blip",
      font: '"Bricolage Grotesque", system-ui, sans-serif',
      weight: 700,
      tracking: "-0.03em",
      size: 18,
    },
    footer: "Blip Stickers · Austin",
    layouts: {
      header: ["left", "band"],
      hero: ["band", "plain"],
      align: ["left", "center"],
      cta: ["solid", "block"],
      code: ["tiles", "box"],
    },
    copy: {
      marketing: {
        eyebrow: "NEW DROP",
        headline: "Stickers, but make it bigger.",
        body: "Our biggest pack yet: 60 weatherproof stickers for laptops, bikes and walls.",
        cta: "Grab a pack",
        items: [
          { name: "Mega Pack", price: "$18" },
          { name: "Mini Pack", price: "$9" },
        ],
        suffix: "Unsubscribe",
      },
      ecommerce: {
        eyebrow: "ORDER #B-0042",
        headline: "Yay, your order's in!",
        sub: "We're packing it with extra stickers.",
        item: { name: "Mega Sticker Pack", meta: "Qty 1", price: "$18" },
        totalLabel: "Total",
        total: "$18",
        cta: "Where's my pack?",
      },
      transactional: {
        headline: "Quick, confirm your email",
        body: "Pop this code into the app and you are done.",
        code: "5 8 2 1",
        cta: "Open the app",
        note: "Not you? Just ignore this one.",
      },
    },
  },
];

/** First three brands are the ones shown on page load: marketing, e-commerce, transactional. */
export const initialBrandIds = ["northwind", "rosa", "sprout"] as const;

export function defaultLayout(brand: Brand): Layout {
  const l = brand.layouts;
  return {
    header: l.header[0],
    hero: l.hero[0],
    align: l.align[0],
    cta: l.cta[0],
    code: l.code[0],
  };
}

function pick<T>(list: T[], random: () => number): T {
  return list[Math.floor(random() * list.length)];
}

export function randomLayout(brand: Brand, random: () => number = Math.random): Layout {
  const l = brand.layouts;
  return {
    header: pick(l.header, random),
    hero: pick(l.hero, random),
    align: pick(l.align, random),
    cta: pick(l.cta, random),
    code: pick(l.code, random),
  };
}

/** Pick `count` distinct brands that are not in `exclude`. */
export function pickBrands(
  count: number,
  exclude: string[],
  random: () => number = Math.random,
): Brand[] {
  const pool = brands.filter((b) => !exclude.includes(b.id));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/** Hub section an entry is listed under, in page order. */
export type IntegrationCategory = "agents" | "sdks" | "platforms" | "connectors" | "everything";

export type IntegrationType =
  | "SDK"
  | "Framework"
  | "Protocol"
  | "API"
  | "Plugin"
  | "Platform guide"
  | "Marketplace app"
  | "Automation platform"
  | "AI agents and MCP"
  | "Connector platform";

/** Only `live` renders. `held` waits on a fix; `removed` stays for the record. */
export type IntegrationStatus = "live" | "held" | "removed";

export type IntegrationAuth =
  | "API key"
  | "OAuth or API key"
  | "SMTP credentials"
  | "Set up in the platform"
  | "Set per endpoint";

/** One setup block. `code` renders highlighted with a copy button; `steps` renders as a numbered list. */
export type IntegrationSetup =
  | { kind: "code"; label: string; lang: string; code: string; note?: string }
  | { kind: "steps"; steps: string[] };

export interface IntegrationFaq {
  question: string;
  answer: string;
}

export interface Integration {
  /** As the partner writes it: "n8n", "Tray.ai". */
  name: string;
  /** Lowercase, one word where possible. The detail page lives at `/integrations/{slug}/`. */
  slug: string;
  type: IntegrationType;
  category: IntegrationCategory;
  /** "Lettr" or the company that built and maintains it. */
  builtBy: string;
  /** One plain sentence: "Lettr works with {Tool} through {method}." No adjectives. */
  statement: string;
  /** Card line, short enough to never truncate. */
  summary: string;
  /** Three to five things the integration does today. */
  canDo: string[];
  setup?: IntegrationSetup[];
  auth: IntegrationAuth;
  requirements?: string[];
  links: {
    docs?: string;
    /** The live public entry: registry, marketplace or partner catalog. */
    listing?: string;
    source?: string;
    /** How the listing link reads on the detail page, e.g. "Package on npm". */
    listingLabel?: string;
  };
  /** Shown in the hub's featured row. */
  featured?: boolean;
  status: IntegrationStatus;
  /** ISO date the listing was last opened and read. Shown on the page. */
  lastChecked: string;
  /** Root-relative path to a one-colour SVG glyph, tinted to the tile; entries without one get a lettermark. */
  logo?: string;
  /** Text drawn in place of the first-letter lettermark when the entry has no glyph (".md"). */
  lettermark?: string;
  /**
   * The company's official logo files, shown exactly as supplied (never tinted). Wins over `logo`.
   * `light` is the file for light backgrounds; `dark` for dark ones, when the brand has a separate file.
   */
  brandLogo?: { light: string; dark?: string };
  /**
   * Optical size: the share of the tile's logo box the mark is drawn at. The Font Awesome glyphs
   * fill about 80% of theirs, so a mark that runs edge to edge sets 0.8 to look the same size.
   */
  logoScale?: number;
  related?: string[];
  /** Other words people search for this by, e.g. "javascript" for Node.js. Not shown. */
  keywords?: string[];
  /** The name the A–Z filter files this under when `name` leads with a generic word ("MCP server"). */
  sortName?: string;
  /** How the footer CTA names the entry after "Send from", when `name` is a common noun ("a hosted MCP server"). */
  ctaName?: string;
  faq?: IntegrationFaq[];
  /** `<title>` (50–60 characters with the suffix), meta description (≤155) and H1 of the entry's page. Required for live entries. */
  seo?: { title: string; description: string; heading: string };
}

export interface IntegrationSection {
  id: IntegrationCategory;
  heading: string;
  intro: string;
}

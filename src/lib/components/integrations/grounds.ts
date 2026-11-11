import type { IntegrationCategory } from "$lib/integrations/types";

/** Tile grounds from the card system, each with the logo colour that reads on it. */
export type Ground = "white" | "plum" | "forest" | "blush" | "ink";

/** `dark` picks a brand's dark-background logo file where it has one. */
export const grounds: Record<Ground, { tile: string; logo: string; arrow: string; dark: boolean }> =
  {
    white: { tile: "bg-white", logo: "text-surface", arrow: "text-subtle", dark: false },
    plum: {
      tile: "bg-plum",
      logo: "text-primary-outline",
      arrow: "text-primary-outline",
      dark: true,
    },
    forest: {
      tile: "bg-forest",
      logo: "text-mint-outline",
      arrow: "text-mint-outline",
      dark: true,
    },
    blush: { tile: "bg-primary-soft", logo: "text-primary", arrow: "text-primary", dark: false },
    ink: { tile: "bg-surface", logo: "text-white", arrow: "text-white/70", dark: true },
  };

/** The ground a detail page's logo tile takes, so each family of pages has its own colour. */
export const categoryGround: Record<IntegrationCategory, Ground> = {
  agents: "plum",
  sdks: "ink",
  platforms: "blush",
  connectors: "forest",
  everything: "white",
};

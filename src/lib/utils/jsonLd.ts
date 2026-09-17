/**
 * A `<script type="application/ld+json">` tag for `{@html}`. `<` is escaped
 * so text such as a quoted `</script>` in authored copy cannot end the tag.
 */
export function jsonLdScript(data: unknown): string {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

export const SITE_URL = "https://lettr.com";

/** Absolute URL for a root-relative path; absolute URLs pass through. */
export function absoluteUrl(value: string): string {
  return value.startsWith("http") ? value : `${SITE_URL}${value}`;
}

/**
 * The homepage defines these nodes in full; every other page repeats this
 * minimal copy because crawlers do not resolve an `@id` across pages.
 */
export const organization = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Lettr",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg` },
};

export const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Lettr",
  url: SITE_URL,
  publisher: { "@id": organization["@id"] },
};

export function breadcrumb(id: string, items: { name: string; item: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      ...entry,
    })),
  };
}

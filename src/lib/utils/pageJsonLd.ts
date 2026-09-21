import { SITE_URL, absoluteUrl, breadcrumb, organization, website } from "./jsonLd";

/**
 * Structured data for blog posts, feature, product and compare pages. A graph
 * that references the Organization or WebSite ends with their shared minimal
 * nodes.
 */

export interface FaqEntry {
  question: string;
  /** Plain-text answer, without markup. */
  answer: string;
}

export function faqPage(url: string, faqs: readonly FaqEntry[]) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export interface BlogPostJsonLdInput {
  slug: string;
  title: string;
  description: string;
  /** ISO publish date, e.g. "2026-09-16". */
  datetime?: string;
  /** ISO date of the last substantial edit. Defaults to {@link datetime}. */
  dateModified?: string;
  category?: string;
  author: { name: string; role?: string; avatar?: string };
  image?: string;
  faqs?: readonly FaqEntry[];
}

export function blogPostJsonLd(post: BlogPostJsonLdInput) {
  const url = `${SITE_URL}/blog/${post.slug}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        mainEntityOfPage: url,
        headline: post.title,
        description: post.description,
        ...(post.datetime
          ? { datePublished: post.datetime, dateModified: post.dateModified ?? post.datetime }
          : {}),
        ...(post.category ? { articleSection: post.category } : {}),
        image: absoluteUrl(post.image ?? "/og-image.png"),
        inLanguage: "en",
        author: {
          "@type": "Person",
          name: post.author.name,
          ...(post.author.role ? { jobTitle: post.author.role } : {}),
          ...(post.author.avatar ? { image: absoluteUrl(post.author.avatar) } : {}),
          worksFor: { "@id": organization["@id"] },
        },
        publisher: { "@id": organization["@id"] },
        isPartOf: { "@id": website["@id"] },
      },
      breadcrumb(`${url}#breadcrumb`, [
        { name: "Home", item: `${SITE_URL}/` },
        { name: "Blog", item: `${SITE_URL}/blog/` },
        { name: post.title, item: url },
      ]),
      ...(post.faqs?.length ? [faqPage(url, post.faqs)] : []),
      website,
      organization,
    ],
  };
}

export interface PageLink {
  name: string;
  /** Root-relative path with the trailing slash, e.g. "/compare/". */
  path: string;
}

/**
 * Compare and product pages: Lettr as a SoftwareApplication plus the page's
 * breadcrumb (Home → optional parent → page). The application node always
 * describes Lettr, never a compared provider, and deliberately carries no
 * offers or ratings.
 */
export function productPageJsonLd(page: PageLink & { description: string; parent?: PageLink }) {
  const url = absoluteUrl(page.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Lettr",
        description: page.description,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
      },
      breadcrumb(`${url}#breadcrumb`, [
        { name: "Home", item: `${SITE_URL}/` },
        ...(page.parent ? [{ name: page.parent.name, item: absoluteUrl(page.parent.path) }] : []),
        { name: page.name, item: url },
      ]),
    ],
  };
}

/** Minimal graph for pages without richer structured data. */
export function basicPageJsonLd(
  page: PageLink & { type?: "WebPage" | "AboutPage" | "CollectionPage" },
) {
  const url = absoluteUrl(page.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": page.type ?? "WebPage",
        "@id": url,
        url,
        name: page.name,
        isPartOf: { "@id": website["@id"] },
      },
      website,
      organization,
    ],
  };
}

export function featurePageJsonLd(page: { path: string; title: string; description: string }) {
  const url = absoluteUrl(page.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: page.title,
        description: page.description,
        inLanguage: "en",
        isPartOf: { "@id": website["@id"] },
        publisher: { "@id": organization["@id"] },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      breadcrumb(`${url}#breadcrumb`, [
        { name: "Home", item: `${SITE_URL}/` },
        { name: page.title, item: url },
      ]),
      website,
      organization,
    ],
  };
}

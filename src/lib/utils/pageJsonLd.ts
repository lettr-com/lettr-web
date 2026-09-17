/**
 * Structured data for blog posts and feature pages. The root layout emits the
 * Organization and WebSite nodes on the homepage only, and crawlers do not
 * resolve an `@id` across pages, so every graph carries a minimal copy.
 */
const SITE_URL = "https://lettr.com";

const organization = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Lettr",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg` },
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Lettr",
  url: SITE_URL,
  publisher: { "@id": organization["@id"] },
};

const ORGANIZATION_ID = organization["@id"];
const WEBSITE_ID = website["@id"];

export interface FaqEntry {
  question: string;
  /** Plain-text answer, without markup. */
  answer: string;
}

function absolute(value: string): string {
  return value.startsWith("http") ? value : `${SITE_URL}${value}`;
}

function breadcrumb(url: string, items: { name: string; item: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      ...entry,
    })),
  };
}

function faqPage(url: string, faqs: readonly FaqEntry[]) {
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
        ...(post.datetime ? { datePublished: post.datetime } : {}),
        ...(post.datetime ? { dateModified: post.dateModified ?? post.datetime } : {}),
        ...(post.category ? { articleSection: post.category } : {}),
        image: absolute(post.image ?? "/og-image.png"),
        inLanguage: "en",
        author: {
          "@type": "Person",
          name: post.author.name,
          ...(post.author.role ? { jobTitle: post.author.role } : {}),
          ...(post.author.avatar ? { image: absolute(post.author.avatar) } : {}),
          worksFor: { "@id": ORGANIZATION_ID },
        },
        publisher: { "@id": ORGANIZATION_ID },
        isPartOf: { "@id": WEBSITE_ID },
      },
      breadcrumb(url, [
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

export function featurePageJsonLd(page: { path: string; title: string; description: string }) {
  const url = absolute(page.path);
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
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORGANIZATION_ID },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      breadcrumb(url, [
        { name: "Home", item: `${SITE_URL}/` },
        { name: page.title, item: url },
      ]),
      website,
      organization,
    ],
  };
}

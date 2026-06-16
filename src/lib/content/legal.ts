import { marked } from "marked";

import accessibilityStatementMarkdown from "../../../static/legals/statement.md?raw";
import privacyPolicyMarkdown from "../../../static/legals/privacy-policy.md?raw";
import termsOfUseMarkdown from "../../../static/legals/terms.md?raw";
import termsOfUse20260215Markdown from "../../../static/legals/terms-15-02-2026.md?raw";

export type LegalDocumentKey =
  | "privacyPolicy"
  | "termsOfUse"
  | "accessibilityStatement"
  | "termsOfUse20260215";

export interface LegalNavLink {
  key: LegalDocumentKey;
  label: string;
  href: string;
}

export interface LegalDocumentData {
  key: LegalDocumentKey;
  title: string;
  description: string;
  updatedAt: string;
  href: string;
  html: string;
}

interface LegalDocumentEntry {
  title: string;
  description: string;
  updatedAt: string;
  href: string;
  markdown: string;
}

const googleDocReferencePattern = /\[(\d+)\\?\.\]\(https:\/\/docs\.google\.com\/document\/[^)]+\)/g;

const legalDocuments: Record<LegalDocumentKey, LegalDocumentEntry> = {
  privacyPolicy: {
    title: "Privacy Policy",
    description:
      "How Lettr collects, uses, stores, and protects your personal data, the rights you have over it, and the third-party processors we rely on.",
    updatedAt: "February 15, 2026",
    href: "/privacy-policy/",
    markdown: privacyPolicyMarkdown,
  },
  termsOfUse: {
    title: "Terms of Use",
    description:
      "The rules and contractual terms for using Lettr's email platform, covering accounts, acceptable use, billing, liability, and termination.",
    updatedAt: "June 4, 2026",
    href: "/terms/",
    markdown: termsOfUseMarkdown,
  },
  termsOfUse20260215: {
    title: "Terms of Use",
    description:
      "Archived Terms of Use for Lettr, effective February 15, 2026 — kept for reference and superseded by the current Terms of Use.",
    updatedAt: "February 15, 2026",
    href: "/terms-15-02-2026/",
    markdown: termsOfUse20260215Markdown,
  },
  accessibilityStatement: {
    title: "Accessibility Statement",
    description:
      "Lettr's commitment to digital accessibility — the standards we follow, the steps we take to meet them, and how to report any barriers you encounter.",
    updatedAt: "January 30, 2026",
    href: "/accessibility-statement/",
    markdown: accessibilityStatementMarkdown,
  },
};

// Keys shown in the legal nav. Archived documents (e.g. superseded Terms
// versions) are intentionally excluded so they stay reachable only by direct URL.
const navLinkKeys: LegalDocumentKey[] = ["privacyPolicy", "termsOfUse", "accessibilityStatement"];

export const legalNavLinks: LegalNavLink[] = navLinkKeys.map((key) => ({
  key,
  label: legalDocuments[key].title,
  href: legalDocuments[key].href,
}));

function normalizeLegalMarkdown(markdown: string): string {
  return markdown
    .replace(/<span class="mark">/g, "")
    .replace(/<\/span>/g, "")
    .replace(/<mark>/g, "")
    .replace(/<\/mark>/g, "")
    .replace(/<u>/g, "")
    .replace(/<\/u>/g, "")
    .replace(googleDocReferencePattern, "$1.");
}

export async function getLegalDocumentData(key: LegalDocumentKey): Promise<LegalDocumentData> {
  const document = legalDocuments[key];
  const html = await marked.parse(normalizeLegalMarkdown(document.markdown));

  return {
    key,
    title: document.title,
    description: document.description,
    updatedAt: document.updatedAt,
    href: document.href,
    html,
  };
}

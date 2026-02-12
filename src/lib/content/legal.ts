import { marked } from 'marked';

import accessibilityStatementMarkdown from '../../../static/legals/statement.md?raw';
import privacyPolicyMarkdown from '../../../static/legals/privacy-policy.md?raw';
import termsOfUseMarkdown from '../../../static/legals/terms.md?raw';

export type LegalDocumentKey = 'privacyPolicy' | 'termsOfUse' | 'accessibilityStatement';

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

const googleDocReferencePattern = /\[(\d+\.)\]\(https:\/\/docs\.google\.com\/document\/[^)]+\)/g;

const legalDocuments: Record<LegalDocumentKey, LegalDocumentEntry> = {
	privacyPolicy: {
		title: 'Privacy Policy',
		description: 'How Lettr collects, uses, and protects personal data.',
		updatedAt: 'February 15, 2026',
		href: '/privacy-policy/',
		markdown: privacyPolicyMarkdown
	},
	termsOfUse: {
		title: 'Terms of Use',
		description: 'Rules and contractual terms for using Lettr services.',
		updatedAt: 'February 15, 2026',
		href: '/terms/',
		markdown: termsOfUseMarkdown
	},
	accessibilityStatement: {
		title: 'Accessibility Statement',
		description: 'Accessibility commitment and compliance details for lettr.com.',
		updatedAt: 'January 30, 2026',
		href: '/accessibility-statement/',
		markdown: accessibilityStatementMarkdown
	}
};

export const legalNavLinks: LegalNavLink[] = (Object.entries(legalDocuments) as [
	LegalDocumentKey,
	LegalDocumentEntry
][]).map(([key, document]) => ({
	key,
	label: document.title,
	href: document.href
}));

function normalizeLegalMarkdown(markdown: string): string {
	return markdown
		.replace(/<span class="mark">/g, '')
		.replace(/<\/span>/g, '')
		.replace(/<mark>/g, '')
		.replace(/<\/mark>/g, '')
		.replace(/<u>/g, '')
		.replace(/<\/u>/g, '')
		.replace(googleDocReferencePattern, '$1');
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
		html
	};
}

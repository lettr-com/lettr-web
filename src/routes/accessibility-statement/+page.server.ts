import type { PageServerLoad } from './$types';

import { getLegalDocumentData, legalNavLinks } from '$lib/content/legal';

export const load: PageServerLoad = async () => ({
	document: await getLegalDocumentData('accessibilityStatement'),
	links: legalNavLinks
});

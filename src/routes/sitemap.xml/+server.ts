import { providerSlugs } from '$lib/data/providers';
import type { RequestHandler } from './$types';

const BASE_URL = 'https://lettr.com';

interface SitemapEntry {
	loc: string;
	changefreq: string;
	priority: number;
}

const staticPages: SitemapEntry[] = [
	{ loc: '/', changefreq: 'weekly', priority: 1.0 },
	{ loc: '/about', changefreq: 'monthly', priority: 0.8 },
	{ loc: '/changelog', changefreq: 'weekly', priority: 0.7 },
	{ loc: '/support', changefreq: 'monthly', priority: 0.7 },
	{ loc: '/compare', changefreq: 'monthly', priority: 0.8 },
	{ loc: '/platform/laravel', changefreq: 'monthly', priority: 0.8 },
	{ loc: '/platform/templates', changefreq: 'monthly', priority: 0.7 },
	{ loc: '/platform/sync', changefreq: 'monthly', priority: 0.7 },
	{ loc: '/platform/analytics', changefreq: 'monthly', priority: 0.7 },
	{ loc: '/platform/deliverability', changefreq: 'monthly', priority: 0.7 },
	{ loc: '/platform/mcp', changefreq: 'monthly', priority: 0.7 },
	{ loc: '/channels/email', changefreq: 'monthly', priority: 0.7 },
	{ loc: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
	{ loc: '/terms', changefreq: 'yearly', priority: 0.3 },
	{ loc: '/accessibility-statement', changefreq: 'yearly', priority: 0.3 }
];

export const GET: RequestHandler = () => {
	const dynamicPages: SitemapEntry[] = providerSlugs.map((slug) => ({
		loc: `/compare/${slug}`,
		changefreq: 'monthly',
		priority: 0.7
	}));

	const allPages = [...staticPages, ...dynamicPages];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		(page) => `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};

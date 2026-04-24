import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		prerender: {
			entries: ['*', '/sitemap.xml'],
			handleUnseenRoutes: ({ routes, message }) => {
				const unseen = routes.filter((r) => r !== '/sitemap.xml');
				if (unseen.length) throw new Error(message);
			}
		}
	}
};

export default config;

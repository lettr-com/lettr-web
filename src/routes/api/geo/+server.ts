import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const CLOUDFLARE_SPECIALS = new Set(['XX', 'T1']);

export const GET: RequestHandler = ({ request }) => {
	const raw = request.headers.get('CF-IPCountry');
	const countryCode = raw && !CLOUDFLARE_SPECIALS.has(raw) ? raw : null;

	return json(
		{ countryCode },
		{
			headers: {
				'Cache-Control': 'private, max-age=3600',
			},
		},
	);
};

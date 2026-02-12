import { json, type RequestHandler } from '@sveltejs/kit';
import type { InitResponse } from '$lib/zaptime/types';
import { getZaptimeConfig, getZaptimeHeaders, parseJsonResponse } from '$lib/server/zaptime';

export const prerender = false;

export const GET: RequestHandler = async ({ fetch }) => {
	const { token, baseUrl } = getZaptimeConfig();

	const response = await fetch(`${baseUrl}event-types/init`, {
		method: 'POST',
		headers: getZaptimeHeaders(token),
		body: JSON.stringify({})
	});

	const data = await parseJsonResponse<InitResponse>(
		response,
		'Could not load booking configuration'
	);

	return json(data);
};

import { json, type RequestHandler } from '@sveltejs/kit';
import type { AvailableTimeSlotsResponse } from '$lib/zaptime/types';
import { getZaptimeConfig, getZaptimeHeaders, parseJsonResponse } from '$lib/server/zaptime';

export const prerender = false;

function defaultDateRange() {
	const fromDate = new Date();
	const untilDate = new Date();
	untilDate.setDate(untilDate.getDate() + 21);

	return {
		from: fromDate.toISOString(),
		until: untilDate.toISOString()
	};
}

export const GET: RequestHandler = async ({ fetch, url }) => {
	const { token, baseUrl } = getZaptimeConfig();
	const defaultRange = defaultDateRange();
	const from = url.searchParams.get('from') ?? defaultRange.from;
	const until = url.searchParams.get('until') ?? defaultRange.until;

	const params = new URLSearchParams({ from, until });
	const response = await fetch(`${baseUrl}time-slots?${params.toString()}`, {
		headers: getZaptimeHeaders(token)
	});

	const data = await parseJsonResponse<AvailableTimeSlotsResponse>(
		response,
		'Could not load available time slots'
	);

	return json(data);
};

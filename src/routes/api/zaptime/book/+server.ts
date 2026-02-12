import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { ReservationPayload, ReservationResponse } from '$lib/zaptime/types';
import { getZaptimeConfig, getZaptimeHeaders, parseJsonResponse } from '$lib/server/zaptime';

export const prerender = false;

export const POST: RequestHandler = async ({ fetch, request }) => {
	const { token, baseUrl } = getZaptimeConfig();
	const payload = (await request.json()) as Partial<ReservationPayload>;

	if (!payload.email || !payload.timeSlot?.start || !payload.timeSlot?.end || !payload.timezone) {
		throw error(400, 'Missing required booking fields');
	}

	const response = await fetch(`${baseUrl}reservations`, {
		method: 'POST',
		headers: getZaptimeHeaders(token),
		body: JSON.stringify({
			start: payload.timeSlot.start,
			end: payload.timeSlot.end,
			email: payload.email,
			seats: payload.seats ?? 1,
			firstname: payload.firstName,
			lastname: payload.lastName,
			phone: payload.phone,
			location: payload.location,
			timezone: payload.timezone,
			customFields: payload.customFields
		})
	});

	const data = await parseJsonResponse<ReservationResponse>(response, 'Could not book time slot');

	return json(data);
};

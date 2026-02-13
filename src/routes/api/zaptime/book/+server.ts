import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getCurrentZaptimeConfig } from '$lib/server/zaptime-config';
import { verifyTurnstileToken } from '$lib/server/turnstile';
import type { ReservationPayload, ReservationResponse } from '$lib/zaptime/types';
import { getZaptimeConfig, getZaptimeHeaders, parseJsonResponse } from '$lib/server/zaptime';

export const prerender = false;

function buildCustomFields(payload: Partial<ReservationPayload>) {
	const customFields: NonNullable<ReservationPayload['customFields']> = [];
	const { customFieldIds } = getCurrentZaptimeConfig();
	const companyFieldId = customFieldIds.company;
	if (companyFieldId && payload.companyName?.trim()) {
		customFields.push({
			uuid: companyFieldId,
			value: payload.companyName.trim()
		});
	}

	const emailsVolumeFieldId = customFieldIds.emailsVolume;
	if (emailsVolumeFieldId && payload.emailsVolume?.trim()) {
		customFields.push({
			uuid: emailsVolumeFieldId,
			value: payload.emailsVolume.trim()
		});
	}

	return customFields;
}

function getRequestIp(request: Request) {
	const cloudflareIp = request.headers.get('CF-Connecting-IP');
	if (cloudflareIp) {
		return cloudflareIp;
	}

	const forwardedFor = request.headers.get('x-forwarded-for');
	if (!forwardedFor) {
		return null;
	}

	const [first] = forwardedFor.split(',');
	return first?.trim() || null;
}

export const POST: RequestHandler = async ({ fetch, request }) => {
	const { token, baseUrl } = getZaptimeConfig();
	const payload = (await request.json()) as Partial<ReservationPayload>;

	if (
		!payload.email ||
		!payload.companyName?.trim() ||
		!payload.timeSlot?.start ||
		!payload.timeSlot?.end ||
		!payload.timezone ||
		!payload.turnstileToken
	) {
		throw error(400, 'Missing required booking fields');
	}

	const verification = await verifyTurnstileToken(payload.turnstileToken, getRequestIp(request));
	if (!verification.success) {
		throw error(400, 'Please complete the captcha challenge');
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
			phone: payload.companyName ?? payload.phone,
			location: payload.location,
			timezone: payload.timezone,
			customFields: buildCustomFields(payload)
		})
	});

	const data = await parseJsonResponse<ReservationResponse>(response, 'Could not book time slot');

	return json(data);
};

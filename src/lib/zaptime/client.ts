import { getZaptimeConfig } from './config';
import type {
	AvailableTimeSlotsResponse,
	InitResponse,
	ReservationPayload,
	ReservationResponse,
	TimeSlot
} from './types';

function headers() {
	const { token } = getZaptimeConfig();
	return {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: `Bearer ${token}`
	};
}

async function parseJson<T>(response: Response, fallback: string): Promise<T> {
	const text = await response.text();

	if (!text) {
		if (response.ok) return { success: true } as T;
		throw new Error(fallback);
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(text);
	} catch {
		throw new Error(response.ok ? 'Invalid JSON response from Zaptime API' : fallback);
	}

	if (!response.ok) {
		const message =
			typeof parsed === 'object' && parsed !== null && 'message' in parsed
				? String((parsed as { message: unknown }).message)
				: fallback;
		throw new Error(message);
	}

	return parsed as T;
}

export async function fetchZaptimeConfig(): Promise<InitResponse> {
	const { baseUrl } = getZaptimeConfig();
	const response = await fetch(`${baseUrl}event-types/init`, {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({})
	});

	return parseJson<InitResponse>(response, 'Could not load booking configuration');
}

export async function fetchZaptimeSlots(
	from: string,
	until: string
): Promise<AvailableTimeSlotsResponse> {
	const { baseUrl } = getZaptimeConfig();
	const params = new URLSearchParams({ from, until });
	const response = await fetch(`${baseUrl}time-slots?${params.toString()}`, {
		headers: headers()
	});

	return parseJson<AvailableTimeSlotsResponse>(response, 'Could not load available time slots');
}

type BookingRequest = {
	email: string;
	firstName?: string;
	lastName?: string;
	companyName: string;
	phone?: string;
	location?: string;
	seats?: number;
	emailsVolume?: string;
	timeSlot: TimeSlot;
	timezone: string;
};

export async function bookZaptimeSlot(req: BookingRequest): Promise<ReservationResponse> {
	const { baseUrl, customFieldIds } = getZaptimeConfig();

	const customFields: NonNullable<ReservationPayload['customFields']> = [];
	if (customFieldIds.company && req.companyName.trim()) {
		customFields.push({ uuid: customFieldIds.company, value: req.companyName.trim() });
	}
	if (customFieldIds.emailsVolume && req.emailsVolume?.trim()) {
		customFields.push({ uuid: customFieldIds.emailsVolume, value: req.emailsVolume.trim() });
	}

	const body = {
		start: req.timeSlot.start,
		end: req.timeSlot.end,
		email: req.email,
		seats: req.seats ?? 1,
		firstname: req.firstName,
		lastname: req.lastName,
		phone: req.companyName ?? req.phone,
		location: req.location,
		timezone: req.timezone,
		customFields
	};

	const response = await fetch(`${baseUrl}reservations`, {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify(body)
	});

	return parseJson<ReservationResponse>(response, 'Could not book time slot');
}

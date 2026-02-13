import { getCurrentZaptimeConfig } from '$lib/server/zaptime-config';
import { error } from '@sveltejs/kit';

const defaultBaseUrl = 'https://api.zaptime.app/';

function withTrailingSlash(url: string) {
	return url.endsWith('/') ? url : `${url}/`;
}

export function getZaptimeConfig() {
	const config = getCurrentZaptimeConfig();
	const token = config.apiToken.trim();
	const baseUrl = withTrailingSlash(config.apiBaseUrl || defaultBaseUrl);

	return { token, baseUrl };
}

export function getZaptimeHeaders(token: string) {
	return {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: `Bearer ${token}`
	};
}

export async function parseJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
	const text = await response.text();

	if (!text) {
		if (response.ok) {
			return { success: true } as T;
		}
		throw error(response.status, fallbackMessage);
	}

	let parsed: T | Record<string, unknown>;

	try {
		parsed = JSON.parse(text) as T;
	} catch {
		if (!response.ok) {
			throw error(response.status, fallbackMessage);
		}
		throw error(500, 'Invalid JSON response from Zaptime API');
	}

	if (!response.ok) {
		const message =
			typeof parsed === 'object' && parsed !== null && 'message' in parsed
				? String(parsed.message)
				: fallbackMessage;
		throw error(response.status, message);
	}

	return parsed as T;
}

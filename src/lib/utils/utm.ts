import { getCookieValue } from '$lib/utils/cookieConsent';

export const registerUrl = 'https://app.lettr.com/register';

const utmCookieName = 'lettr_utm';

export type UtmParams = Record<string, string>;

function hasUtmParams(utmParams: UtmParams): boolean {
	return Object.keys(utmParams).length > 0;
}

export function extractUtmParams(searchParams: URLSearchParams): UtmParams {
	const utmParams: UtmParams = {};

	for (const [key, value] of searchParams.entries()) {
		if (!key.toLowerCase().startsWith('utm_')) continue;
		if (!value) continue;
		utmParams[key] = value;
	}

	return utmParams;
}

export function buildUtmCookieString(utmParams: UtmParams, maxAgeDays: number = 7): string {
	const serializedParams = new URLSearchParams(utmParams).toString();
	const maxAge = maxAgeDays * 24 * 60 * 60;

	return `${utmCookieName}=${encodeURIComponent(serializedParams)}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
}

export function getUtmParamsFromCookie(cookieString: string): UtmParams {
	const value = getCookieValue(cookieString, utmCookieName);
	if (!value) return {};

	let decodedValue = '';
	try {
		decodedValue = decodeURIComponent(value);
	} catch {
		return {};
	}

	const parsed = new URLSearchParams(decodedValue);
	const utmParams: UtmParams = {};

	for (const [key, paramValue] of parsed.entries()) {
		if (!key.toLowerCase().startsWith('utm_')) continue;
		if (!paramValue) continue;
		utmParams[key] = paramValue;
	}

	return utmParams;
}

export function writeUtmCookie(
	utmParams: UtmParams,
	doc: { cookie: string } = document,
	maxAgeDays?: number,
): UtmParams {
	if (!hasUtmParams(utmParams)) return utmParams;
	doc.cookie = buildUtmCookieString(utmParams, maxAgeDays);
	return utmParams;
}

export function persistUtmParamsFromUrl(url: URL, doc: { cookie: string } = document): UtmParams {
	const utmParams = extractUtmParams(url.searchParams);
	if (!hasUtmParams(utmParams)) return utmParams;
	return writeUtmCookie(utmParams, doc);
}

export function buildRegisterUrl(url: URL, cookieString: string): string {
	const urlUtmParams = extractUtmParams(url.searchParams);
	const cookieUtmParams = getUtmParamsFromCookie(cookieString);
	const mergedUtmParams = { ...cookieUtmParams, ...urlUtmParams };

	if (!hasUtmParams(mergedUtmParams)) return registerUrl;

	const trackedRegisterUrl = new URL(registerUrl);
	for (const [key, value] of Object.entries(mergedUtmParams)) {
		trackedRegisterUrl.searchParams.set(key, value);
	}

	return trackedRegisterUrl.toString();
}

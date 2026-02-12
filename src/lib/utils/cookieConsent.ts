export type ConsentValue = 'accepted' | 'rejected';

export interface ConsentState {
	hasConsented: boolean;
	value: ConsentValue | null;
}

const COOKIE_NAME = 'cookie_consent';

export function getCookieValue(cookieString: string, name: string): string | null {
	if (!cookieString) return null;
	const entries = cookieString.split(';');
	for (const entry of entries) {
		const eqIndex = entry.indexOf('=');
		if (eqIndex === -1) continue;
		const key = entry.slice(0, eqIndex).trim();
		if (key === name) {
			return entry.slice(eqIndex + 1).trim();
		}
	}
	return null;
}

export function getConsentState(cookieString: string): ConsentState {
	const value = getCookieValue(cookieString, COOKIE_NAME);
	if (value === 'accepted' || value === 'rejected') {
		return { hasConsented: true, value };
	}
	return { hasConsented: false, value: null };
}

export function buildConsentCookieString(value: ConsentValue, maxAgeDays: number = 365): string {
	const maxAge = maxAgeDays * 24 * 60 * 60;
	return `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
}

export function shouldShowBanner(consentState: ConsentState, requiresConsent: boolean): boolean {
	if (consentState.hasConsented) return false;
	return requiresConsent;
}

export function writeConsentCookie(
	value: ConsentValue,
	doc: { cookie: string } = document,
	maxAgeDays?: number,
): ConsentValue {
	doc.cookie = buildConsentCookieString(value, maxAgeDays);
	return value;
}

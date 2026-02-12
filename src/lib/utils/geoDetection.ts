/** EU-27 + EEA (IS, LI, NO) + GB */
export const EU_EEA_COUNTRY_CODES: ReadonlySet<string> = new Set([
	// EU-27
	'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
	'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
	'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
	// EEA
	'IS', 'LI', 'NO',
	// UK (post-Brexit, still requires consent)
	'GB',
]);

export function isConsentRequiredCountry(code: string | null | undefined): boolean {
	if (!code) return false;
	return EU_EEA_COUNTRY_CODES.has(code.toUpperCase());
}

export interface GeoDetectionResult {
	countryCode: string | null;
	requiresConsent: boolean;
}

export async function fetchGeoDetection(
	endpointUrl: string,
	fetchFn: typeof fetch = fetch,
): Promise<GeoDetectionResult> {
	try {
		const response = await fetchFn(endpointUrl);
		if (!response.ok) {
			return { countryCode: null, requiresConsent: false };
		}
		const data = await response.json();
		const countryCode: string | null = data?.countryCode ?? null;
		return {
			countryCode,
			requiresConsent: isConsentRequiredCountry(countryCode),
		};
	} catch {
		return { countryCode: null, requiresConsent: false };
	}
}

import { describe, expect, it, vi } from 'vitest';
import {
	EU_EEA_COUNTRY_CODES,
	isConsentRequiredCountry,
	fetchGeoDetection,
} from './geoDetection';

describe('EU_EEA_COUNTRY_CODES', () => {
	it('contains exactly 31 entries (EU-27 + IS, LI, NO + GB)', () => {
		expect(EU_EEA_COUNTRY_CODES.size).toBe(31);
	});

	it('contains all EU-27 member states', () => {
		const eu27 = [
			'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
			'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
			'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
		];
		for (const code of eu27) {
			expect(EU_EEA_COUNTRY_CODES.has(code)).toBe(true);
		}
	});

	it('contains EEA members IS, LI, NO', () => {
		expect(EU_EEA_COUNTRY_CODES.has('IS')).toBe(true);
		expect(EU_EEA_COUNTRY_CODES.has('LI')).toBe(true);
		expect(EU_EEA_COUNTRY_CODES.has('NO')).toBe(true);
	});

	it('contains GB', () => {
		expect(EU_EEA_COUNTRY_CODES.has('GB')).toBe(true);
	});
});

describe('isConsentRequiredCountry', () => {
	it('returns true for EU country codes', () => {
		expect(isConsentRequiredCountry('DE')).toBe(true);
		expect(isConsentRequiredCountry('FR')).toBe(true);
		expect(isConsentRequiredCountry('GB')).toBe(true);
	});

	it('returns false for non-EU country codes', () => {
		expect(isConsentRequiredCountry('US')).toBe(false);
		expect(isConsentRequiredCountry('JP')).toBe(false);
		expect(isConsentRequiredCountry('AU')).toBe(false);
	});

	it('is case-insensitive', () => {
		expect(isConsentRequiredCountry('de')).toBe(true);
		expect(isConsentRequiredCountry('De')).toBe(true);
		expect(isConsentRequiredCountry('us')).toBe(false);
	});

	it('returns false for null, undefined, and empty string', () => {
		expect(isConsentRequiredCountry(null)).toBe(false);
		expect(isConsentRequiredCountry(undefined)).toBe(false);
		expect(isConsentRequiredCountry('')).toBe(false);
	});
});

describe('fetchGeoDetection', () => {
	function mockFetch(body: unknown, status = 200): typeof fetch {
		return vi.fn().mockResolvedValue({
			ok: status >= 200 && status < 300,
			status,
			json: () => Promise.resolve(body),
		});
	}

	it('returns requiresConsent true for EU country', async () => {
		const result = await fetchGeoDetection('/api/geo', mockFetch({ countryCode: 'DE' }));
		expect(result).toEqual({ countryCode: 'DE', requiresConsent: true });
	});

	it('returns requiresConsent false for non-EU country', async () => {
		const result = await fetchGeoDetection('/api/geo', mockFetch({ countryCode: 'US' }));
		expect(result).toEqual({ countryCode: 'US', requiresConsent: false });
	});

	it('returns safe default for non-200 response', async () => {
		const result = await fetchGeoDetection('/api/geo', mockFetch({}, 500));
		expect(result).toEqual({ countryCode: null, requiresConsent: false });
	});

	it('returns safe default for network error', async () => {
		const failFetch = vi.fn().mockRejectedValue(new Error('Network error'));
		const result = await fetchGeoDetection('/api/geo', failFetch);
		expect(result).toEqual({ countryCode: null, requiresConsent: false });
	});

	it('returns safe default for malformed JSON', async () => {
		const badFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.reject(new SyntaxError('Unexpected token')),
		});
		const result = await fetchGeoDetection('/api/geo', badFetch);
		expect(result).toEqual({ countryCode: null, requiresConsent: false });
	});

	it('returns null countryCode when response has no countryCode field', async () => {
		const result = await fetchGeoDetection('/api/geo', mockFetch({}));
		expect(result).toEqual({ countryCode: null, requiresConsent: false });
	});
});

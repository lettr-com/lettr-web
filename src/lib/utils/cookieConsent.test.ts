import { describe, expect, it } from 'vitest';
import {
	getCookieValue,
	getConsentState,
	buildConsentCookieString,
	writeConsentCookie,
	getViewerCountry,
	requiresExplicitConsent,
} from './cookieConsent';

describe('getCookieValue', () => {
	it('returns value for an existing cookie', () => {
		expect(getCookieValue('foo=bar; baz=qux', 'foo')).toBe('bar');
		expect(getCookieValue('foo=bar; baz=qux', 'baz')).toBe('qux');
	});

	it('returns null for a missing cookie', () => {
		expect(getCookieValue('foo=bar', 'missing')).toBeNull();
	});

	it('returns null for an empty string', () => {
		expect(getCookieValue('', 'foo')).toBeNull();
	});

	it('handles values containing =', () => {
		expect(getCookieValue('token=abc=def=ghi', 'token')).toBe('abc=def=ghi');
	});

	it('handles whitespace around entries', () => {
		expect(getCookieValue('foo=bar;  baz=qux', 'baz')).toBe('qux');
		expect(getCookieValue(' foo=bar ; baz=qux ', 'foo')).toBe('bar');
	});
});

describe('getConsentState', () => {
	it('returns hasConsented true for accepted', () => {
		expect(getConsentState('cookie_consent=accepted')).toEqual({
			hasConsented: true,
			value: 'accepted',
		});
	});

	it('returns hasConsented true for rejected', () => {
		expect(getConsentState('cookie_consent=rejected')).toEqual({
			hasConsented: true,
			value: 'rejected',
		});
	});

	it('returns hasConsented false when cookie is missing', () => {
		expect(getConsentState('other=value')).toEqual({
			hasConsented: false,
			value: null,
		});
	});

	it('returns hasConsented false for unexpected value', () => {
		expect(getConsentState('cookie_consent=maybe')).toEqual({
			hasConsented: false,
			value: null,
		});
	});

	it('returns hasConsented false for empty string', () => {
		expect(getConsentState('')).toEqual({
			hasConsented: false,
			value: null,
		});
	});
});

describe('buildConsentCookieString', () => {
	it('builds correct string for accepted', () => {
		const result = buildConsentCookieString('accepted');
		expect(result).toBe('cookie_consent=accepted; path=/; max-age=31536000; SameSite=Lax; Secure');
	});

	it('builds correct string for rejected', () => {
		const result = buildConsentCookieString('rejected');
		expect(result).toBe('cookie_consent=rejected; path=/; max-age=31536000; SameSite=Lax; Secure');
	});

	it('uses custom max-age', () => {
		const result = buildConsentCookieString('accepted', 30);
		expect(result).toContain('max-age=2592000');
	});
});

describe('writeConsentCookie', () => {
	it('writes to the provided document object', () => {
		const mockDoc = { cookie: '' };
		writeConsentCookie('accepted', mockDoc);
		expect(mockDoc.cookie).toBe(
			'cookie_consent=accepted; path=/; max-age=31536000; SameSite=Lax; Secure',
		);
	});

	it('returns the consent value', () => {
		const mockDoc = { cookie: '' };
		expect(writeConsentCookie('rejected', mockDoc)).toBe('rejected');
	});

	it('uses custom max-age days', () => {
		const mockDoc = { cookie: '' };
		writeConsentCookie('accepted', mockDoc, 30);
		expect(mockDoc.cookie).toContain('max-age=2592000');
	});
});

describe('getViewerCountry', () => {
	it('returns the upper-cased country code', () => {
		expect(getViewerCountry('viewer_country=de')).toBe('DE');
		expect(getViewerCountry('viewer_country=US')).toBe('US');
	});

	it('returns null when the cookie is missing', () => {
		expect(getViewerCountry('foo=bar')).toBeNull();
	});

	it('returns null for the XX fallback used when CloudFront cannot resolve', () => {
		expect(getViewerCountry('viewer_country=XX')).toBeNull();
	});

	it('returns null for malformed values', () => {
		expect(getViewerCountry('viewer_country=')).toBeNull();
		expect(getViewerCountry('viewer_country=USA')).toBeNull();
	});
});

describe('requiresExplicitConsent', () => {
	it('requires consent for EU member states', () => {
		expect(requiresExplicitConsent('DE')).toBe(true);
		expect(requiresExplicitConsent('FR')).toBe(true);
		expect(requiresExplicitConsent('CZ')).toBe(true);
	});

	it('requires consent for EEA countries, the UK, and Switzerland', () => {
		expect(requiresExplicitConsent('NO')).toBe(true);
		expect(requiresExplicitConsent('IS')).toBe(true);
		expect(requiresExplicitConsent('LI')).toBe(true);
		expect(requiresExplicitConsent('GB')).toBe(true);
		expect(requiresExplicitConsent('CH')).toBe(true);
	});

	it('does not require consent for countries outside the perimeter', () => {
		expect(requiresExplicitConsent('US')).toBe(false);
		expect(requiresExplicitConsent('CA')).toBe(false);
		expect(requiresExplicitConsent('JP')).toBe(false);
	});

	it('defaults to requiring consent when the country is unknown', () => {
		expect(requiresExplicitConsent(null)).toBe(true);
	});
});

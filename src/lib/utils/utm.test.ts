import { describe, expect, it } from 'vitest';
import {
	buildRegisterUrl,
	buildUtmCookieString,
	extractUtmParams,
	getUtmParamsFromCookie,
	persistUtmParamsFromUrl,
	registerUrl,
	writeUtmCookie,
} from './utm';

describe('extractUtmParams', () => {
	it('extracts utm params from URL search params', () => {
		const searchParams = new URLSearchParams('utm_source=google&utm_medium=cpc&foo=bar');

		expect(extractUtmParams(searchParams)).toEqual({
			utm_source: 'google',
			utm_medium: 'cpc',
		});
	});

	it('supports case-insensitive utm keys', () => {
		const searchParams = new URLSearchParams('UTM_SOURCE=twitter&utm_campaign=launch');

		expect(extractUtmParams(searchParams)).toEqual({
			UTM_SOURCE: 'twitter',
			utm_campaign: 'launch',
		});
	});
});

describe('buildUtmCookieString', () => {
	it('uses a 7-day max-age by default', () => {
		const cookie = buildUtmCookieString({ utm_source: 'google' });

		expect(cookie).toContain('max-age=604800');
		expect(cookie).toContain('path=/');
		expect(cookie).toContain('SameSite=Lax');
		expect(cookie).toContain('Secure');
	});
});

describe('getUtmParamsFromCookie', () => {
	it('parses utm values from cookie', () => {
		const cookie =
			'lettr_utm=utm_source%3Dgoogle%26utm_medium%3Dcpc%26foo%3Dbar; theme=dark';

		expect(getUtmParamsFromCookie(cookie)).toEqual({
			utm_source: 'google',
			utm_medium: 'cpc',
		});
	});

	it('returns empty object for malformed cookie values', () => {
		expect(getUtmParamsFromCookie('lettr_utm=%E0%A4%A')).toEqual({});
	});
});

describe('writeUtmCookie', () => {
	it('writes cookie when utm params are present', () => {
		const mockDoc = { cookie: '' };

		writeUtmCookie({ utm_source: 'google' }, mockDoc);

		expect(mockDoc.cookie).toContain('lettr_utm=');
		expect(mockDoc.cookie).toContain('max-age=604800');
	});

	it('does not write cookie when utm params are empty', () => {
		const mockDoc = { cookie: '' };

		writeUtmCookie({}, mockDoc);

		expect(mockDoc.cookie).toBe('');
	});
});

describe('persistUtmParamsFromUrl', () => {
	it('persists utm params found in URL', () => {
		const mockDoc = { cookie: '' };
		const url = new URL('https://lettr.com/?utm_source=google&utm_campaign=spring');

		const result = persistUtmParamsFromUrl(url, mockDoc);

		expect(result).toEqual({ utm_source: 'google', utm_campaign: 'spring' });
		expect(mockDoc.cookie).toContain('lettr_utm=');
	});

	it('skips writing when URL has no utm params', () => {
		const mockDoc = { cookie: '' };
		const url = new URL('https://lettr.com/?foo=bar');

		const result = persistUtmParamsFromUrl(url, mockDoc);

		expect(result).toEqual({});
		expect(mockDoc.cookie).toBe('');
	});
});

describe('buildRegisterUrl', () => {
	it('returns register url with utms from URL', () => {
		const url = new URL('https://lettr.com/?utm_source=google&utm_medium=cpc');

		expect(buildRegisterUrl(url, '')).toBe('https://app.lettr.com/register?utm_source=google&utm_medium=cpc');
	});

	it('falls back to utms from cookie when URL has none', () => {
		const url = new URL('https://lettr.com/pricing');
		const cookie = 'lettr_utm=utm_source%3Dnewsletter%26utm_campaign%3Dlaunch';

		expect(buildRegisterUrl(url, cookie)).toBe(
			'https://app.lettr.com/register?utm_source=newsletter&utm_campaign=launch',
		);
	});

	it('gives URL params precedence over cookie params', () => {
		const url = new URL('https://lettr.com/?utm_source=google&utm_medium=cpc');
		const cookie = 'lettr_utm=utm_source%3Dnewsletter%26utm_campaign%3Dlaunch';

		expect(buildRegisterUrl(url, cookie)).toBe(
			'https://app.lettr.com/register?utm_source=google&utm_campaign=launch&utm_medium=cpc',
		);
	});

	it('returns plain register URL when no utms exist', () => {
		const url = new URL('https://lettr.com/');

		expect(buildRegisterUrl(url, '')).toBe(registerUrl);
	});
});

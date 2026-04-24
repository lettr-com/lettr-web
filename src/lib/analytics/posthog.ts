import { browser } from '$app/environment';

import type posthogJs from 'posthog-js';

import { consentChangedEventName, getConsentState } from '$lib/utils/cookieConsent';

const posthogConfig = {
	apiKey: 'phc_67BYz5Uv0uoiydQyaN3OyeK9OPx6LjmFDFvF0mNaTy9',
	apiHost: 'https://m.lettr.cz',
	defaults: '2026-01-30',
	crossSubdomainCookie: true,
} as const;

type PosthogClient = typeof posthogJs;
type PosthogProperties = Record<string, string | number | boolean | null | undefined>;

let posthogClient: PosthogClient | null = null;
let initPromise: Promise<void> | null = null;
let isConsentListenerAttached = false;

function syncClientConsent(client: PosthogClient): void {
	const consentState = getConsentState(document.cookie);

	if (consentState.value === 'accepted') {
		client.opt_in_capturing();
		return;
	}

	client.opt_out_capturing();
}

function attachConsentListener(): void {
	if (!browser || isConsentListenerAttached) return;

	window.addEventListener(consentChangedEventName, () => {
		if (!posthogClient) return;
		syncClientConsent(posthogClient);
	});

	isConsentListenerAttached = true;
}

export async function initPosthog(): Promise<void> {
	if (!browser) return;
	if (initPromise) return initPromise;

	initPromise = (async () => {
		const { default: posthog } = await import('posthog-js');

		posthog.init(posthogConfig.apiKey, {
			api_host: posthogConfig.apiHost,
			defaults: posthogConfig.defaults,
			cross_subdomain_cookie: posthogConfig.crossSubdomainCookie,
		});

		posthogClient = posthog;
		syncClientConsent(posthog);
		attachConsentListener();
	})();

	return initPromise;
}

export async function capturePosthogEvent(
	eventName: string,
	properties?: PosthogProperties
): Promise<void> {
	if (!browser) return;

	await initPosthog();
	posthogClient?.capture(eventName, properties);
}

function authEventProperties(placement: string, href: string, extra?: PosthogProperties) {
	return {
		placement,
		href,
		page_path: browser ? window.location.pathname : null,
		page_url: browser ? window.location.href : null,
		...extra
	};
}

export function trackSignupClick(
	placement: string,
	href: string,
	extra?: PosthogProperties
): void {
	void capturePosthogEvent('signup_clicked', authEventProperties(placement, href, extra));
}

export function trackSigninClick(
	placement: string,
	href: string,
	extra?: PosthogProperties
): void {
	void capturePosthogEvent('signin_clicked', authEventProperties(placement, href, extra));
}

export async function identifyPosthogUser(
	distinctId: string,
	properties?: PosthogProperties
): Promise<void> {
	if (!browser || !distinctId) return;

	await initPosthog();
	posthogClient?.identify(distinctId, properties);
}

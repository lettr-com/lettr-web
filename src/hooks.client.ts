import type { ClientInit } from '@sveltejs/kit';

import { initPosthog } from '$lib/analytics/posthog';

export const init: ClientInit = async () => {
	await initPosthog();
};

import { dev } from '$app/environment';

interface ZaptimeEnvironmentConfig {
	apiToken: string;
	apiBaseUrl: string;
	customFieldIds: {
		company: string;
		emailsVolume: string;
	};
}

const zaptimeConfigByEnvironment: Record<'development' | 'production', ZaptimeEnvironmentConfig> = {
	development: {
		apiToken: '4yqIIToZJuqSP68pjYkbwfZyq9BMH3Is',
		apiBaseUrl: 'https://api.zaptime.app/',
		customFieldIds: {
			company: 'af77913a-f643-484b-b3ae-ca2690775fe1',
			emailsVolume: '5338133b-a651-4e45-b6e9-1c5a2f0ef193'
		}
	},
	production: {
		apiToken: 'B8a1Q4i9WDlDylTCLpE4l4SCy8AHQ8on',
		apiBaseUrl: 'https://api.zaptime.app/',
		customFieldIds: {
			company: 'af77913a-f643-484b-b3ae-ca2690775fe1',
			emailsVolume: '5338133b-a651-4e45-b6e9-1c5a2f0ef193'
		}
	}
};

export function getCurrentZaptimeConfig() {
	return dev ? zaptimeConfigByEnvironment.development : zaptimeConfigByEnvironment.production;
}

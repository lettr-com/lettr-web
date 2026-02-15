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
			company: 'cab7ddde-092a-4d80-94e8-d44fa3fafd40',
			emailsVolume: '644026ef-61f8-4d35-afe5-c8259cfeaf64'
		}
	},
	production: {
		apiToken: 'B8a1Q4i9WDlDylTCLpE4l4SCy8AHQ8on',
		apiBaseUrl: 'https://api.zaptime.app/',
		customFieldIds: {
			company: '271b96ff-5c2c-49b0-aa0b-778bdcc4f813',
			emailsVolume: '6b40dbee-5aae-4af3-b997-3729a9f2bfc7'
		}
	}
};

export function getCurrentZaptimeConfig() {
	return dev ? zaptimeConfigByEnvironment.development : zaptimeConfigByEnvironment.production;
}

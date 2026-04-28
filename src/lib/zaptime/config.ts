import { dev } from "$app/environment";

interface ZaptimeEnvironmentConfig {
  apiToken: string;
  apiBaseUrl: string;
  customFieldIds: {
    company: string;
    emailsVolume: string;
  };
}

const zaptimeConfigByEnvironment: Record<"development" | "production", ZaptimeEnvironmentConfig> = {
  development: {
    apiToken: "B8a1Q4i9WDlDylTCLpE4l4SCy8AHQ8on",
    apiBaseUrl: "https://api.zaptime.app/",
    customFieldIds: {
      company: "271b96ff-5c2c-49b0-aa0b-778bdcc4f813",
      emailsVolume: "6b40dbee-5aae-4af3-b997-3729a9f2bfc7",
    },
  },
  production: {
    apiToken: "B8a1Q4i9WDlDylTCLpE4l4SCy8AHQ8on",
    apiBaseUrl: "https://api.zaptime.app/",
    customFieldIds: {
      company: "271b96ff-5c2c-49b0-aa0b-778bdcc4f813",
      emailsVolume: "6b40dbee-5aae-4af3-b997-3729a9f2bfc7",
    },
  },
};

export function getZaptimeConfig() {
  const { apiToken, apiBaseUrl, customFieldIds } = dev
    ? zaptimeConfigByEnvironment.development
    : zaptimeConfigByEnvironment.production;

  return { token: apiToken.trim(), baseUrl: apiBaseUrl, customFieldIds };
}

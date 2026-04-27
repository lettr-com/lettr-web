export type ConsentValue = "accepted" | "rejected";

export interface ConsentState {
  hasConsented: boolean;
  value: ConsentValue | null;
}

const COOKIE_NAME = "cookie_consent";
const COUNTRY_COOKIE_NAME = "viewer_country";
export const consentChangedEventName = "cookie-consent:changed";

// Countries where explicit cookie consent is required: EU 27 + EEA + UK + CH.
const CONSENT_REQUIRED_COUNTRIES = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "GB",
  "CH",
]);

export function getCookieValue(cookieString: string, name: string): string | null {
  if (!cookieString) return null;
  const entries = cookieString.split(";");
  for (const entry of entries) {
    const eqIndex = entry.indexOf("=");
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
  if (value === "accepted" || value === "rejected") {
    return { hasConsented: true, value };
  }
  return { hasConsented: false, value: null };
}

export function buildConsentCookieString(value: ConsentValue, maxAgeDays: number = 365): string {
  const maxAge = maxAgeDays * 24 * 60 * 60;
  return `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
}

export function writeConsentCookie(
  value: ConsentValue,
  doc: { cookie: string } = document,
  maxAgeDays?: number,
): ConsentValue {
  doc.cookie = buildConsentCookieString(value, maxAgeDays);

  if (typeof window !== "undefined" && typeof document !== "undefined" && doc === document) {
    window.dispatchEvent(new CustomEvent<ConsentValue>(consentChangedEventName, { detail: value }));
  }

  return value;
}

export function getViewerCountry(cookieString: string): string | null {
  const value = getCookieValue(cookieString, COUNTRY_COOKIE_NAME);
  if (!value) return null;
  const normalised = value.toUpperCase();
  // CloudFront returns ISO-3166-1 alpha-2 codes; the function falls back to
  // 'XX' when the header is missing. Treat both as unknown.
  if (normalised === "XX" || normalised.length !== 2) return null;
  return normalised;
}

export function requiresExplicitConsent(country: string | null): boolean {
  // Default to requiring consent when the country is unknown — safer than
  // silently opting an EU visitor in due to a missing CDN header.
  if (!country) return true;
  return CONSENT_REQUIRED_COUNTRIES.has(country);
}

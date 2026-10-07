import { browser } from "$app/environment";

import { consentChangedEventName, getConsentState } from "$lib/utils/cookieConsent";

const pixelId = "UWeU6iAhAjwa8ospjRyuw3";
const sdkUrl = "https://bzrcdn.openai.com/sdk/oaiq.min.js";

type Oaiq = ((...args: unknown[]) => void) & { q: unknown[] };

declare global {
  interface Window {
    oaiq?: Oaiq;
  }
}

let isConsentListenerAttached = false;

function loadPixel(): void {
  if (window.oaiq) return;

  const oaiq = ((...args: unknown[]) => {
    oaiq.q.push(args);
  }) as Oaiq;
  oaiq.q = [];
  window.oaiq = oaiq;
  oaiq("init", { pixelId });

  const script = document.createElement("script");
  script.src = sdkUrl;
  script.async = true;
  document.head.appendChild(script);
}

function syncConsent(): void {
  if (getConsentState(document.cookie).value === "accepted") {
    loadPixel();
    return;
  }

  // Consent withdrawn after the pixel loaded: it stops sending events and
  // removes its cookies.
  window.oaiq?.("consent", false);
}

/**
 * Loads the OpenAI Ads pixel once optional cookies are accepted. The pixel
 * stores the ad click (`oppref`) in a `.lettr.com` cookie, so the app can
 * attribute the signup to the ad.
 *
 * Without consent the pixel is not loaded at all, rather than loaded with
 * consent off: a pixel told `consent: false` deletes its cookies, including
 * the ad click.
 */
export function initOpenAiAds(): void {
  if (!browser) return;

  syncConsent();

  if (!isConsentListenerAttached) {
    window.addEventListener(consentChangedEventName, syncConsent);
    isConsentListenerAttached = true;
  }
}

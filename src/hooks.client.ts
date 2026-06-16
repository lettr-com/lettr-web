import type { ClientInit } from "@sveltejs/kit";

import { initPosthog } from "$lib/analytics/posthog";

export const init: ClientInit = () => {
  // Defer analytics until the browser is idle so the posthog-js chunk download
  // and init never block hydration / first interaction. Fire-and-forget.
  const schedule =
    typeof window !== "undefined" && "requestIdleCallback" in window
      ? window.requestIdleCallback.bind(window)
      : (cb: () => void) => setTimeout(cb, 1);

  schedule(() => void initPosthog());
};

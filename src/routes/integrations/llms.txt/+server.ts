import type { RequestHandler } from "./$types";

import { integrationsLlmsTxt } from "$lib/integrations/seo";

// Endpoints do not inherit `prerender` from +layout.ts.
export const prerender = true;

export const GET: RequestHandler = () =>
  new Response(integrationsLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });

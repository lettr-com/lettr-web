import type { RequestHandler } from "./$types";

import { blogAtom } from "$lib/blog/feed";
import { posts } from "$lib/data/posts";

// Endpoints do not inherit `prerender` from +layout.ts.
export const prerender = true;

export const GET: RequestHandler = () =>
  new Response(blogAtom(posts), {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });

import { dev } from "$app/environment";
import { error } from "@sveltejs/kit";

// Internal reference for the design system. The dev server renders it; it is never
// prerendered, so it is not in the build, the sitemap or the agents' Markdown, and a
// client-side visit to the deployed site gets the 404 page.
export const prerender = false;

export function load() {
  if (!dev) error(404, "Not found");
}

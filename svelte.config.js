import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Inline every stylesheet: on slow connections waiting for the CSS file kept the page blank.
    inlineStyleThreshold: 200000,
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "404.html",
      precompress: false,
      strict: true,
    }),
    prerender: {
      entries: ["*"],
    },
  },
};

export default config;

import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vite-plus/test";

const source = readFileSync(
  new URL("../../../terraform/cloudfront/viewer-request.js", import.meta.url),
  "utf8",
);

interface Reply {
  uri?: string;
  statusCode?: number;
  headers?: Record<string, { value: string }>;
}
type Handler = (event: { request: Record<string, unknown> }) => Reply;

/** The function as Terraform ships it: the file with the redirect map filled in. */
function load(redirects: Record<string, string> = {}): { handler: Handler; code: string } {
  const code = source.replace("__REDIRECTS__", JSON.stringify(redirects));
  return { handler: runInNewContext(`${code}\nhandler`) as Handler, code };
}

function run(
  uri: string,
  options: {
    accept?: string;
    query?: Record<string, unknown>;
    redirects?: Record<string, string>;
  } = {},
): Reply {
  const request = {
    uri,
    querystring: options.query ?? {},
    headers: options.accept ? { accept: { value: options.accept } } : {},
  };
  return load(options.redirects).handler({ request });
}

const location = (reply: Reply) => reply.headers?.location.value;

describe("viewer-request function", () => {
  it("serves a page from its index file", () => {
    expect(run("/").uri).toBe("/index.html");
    expect(run("/pricing/").uri).toBe("/pricing/index.html");
    expect(run("/glossary/dkim/").uri).toBe("/glossary/dkim/index.html");
  });

  it("serves the markdown twin to a client that prefers it", () => {
    expect(run("/pricing/", { accept: "text/markdown" }).uri).toBe("/pricing/index.md");
    expect(run("/pricing/", { accept: "text/html,*/*;q=0.8" }).uri).toBe("/pricing/index.html");
    expect(run("/pricing/", { accept: "text/markdown;q=0.5, text/html" }).uri).toBe(
      "/pricing/index.html",
    );
  });

  it("redirects a slashless path to its trailing-slash twin with one 301", () => {
    const reply = run("/pricing");
    expect(reply.statusCode).toBe(301);
    expect(location(reply)).toBe("/pricing/");
    expect(location(run("/glossary/jmrp"))).toBe("/glossary/jmrp/");
  });

  it("redirects /index.html to the folder", () => {
    expect(location(run("/index.html"))).toBe("/");
    expect(location(run("/pricing/index.html"))).toBe("/pricing/");
  });

  it("lowercases a page path in the same hop", () => {
    expect(location(run("/Pricing/"))).toBe("/pricing/");
    expect(location(run("/Blog/Some-Post"))).toBe("/blog/some-post/");
    expect(location(run("/Pricing/Index.html".replace("Index", "index")))).toBe("/pricing/");
  });

  it("keeps the query string", () => {
    expect(location(run("/pricing", { query: { plan: { value: "marketing" } } }))).toBe(
      "/pricing/?plan=marketing",
    );
    expect(
      location(
        run("/pricing", {
          query: { a: { value: "1", multiValue: [{ value: "1" }, { value: "2" }] } },
        }),
      ),
    ).toBe("/pricing/?a=1&a=2");
  });

  it("leaves files alone, whatever their case", () => {
    for (const uri of [
      "/llms.txt",
      "/favicon.ico",
      "/_app/immutable/chunks/AbC123.js",
      "/.well-known/api-catalog",
      "/pricing/index.md",
      "/images/Logo.PNG",
    ]) {
      const reply = run(uri);
      expect(reply.statusCode).toBeUndefined();
      expect(reply.uri).toBe(uri);
    }
  });

  it("sends a moved page to its new home in one hop, from either spelling", () => {
    const redirects = { "/compare/resend/": "/alternatives/resend/" };
    for (const uri of ["/compare/resend/", "/compare/resend", "/Compare/Resend"]) {
      const reply = run(uri, { redirects });
      expect(reply.statusCode).toBe(301);
      expect(location(reply)).toBe("/alternatives/resend/");
    }
    expect(run("/compare/mailgun/", { redirects }).uri).toBe("/compare/mailgun/index.html");
  });

  it("stays well inside the 10 KB CloudFront Functions limit with a long redirect map", () => {
    const redirects = Object.fromEntries(
      Array.from({ length: 60 }, (_, i) => [
        `/compare/old-page-number-${i}/`,
        `/alternatives/new-page-number-${i}/`,
      ]),
    );
    expect(load(redirects).code.length).toBeLessThan(10_000);
  });
});

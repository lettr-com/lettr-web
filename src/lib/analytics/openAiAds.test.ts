import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

vi.mock("$app/environment", () => ({ browser: true }));

type Listener = () => void;

function stubBrowser(cookie: string) {
  const listeners: Record<string, Listener[]> = {};
  const appendedScripts: { src: string; async: boolean }[] = [];
  const doc = {
    cookie,
    createElement: () => ({ src: "", async: false }),
    head: {
      appendChild: (script: { src: string; async: boolean }) => appendedScripts.push(script),
    },
  };
  const win: Record<string, unknown> = {
    addEventListener: (name: string, listener: Listener) => {
      (listeners[name] ??= []).push(listener);
    },
  };

  vi.stubGlobal("document", doc);
  vi.stubGlobal("window", win);

  return {
    doc,
    win,
    appendedScripts,
    emit: (name: string) => listeners[name]?.forEach((listener) => listener()),
  };
}

async function loadModule() {
  vi.resetModules();
  return import("./openAiAds");
}

describe("initOpenAiAds", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not load the pixel without consent", async () => {
    const browser = stubBrowser("");
    const { initOpenAiAds } = await loadModule();

    initOpenAiAds();

    expect(browser.win.oaiq).toBeUndefined();
    expect(browser.appendedScripts).toHaveLength(0);
  });

  it("loads the pixel once when cookies are accepted", async () => {
    const browser = stubBrowser("cookie_consent=accepted");
    const { initOpenAiAds } = await loadModule();

    initOpenAiAds();
    initOpenAiAds();

    const oaiq = browser.win.oaiq as { q: unknown[][] };
    expect(oaiq.q).toEqual([["init", { pixelId: "UWeU6iAhAjwa8ospjRyuw3" }]]);
    expect(browser.appendedScripts).toEqual([
      { src: "https://bzrcdn.openai.com/sdk/oaiq.min.js", async: true },
    ]);
  });

  it("loads the pixel when consent is given later", async () => {
    const browser = stubBrowser("");
    const { initOpenAiAds } = await loadModule();

    initOpenAiAds();
    browser.doc.cookie = "cookie_consent=accepted";
    browser.emit("cookie-consent:changed");

    expect(browser.win.oaiq).toBeDefined();
    expect(browser.appendedScripts).toHaveLength(1);
  });

  it("turns the pixel off when consent is withdrawn", async () => {
    const browser = stubBrowser("cookie_consent=accepted");
    const { initOpenAiAds } = await loadModule();

    initOpenAiAds();
    browser.doc.cookie = "cookie_consent=rejected";
    browser.emit("cookie-consent:changed");

    const oaiq = browser.win.oaiq as { q: unknown[][] };
    expect(oaiq.q.at(-1)).toEqual(["consent", false]);
  });
});

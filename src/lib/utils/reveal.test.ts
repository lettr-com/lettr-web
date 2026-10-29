import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

const VIEWPORT = 800;

class FakeElement {
  attributes = new Set<string>();
  animate = vi.fn();
  constructor(public top: number) {}
  setAttribute(name: string) {
    this.attributes.add(name);
  }
  removeAttribute(name: string) {
    this.attributes.delete(name);
  }
  hasAttribute(name: string) {
    return this.attributes.has(name);
  }
}
// The helper checks for the Web Animations API on the prototype.
Object.defineProperty(FakeElement.prototype, "animate", { value: () => undefined, writable: true });

class FakeObserver {
  static instances: FakeObserver[] = [];
  observed = new Set<FakeElement>();
  constructor(public callback: IntersectionObserverCallback) {
    FakeObserver.instances.push(this);
  }
  observe(element: FakeElement) {
    this.observed.add(element);
  }
  unobserve(element: FakeElement) {
    this.observed.delete(element);
  }
  /** Deliver one batch, as the browser does after a frame. */
  report(entries: { element: FakeElement; isIntersecting?: boolean }[]) {
    this.callback(
      entries.map(({ element, isIntersecting = false }) => ({
        target: element,
        isIntersecting,
        boundingClientRect: { top: element.top },
      })) as unknown as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver,
    );
  }
}

function scopeOf(elements: FakeElement[]): Element {
  return { querySelectorAll: () => elements } as unknown as Element;
}

async function setup({ reducedMotion = false } = {}) {
  vi.stubGlobal("Element", FakeElement);
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  vi.stubGlobal("document", { documentElement: { clientHeight: VIEWPORT } });
  vi.stubGlobal("window", { matchMedia: () => ({ matches: reducedMotion }) });
  // The observer is a module-level singleton, so each test gets a fresh module.
  vi.resetModules();
  return import("./reveal");
}

beforeEach(() => {
  FakeObserver.instances = [];
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createScrollRevealCleanup", () => {
  it("leaves content that was on screen or scrolled past alone", async () => {
    const { createScrollRevealCleanup, pendingAttribute } = await setup();
    const onScreen = new FakeElement(VIEWPORT - 10);
    const above = new FakeElement(-400);

    createScrollRevealCleanup({ scope: scopeOf([onScreen, above]), targets: "[data-reveal]" });
    const [observer] = FakeObserver.instances;
    observer.report([{ element: onScreen }, { element: above }]);

    for (const element of [onScreen, above]) {
      expect(element.hasAttribute(pendingAttribute)).toBe(false);
      expect(element.animate).not.toHaveBeenCalled();
      expect(observer.observed.has(element)).toBe(false);
    }
  });

  it("hides content below the fold until it scrolls in, then fades it in staggered", async () => {
    const { createScrollRevealCleanup, pendingAttribute } = await setup();
    const first = new FakeElement(VIEWPORT + 100);
    const second = new FakeElement(VIEWPORT + 120);

    createScrollRevealCleanup({
      scope: scopeOf([first, second]),
      targets: "[data-reveal]",
      stagger: 50,
    });
    const [observer] = FakeObserver.instances;
    observer.report([{ element: first }, { element: second }]);

    expect(first.hasAttribute(pendingAttribute)).toBe(true);
    expect(second.hasAttribute(pendingAttribute)).toBe(true);

    observer.report([
      { element: first, isIntersecting: true },
      { element: second, isIntersecting: true },
    ]);

    expect(first.hasAttribute(pendingAttribute)).toBe(false);
    expect(second.hasAttribute(pendingAttribute)).toBe(false);
    expect(first.animate.mock.calls[0][1]).toMatchObject({ delay: 0, fill: "backwards" });
    expect(second.animate.mock.calls[0][1]).toMatchObject({ delay: 50 });
    expect(observer.observed.size).toBe(0);
  });

  it("ignores a below-the-fold element leaving view before it ever entered", async () => {
    const { createScrollRevealCleanup, pendingAttribute } = await setup();
    const element = new FakeElement(VIEWPORT + 100);

    createScrollRevealCleanup({ scope: scopeOf([element]), targets: "[data-reveal]" });
    const [observer] = FakeObserver.instances;
    observer.report([{ element }]);
    observer.report([{ element, isIntersecting: false }]);

    expect(element.hasAttribute(pendingAttribute)).toBe(true);
    expect(element.animate).not.toHaveBeenCalled();
  });

  it("cleanup shows anything still waiting and stops watching it", async () => {
    const { createScrollRevealCleanup, pendingAttribute } = await setup();
    const element = new FakeElement(VIEWPORT + 100);

    const cleanup = createScrollRevealCleanup({
      scope: scopeOf([element]),
      targets: "[data-reveal]",
    });
    const [observer] = FakeObserver.instances;
    observer.report([{ element }]);
    cleanup();

    expect(element.hasAttribute(pendingAttribute)).toBe(false);
    expect(observer.observed.has(element)).toBe(false);
    expect(element.animate).not.toHaveBeenCalled();
  });

  it("does nothing under prefers-reduced-motion", async () => {
    const { createScrollRevealCleanup } = await setup({ reducedMotion: true });
    const element = new FakeElement(VIEWPORT + 100);

    createScrollRevealCleanup({ scope: scopeOf([element]), targets: "[data-reveal]" })();

    expect(FakeObserver.instances).toHaveLength(0);
    expect(element.attributes.size).toBe(0);
  });

  it("shares one observer across every reveal on the page", async () => {
    const { createScrollRevealCleanup } = await setup();

    createScrollRevealCleanup({ scope: scopeOf([new FakeElement(0)]), targets: "[data-reveal]" });
    createScrollRevealCleanup({ scope: scopeOf([new FakeElement(0)]), targets: "[data-reveal]" });

    expect(FakeObserver.instances).toHaveLength(1);
  });
});

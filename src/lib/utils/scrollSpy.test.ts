import { describe, expect, it } from "vite-plus/test";
import { resolveActiveId, hasReachedPinned, type HeadingPosition } from "./scrollSpy";

const VIEWPORT = 1000; // bandBottom = 0.34 * 1000 = 340; bandTop default = 120.

describe("resolveActiveId — geometry (no pin)", () => {
  it("lights the topmost heading sitting inside the band", () => {
    const positions: HeadingPosition[] = [
      { id: "a", top: -200 },
      { id: "b", top: 100 }, // in band (0..340)
      { id: "c", top: 300 }, // also in band, but lower
      { id: "d", top: 700 },
    ];
    expect(resolveActiveId(positions, { viewportHeight: VIEWPORT })).toBe("b");
  });

  it("keeps the most recently passed heading lit when none are in the band", () => {
    // All headings are either above the band or below the viewport.
    const positions: HeadingPosition[] = [
      { id: "a", top: -400 },
      { id: "b", top: -50 }, // passed (top <= 120) and most recent above band
      { id: "c", top: 600 }, // below the band
    ];
    expect(resolveActiveId(positions, { viewportHeight: VIEWPORT })).toBe("b");
  });

  it("falls back to the first heading at the very top of the page", () => {
    const positions: HeadingPosition[] = [
      { id: "a", top: 500 },
      { id: "b", top: 900 },
    ];
    expect(resolveActiveId(positions, { viewportHeight: VIEWPORT })).toBe("a");
  });

  it("returns null when there are no headings", () => {
    expect(resolveActiveId([], { viewportHeight: VIEWPORT })).toBeNull();
  });
});

describe("resolveActiveId — pinning (the click-scroll fix)", () => {
  // Reproduces the reported bug: clicking a heading BELOW the current one made
  // the indicator snap back to the origin and walk down through every heading
  // the smooth scroll passed over. With the target pinned, the indicator must
  // stay on the clicked target for the whole scroll.

  it("holds the pinned target while it is still below the band (scrolling down)", () => {
    // Geometry still shows the origin section at the top — exactly the frame
    // that used to snap the indicator back to the origin.
    const positions: HeadingPosition[] = [
      { id: "intro", top: 90 }, // origin still in band
      { id: "middle", top: 1200 },
      { id: "target", top: 3000 }, // far below: scroll has not arrived
    ];
    const active = resolveActiveId(positions, {
      viewportHeight: VIEWPORT,
      pinnedId: "target",
    });
    expect(active).toBe("target"); // NOT 'intro'
  });

  it("holds the pinned target through an intermediate heading entering the band", () => {
    const positions: HeadingPosition[] = [
      { id: "intro", top: -400 },
      { id: "middle", top: 100 }, // intermediate now in the band
      { id: "target", top: 1500 }, // still below
    ];
    const active = resolveActiveId(positions, {
      viewportHeight: VIEWPORT,
      pinnedId: "target",
    });
    expect(active).toBe("target"); // NOT 'middle'
  });

  it("releases to geometry once the pinned target reaches the band", () => {
    const positions: HeadingPosition[] = [
      { id: "intro", top: -2000 },
      { id: "middle", top: -800 },
      { id: "target", top: 80 }, // arrived: inside the band
    ];
    const active = resolveActiveId(positions, {
      viewportHeight: VIEWPORT,
      pinnedId: "target",
    });
    expect(active).toBe("target");
  });

  it("holds the pinned target while scrolling UP, before it descends into the band", () => {
    // Up-scroll: the target starts ABOVE the viewport (negative top). A one-sided
    // "top <= bandBottom" release would fire immediately here and let the observer
    // walk the indicator down through the intermediate sections. The pin must hold.
    const positions: HeadingPosition[] = [
      { id: "target", top: -1500 }, // above the viewport: scroll still descending to it
      { id: "middle", top: 100 }, // an intermediate currently in the band
      { id: "bottom", top: 2000 },
    ];
    const active = resolveActiveId(positions, {
      viewportHeight: VIEWPORT,
      pinnedId: "target",
    });
    expect(active).toBe("target"); // NOT 'middle'
  });

  it("does not pin a target id that is not among the observed headings", () => {
    const positions: HeadingPosition[] = [{ id: "a", top: 100 }];
    const active = resolveActiveId(positions, {
      viewportHeight: VIEWPORT,
      pinnedId: "ghost",
    });
    // Ghost target can never "arrive", so geometry must still win.
    expect(active).toBe("a");
  });
});

describe("hasReachedPinned", () => {
  it("is false while the pinned heading is below the band (scrolling down to it)", () => {
    expect(
      hasReachedPinned([{ id: "t", top: 800 }], { pinnedId: "t", viewportHeight: VIEWPORT }),
    ).toBe(false);
  });

  it("is false while the pinned heading is above the band (scrolling up to it)", () => {
    // The symmetry fix: a heading above the viewport has NOT arrived yet.
    expect(
      hasReachedPinned([{ id: "t", top: -500 }], { pinnedId: "t", viewportHeight: VIEWPORT }),
    ).toBe(false);
  });

  it("is true once the pinned heading is inside the band", () => {
    expect(
      hasReachedPinned([{ id: "t", top: 200 }], { pinnedId: "t", viewportHeight: VIEWPORT }),
    ).toBe(true);
    expect(
      hasReachedPinned([{ id: "t", top: 0 }], { pinnedId: "t", viewportHeight: VIEWPORT }),
    ).toBe(true);
  });

  it("is true when nothing is pinned or the pinned id is absent", () => {
    expect(
      hasReachedPinned([{ id: "x", top: 9 }], { pinnedId: null, viewportHeight: VIEWPORT }),
    ).toBe(true);
    expect(
      hasReachedPinned([{ id: "x", top: 9 }], { pinnedId: "missing", viewportHeight: VIEWPORT }),
    ).toBe(true);
  });
});

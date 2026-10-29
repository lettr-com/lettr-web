import { describe, expect, it } from "vite-plus/test";
import { readProgress } from "./article";

const page = { height: 3000, firstLine: 30, topEdge: 60, viewportHeight: 800 };

describe("readProgress", () => {
  it("stays at 0 until the first line is under the header", () => {
    expect(readProgress({ ...page, top: 500 })).toBe(0);
    expect(readProgress({ ...page, top: 30 })).toBe(0);
  });

  it("counts up from there and reaches 1 when the end of the body is on screen", () => {
    expect(readProgress({ ...page, top: 30 - 1115 })).toBeCloseTo(0.5);
    expect(readProgress({ ...page, top: 800 - 3000 })).toBe(1);
    expect(readProgress({ ...page, top: -5000 })).toBe(1);
  });

  it("jumps straight to 1 for a body shorter than the screen", () => {
    expect(readProgress({ ...page, height: 400, top: 100 })).toBe(0);
    expect(readProgress({ ...page, height: 400, top: 0 })).toBe(1);
  });
});

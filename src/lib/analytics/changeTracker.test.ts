import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { createChangeTracker } from "./changeTracker";

describe("createChangeTracker", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("does not report the initial value", () => {
    const report = vi.fn();
    const track = createChangeTracker();

    track(1, report);
    vi.runAllTimers();

    expect(report).not.toHaveBeenCalled();
  });

  it("reports a change once the value settles", () => {
    const report = vi.fn();
    const track = createChangeTracker(400);

    track(1, report);
    track(2, () => report(2));
    track(3, () => report(3));
    vi.advanceTimersByTime(399);
    expect(report).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(report).toHaveBeenCalledOnce();
    expect(report).toHaveBeenCalledWith(3);
  });

  it("drops a change that returns to the reported value before settling", () => {
    const report = vi.fn();
    const track = createChangeTracker();

    track(1, report);
    track(2, report);
    track(1, report);
    vi.runAllTimers();

    expect(report).not.toHaveBeenCalled();
  });

  it("does not repeat a report for an unchanged value", () => {
    const report = vi.fn();
    const track = createChangeTracker();

    track(1, report);
    track(2, report);
    vi.runAllTimers();
    track(2, report);
    vi.runAllTimers();

    expect(report).toHaveBeenCalledOnce();
  });
});

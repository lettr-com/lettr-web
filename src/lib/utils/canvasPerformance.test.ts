import { describe, expect, it } from 'vitest';
import { getEffectivePixelRatio, shouldAnimate, shouldRenderFrame } from './canvasPerformance';

describe('getEffectivePixelRatio', () => {
	it('caps pixel ratio to max', () => {
		expect(getEffectivePixelRatio(2, 1.5)).toBe(1.5);
	});

	it('returns original ratio when below max', () => {
		expect(getEffectivePixelRatio(1.25, 1.5)).toBe(1.25);
	});

	it('falls back to 1 for invalid ratios', () => {
		expect(getEffectivePixelRatio(0, 1.5)).toBe(1);
		expect(getEffectivePixelRatio(Number.NaN, 1.5)).toBe(1);
	});
});

describe('shouldRenderFrame', () => {
	it('returns false when elapsed time is below frame duration', () => {
		expect(shouldRenderFrame(33, 0, 30)).toBe(false);
	});

	it('returns true when elapsed time reaches frame duration', () => {
		expect(shouldRenderFrame(1000 / 30, 0, 30)).toBe(true);
	});

	it('always renders when target fps is invalid', () => {
		expect(shouldRenderFrame(1, 0, 0)).toBe(true);
		expect(shouldRenderFrame(1, 0, Number.NaN)).toBe(true);
	});
});

describe('shouldAnimate', () => {
	it('animates only when tab is visible and canvas is in viewport', () => {
		expect(shouldAnimate({ isTabVisible: true, isInViewport: true })).toBe(true);
		expect(shouldAnimate({ isTabVisible: false, isInViewport: true })).toBe(false);
		expect(shouldAnimate({ isTabVisible: true, isInViewport: false })).toBe(false);
	});
});

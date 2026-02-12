import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSingleTimeoutManager } from './timeoutManager';

describe('createSingleTimeoutManager', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('runs scheduled callback after delay', () => {
		const callback = vi.fn();
		const manager = createSingleTimeoutManager();

		manager.schedule(callback, 3000);
		expect(manager.hasPending()).toBe(true);

		vi.advanceTimersByTime(3000);

		expect(callback).toHaveBeenCalledTimes(1);
		expect(manager.hasPending()).toBe(false);
	});

	it('replaces previous timeout when scheduled again', () => {
		const first = vi.fn();
		const second = vi.fn();
		const manager = createSingleTimeoutManager();

		manager.schedule(first, 3000);
		manager.schedule(second, 3000);
		vi.advanceTimersByTime(3000);

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledTimes(1);
	});

	it('clears pending timeout', () => {
		const callback = vi.fn();
		const manager = createSingleTimeoutManager();

		manager.schedule(callback, 3000);
		manager.clear();
		vi.advanceTimersByTime(3000);

		expect(callback).not.toHaveBeenCalled();
		expect(manager.hasPending()).toBe(false);
	});
});

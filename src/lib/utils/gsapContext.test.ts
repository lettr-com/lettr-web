import { describe, expect, it, vi } from 'vitest';
import { createGsapContextCleanup } from './gsapContext';

describe('createGsapContextCleanup', () => {
	it('creates a gsap context with setup and scope', () => {
		const revert = vi.fn();
		const context = vi.fn(() => ({ revert }));
		const gsapLike = { context };
		const setup = vi.fn();
		const scope = {} as Element;

		createGsapContextCleanup(gsapLike, setup, scope);

		expect(context).toHaveBeenCalledTimes(1);
		expect(context).toHaveBeenCalledWith(setup, scope);
	});

	it('reverts context once when cleanup is called repeatedly', () => {
		const revert = vi.fn();
		const gsapLike = {
			context: vi.fn(() => ({ revert }))
		};

		const cleanup = createGsapContextCleanup(gsapLike, () => undefined);
		cleanup();
		cleanup();

		expect(revert).toHaveBeenCalledTimes(1);
	});

	it('supports omitted scope', () => {
		const gsapLike = {
			context: vi.fn(() => ({ revert: vi.fn() }))
		};

		createGsapContextCleanup(gsapLike, () => undefined);

		expect(gsapLike.context).toHaveBeenCalledWith(expect.any(Function), undefined);
	});
});

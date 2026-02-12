import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	defaultMinSplineWidth,
	loadSplineViewerScript,
	resetSplineLoaderForTests,
	shouldUseSpline
} from './spline';

type Listener = () => void;

function createMockScript() {
	const listeners: Record<'load' | 'error', Listener[]> = {
		load: [],
		error: []
	};

	return {
		type: '',
		src: '',
		async: false,
		onload: null as (() => void) | null,
		onerror: null as (() => void) | null,
		addEventListener(type: 'load' | 'error', listener: Listener) {
			listeners[type].push(listener);
		},
		dispatch(type: 'load' | 'error') {
			for (const listener of listeners[type]) listener();
		}
	};
}

function createMockDocument(existingScript: ReturnType<typeof createMockScript> | null = null) {
	const createdScripts: ReturnType<typeof createMockScript>[] = [];
	const head = { appendChild: vi.fn<(node: ReturnType<typeof createMockScript>) => void>() };

	const doc = {
		querySelector: vi.fn<(selector: string) => ReturnType<typeof createMockScript> | null>(
			() => existingScript
		),
		createElement: vi.fn<(tagName: 'script') => ReturnType<typeof createMockScript>>(() => {
			const script = createMockScript();
			createdScripts.push(script);
			return script;
		}),
		head,
		createdScripts
	};

	return doc;
}

describe('shouldUseSpline', () => {
	it('returns false for reduced motion users', () => {
		expect(
			shouldUseSpline({
				width: 2000,
				prefersReducedMotion: true
			})
		).toBe(false);
	});

	it('returns false below minimum width', () => {
		expect(
			shouldUseSpline({
				width: defaultMinSplineWidth - 1,
				prefersReducedMotion: false
			})
		).toBe(false);
	});

	it('returns true when width is large enough and motion is allowed', () => {
		expect(
			shouldUseSpline({
				width: defaultMinSplineWidth,
				prefersReducedMotion: false
			})
		).toBe(true);
	});
});

describe('loadSplineViewerScript', () => {
	beforeEach(() => {
		resetSplineLoaderForTests();
	});

	it('resolves immediately when the custom element is already registered', async () => {
		const doc = createMockDocument();

		await expect(
			loadSplineViewerScript({
				doc,
				isViewerDefined: () => true
			})
		).resolves.toBeUndefined();

		expect(doc.createElement).not.toHaveBeenCalled();
		expect(doc.head.appendChild).not.toHaveBeenCalled();
	});

	it('injects script once and reuses the in-flight promise', async () => {
		const doc = createMockDocument();

		const first = loadSplineViewerScript({
			doc,
			scriptSrc: 'https://cdn.example/spline.js',
			isViewerDefined: () => false
		});
		const second = loadSplineViewerScript({
			doc,
			scriptSrc: 'https://cdn.example/spline.js',
			isViewerDefined: () => false
		});

		expect(first).toBe(second);
		expect(doc.createElement).toHaveBeenCalledTimes(1);
		expect(doc.head.appendChild).toHaveBeenCalledTimes(1);

		doc.createdScripts[0].onload?.();
		await expect(first).resolves.toBeUndefined();
	});

	it('waits for an already existing script element to load', async () => {
		const existingScript = createMockScript();
		const doc = createMockDocument(existingScript);

		const pending = loadSplineViewerScript({
			doc,
			scriptSrc: 'https://cdn.example/spline.js',
			isViewerDefined: () => false
		});

		expect(doc.createElement).not.toHaveBeenCalled();
		existingScript.dispatch('load');

		await expect(pending).resolves.toBeUndefined();
	});

	it('resets internal loader state after failure to allow retries', async () => {
		const firstDoc = createMockDocument();
		const firstPending = loadSplineViewerScript({
			doc: firstDoc,
			scriptSrc: 'https://cdn.example/spline.js',
			isViewerDefined: () => false
		});

		firstDoc.createdScripts[0].onerror?.();
		await expect(firstPending).rejects.toThrow('Failed to load Spline viewer script.');

		const retryDoc = createMockDocument();
		const retryPending = loadSplineViewerScript({
			doc: retryDoc,
			scriptSrc: 'https://cdn.example/spline.js',
			isViewerDefined: () => false
		});

		expect(retryDoc.createElement).toHaveBeenCalledTimes(1);
		retryDoc.createdScripts[0].onload?.();
		await expect(retryPending).resolves.toBeUndefined();
	});
});

export const splineViewerTagName = 'spline-viewer';
export const splineViewerScriptSrc =
	'https://unpkg.com/@splinetool/viewer@1.12.52/build/spline-viewer.js';
export const defaultMinSplineWidth = 1024;

interface SplineScriptElement {
	type: string;
	src: string;
	async: boolean;
	onload: (() => void) | null;
	onerror: (() => void) | null;
	addEventListener(
		type: 'load' | 'error',
		listener: () => void,
		options?: AddEventListenerOptions
	): void;
}

interface SplineScriptDocument {
	querySelector(selector: string): SplineScriptElement | null;
	createElement(tagName: 'script'): SplineScriptElement;
	head: {
		appendChild(node: SplineScriptElement): void;
	};
}

interface ShouldUseSplineOptions {
	width: number;
	prefersReducedMotion: boolean;
	minWidth?: number;
}

interface LoadSplineViewerScriptOptions {
	doc?: SplineScriptDocument;
	scriptSrc?: string;
	isViewerDefined?: () => boolean;
}

let splineLoader: Promise<void> | null = null;

export function shouldUseSpline({
	width,
	prefersReducedMotion,
	minWidth = defaultMinSplineWidth
}: ShouldUseSplineOptions): boolean {
	return width >= minWidth && !prefersReducedMotion;
}

export function loadSplineViewerScript({
	doc = document as unknown as SplineScriptDocument,
	scriptSrc = splineViewerScriptSrc,
	isViewerDefined = () => Boolean(customElements.get(splineViewerTagName))
}: LoadSplineViewerScriptOptions = {}): Promise<void> {
	if (isViewerDefined()) return Promise.resolve();
	if (splineLoader) return splineLoader;

	splineLoader = new Promise<void>((resolve, reject) => {
		const existing = doc.querySelector(`script[src="${scriptSrc}"]`);
		if (existing) {
			existing.addEventListener('load', () => resolve(), { once: true });
			existing.addEventListener(
				'error',
				() => reject(new Error('Failed to load Spline viewer script.')),
				{ once: true }
			);
			return;
		}

		const script = doc.createElement('script');
		script.type = 'module';
		script.src = scriptSrc;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error('Failed to load Spline viewer script.'));
		doc.head.appendChild(script);
	}).catch((error: unknown) => {
		splineLoader = null;
		throw error;
	});

	return splineLoader;
}

export function resetSplineLoaderForTests(): void {
	splineLoader = null;
}

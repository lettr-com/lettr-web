interface ShouldAnimateOptions {
	isTabVisible: boolean;
	isInViewport: boolean;
}

export function getEffectivePixelRatio(devicePixelRatio: number, max = 1.5): number {
	if (!Number.isFinite(devicePixelRatio) || devicePixelRatio <= 0) return 1;
	if (!Number.isFinite(max) || max <= 0) return devicePixelRatio;
	return Math.min(devicePixelRatio, max);
}

export function shouldRenderFrame(now: number, lastFrameTime: number, targetFps = 30): boolean {
	if (!Number.isFinite(targetFps) || targetFps <= 0) return true;
	const frameDuration = 1000 / targetFps;
	return now - lastFrameTime >= frameDuration;
}

export function shouldAnimate({ isTabVisible, isInViewport }: ShouldAnimateOptions): boolean {
	return isTabVisible && isInViewport;
}

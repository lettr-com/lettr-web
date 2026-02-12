export function createSingleTimeoutManager(
	setTimer: typeof globalThis.setTimeout = globalThis.setTimeout,
	clearTimer: typeof globalThis.clearTimeout = globalThis.clearTimeout
) {
	let timeoutId: ReturnType<typeof globalThis.setTimeout> | undefined;

	function clear() {
		if (timeoutId === undefined) return;
		clearTimer(timeoutId);
		timeoutId = undefined;
	}

	function schedule(callback: () => void, delay: number) {
		clear();
		timeoutId = setTimer(() => {
			timeoutId = undefined;
			callback();
		}, delay);
	}

	function hasPending() {
		return timeoutId !== undefined;
	}

	return { schedule, clear, hasPending };
}

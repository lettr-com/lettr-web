interface GsapContext {
	revert(): void;
}

interface GsapLike {
	context(setup: () => void, scope?: Element): GsapContext;
}

export function createGsapContextCleanup(
	gsapInstance: GsapLike,
	setup: () => void,
	scope?: Element
): () => void {
	const context = gsapInstance.context(setup, scope);
	let isReverted = false;

	return () => {
		if (isReverted) return;
		isReverted = true;
		context.revert();
	};
}

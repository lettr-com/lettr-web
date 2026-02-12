import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createGsapContextCleanup } from './gsapContext';

type GsapTargets = string | Element | Element[] | NodeListOf<Element>;
type GsapFromVars = NonNullable<Parameters<typeof gsap.from>[1]>;

interface BaseAnimationOptions {
	scope: Element;
	targets: GsapTargets;
	vars: GsapFromVars;
}

interface ScrollRevealOptions {
	scope: Element;
	targets: GsapTargets;
	trigger?: Element;
	vars?: GsapFromVars;
}

let hasRegisteredScrollTrigger = false;

function resolveTargets(scope: Element, targets: GsapTargets): GsapTargets {
	if (typeof targets === 'string') {
		return scope.querySelectorAll(targets);
	}

	return targets;
}

export function ensureGsapPlugins(): void {
	if (hasRegisteredScrollTrigger) return;

	gsap.registerPlugin(ScrollTrigger);
	hasRegisteredScrollTrigger = true;
}

export function createFromAnimationCleanup({ scope, targets, vars }: BaseAnimationOptions): () => void {
	const resolvedTargets = resolveTargets(scope, targets);

	return createGsapContextCleanup(
		gsap,
		() => {
			gsap.from(resolvedTargets, vars);
		},
		scope
	);
}

export function createScrollRevealCleanup({
	scope,
	targets,
	trigger = scope,
	vars
}: ScrollRevealOptions): () => void {
	ensureGsapPlugins();

	const animationVars = vars ?? ({} as GsapFromVars);
	const scrollTriggerVars = (animationVars.scrollTrigger ?? {}) as Record<string, unknown>;

	return createFromAnimationCleanup({
		scope,
		targets,
		vars: {
			y: 30,
			opacity: 0,
			duration: 0.6,
			stagger: 0.08,
			ease: 'power3.out',
			...animationVars,
			scrollTrigger: {
				trigger,
				start: 'top 80%',
				toggleActions: 'play none none none',
				...scrollTriggerVars
			}
		}
	});
}

import { createGsapContextCleanup } from "./gsapContext";

type GsapTargets = string | Element | Element[] | NodeListOf<Element>;
type GsapModule = (typeof import("gsap"))["default"];
type ScrollTriggerCtor = (typeof import("gsap/ScrollTrigger"))["ScrollTrigger"];
type GsapFromVars = NonNullable<Parameters<GsapModule["from"]>[1]>;

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

let gsapModulePromise: Promise<{ gsap: GsapModule; ScrollTrigger: ScrollTriggerCtor }> | null =
  null;

/**
 * Dynamically import gsap (and ScrollTrigger) so it is split into its own chunk
 * and kept out of the initial bundle / critical render path. The promise is
 * cached so the module is only fetched, parsed, and the plugin registered once.
 */
export function loadGsap(): Promise<{ gsap: GsapModule; ScrollTrigger: ScrollTriggerCtor }> {
  if (!gsapModulePromise) {
    gsapModulePromise = (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    })();
  }

  return gsapModulePromise;
}

function resolveTargets(scope: Element, targets: GsapTargets): GsapTargets {
  if (typeof targets === "string") {
    return scope.querySelectorAll(targets);
  }

  return targets;
}

/**
 * Fail-safe used when the gsap chunk cannot be loaded (offline / blocked):
 * elements that rely on the animation to become visible are forced visible so
 * content is never permanently hidden.
 */
function revealTargets(targets: GsapTargets): void {
  if (typeof targets === "string") return;

  const list = targets instanceof Element ? [targets] : Array.from(targets as ArrayLike<Element>);
  for (const el of list) {
    (el as HTMLElement).style.opacity = "1";
    (el as HTMLElement).style.transform = "none";
  }
}

export function createFromAnimationCleanup({
  scope,
  targets,
  vars,
}: BaseAnimationOptions): () => void {
  const resolvedTargets = resolveTargets(scope, targets);
  let cancelled = false;
  let revert: (() => void) | undefined;

  void loadGsap()
    .then(({ gsap }) => {
      if (cancelled) return;
      revert = createGsapContextCleanup(
        gsap,
        () => {
          gsap.from(resolvedTargets, vars);
        },
        scope,
      );
    })
    .catch(() => revealTargets(resolvedTargets));

  return () => {
    cancelled = true;
    revert?.();
  };
}

export function createScrollRevealCleanup({
  scope,
  targets,
  trigger = scope,
  vars,
}: ScrollRevealOptions): () => void {
  const resolvedTargets = resolveTargets(scope, targets);
  const animationVars = vars ?? ({} as GsapFromVars);
  const scrollTriggerVars = (animationVars.scrollTrigger ?? {}) as Record<string, unknown>;
  let cancelled = false;
  let revert: (() => void) | undefined;

  void loadGsap()
    .then(({ gsap }) => {
      if (cancelled) return;
      revert = createGsapContextCleanup(
        gsap,
        () => {
          gsap.fromTo(
            resolvedTargets,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.04,
              ease: "power3.out",
              ...animationVars,
              scrollTrigger: {
                trigger,
                start: "top 95%",
                toggleActions: "play none none none",
                ...scrollTriggerVars,
              },
            },
          );
        },
        scope,
      );
    })
    .catch(() => revealTargets(resolvedTargets));

  return () => {
    cancelled = true;
    revert?.();
  };
}

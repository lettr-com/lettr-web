type RevealTargets = string | Element | Element[] | NodeListOf<Element>;

interface ScrollRevealOptions {
  scope: Element;
  targets: RevealTargets;
  /** Delay between elements that come into view together, in ms. */
  stagger?: number;
}

/** Set on an element waiting below the fold; app.css hides it until it scrolls in. */
export const pendingAttribute = "data-reveal-pending";

const defaultStagger = 40;
// From translateY(20px) to the element's own state; gsap's power3.out.
const keyframes: Keyframe[] = [{ opacity: 0, transform: "translateY(20px)" }];
const timing: KeyframeAnimationOptions = {
  duration: 400,
  easing: "cubic-bezier(0.165, 0.84, 0.44, 1)",
  fill: "backwards",
};

let observer: IntersectionObserver | undefined;
const staggers = new WeakMap<Element, number>();
// Elements whose first observation has come in. That first one decides whether
// the element is already on screen (left alone) or below the fold (hidden).
const placed = new WeakSet<Element>();

function canReveal(): boolean {
  return (
    typeof IntersectionObserver !== "undefined" &&
    typeof Element.prototype.animate === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function handleEntries(entries: IntersectionObserverEntry[], io: IntersectionObserver): void {
  const viewportHeight = document.documentElement.clientHeight;
  let step = 0;

  for (const entry of entries) {
    const element = entry.target;

    if (!placed.has(element)) {
      placed.add(element);
      // Painted on screen (or scrolled past) before the reveal set up: hiding
      // it now would flash, so it stays as it is.
      if (entry.boundingClientRect.top < viewportHeight) {
        io.unobserve(element);
      } else {
        element.setAttribute(pendingAttribute, "");
      }
      continue;
    }

    if (!entry.isIntersecting) continue;

    io.unobserve(element);
    element.removeAttribute(pendingAttribute);
    element.animate(keyframes, {
      ...timing,
      delay: step * (staggers.get(element) ?? defaultStagger),
    });
    step += 1;
  }
}

function getObserver(): IntersectionObserver {
  // "top 95%": an element reveals once its top is 5% above the viewport bottom.
  observer ??= new IntersectionObserver(handleEntries, { rootMargin: "0px 0px -5% 0px" });
  return observer;
}

function resolveTargets(scope: Element, targets: RevealTargets): Element[] {
  if (typeof targets === "string") return Array.from(scope.querySelectorAll(targets));
  if (targets instanceof Element) return [targets];
  return Array.from(targets);
}

/**
 * Fades and lifts `targets` in as they scroll into view. Content is visible by
 * default: only elements still below the fold when this runs are hidden, so
 * nothing already painted disappears, and without JS or with reduced motion
 * everything simply stays put. The returned cleanup shows anything still
 * waiting, at once.
 */
export function createScrollRevealCleanup({
  scope,
  targets,
  stagger = defaultStagger,
}: ScrollRevealOptions): () => void {
  if (!canReveal()) return () => {};

  const io = getObserver();
  const elements = resolveTargets(scope, targets);

  for (const element of elements) {
    staggers.set(element, stagger);
    io.observe(element);
  }

  return () => {
    for (const element of elements) {
      io.unobserve(element);
      placed.delete(element);
      element.removeAttribute(pendingAttribute);
    }
  };
}

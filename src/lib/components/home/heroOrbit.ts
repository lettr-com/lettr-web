import { emailInfraYears, topolCompanies } from "$lib/data/company";

/**
 * The hero's orbit, in units of the square stage (1 = stage width, origin at its centre).
 * Each body rides a tilted ellipse: angle 90° is nearest the viewer, 270° is furthest away.
 *
 * Only three bodies are ever in view. The other two wait behind the globe, where a body's
 * motion can't be seen: when one goes fully out of sight, the longest-waiting one takes its
 * place from the far side of its own orbit, so the count never changes.
 */

export const GLOBE_RADIUS = 0.34;
export const VISIBLE_COUNT = 3;

/** Paper's sprites are 384px with about 14% transparent margin, so the art is smaller than the box. */
const ART_RADIUS = 0.46;
const NEAR_SCALE = 1;
const FAR_SCALE = 0.74;
const ROCK_DEGREES = 5;
const TAU = Math.PI * 2;
const SPACING_REACH = Math.PI / 2.5;
const SPACING_PULL = 0.45;

export interface OrbitBody {
  id: string;
  src: string;
  /** One chapter of what Lettr is, shown on hover. Bodies appear in any order, so each stands alone. */
  title: string;
  story: string;
  /** Sprite box width at its nearest. */
  size: number;
  /** Semi-major and semi-minor axes of the ellipse. */
  a: number;
  b: number;
  /** Ellipse tilt in degrees; negative drops the left end, which keeps it clear of the copy. */
  tilt: number;
  /** Sprite rotation in degrees, from Paper. */
  rotation: number;
  /** Seconds per full orbit. */
  period: number;
  /** Starting angle in degrees for a body that begins in view; omit to begin behind the globe. */
  start?: number;
}

export interface BodyPose {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  isBehind: boolean;
}

export function poseAt(body: OrbitBody, angle: number): BodyPose {
  const tilt = (body.tilt * Math.PI) / 180;
  const ex = body.a * Math.cos(angle);
  const ey = body.b * Math.sin(angle);
  const nearness = (Math.sin(angle) + 1) / 2;
  return {
    x: ex * Math.cos(tilt) - ey * Math.sin(tilt),
    y: ex * Math.sin(tilt) + ey * Math.cos(tilt),
    scale: FAR_SCALE + (NEAR_SCALE - FAR_SCALE) * nearness,
    rotation: body.rotation + ROCK_DEGREES * Math.cos(angle),
    isBehind: Math.sin(angle) < 0,
  };
}

/** True when the whole sprite is covered by the globe's disc. */
export function isOccluded(body: OrbitBody, angle: number): boolean {
  const pose = poseAt(body, angle);
  if (!pose.isBehind) return false;
  return Math.hypot(pose.x, pose.y) + body.size * ART_RADIUS * pose.scale < GLOBE_RADIUS;
}

/** The arc around 270° where the body is fully covered: it vanishes at `enter` and reappears at `exit`. */
export function hiddenArc(body: OrbitBody): { enter: number; exit: number } {
  const far = (3 * Math.PI) / 2;
  const step = Math.PI / 720;
  let half = 0;
  while (
    half < Math.PI / 2 &&
    isOccluded(body, far + half + step) &&
    isOccluded(body, far - half - step)
  ) {
    half += step;
  }
  if (half === 0) throw new Error(`Orbit of "${body.id}" never passes fully behind the globe`);
  return { enter: far - half, exit: far + half };
}

export interface BodyState {
  angle: number;
  isParked: boolean;
}

/** Eases a body off one it's catching up with, so three in view don't read as two stacked. */
function spacingPace(state: BodyState, states: BodyState[]): number {
  let pace = 1;
  for (const other of states) {
    if (other === state || other.isParked) continue;
    const gap = ((other.angle - state.angle + Math.PI * 3) % TAU) - Math.PI;
    if (Math.abs(gap) < SPACING_REACH) {
      pace -= Math.sign(gap) * SPACING_PULL * (1 - Math.abs(gap) / SPACING_REACH);
    }
  }
  return Math.min(Math.max(pace, 1 - SPACING_PULL), 1 + SPACING_PULL);
}

export function createOrbit(bodies: OrbitBody[]) {
  const arcs = bodies.map(hiddenArc);
  const states: BodyState[] = bodies.map((body, i) =>
    body.start === undefined
      ? { angle: arcs[i].exit % TAU, isParked: true }
      : { angle: (body.start * Math.PI) / 180, isParked: false },
  );
  const waiting = bodies.flatMap((body, i) => (body.start === undefined ? [i] : []));

  return {
    states,
    advance(seconds: number) {
      states.forEach((state, i) => {
        if (state.isParked) return;
        const pace = spacingPace(state, states);
        state.angle = (state.angle + (TAU * seconds * pace) / bodies[i].period) % TAU;
        const { enter, exit } = arcs[i];
        if (state.angle < enter || state.angle >= exit) return;

        state.angle = exit % TAU;
        state.isParked = true;
        waiting.push(i);
        states[waiting.shift()!].isParked = false;
      });
    },
  };
}

export const orbitBodies: OrbitBody[] = [
  {
    id: "stamp",
    src: "/home/orbit/stamp.png",
    title: "One editor for every email",
    story: `The drag-and-drop editor ${topolCompanies} companies use.`,
    size: 0.21,
    a: 0.44,
    b: 0.17,
    tilt: -24,
    rotation: -7.5,
    period: 58,
    start: 150,
  },
  {
    id: "megaphone",
    src: "/home/orbit/megaphone.png",
    title: "Marketing in the same account",
    story: "Segment contacts and send, right next to your product email.",
    size: 0.14,
    a: 0.43,
    b: 0.13,
    tilt: -40,
    rotation: 5.8,
    period: 44,
    start: 345,
  },
  {
    id: "server",
    src: "/home/orbit/server.png",
    title: "Developers integrate once",
    story: `REST API, SMTP or SDK, on infrastructure we've run for ${emailInfraYears} years.`,
    size: 0.17,
    a: 0.42,
    b: 0.2,
    tilt: -22,
    rotation: 5.8,
    period: 70,
    start: 40,
  },
  {
    id: "chart",
    src: "/home/orbit/chart.png",
    title: "One view of every send",
    story: "Delivered, opened and clicked, all in one place.",
    size: 0.13,
    a: 0.41,
    b: 0.11,
    tilt: -28,
    rotation: 29.4,
    period: 38,
  },
  {
    id: "shield",
    src: "/home/orbit/shield.png",
    title: "Hosted in the EU",
    story: "GDPR and CCPA compliant.",
    size: 0.16,
    a: 0.45,
    b: 0.18,
    tilt: -36,
    rotation: -16.5,
    period: 50,
  },
];

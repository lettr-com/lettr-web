import { describe, expect, test } from "vite-plus/test";
import {
  createOrbit,
  GLOBE_RADIUS,
  isOccluded,
  orbitBodies,
  poseAt,
  VISIBLE_COUNT,
} from "./heroOrbit";

const frame = 1 / 60;
const tenMinutes = 10 * 60 * 60;

describe("hero orbit", () => {
  test("exactly three bodies are ever in view, and none shows while parked", () => {
    const orbit = createOrbit(orbitBodies);
    for (let i = 0; i < tenMinutes; i++) {
      orbit.advance(frame);
      const inView = orbit.states.filter((state) => !state.isParked);
      expect(inView.length).toBe(VISIBLE_COUNT);
      orbit.states.forEach((state, index) => {
        if (state.isParked) expect(isOccluded(orbitBodies[index], state.angle - 0.01)).toBe(true);
      });
    }
  });

  test("every body takes turns in view", () => {
    const orbit = createOrbit(orbitBodies);
    const seen = new Set<number>();
    for (let i = 0; i < tenMinutes; i++) {
      orbit.advance(frame);
      orbit.states.forEach((state, index) => {
        if (!state.isParked) seen.add(index);
      });
    }
    expect(seen.size).toBe(orbitBodies.length);
  });

  test("a body changes layer only where the globe cannot cut it off", () => {
    for (const body of orbitBodies) {
      for (const angle of [0, Math.PI]) {
        const pose = poseAt(body, angle);
        const artRadius = body.size * 0.41 * pose.scale;
        expect(Math.hypot(pose.x, pose.y) - artRadius, body.id).toBeGreaterThan(GLOBE_RADIUS);
      }
    }
  });

  test("all bodies orbit at different speeds", () => {
    expect(new Set(orbitBodies.map((body) => body.period)).size).toBe(orbitBodies.length);
  });
});

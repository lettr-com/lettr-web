/**
 * Picks which requestAnimationFrame ticks a canvas animation should draw on: every Nth
 * display refresh, with N chosen so the rate stays at 60 per second or more. On a 120 or
 * 160 Hz screen that halves the work, and because frames stay evenly spaced the motion
 * does not judder the way a fixed 30 fps time cap does on refresh rates it doesn't divide.
 *
 * Call `shouldDraw(now)` with the rAF timestamp on every tick, and `reset()` whenever the
 * loop restarts after a pause, so the pause is not mistaken for a slow display.
 */
export function createFramePacer() {
  const samples: number[] = [];
  let last = 0;
  let every = 1;
  let tick = 0;

  return {
    shouldDraw(now: number): boolean {
      if (last && samples.length < 15) {
        samples.push(now - last);
        if (samples.length === 15) {
          const interval = [...samples].sort((a, b) => a - b)[7];
          every = Math.max(1, Math.floor(1000 / interval / 60 + 0.1));
        }
      }
      last = now;
      return tick++ % every === 0;
    },
    reset() {
      last = 0;
    },
  };
}

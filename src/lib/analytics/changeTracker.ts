/**
 * Debounced reporting of a control's value that skips the value it starts with,
 * so mounting a slider (or remounting it on a tab switch) is not reported as a change.
 */
export function createChangeTracker(delayMs = 400) {
  let reported: number | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (value: number, report: () => void): void => {
    if (timer) clearTimeout(timer);
    timer = null;

    if (reported === null) {
      reported = value;
      return;
    }
    if (value === reported) return;

    timer = setTimeout(() => {
      reported = value;
      report();
    }, delayMs);
  };
}

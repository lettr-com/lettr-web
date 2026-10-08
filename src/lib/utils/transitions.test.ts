import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { compile } from "tailwindcss";
import { describe, expect, it } from "vite-plus/test";

// Chrome runs background-color transitions on the compositor and, as one ends, can paint the
// pre-transition colour for a single frame: the hover blip on buttons. These tests keep
// background-color out of every transition on the site.

const srcDir = path.resolve(__dirname, "../..");
const appCssPath = path.join(srcDir, "styles/app.css");

/** Resolves a CSS `@import`: relative paths as files, packages (`tailwindcss`, `tw-animate-css`) through their `style` export. */
function resolveStylesheet(id: string, base: string): string {
  if (id.startsWith(".")) return path.resolve(base, id);
  const packageDir = path.resolve(srcDir, "../node_modules", id);
  const manifest = JSON.parse(readFileSync(path.join(packageDir, "package.json"), "utf8"));
  const style: string = manifest.exports?.["."]?.style ?? manifest.style;
  return path.join(packageDir, style);
}

async function compileUtilities(candidates: string[]): Promise<string> {
  const { build } = await compile(readFileSync(appCssPath, "utf8"), {
    base: path.dirname(appCssPath),
    async loadStylesheet(id, base) {
      const file = resolveStylesheet(id, base);
      return { path: file, base: path.dirname(file), content: readFileSync(file, "utf8") };
    },
  });
  return build(candidates);
}

/** Every `transition-property` the compiled CSS declares for `selector`, in source order. */
function transitionProperties(css: string, selector: string): string[] {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rule = new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "g");
  return [...css.matchAll(rule)]
    .map((match) => /transition-property:\s*([^;]+)/.exec(match[1])?.[1].trim())
    .filter((value): value is string => value !== undefined);
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(svelte|css)$/.test(entry.name) ? [full] : [];
  });
}

describe("transitions", () => {
  it.each(["transition", "transition-colors"])(
    "compiled .%s leaves background-color out",
    async (utility) => {
      const css = await compileUtilities([utility]);
      const declared = transitionProperties(css, `.${utility}`);

      expect(declared.length).toBeGreaterThan(0);
      // The last declaration wins the cascade, so that is the one the browser applies.
      const effective = declared.at(-1)!;
      expect(effective).not.toMatch(/background|\ball\b/);
      expect(effective).toMatch(/\bcolor\b/);
    },
  );

  it("keeps the transition timing and lets motion-reduce:transition-none win", async () => {
    const css = await compileUtilities(["transition", "motion-reduce:transition-none"]);

    expect(css).toMatch(/\.transition\s*\{[^}]*transition-duration/);
    expect(css.lastIndexOf(".motion-reduce\\:transition-none")).toBeGreaterThan(
      css.lastIndexOf(".transition {"),
    );
  });

  it("no component transitions background-color", () => {
    const offenders: string[] = [];
    const forbidden = [
      // transition-all would animate background-color too
      /\btransition-all\b/,
      /\btransition-\[[^\]]*(background|\ball\b)/,
      /\btransition(-property)?\s*:[^;{}<>"]*(background|\ball\b)/,
    ];

    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/<!--[\s\S]*?-->/g, "");
      text.split("\n").forEach((line, i) => {
        if (forbidden.some((pattern) => pattern.test(line))) {
          offenders.push(`${path.relative(srcDir, file)}:${i + 1}`);
        }
      });
    }

    expect(offenders).toEqual([]);
  });
});

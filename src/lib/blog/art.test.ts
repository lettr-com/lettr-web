import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { posts } from "$lib/data/posts";
import { artAlt, artPaths, blogObjects, categoryPalettes, groundColor } from "./art";

describe("blog art", () => {
  it("gives every post a known object and a readable tilt", () => {
    for (const post of posts) {
      expect(blogObjects, post.slug).toContain(post.art.object);
      expect(Math.abs(post.art.rotate), post.slug).toBeLessThanOrEqual(30);
    }
  });

  it("has a palette for every category in use", () => {
    for (const post of posts) {
      expect(categoryPalettes, post.slug).toHaveProperty([post.category]);
    }
  });

  it("has rendered images for every post", () => {
    for (const post of posts) {
      for (const path of Object.values(artPaths(post.slug))) {
        // Run `vp run blog:images -- <slug>` when this fails for a new post.
        expect(existsSync(join("static", path)), path).toBe(true);
      }
    }
  });

  it("paints the card ground in the palette's ground colour", () => {
    expect(groundColor("Product")).toBe("#23020b");
    expect(groundColor("Fundamentals")).toBe("#fde7ed");
  });

  it("describes the object in the alt text", () => {
    expect(artAlt({ object: "envelope-open", rotate: 0 })).toBe("Pixel-dithered open envelope");
  });
});

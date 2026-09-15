/**
 * A `<script type="application/ld+json">` tag for `{@html}`. `<` is escaped
 * so text such as a quoted `</script>` in authored copy cannot end the tag.
 */
export function jsonLdScript(data: unknown): string {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

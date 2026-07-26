/** Converts a display name into a URL-safe slug. Supports Thai characters. */
export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0E00-\u0E7F\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Small helpers shared across components. */

/** Join class names, ignoring anything falsy. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

/** Keep a number inside a range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Scroll to a section by id, respecting the fixed navigation height. */
export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offset = window.innerWidth >= 1024 ? 96 : 72;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}

/**
 * Build a smooth SVG path through a list of points using a Catmull Rom curve
 * converted to cubic bezier segments. This is what gives the Digital Thread
 * its continuous, drawn by hand quality instead of hard corners.
 */
export function smoothPath(points: Array<{ x: number; y: number }>, tension = 0.5): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? points[i + 1];

    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension * 2;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension * 2;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension * 2;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension * 2;

    path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

/** Format a number for the animated statistics. */
export function formatCount(value: number): string {
  return Math.round(value).toLocaleString("en");
}

/** Basic email shape check used by the contact form. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

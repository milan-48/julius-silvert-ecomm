/**
 * Muted, low-chroma backgrounds for missing/broken product images.
 * Deterministic from `key` (e.g. slug) so SSR/hydration match and colors don’t flash.
 */
const PALETTE = [
  "#E6E9ED",
  "#EAE8E4",
  "#E5E8E5",
  "#EDEAE8",
  "#E8E6EA",
  "#E4EAEB",
  "#EBE9E4",
  "#E7EAED",
  "#E9EBE6",
  "#E6E8EA",
];

export function softPlaceholderBg(key) {
  let h = 2166136261;
  const s = String(key ?? "");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return PALETTE[Math.abs(h) % PALETTE.length];
}

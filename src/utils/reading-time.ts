/** Rough reading time estimate for Markdown content (~200 words/min, Thai-aware). */
export function estimateReadingTime(markdown: string): number {
  const plain = markdown.replace(/[#*_`>\-[\]()!]/g, " ");
  const wordCount = plain.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

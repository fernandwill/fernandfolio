const glyphs = " .,:;~";

export function steamFrame(seconds: number, compact = false): string {
  const columns = compact ? 12 : 16;
  const rows = compact ? 4 : 8;
  return Array.from({ length: rows }, (_, y) => {
    const height = 1 - y / (rows - 1);
    const center = columns / 2 + Math.sin(seconds * 1.3 - height * 4) * (1 + height * 2);
    const spread = 0.7 + height * 0.8;
    const pulse = 0.55 + Math.sin(seconds * 2.8 - height * 9) * 0.45;
    return Array.from({ length: columns }, (_, x) => {
      const distance = Math.abs(x - center) - (1.5 + height * 2);
      const density = Math.exp(-((distance / spread) ** 2)) * (1 - height * 0.65) * pulse;
      return glyphs[Math.round(density * (glyphs.length - 1))];
    }).join("");
  }).join("\n");
}

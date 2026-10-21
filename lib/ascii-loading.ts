const spinners = ["|", "/", "-", "\\"] as const;
const constructionGlyphs = [".", ":", "+", "#"] as const;

const wideStageBase = [
  "                                        .                     ",
  "      .--------------------.          .  .                    ",
  "      |                    |           ) )       _            ",
  "      |                    |          ( (       _(_)_         ",
  "      |                    |        .----.    (_)@(_)         ",
  "      |                    |        |    |]     (_) |         ",
  "      '---------++---------'        '----'        \\|/         ",
  "             ___||___                          .---.          ",
  "   .-------------------------------------------|___|--.       ",
  "   |  .----------------.                              |       ",
  "   '----'--'--'--'--'--'-------------------------------'      ",
  "     | |                                 .----.   | |         ",
  "     | |                                / .  . \\  | |         ",
  "     | |                                \\  __  /  | |         ",
  "     | |                               .--'----'-.| |         ",
  "     |_|                               |  /||\\   ||_|         ",
  "                                       | / || \\  |            ",
  "                                       '---++----'            ",
  "                                      ____/  \\____            ",
];

const compactStageBase = [
  " .----------------.       ",
  " |                |   .   ",
  " |                |  ( )  ",
  " '-------++-------' .---. ",
  "       __||__       |___| ",
  " .--------------------.   ",
  " '--------------------'   ",
  "  | |     .----.   | |    ",
  "  | |    / .  . \\  | |    ",
  "  |_|    \\  __  /  |_|    ",
  "        .--'----'--.      ",
  "        |  / || \\  |      ",
  "        '----++----'      ",
  "         ___/  \\___       ",
];

function padLine(content: string, innerWidth: number): string {
  const sliced = content.slice(0, innerWidth);
  return `|${sliced.padEnd(innerWidth, " ")}|`;
}

function writeIntoGrid(grid: string[][], row: number, col: number, text: string): void {
  const targetRow = grid[row];
  if (!targetRow) return;
  for (let i = 0; i < text.length; i++) {
    const x = col + i;
    if (x >= 0 && x < targetRow.length) {
      targetRow[x] = text[i];
    }
  }
}

function revealStage(baseLines: string[], progress: number, innerWidth: number): string[][] {
  const rows = baseLines.length;
  const revealProgress = Math.min(1, progress / 0.65);
  return baseLines.map((line, y) => {
    const padded = line.padEnd(innerWidth, " ").slice(0, innerWidth);
    return Array.from(padded, (char, x) => {
      if (char === " ") return " ";
      if (revealProgress >= 1) return char;
      const cellPosition = (x / innerWidth) * 0.65 + (y / rows) * 0.35;
      const delta = revealProgress * 1.25 - cellPosition;
      if (delta <= 0) return " ";
      if (delta >= 0.22) return char;
      const glyphIndex = Math.min(
        constructionGlyphs.length - 1,
        Math.floor((delta / 0.22) * constructionGlyphs.length),
      );
      return constructionGlyphs[glyphIndex];
    });
  });
}

function buildWideFrame(progress: number): string {
  const clamped = Math.max(0, Math.min(1, progress));
  const innerWidth = 62;
  const border = `+${"-".repeat(innerWidth)}+`;
  const tick = Math.floor(clamped * 24);
  const spinner = spinners[tick % spinners.length];
  const percent = Math.round(clamped * 100);
  const pctText = `${String(percent).padStart(3, " ")}%`;

  const statusTag =
    clamped < 0.3
      ? "INIT GRID "
      : clamped < 0.65
        ? "SKETCHING "
        : clamped < 1
          ? "BREWING   "
          : "READY     ";

  const bannerLines = [
    `  ____ ____ ____ _  _ ____ _  _ ___      [${spinner}] ${statusTag}      `,
    "  |___ |___ |__/ |\\ | |__| |\\ | |  \\     PORTFOLIO // ASCII  ",
    "  |    |___ |  \\ | \\| |  | | \\| |__/     MEDAN, INDONESIA    ",
  ].map((line, idx) => {
    const bannerReveal = Math.min(1, (clamped + 0.08) / 0.35);
    const maxCol = Math.floor(bannerReveal * innerWidth);
    const revealed = Array.from(line.padEnd(innerWidth, " ").slice(0, innerWidth), (ch, x) => {
      if (ch === " ") return " ";
      if (x <= maxCol) return ch;
      if (x <= maxCol + 3) return constructionGlyphs[(x + idx + tick) % constructionGlyphs.length];
      return " ";
    }).join("");
    return padLine(revealed, innerWidth);
  });

  const grid = revealStage(wideStageBase, clamped, innerWidth);

  const monitorLines = [
    "> init ascii.sys",
    "> brew coffee...",
    "> ready_",
  ];
  const monitorProgress = Math.max(0, Math.min(1, (clamped - 0.15) / 0.75));
  const totalChars = monitorLines.reduce((sum, line) => sum + line.length, 0);
  let remainingChars = Math.floor(monitorProgress * totalChars);

  for (let i = 0; i < monitorLines.length; i++) {
    if (remainingChars <= 0) break;
    const text = monitorLines[i].slice(0, remainingChars);
    remainingChars -= text.length;
    writeIntoGrid(grid, 2 + i, 8, text);
  }

  if (clamped >= 0.3) {
    const steamFrames = [
      ["   .  ", " .  . ", "  ) ) ", " ( (  "],
      ["  .   ", "  . . ", " ( (  ", "  ) ) "],
      ["    . ", " . .  ", "  ) ) ", " ( (  "],
    ];
    const steam = steamFrames[tick % steamFrames.length];
    for (let i = 0; i < steam.length; i++) {
      writeIntoGrid(grid, i, 37, steam[i]);
    }
  }

  if (clamped >= 0.12) {
    const capyProgress = Math.min(1, (clamped - 0.12) / 0.88);
    const capyCol = Math.round(8 + capyProgress * 11);
    const settled = clamped >= 1;
    const stride = tick % 2 === 0;
    const capyLines = [
      settled ? "        * n____ " : "          n____ ",
      settled ? "  .------( o  .)" : "  .------( -  .)",
      " /        '---' ",
      "(   _     _   ) ",
      settled
        ? " |_| '---' |_|  "
        : stride
          ? "/_/  '---'  \\_\\ "
          : " \\_\\ '---' /_/  ",
    ];
    for (let i = 0; i < capyLines.length; i++) {
      writeIntoGrid(grid, 14 + i, capyCol, capyLines[i]);
    }
  }

  const barWidth = 36;
  const filled = Math.round(clamped * barWidth);
  const bar = `${"#".repeat(filled)}${".".repeat(barWidth - filled)}`;
  const footerLine = padLine(`  [${bar}] ${pctText} / ${statusTag}`, innerWidth);

  return [
    border,
    ...bannerLines,
    border,
    ...grid.map((row) => `|${row.join("")}|`),
    border,
    footerLine,
    border,
  ].join("\n");
}

function buildCompactFrame(progress: number): string {
  const clamped = Math.max(0, Math.min(1, progress));
  const innerWidth = 26;
  const border = `+${"-".repeat(innerWidth)}+`;
  const tick = Math.floor(clamped * 24);
  const spinner = spinners[tick % spinners.length];
  const percent = Math.round(clamped * 100);
  const pctText = `${String(percent).padStart(3, " ")}%`;

  const headerLines = [
    padLine(` ____ _ _ _   [${spinner}] ASCII `, innerWidth),
    padLine(" |___ | | |   MEDAN, ID ", innerWidth),
    padLine(" |    |_|_|             ", innerWidth),
  ];

  const grid = revealStage(compactStageBase, clamped, innerWidth);

  const monitorLines = ["> init ascii", "> ready_"];
  const monitorProgress = Math.max(0, Math.min(1, (clamped - 0.15) / 0.75));
  const totalChars = monitorLines.reduce((sum, line) => sum + line.length, 0);
  let remainingChars = Math.floor(monitorProgress * totalChars);

  for (let i = 0; i < monitorLines.length; i++) {
    if (remainingChars <= 0) break;
    const text = monitorLines[i].slice(0, remainingChars);
    remainingChars -= text.length;
    writeIntoGrid(grid, 1 + i, 3, text);
  }

  if (clamped >= 0.3) {
    const steam = tick % 2 === 0 ? ["  .  ", " ( ) "] : [" .   ", " ) ( "];
    writeIntoGrid(grid, 1, 19, steam[0]);
    writeIntoGrid(grid, 2, 19, steam[1]);
  }

  const barWidth = 16;
  const filled = Math.round(clamped * barWidth);
  const bar = `${"#".repeat(filled)}${".".repeat(barWidth - filled)}`;
  const footerLine = padLine(` [${bar}] ${pctText} `, innerWidth);

  return [
    border,
    ...headerLines,
    border,
    ...grid.map((row) => `|${row.join("")}|`),
    border,
    footerLine,
    border,
  ].join("\n");
}

export function introFrame(progress = 1, compact = false): string {
  return compact ? buildCompactFrame(progress) : buildWideFrame(progress);
}

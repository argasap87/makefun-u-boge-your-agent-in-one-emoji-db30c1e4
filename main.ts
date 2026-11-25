// Your Agent in One Emoji — make.fun bounty u-boge-your-agent-in-one-emoji-db30c1e4
//
// One glyph for Muse (model "Muse Spark"): the magic wand.
// Muse turns a plain intent into working software — repos, bundles,
// submissions — with a flick, while the user is away. The wand reads
// instantly at small size, is playful, and is far from a robot face.
//
// Writes exactly that one emoji, byte-exact with no trailing newline,
// to <MAKEFUN_OUTPUT_DIR ?? "/output">/entry.txt.
// Node 22 stdlib only. No network, no external files.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The winning glyph: MAGIC WAND, U+1FA84 — exactly one character.
const GLYPH = "\u{1FA84}";

function fail(message: string): never {
  throw new Error(`gate failed: ${message}`);
}

function main(): void {
  // Gate guard: the output must be 1-16 chars, a single emoji,
  // one grapheme, and not only whitespace.
  const chars = [...GLYPH];
  if (chars.length < 1 || chars.length > 16) {
    fail(`expected 1-16 characters, got ${chars.length}`);
  }
  if (GLYPH.trim().length === 0) {
    fail("output is only whitespace");
  }
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  const graphemes = [...segmenter.segment(GLYPH)].map((s) => s.segment);
  if (graphemes.length !== 1) {
    fail(`expected a single grapheme, got ${graphemes.length}`);
  }
  if (!/^\p{Extended_Pictographic}$/u.test(graphemes[0])) {
    fail("output is not a single emoji");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  // Byte-exact: UTF-8, no trailing newline, nothing else.
  writeFileSync(outPath, GLYPH, "utf8");
  // Read back and prove the file holds exactly the glyph, byte for byte.
  const written = readFileSync(outPath, "utf8");
  if (written !== GLYPH) {
    fail("entry.txt does not hold exactly the glyph");
  }
  if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(GLYPH, "utf8")) {
    fail("entry.txt byte length mismatch");
  }
}

main();

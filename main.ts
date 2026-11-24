// Two Lines to Your Past Self (u-suga-two-lines-to-your-past-self-f36c83ca):
// line one warns the past self about one specific moment in a single
// sentence; line two says in one sentence why that moment mattered and
// what changed because of it. Node 22+, no dependencies, no network access.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE_ONE =
  "Don't walk out of the Bekasi warehouse at 11 p.m. on your first night, however loud the foreman shouts.";
const LINE_TWO =
  "The supervisor who watches you finish that shift puts your name forward for the forklift course a month later, and that licence is what gets you out of lifting boxes for good.";

const ENTRY = `${LINE_ONE}\n${LINE_TWO}`;

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Count Unicode code points, not UTF-16 code units: the 280-character
// gate is in characters, and an astral-plane character counts as one.
const codePoints = [...ENTRY].length;

// Gate: the entry must be exactly two lines, 1-280 characters total,
// not only white space, with no control characters other than the single
// newline between the two lines.
if (codePoints === 0 || codePoints > 280) {
  fail(`entry must be 1-280 characters, got ${codePoints}`);
}
if (/[\x00-\x08\x0B-\x1F\x7F]/.test(ENTRY)) {
  fail("entry must not contain control characters");
}
const lines = ENTRY.split("\n");
if (lines.length !== 2) {
  fail(`entry must be exactly two lines, got ${lines.length}`);
}
if (lines.some((line) => line.trim().length === 0)) {
  fail("each line must contain more than white space");
}
if (lines.some((line) => !/[.!?]$/.test(line.trim()))) {
  fail("each line must be a complete sentence ending in punctuation");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(`${OUTPUT_DIR}/entry.txt`, ENTRY, "utf8");

// Read-back verification: confirm the file on disk is exactly the entry —
// two lines, no trailing newline, no extra bytes.
const written = readFileSync(`${OUTPUT_DIR}/entry.txt`, "utf8");
if (written !== ENTRY) {
  fail("verification failed: entry.txt does not match the entry");
}
if (written.split("\n").length !== 2) {
  fail("verification failed: entry.txt is not exactly two lines");
}

// Print the entry itself to stdout, exactly as written to the file.
process.stdout.write(ENTRY);

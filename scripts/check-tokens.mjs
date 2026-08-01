#!/usr/bin/env node
// Fails the build when component markup reaches past the semantic design tokens
// into raw Tailwind palette utilities. See docs/design/MASTER.md — the whole
// point of declaring a token is that nothing bypasses it.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath (not URL.pathname) — pathname yields "/C:/..." on Windows.
const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const SCANNED = /\.(astro|css)$/;

const RULES = [
  {
    re: /\b(?:bg|text|border|from|via|to|ring|divide|placeholder|decoration|outline|shadow|caret|fill|stroke)-(?:zinc|cyan|pink|slate|gray|neutral|stone)-\d{2,3}\b/g,
    msg: 'raw palette color — use a semantic token',
  },
  {
    re: /\b(?:text|bg|border)-(?:white|black)\b/g,
    msg: 'raw black/white — use text-foreground / bg-surface',
  },
  {
    re: /\bprose-(?:invert|cyan)\b/g,
    msg: 'theme-locked prose modifier — prose colors come from tokens',
  },
  {
    re: /\baccent-dark\b/g,
    msg: 'retired token — use accent-hover',
  },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (SCANNED.test(entry.name)) yield path;
  }
}

const violations = [];
for await (const path of walk(SRC)) {
  const lines = (await readFile(path, 'utf8')).split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const { re, msg } of RULES) {
      for (const match of line.matchAll(re)) {
        violations.push({
          file: path.slice(SRC.length).replace(/\\/g, '/'),
          line: i + 1,
          text: match[0],
          msg,
        });
      }
    }
  });
}

if (violations.length === 0) {
  console.log('check-tokens: OK — no raw palette utilities in src/');
  process.exit(0);
}

const byFile = new Map();
for (const v of violations) {
  if (!byFile.has(v.file)) byFile.set(v.file, []);
  byFile.get(v.file).push(v);
}
for (const [file, list] of [...byFile].sort()) {
  console.error(`\n  ${file}`);
  for (const v of list) console.error(`    ${v.line}: ${v.text} — ${v.msg}`);
}
console.error(
  `\ncheck-tokens: FAILED — ${violations.length} violation(s) in ${byFile.size} file(s)\n`,
);
process.exit(1);

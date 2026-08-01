#!/usr/bin/env node
// Fails the build when component markup reaches past the semantic design tokens
// into raw Tailwind palette utilities. See docs/design/MASTER.md — the whole
// point of declaring a token is that nothing bypasses it.
//
// Exit codes: 0 = clean, 1 = violations found, 2 = the guard itself broke
// (unreadable tree, nothing scanned) — CI must be able to tell those apart.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath (not URL.pathname) — pathname yields "/C:/..." on Windows.
const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const SCANNED = /\.(astro|css)$/;

// Every Tailwind palette. Spelled out rather than [a-z]+-\d{2,3} on purpose:
// the generic form would flag legitimate future tokens on a numeric scale.
const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

// border/divide take an optional side or axis segment (border-t-, divide-x-).
// ring-offset must precede ring so the longer prefix wins.
const PREFIX =
  '(?:border|divide)(?:-[trblxyse])?|bg|text|from|via|to|ring-offset|ring|placeholder|decoration|outline|shadow|caret|fill|stroke';

const HEX = '#[0-9a-fA-F]{3,8}';

// Known one-to-one replacements, so the output reads as a list of edits
// rather than a list of complaints.
const HINTS = new Map([
  ['zinc-300', 'text-body'],
  ['zinc-400', 'text-muted'],
  ['zinc-500', 'text-muted'],
  ['zinc-800', 'border-border'],
  ['zinc-900', 'bg-surface'],
  ['cyan-400', 'text-accent'],
]);

// NOTE: these are /g regexes shared across every line. That is safe only
// because String.prototype.matchAll clones the regex and never advances
// lastIndex on the original. Switching to re.test(line) as an "optimisation"
// would silently skip every second match.
const RULES = [
  {
    re: new RegExp(`\\b(?:${PREFIX})-(?:${PALETTE})-\\d{2,3}\\b`, 'g'),
    msg: 'raw palette color — use a semantic token',
    hint: true,
  },
  {
    re: /\b(?:text|bg|border)-(?:white|black)\b/g,
    msg: 'raw black/white — use text-foreground / bg-surface',
  },
  {
    // (?<![\w-]) / (?![\w-]) so --tw-prose-invert-body, a real
    // @tailwindcss/typography variable, is not a false positive.
    re: /(?<![\w-])prose-(?:invert|cyan)(?![\w-])/g,
    msg: 'theme-locked prose modifier — prose colors come from tokens',
  },
  {
    // Deliberately NOT boundary-guarded: this must also match the declaration
    // --color-accent-dark, which has to disappear entirely.
    re: /\baccent-dark\b/g,
    msg: 'retired token — use accent-hover',
  },
  {
    // Arbitrary-value syntax is idiomatic here (shadow-[var(--shadow-card)]),
    // so a raw hex smuggled into one reads as normal code. .astro only —
    // global.css legitimately declares hex in :root.
    re: new RegExp(`\\[[^\\]\\s]*${HEX}[^\\]]*\\]`, 'g'),
    msg: 'hex literal in an arbitrary value — reference a token var instead',
    files: /\.astro$/,
  },
  {
    re: new RegExp(`style\\s*=\\s*(?:"[^"]*|'[^']*|\\{[^}]*)${HEX}`, 'g'),
    msg: 'hex literal in an inline style — reference a token var instead',
    files: /\.astro$/,
  },
];

// Blank out comment *content* so rules never fire on prose about the rules
// (global.css documents that `prose-invert` was deleted). Every newline and
// carriage return is preserved, so reported line numbers stay exact.
function stripComments(source) {
  const out = [...source];
  const n = source.length;
  const blank = (start, end) => {
    for (let k = start; k < end; k++) {
      if (out[k] !== '\n' && out[k] !== '\r') out[k] = ' ';
    }
  };
  let i = 0;
  while (i < n) {
    if (source.startsWith('/*', i)) {
      const end = source.indexOf('*/', i + 2);
      const stop = end === -1 ? n : end + 2;
      blank(i, stop);
      i = stop;
    } else if (source.startsWith('<!--', i)) {
      const end = source.indexOf('-->', i + 4);
      const stop = end === -1 ? n : end + 3;
      blank(i, stop);
      i = stop;
    } else if (source.startsWith('//', i) && source[i - 1] !== ':') {
      // The ':' guard keeps https://example.com intact.
      const end = source.indexOf('\n', i);
      const stop = end === -1 ? n : end;
      blank(i, stop);
      i = stop;
    } else {
      i++;
    }
  }
  return out.join('');
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (SCANNED.test(entry.name)) yield path;
  }
}

function hintFor(text) {
  const key = text.split('-').slice(-2).join('-');
  const token = HINTS.get(key);
  return token ? ` (${key} → ${token})` : '';
}

async function main() {
  const violations = [];
  let scanned = 0;

  try {
    for await (const path of walk(SRC)) {
      scanned++;
      const rel = 'src/' + path.slice(SRC.length).replace(/\\/g, '/');
      const lines = stripComments(await readFile(path, 'utf8')).split(/\r?\n/);
      lines.forEach((line, i) => {
        for (const { re, msg, hint, files } of RULES) {
          if (files && !files.test(path)) continue;
          for (const match of line.matchAll(re)) {
            const text =
              match[0].length > 60 ? match[0].slice(0, 57) + '…' : match[0];
            violations.push({
              file: rel,
              line: i + 1,
              text,
              msg: hint ? msg + hintFor(match[0]) : msg,
            });
          }
        }
      });
    }
  } catch (err) {
    console.error(`\ncheck-tokens: ERROR — ${err.message}\n`);
    process.exitCode = 2;
    return;
  }

  // Without this, reorganising src/ or editing the file filter would leave the
  // gate printing OK forever.
  if (scanned === 0) {
    console.error(
      `\ncheck-tokens: ERROR — scanned 0 files under ${SRC}; the guard is not looking at anything\n`,
    );
    process.exitCode = 2;
    return;
  }

  if (violations.length === 0) {
    console.log(
      `check-tokens: OK — ${scanned} files scanned, no raw palette utilities`,
    );
    return;
  }

  const byFile = new Map();
  for (const v of violations) {
    if (!byFile.has(v.file)) byFile.set(v.file, []);
    byFile.get(v.file).push(v);
  }
  // Sort on the key — the default comparator would stringify [key, array].
  for (const [file, list] of [...byFile].sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0,
  )) {
    console.error(`\n  ${file}`);
    for (const v of list) console.error(`    ${v.line}: ${v.text} — ${v.msg}`);
  }
  console.error(
    `\ncheck-tokens: FAILED — ${violations.length} violation(s) in ${byFile.size} file(s), ${scanned} files scanned\n`,
  );
  // exitCode, not exit() — process.exit() discards buffered output when
  // stdout/stderr is a pipe, which is exactly where CI reads the listing.
  process.exitCode = 1;
}

await main();

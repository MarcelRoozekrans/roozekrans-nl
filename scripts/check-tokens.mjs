#!/usr/bin/env node
// Fails the build when component markup reaches past the semantic design tokens
// into raw Tailwind palette utilities. See docs/design/MASTER.md — the whole
// point of declaring a token is that nothing bypasses it.
//
// Exit codes: 0 = clean, 1 = violations found, 2 = the guard itself broke
// (unreadable tree, nothing scanned) — CI must be able to tell those apart.
//
// Comments are scanned like any other text. This is deliberate: a stripper has
// to guess where comments start, and a wrong guess (an unterminated /* opened
// by "src/**" inside a string, url(//cdn.x/i.png) in CSS, href="//cdn.x")
// blanks the rest of the file and silently switches the gate off. A false
// positive on a comment is noisy and self-announcing — reword the comment.
// A stripper that disables the gate tells you nothing. Prefer the loud failure.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath (not URL.pathname) — pathname yields "/C:/..." on Windows.
const SRC = fileURLToPath(new URL('../src/', import.meta.url));
// Must stay a superset of what Tailwind's source detection reads, or the gate
// has a hole: a raw palette utility in a markdown post or a TS content config
// still renders and still generates CSS, but nothing here would look at it.
const SCANNED = /\.(astro|css|md|mdx|ts)$/;

// Every Tailwind palette. Spelled out rather than [a-z]+-\d{2,3} on purpose:
// the generic form would flag legitimate future tokens on a numeric scale.
const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

// border/divide take an optional side or axis segment (border-t-, divide-x-).
// ring-offset must precede ring so the longer prefix wins.
const PREFIX =
  '(?:border|divide)(?:-[trblxyse])?|bg|text|from|via|to|ring-offset|ring|placeholder|decoration|outline|shadow|caret|fill|stroke';

const HEX = '#[0-9a-fA-F]{3,8}';

// Known one-to-one replacements, so the output reads as a list of edits rather
// than a list of complaints. Keyed on the FULL utility, never the palette
// suffix — bg-cyan-400 and border-cyan-400 do not share a replacement, and a
// hint that is followed produces markup this guard would then happily pass.
// Anything not listed gets no hint: a wrong hint is worse than none.
const HINTS = new Map([
  ['text-zinc-300', 'text-body'],
  ['text-zinc-400', 'text-muted'],
  ['text-zinc-500', 'text-muted'],
  ['text-white', 'text-foreground'],
  ['bg-zinc-950', 'bg-background'],
  ['bg-zinc-900', 'bg-surface'],
  ['bg-zinc-800', 'bg-surface-subtle'],
  ['border-zinc-800', 'border-border'],
  ['border-zinc-700', 'border-border-strong'],
  ['border-zinc-500', 'border-disabled'],
  ['text-cyan-400', 'text-accent'],
  ['text-cyan-300', 'text-accent-hover'],
  ['bg-cyan-400', 'bg-accent-solid'],
  ['border-cyan-400', 'border-accent-border'],
  ['text-pink-400', 'text-sponsor'],
  ['bg-pink-500', 'bg-sponsor-subtle'],
  ['border-pink-500', 'border-sponsor-border'],
  ['border-pink-400', 'border-sponsor-border'],
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
    msg: 'raw black/white — use a semantic token',
    hint: true,
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
    // so a raw hex smuggled into one reads as normal code. Anchored to a
    // utility prefix so the report names it, and so a plain JS array
    // ['#22d3ee'] is not miscalled an arbitrary value. Unscoped, so it covers
    // stylesheets too: the required utility prefix before the bracket means a
    // bare custom-property declaration cannot match it, so the legitimate hex
    // in the :root blocks of global.css stays invisible to this rule.
    re: new RegExp(`[\\w-]+-\\[[^\\]\\s]*${HEX}[^\\]]*\\]`, 'g'),
    msg: 'hex literal in an arbitrary value — reference a token var instead',
  },
  {
    re: new RegExp(`style\\s*=\\s*(?:"[^"]*|'[^']*|\\{[^}]*)${HEX}`, 'g'),
    msg: 'hex literal in an inline style — reference a token var instead',
    files: /\.astro$/,
  },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (SCANNED.test(entry.name)) yield path;
  }
}

// Drop any variant prefix (hover:, md:, group-hover:) before the lookup.
function hintFor(text) {
  const key = text.slice(text.lastIndexOf(':') + 1);
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
      const lines = (await readFile(path, 'utf8')).split(/\r?\n/);
      lines.forEach((line, i) => {
        for (const { re, msg, hint, files } of RULES) {
          if (files && !files.test(path)) continue;
          for (const match of line.matchAll(re)) {
            const text =
              match[0].length > 60 ? match[0].slice(0, 57) + '…' : match[0];
            violations.push({
              file: rel,
              line: i + 1,
              col: match.index + 1,
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
    const label = scanned === 1 ? 'file' : 'files';
    console.log(
      `check-tokens: OK — ${scanned} ${label} scanned, no raw palette utilities`,
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
    // Reading order within a file — findings arrive grouped by rule, not by
    // position, which makes the column numbers look wrong.
    list.sort((x, y) => x.line - y.line || x.col - y.col);
    for (const v of list) {
      console.error(`    ${v.line}:${v.col}  ${v.text} — ${v.msg}`);
    }
  }
  console.error(
    `\ncheck-tokens: FAILED — ${violations.length} violation(s) in ${byFile.size} file(s), ${scanned} files scanned\n`,
  );
  // exitCode, not exit() — process.exit() discards buffered output when
  // stdout/stderr is a pipe, which is exactly where CI reads the listing.
  process.exitCode = 1;
}

await main();

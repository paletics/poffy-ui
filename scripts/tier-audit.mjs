import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const allowExts = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.mjs', '.cjs', '.md']);
const skipDirs = new Set([
  '.git',
  'node_modules',
  'dist',
  'storybook-static',
  'styled-system',
  'playwright-report',
  'test-results',
  'coverage',
]);

// In the OSS repo, importing from paid/private tiers is not allowed.
const banned = [
  { label: '@poffy-ui/pro', re: /@poffy-ui\/pro\b/ },
  { label: '@poffy-ui/enterprise', re: /@poffy-ui\/enterprise\b/ },
  { label: 'poffy-ui-pro repo name', re: /\bpoffy-ui-pro\b/ },
  { label: 'poffy-ui-enterprise repo name', re: /\bpoffy-ui-enterprise\b/ },
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      walk(fullPath, files);
      continue;
    }

    const ext = path.extname(entry.name);
    if (!allowExts.has(ext)) continue;
    files.push(fullPath);
  }
  return files;
}

function scanFile(fullPath) {
  let text;
  try {
    text = fs.readFileSync(fullPath, 'utf8');
  } catch {
    return [];
  }

  const rel = path.relative(repoRoot, fullPath).replaceAll('\\', '/');
  if (rel === 'scripts/tier-audit.mjs') {
    return [];
  }

  const hits = [];
  for (const pat of banned) {
    if (pat.re.test(text)) {
      hits.push(pat.label);
    }
  }
  return hits;
}

function main() {
  const roots = [
    path.join(repoRoot, 'packages'),
    path.join(repoRoot, 'docs'),
    path.join(repoRoot, 'scripts'),
    path.join(repoRoot, 'tooling'),
    path.join(repoRoot, '.github'),
  ].filter((p) => fs.existsSync(p));

  const failures = [];

  for (const root of roots) {
    const files = walk(root);
    for (const file of files) {
      const rel = path.relative(repoRoot, file).replaceAll('\\', '/');
      const hits = scanFile(file);
      if (hits.length) {
        failures.push({ rel, hits: Array.from(new Set(hits)) });
      }
    }
  }

  if (failures.length) {
    console.error('Tier audit failures (OSS repo must not reference Pro/Enterprise):');
    for (const f of failures) {
      console.error(`- ${f.rel}: ${f.hits.join(', ')}`);
    }
    process.exit(1);
  }

  console.log('Tier audit passed.');
}

main();

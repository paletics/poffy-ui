import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const textExtensions = new Set([
  '.cjs',
  '.css',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
]);

const skipDirs = new Set(['.git', 'dist', 'node_modules', 'storybook-static', 'styled-system']);

const skipFiles = new Set(['pnpm-lock.yaml']);

const suspiciousCodePoints = [
  0xfffd, // replacement character
  0x7b0f,
  0x7acf,
  0x7ad5,
  0x7e3a,
  0x7e5d,
  0x7e67,
  0x7ab6,
  0x873f,
  0x8b41,
  0x96a8,
  0x5197,
  0x6155,
  0x90e2,
  0x90b1,
  0x906f,
  0x8f3f,
  0xff83,
  0xff7d,
];

const suspiciousPattern = new RegExp(
  `[${suspiciousCodePoints.map((codePoint) => `\\u{${codePoint.toString(16)}}`).join('')}]`,
  'u',
);

const hits = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) {
        walk(path.join(dir, entry.name));
      }
      continue;
    }

    if (skipFiles.has(entry.name) || !textExtensions.has(path.extname(entry.name))) {
      continue;
    }

    const file = path.join(dir, entry.name);
    const text = fs.readFileSync(file, 'utf8');
    if (suspiciousPattern.test(text)) {
      hits.push(path.relative(repoRoot, file));
    }
  }
}

walk(repoRoot);

if (hits.length > 0) {
  console.error(`Mojibake markers found:\n${hits.map((hit) => `- ${hit}`).join('\n')}`);
  process.exit(1);
}

console.log('No mojibake markers found.');

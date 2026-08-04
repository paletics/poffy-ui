import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { clientEntries, serverSafeEntries } from './clientEntries.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const distDir = join(scriptDir, '../dist');
const directive = "'use client';";

const missing = [];
const unexpected = [];

for (const entry of clientEntries) {
  for (const extension of ['js', 'mjs']) {
    const relativePath = `${entry}.${extension}`;
    const source = await readFile(join(distDir, relativePath), 'utf8');
    if (!source.startsWith(directive)) missing.push(relativePath);
  }
}

for (const entry of serverSafeEntries) {
  for (const extension of ['js', 'mjs']) {
    const relativePath = `${entry}.${extension}`;
    const source = await readFile(join(distDir, relativePath), 'utf8');
    if (source.startsWith(directive)) unexpected.push(relativePath);
  }
}

if (missing.length > 0) {
  throw new Error(`Missing ${directive} in behavior client entrypoints:\n${missing.join('\n')}`);
}

if (unexpected.length > 0) {
  throw new Error(
    `Unexpected ${directive} in behavior server-safe entrypoints:\n${unexpected.join('\n')}`,
  );
}

console.log(
  `Verified ${directive} in ${clientEntries.length} client entrypoints and excluded it from ${serverSafeEntries.length} server-safe entrypoints.`,
);

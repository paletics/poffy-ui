import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { clientEntries } from './clientEntries.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const distDir = join(scriptDir, '../dist');
const directive = "'use client';";

const missing = [];

for (const entry of clientEntries) {
  for (const extension of ['js', 'mjs']) {
    const relativePath = `${entry}.${extension}`;
    const source = await readFile(join(distDir, relativePath), 'utf8');
    if (!source.startsWith(directive)) missing.push(relativePath);
  }
}

if (missing.length > 0) {
  throw new Error(`Missing ${directive} in React client entrypoints:\n${missing.join('\n')}`);
}

console.log(`Verified ${directive} in ${clientEntries.length} React client entrypoints.`);

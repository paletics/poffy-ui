import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { clientEntries } from './clientEntries.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const distDir = join(scriptDir, '../dist');
const directive = "'use client';";

const addDirective = async (relativePath) => {
  const filePath = join(distDir, relativePath);
  const source = await readFile(filePath, 'utf8');
  if (source.startsWith(directive)) return;

  await writeFile(filePath, `${directive}\n${source}`);
};

await Promise.all(
  clientEntries.flatMap((entry) => [`${entry}.js`, `${entry}.mjs`].map(addDirective)),
);

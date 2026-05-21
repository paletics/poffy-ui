import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skipDirs = new Set(['.git', 'dist', 'node_modules', 'storybook-static', 'styled-system']);
const packageFiles = [];
const failures = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) {
        walk(path.join(dir, entry.name));
      }
      continue;
    }

    if (entry.name === 'package.json') {
      packageFiles.push(path.join(dir, entry.name));
    }
  }
}

function isExternalTarget(target) {
  return !target.startsWith('./') && !target.startsWith('../');
}

function checkPath(packageDir, packageName, field, target) {
  if (typeof target !== 'string' || isExternalTarget(target)) {
    return;
  }

  const targetPath = path.resolve(packageDir, target);
  if (!fs.existsSync(targetPath)) {
    failures.push(`${packageName} ${field} -> ${path.relative(repoRoot, targetPath)}`);
  }
}

function checkExport(packageDir, packageName, exportName, value) {
  if (typeof value === 'string') {
    checkPath(packageDir, packageName, `exports["${exportName}"]`, value);
    return;
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return;
  }

  for (const [condition, target] of Object.entries(value)) {
    if (typeof target === 'string') {
      checkPath(packageDir, packageName, `exports["${exportName}"].${condition}`, target);
    } else {
      checkExport(packageDir, packageName, `${exportName}.${condition}`, target);
    }
  }
}

walk(repoRoot);

for (const packageFile of packageFiles.sort()) {
  const packageJson = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  const packageDir = path.dirname(packageFile);
  const packageName = packageJson.name ?? path.relative(repoRoot, packageDir);

  if (packageJson.private === true) {
    continue;
  }

  for (const field of ['main', 'module', 'types']) {
    checkPath(packageDir, packageName, field, packageJson[field]);
  }

  if (packageJson.bin && typeof packageJson.bin === 'object') {
    for (const [name, target] of Object.entries(packageJson.bin)) {
      checkPath(packageDir, packageName, `bin.${name}`, target);
    }
  } else {
    checkPath(packageDir, packageName, 'bin', packageJson.bin);
  }

  if (packageJson.exports && typeof packageJson.exports === 'object') {
    for (const [exportName, value] of Object.entries(packageJson.exports)) {
      checkExport(packageDir, packageName, exportName, value);
    }
  }
}

if (failures.length > 0) {
  console.error(
    `Package export targets are missing:\n${failures.map((failure) => `- ${failure}`).join('\n')}`,
  );
  process.exit(1);
}

console.log(`Checked package export targets in ${packageFiles.length} package.json files.`);

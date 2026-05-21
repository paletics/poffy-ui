import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packagesRoot = path.join(repoRoot, 'packages');

const rootOwnedDevTools = new Set([
  '@pandacss/dev',
  '@pandacss/types',
  '@poffy-ui/eslint-config',
  '@poffy-ui/typescript-config',
  'eslint',
  'prettier',
  'tsup',
  'typescript',
  'vite',
  'vitest',
]);

const dependencySections = ['dependencies', 'peerDependencies', 'optionalDependencies'];
const failures = [];

for (const packageDir of fs.readdirSync(packagesRoot).sort()) {
  const packageJsonPath = path.join(packagesRoot, packageDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) continue;

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const packageName = packageJson.name ?? `packages/${packageDir}`;
  const devDependencies = Object.keys(packageJson.devDependencies ?? {});

  if (devDependencies.length > 0) {
    failures.push(
      `${packageName} declares devDependencies: ${devDependencies.sort().join(', ')}`,
    );
  }

  for (const section of dependencySections) {
    const dependencies = packageJson[section] ?? {};
    for (const dependencyName of Object.keys(dependencies).sort()) {
      if (!rootOwnedDevTools.has(dependencyName)) continue;

      failures.push(`${packageName} declares root-owned dev tool ${dependencyName} in ${section}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Package boundary check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Package boundary checks passed.');

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pnpmPackagesDir = path.join(repoRoot, 'node_modules', '.pnpm');
const workspaceSkipDirs = new Set([
  '.git',
  'dist',
  'node_modules',
  'storybook-static',
  'styled-system',
]);
const seen = new Set();
const findings = [];

const prohibitedPatterns = [
  /(^|\W)agpl(?:-\d|\W|$)/i,
  /(^|\W)gpl(?:-\d|\W|$)/i,
  /(^|\W)lgpl(?:-\d|\W|$)/i,
  /(^|\W)sspl(?:-\d|\W|$)/i,
  /commons.?clause/i,
  /non-?commercial/i,
  /cc-?by-?nc/i,
  /polyform.?noncommercial/i,
  /business.?source|(^|\W)bsl(?:-\d|\W|$)|(^|\W)busl(?:-\d|\W|$)/i,
  /proprietary|commercial use|no commercial/i,
];

function readPackageJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return undefined;
  }
}

function licenseText(packageJson) {
  if (typeof packageJson.license === 'string') {
    return packageJson.license;
  }

  if (Array.isArray(packageJson.licenses)) {
    return packageJson.licenses
      .map((license) => {
        if (typeof license === 'string') return license;
        if (license && typeof license.type === 'string') return license.type;
        return '';
      })
      .filter(Boolean)
      .join(' OR ');
  }

  return '';
}

function checkPackage(file) {
  const packageJson = readPackageJson(file);
  if (!packageJson?.name || !packageJson?.version) {
    return;
  }

  const key = `${packageJson.name}@${packageJson.version}`;
  if (seen.has(key)) {
    return;
  }

  seen.add(key);
  const license = licenseText(packageJson);
  if (!license) {
    return;
  }

  if (prohibitedPatterns.some((pattern) => pattern.test(license))) {
    findings.push({
      name: packageJson.name,
      version: packageJson.version,
      license,
      file: path.relative(repoRoot, file),
    });
  }
}

function walkPackages(dir, skipDirs = new Set()) {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) {
        walkPackages(file, skipDirs);
      }
    } else if (entry.name === 'package.json') {
      checkPackage(file);
    }
  }
}

walkPackages(repoRoot, workspaceSkipDirs);
walkPackages(pnpmPackagesDir);

if (findings.length > 0) {
  console.error('Prohibited licenses found:');
  for (const finding of findings) {
    console.error(`- ${finding.name}@${finding.version}: ${finding.license} (${finding.file})`);
  }
  process.exit(1);
}

console.log(`Checked ${seen.size} package license declarations. No prohibited licenses found.`);

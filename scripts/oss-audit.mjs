import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const allowExts = new Set([
  '.cjs',
  '.cts',
  '.css',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.mts',
  '.ts',
  '.tsx',
  '.txt',
  '.yml',
  '.yaml',
]);

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

const hardPatterns = [
  { name: 'Private key header', re: /-----BEGIN (?:OPENSSH|RSA|EC) PRIVATE KEY-----/ },
  { name: 'Generic auth header', re: /^\s*authorization:\s*bearer\s+/im },
  { name: 'GitHub PAT (classic)', re: /\bghp_[A-Za-z0-9]{36}\b/ },
  { name: 'GitHub PAT', re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/ },
  { name: 'AWS access key id', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'AWS secret access key', re: /\baws(.{0,20})?secret(.{0,20})?=.{0,5}[A-Za-z0-9/+=]{40}\b/i },
  { name: 'NPM token', re: /\bnpm_[A-Za-z0-9]{36,}\b/ },
];

const softPatterns = [
  { name: 'Localhost URL', re: /\bhttps?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\b/i },
  { name: 'User home path', re: /\b(?:C:\\Users\\|\/Users\/)[^ \n]+/ },
  { name: 'Internal-only wording', re: /\b(?:internal only|do not share|confidential)\b/i },
  { name: 'Old package name', re: /@paletics\/poffy-ui\b/ },
];

const sensitivePathPatterns = [
  { name: '.env file', re: /(^|\/)\.env(\.|$)/ },
  { name: '.npmrc file', re: /(^|\/)\.npmrc$/ },
  { name: 'Key file', re: /\.pem$|\.key$|\.p12$|\.pfx$/ },
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.changeset' && entry.name !== '.github') {
      // still include dot-folders like .changeset/.github; skip other hidden dirs by default
    }
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      walk(fullPath, files);
      continue;
    }

    const rel = path.relative(repoRoot, fullPath).replaceAll('\\', '/');
    const ext = path.extname(entry.name);
    if (!allowExts.has(ext)) continue;
    files.push({ fullPath, rel });
  }
  return files;
}

function walkForBinaryAssets(dir, findings = []) {
  const binaryExts = new Set([
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.ico',
    '.ttf',
    '.otf',
    '.woff',
    '.woff2',
    '.mp3',
    '.mp4',
    '.mov',
  ]);

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      walkForBinaryAssets(fullPath, findings);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!binaryExts.has(ext)) continue;
    const rel = path.relative(repoRoot, fullPath).replaceAll('\\', '/');
    findings.push(rel);
  }

  return findings;
}

function scanTextFile({ fullPath, rel }) {
  let content;
  try {
    content = fs.readFileSync(fullPath, 'utf8');
  } catch {
    return { rel, hardHits: [], softHits: [] };
  }

  const hardHits = [];
  const softHits = [];

  for (const pat of hardPatterns) {
    if (pat.re.test(content)) hardHits.push(pat.name);
  }
  for (const pat of softPatterns) {
    if (rel === 'scripts/oss-audit.mjs') {
      continue;
    }
    if (pat.name === 'Old package name' && rel.endsWith('package.json')) {
      continue;
    }
    if (pat.re.test(content)) softHits.push(pat.name);
  }

  return { rel, hardHits, softHits };
}

function main() {
  const allFiles = walk(repoRoot);
  const binaryAssets = walkForBinaryAssets(repoRoot);

  const hardFindings = [];
  const softFindings = [];

  for (const file of allFiles) {
    for (const pat of sensitivePathPatterns) {
      if (pat.re.test(file.rel)) {
        hardFindings.push({ rel: file.rel, hits: [`Sensitive path: ${pat.name}`] });
      }
    }

    const { rel, hardHits, softHits } = scanTextFile(file);
    if (hardHits.length) hardFindings.push({ rel, hits: hardHits });
    if (softHits.length) softFindings.push({ rel, hits: softHits });
  }

  if (binaryAssets.length) {
    for (const rel of binaryAssets) {
      softFindings.push({ rel, hits: ['Binary asset (ensure license/attribution is OSS-compatible)'] });
    }
  }

  if (softFindings.length) {
    console.log('OSS audit warnings:');
    for (const f of softFindings) {
      console.log(`- ${f.rel}: ${Array.from(new Set(f.hits)).join(', ')}`);
    }
  }

  if (hardFindings.length) {
    console.error('OSS audit failures:');
    for (const f of hardFindings) {
      console.error(`- ${f.rel}: ${Array.from(new Set(f.hits)).join(', ')}`);
    }
    process.exit(1);
  }

  console.log('OSS audit passed.');
}

main();

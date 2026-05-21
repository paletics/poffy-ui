import fs from 'node:fs';
import path from 'node:path';

const targetDirs = process.argv.slice(2);

if (targetDirs.length === 0) {
  console.error('Usage: node scripts/copy-dts-to-dmts.mjs <directory> [...]');
  process.exit(1);
}

const declarationExtensions = ['.d.ts', '.d.mts'];

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function ensureRelative(specifier) {
  return specifier.startsWith('.') ? specifier : `./${specifier}`;
}

function withoutDeclarationExtension(filePath) {
  return filePath.replace(/\.d\.(m)?ts$/, '');
}

function copyDeclarationFiles(src, dest) {
  if (!fs.existsSync(src)) return;

  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDeclarationFiles(srcPath, destPath);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.d.ts')) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function collectDeclarations(dir, files = []) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory does not exist: ${dir}`);
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      collectDeclarations(entryPath, files);
      continue;
    }

    if (entry.isFile() && declarationExtensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(entryPath);
    }
  }

  return files;
}

function resolveSpecifier(rootDir, fromFile, specifier) {
  if (specifier.startsWith('@/')) {
    return path.join(rootDir, specifier.slice(2));
  }

  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    return path.resolve(path.dirname(fromFile), specifier);
  }

  return null;
}

function resolveDeclarationTarget(rootDir, fromFile, specifier, extension) {
  const resolved = resolveSpecifier(rootDir, fromFile, specifier);
  if (!resolved) return null;

  const withoutExt = withoutDeclarationExtension(resolved);
  const candidates =
    extension === '.d.mts'
      ? [
          `${withoutExt}.d.mts`,
          path.join(withoutExt, 'index.d.mts'),
          `${withoutExt}.d.ts`,
          path.join(withoutExt, 'index.d.ts'),
        ]
      : [
          `${withoutExt}.d.ts`,
          path.join(withoutExt, 'index.d.ts'),
          `${withoutExt}.d.mts`,
          path.join(withoutExt, 'index.d.mts'),
        ];

  const target = candidates.find((candidate) => fs.existsSync(candidate));
  if (!target) return null;

  return { target, isIndex: path.basename(target).startsWith('index.d.') };
}

function toDeclarationSpecifier(rootDir, fromFile, specifier, extension) {
  if (!specifier.startsWith('@/') && !specifier.startsWith('./') && !specifier.startsWith('../')) {
    return specifier;
  }

  const resolved = resolveDeclarationTarget(rootDir, fromFile, specifier, extension);
  if (!resolved) return specifier.replace(/^@\//, './');

  let targetWithoutExt = withoutDeclarationExtension(resolved.target);

  if (extension === '.d.ts' && resolved.isIndex) {
    targetWithoutExt = path.dirname(targetWithoutExt);
  }

  if (extension === '.d.mts') {
    targetWithoutExt = `${targetWithoutExt}.mjs`;
  }

  return ensureRelative(toPosix(path.relative(path.dirname(fromFile), targetWithoutExt)));
}

function rewriteSpecifiers(rootDir, file) {
  const extension = file.endsWith('.d.mts') ? '.d.mts' : '.d.ts';
  const original = fs.readFileSync(file, 'utf8');
  const rewritten = original.replace(
    /((?:from\s*|import\s*\(\s*|import\s+)['"])([^'"]+)(['"])/g,
    (match, prefix, specifier, suffix) =>
      `${prefix}${toDeclarationSpecifier(rootDir, file, specifier, extension)}${suffix}`,
  );

  if (rewritten !== original) {
    fs.writeFileSync(file, rewritten);
  }
}

function copyMtsDeclarations(dir) {
  for (const file of collectDeclarations(dir).filter((candidate) => candidate.endsWith('.d.ts'))) {
    fs.copyFileSync(file, file.replace(/\.d\.ts$/, '.d.mts'));
  }
}

function prepareDeclarations(rootDir) {
  const packageRoot = path.resolve(rootDir, '..', '..');
  copyDeclarationFiles(
    path.join(packageRoot, 'src', 'styled-system'),
    path.join(rootDir, 'styled-system'),
  );

  for (const file of collectDeclarations(rootDir).filter((candidate) =>
    candidate.endsWith('.d.ts'),
  )) {
    rewriteSpecifiers(rootDir, file);
  }

  copyMtsDeclarations(rootDir);

  for (const file of collectDeclarations(rootDir).filter((candidate) =>
    candidate.endsWith('.d.mts'),
  )) {
    rewriteSpecifiers(rootDir, file);
  }
}

for (const targetDir of targetDirs) {
  prepareDeclarations(path.resolve(targetDir));
}

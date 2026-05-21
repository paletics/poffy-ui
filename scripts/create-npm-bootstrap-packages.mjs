import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const outDirArg = process.argv.find((arg) => arg.startsWith('--out='));
const outDir = path.resolve(
  outDirArg ? outDirArg.slice('--out='.length) : path.join(os.tmpdir(), 'poffy-ui-npm-bootstrap'),
);

const packages = [
  {
    name: '@poffy-ui/types',
    directory: 'packages/types',
    description: 'Bootstrap package for Poffy UI trusted publishing setup.',
  },
  {
    name: '@poffy-ui/system',
    directory: 'packages/system',
    description: 'Bootstrap package for Poffy UI trusted publishing setup.',
  },
  {
    name: '@poffy-ui/behavior',
    directory: 'packages/behavior',
    description: 'Bootstrap package for Poffy UI trusted publishing setup.',
  },
  {
    name: '@poffy-ui/react',
    directory: 'packages/react',
    description: 'Bootstrap package for Poffy UI trusted publishing setup.',
  },
];

function packageDir(packageName) {
  return path.join(outDir, packageName.replace('@poffy-ui/', ''));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

fs.rmSync(outDir, { force: true, recursive: true });
fs.mkdirSync(outDir, { recursive: true });

for (const pkg of packages) {
  const targetDir = packageDir(pkg.name);
  fs.mkdirSync(targetDir, { recursive: true });

  writeJson(path.join(targetDir, 'package.json'), {
    name: pkg.name,
    version: '0.0.1',
    description: pkg.description,
    license: 'Apache-2.0',
    author: 'paletics',
    repository: {
      type: 'git',
      url: 'git+https://github.com/paletics/poffy-ui.git',
      directory: pkg.directory,
    },
    publishConfig: {
      access: 'public',
      registry: 'https://registry.npmjs.org/',
    },
    files: ['README.md', 'index.js'],
    main: 'index.js',
    sideEffects: false,
  });

  fs.writeFileSync(
    path.join(targetDir, 'README.md'),
    `# ${pkg.name}\n\nBootstrap-only package for npm Trusted Publishing setup.\nUse version 0.1.0 or later for Poffy UI.\n`,
    'utf8',
  );
  fs.writeFileSync(
    path.join(targetDir, 'index.js'),
    "'use strict';\n\nmodule.exports = {};\n",
    'utf8',
  );
}

console.log(`Created npm bootstrap packages in ${outDir}`);
console.log('');
console.log('Review the generated package.json files, then publish with 2FA:');
for (const pkg of packages) {
  console.log(`npm publish ${packageDir(pkg.name)} --access public`);
}
console.log('');
console.log('After publishing 0.0.1, configure npm Trusted Publishing before releasing 0.1.0.');

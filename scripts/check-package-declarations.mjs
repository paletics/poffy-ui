import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reactPackageRoot = path.join(repoRoot, 'packages', 'react');
const smokeDir = path.join(reactPackageRoot, '.declaration-smoke');

const subpaths = [
  '@poffy-ui/react',
  '@poffy-ui/react/a11y',
  '@poffy-ui/react/animations',
  '@poffy-ui/react/layout',
  '@poffy-ui/react/typography',
  '@poffy-ui/react/inputs',
  '@poffy-ui/react/data-display',
  '@poffy-ui/react/feedback',
  '@poffy-ui/react/navigation',
  '@poffy-ui/react/overlay',
  '@poffy-ui/react/surfaces',
  '@poffy-ui/react/media',
  '@poffy-ui/react/tree-view',
];

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function runTsc(project) {
  const command = process.platform === 'win32' ? 'cmd.exe' : 'pnpm';
  const args =
    process.platform === 'win32'
      ? ['/d', '/s', '/c', `pnpm exec tsc --noEmit -p ${project}`]
      : ['exec', 'tsc', '--noEmit', '-p', project];
  const result = spawnSync(command, args, {
    cwd: reactPackageRoot,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`tsc failed for ${project}`);
  }
}

fs.rmSync(smokeDir, { recursive: true, force: true });
fs.mkdirSync(smokeDir, { recursive: true });

fs.writeFileSync(
  path.join(smokeDir, 'esm.mts'),
  [
    subpaths.map((specifier, index) => `import * as ns${index} from '${specifier}';`).join('\n'),
    "import type { ButtonProps } from '@poffy-ui/react/inputs';",
    "import type { BoxProps } from '@poffy-ui/react/layout';",
    '',
    'const buttonProps: ButtonProps = { children: "OK" };',
    'const boxProps: BoxProps = {};',
    `void [${subpaths.map((_, index) => `ns${index}`).join(', ')}];`,
    'void buttonProps;',
    'void boxProps;',
    '',
  ].join('\n'),
);

fs.writeFileSync(
  path.join(smokeDir, 'cjs.cts'),
  [
    "import react = require('@poffy-ui/react');",
    "import inputs = require('@poffy-ui/react/inputs');",
    '',
    'const button = inputs.Button;',
    'const box = react.Box;',
    'void button;',
    'void box;',
    '',
  ].join('\n'),
);

writeJson(path.join(smokeDir, 'tsconfig.nodenext.json'), {
  compilerOptions: {
    module: 'NodeNext',
    moduleResolution: 'NodeNext',
    target: 'ES2022',
    jsx: 'react-jsx',
    strict: true,
    // Keep this focused on Poffy UI's public declaration graph. Panda's external
    // declaration package currently has duplicate re-exports under full lib checks.
    skipLibCheck: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    noEmit: true,
  },
  files: ['esm.mts', 'cjs.cts'],
});

writeJson(path.join(smokeDir, 'tsconfig.bundler.json'), {
  compilerOptions: {
    module: 'ESNext',
    moduleResolution: 'Bundler',
    target: 'ES2022',
    jsx: 'react-jsx',
    strict: true,
    // Keep this focused on Poffy UI's public declaration graph. Panda's external
    // declaration package currently has duplicate re-exports under full lib checks.
    skipLibCheck: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    noEmit: true,
  },
  files: ['esm.mts'],
});

try {
  runTsc(path.join(smokeDir, 'tsconfig.nodenext.json'));
  runTsc(path.join(smokeDir, 'tsconfig.bundler.json'));
  console.log('Package declaration smoke checks passed.');
} finally {
  fs.rmSync(smokeDir, { recursive: true, force: true });
}

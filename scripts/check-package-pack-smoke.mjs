import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const smokeRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'poffy-ui-pack-smoke-'));
const packDir = path.join(smokeRoot, 'packs');
const consumerDir = path.join(smokeRoot, 'consumer');

const packageDirs = ['types', 'system', 'behavior', 'react'];

function exportSpecifier(packageName, exportKey) {
  if (exportKey === '.') return packageName;
  return `${packageName}/${exportKey.replace(/^\.\//, '')}`;
}

function exportTarget(exportValue, condition) {
  if (!exportValue || typeof exportValue !== 'object' || Array.isArray(exportValue)) {
    return undefined;
  }

  const conditionValue = exportValue[condition];
  if (typeof conditionValue === 'string') return conditionValue;
  if (
    conditionValue &&
    typeof conditionValue === 'object' &&
    typeof conditionValue.default === 'string'
  ) {
    return conditionValue.default;
  }

  return undefined;
}

function collectPublicExports(packageJson) {
  const codeExports = [];
  const assetExports = [];

  for (const [exportKey, exportValue] of Object.entries(packageJson.exports ?? {})) {
    const specifier = exportSpecifier(packageJson.name, exportKey);

    if (typeof exportValue === 'string') {
      assetExports.push({ specifier, target: exportValue });
      continue;
    }

    const importTarget = exportTarget(exportValue, 'import');
    const requireTarget = exportTarget(exportValue, 'require');
    if (importTarget || requireTarget) {
      codeExports.push({ specifier, hasRequire: Boolean(requireTarget) });
    }
  }

  return { codeExports, assetExports };
}

function run(command, args, options = {}) {
  const stdio = options.stdio ?? 'inherit';
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio,
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    if (stdio === 'pipe') {
      process.stdout.write(result.stdout ?? '');
      process.stderr.write(result.stderr ?? '');
    }

    throw new Error(`${command} ${args.join(' ')} failed`);
  }
}

function runPnpm(args, options = {}) {
  if (process.env.npm_execpath) {
    run(process.execPath, [process.env.npm_execpath, ...args], options);
    return;
  }

  if (process.platform === 'win32') {
    run('cmd.exe', ['/d', '/s', '/c', `pnpm ${args.join(' ')}`], options);
    return;
  }

  run('pnpm', args, options);
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function packageTarball(packageJson) {
  const slug = packageJson.name.replace(/^@/, '').replaceAll('/', '-');
  return `${slug}-${packageJson.version}.tgz`;
}

function tarballDependency(packageDir) {
  const packageJsonPath = path.join(repoRoot, 'packages', packageDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const tarball = packageTarball(packageJson);
  return {
    name: packageJson.name,
    specifier: `file:${path.join(packDir, tarball).replaceAll(path.sep, '/')}`,
  };
}

fs.mkdirSync(packDir, { recursive: true });
fs.mkdirSync(consumerDir, { recursive: true });

try {
  fs.writeFileSync(
    path.join(smokeRoot, 'pnpm-workspace.yaml'),
    [
      'packages:',
      '  - "consumer"',
      'trustPolicy: no-downgrade',
      'trustPolicyExclude: [ chokidar ]',
      '',
    ].join('\n'),
  );

  for (const packageDir of packageDirs) {
    const packageJsonPath = path.join(repoRoot, 'packages', packageDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    runPnpm(
      [
        '--dir',
        `packages/${packageDir}`,
        'pack',
        '--pack-destination',
        packDir.replaceAll(path.sep, '/'),
      ],
      {
        encoding: 'utf8',
        stdio: 'pipe',
      },
    );
    console.log(`Packed ${packageJson.name}`);
  }

  const dependencies = Object.fromEntries(
    packageDirs.map((packageDir) => {
      const dependency = tarballDependency(packageDir);
      return [dependency.name, dependency.specifier];
    }),
  );
  const exportCoverage = packageDirs.map((packageDir) => {
    const packageJsonPath = path.join(repoRoot, 'packages', packageDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return {
      packageName: packageJson.name,
      ...collectPublicExports(packageJson),
    };
  });
  const codeExports = exportCoverage.flatMap(({ codeExports }) => codeExports);
  const assetExports = exportCoverage.flatMap(({ packageName, assetExports }) =>
    assetExports.map((assetExport) => ({ packageName, ...assetExport })),
  );

  writeJson(path.join(smokeRoot, 'package.json'), {
    name: 'poffy-ui-pack-smoke-workspace',
    private: true,
    pnpm: {
      overrides: dependencies,
    },
  });

  writeJson(path.join(consumerDir, 'package.json'), {
    name: 'poffy-ui-pack-smoke',
    private: true,
    type: 'module',
    dependencies: {
      ...dependencies,
      react: '^19.0.0',
      'react-dom': '^19.0.0',
    },
    devDependencies: {
      '@types/react': '^19.2.7',
      '@types/react-dom': '^19.2.3',
      typescript: '^5.7.0',
    },
  });

  fs.writeFileSync(
    path.join(consumerDir, 'esm.mts'),
    [
      codeExports
        .map((codeExport, index) => `import * as namespace${index} from '${codeExport.specifier}';`)
        .join('\n'),
      "import type { ButtonProps } from '@poffy-ui/react/inputs';",
      "import type { BoxProps } from '@poffy-ui/react/layout';",
      "import type { PrimitiveProps } from '@poffy-ui/types';",
      '',
      'const buttonProps: ButtonProps = { children: "OK" };',
      'const boxProps: BoxProps = {};',
      'const primitiveProps: PrimitiveProps<"button"> = { children: "OK" };',
      `void [${codeExports.map((_, index) => `namespace${index}`).join(', ')}];`,
      'void buttonProps;',
      'void boxProps;',
      'void primitiveProps;',
      '',
    ].join('\n'),
  );

  fs.writeFileSync(
    path.join(consumerDir, 'cjs.cts'),
    [
      codeExports
        .filter((codeExport) => codeExport.hasRequire)
        .map((codeExport, index) => `import namespace${index} = require('${codeExport.specifier}');`)
        .join('\n'),
      '',
      `void [${codeExports
        .filter((codeExport) => codeExport.hasRequire)
        .map((_, index) => `namespace${index}`)
        .join(', ')}];`,
      '',
    ].join('\n'),
  );

  const compilerOptions = {
    target: 'ES2022',
    jsx: 'react-jsx',
    strict: true,
    // Keep this focused on package installability and public type resolution.
    skipLibCheck: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    noEmit: true,
  };

  writeJson(path.join(consumerDir, 'tsconfig.nodenext.json'), {
    compilerOptions: {
      ...compilerOptions,
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
    },
    files: ['esm.mts', 'cjs.cts'],
  });

  writeJson(path.join(consumerDir, 'tsconfig.bundler.json'), {
    compilerOptions: {
      ...compilerOptions,
      module: 'ESNext',
      moduleResolution: 'Bundler',
    },
    files: ['esm.mts'],
  });

  runPnpm(['install', '--ignore-scripts', '--no-frozen-lockfile'], { cwd: consumerDir });
  for (const assetExport of assetExports) {
    const target = assetExport.target.replace(/^\.\//, '');
    const installedTarget = path.join(consumerDir, 'node_modules', assetExport.packageName, target);
    if (!fs.existsSync(installedTarget)) {
      throw new Error(`${assetExport.specifier} target ${assetExport.target} was not installed`);
    }
  }
  runPnpm(['exec', 'tsc', '--noEmit', '-p', 'tsconfig.nodenext.json'], { cwd: consumerDir });
  runPnpm(['exec', 'tsc', '--noEmit', '-p', 'tsconfig.bundler.json'], { cwd: consumerDir });

  console.log('Package pack smoke checks passed.');
} finally {
  fs.rmSync(smokeRoot, { recursive: true, force: true });
}

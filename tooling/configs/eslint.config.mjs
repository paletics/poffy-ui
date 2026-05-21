import { reactConfig } from '@poffy-ui/eslint-config/react';
import path from 'path';
import { fileURLToPath } from 'url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export default [
  {
    ignores: [
      '**/dist/**',
      '**/.declaration-smoke/**',
      '**/playwright-report/**',
      '**/storybook-static/**',
      '**/styled-system/**',
      '**/test-results/**',
      'src/styled-system/**',
      'packages/*/src/styled-system/**',
    ],
  },
  ...reactConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: [
          path.join(projectRoot, 'tsconfig.json'),
          path.join(projectRoot, 'tsconfig.lib.json'),
          path.join(projectRoot, 'tsconfig.node.json'),
          path.join(projectRoot, 'tsconfig.vitest.json'),
          path.join(projectRoot, 'tsconfig.storybook.json'),
          path.join(projectRoot, 'packages/behavior/tsconfig.json'),
          path.join(projectRoot, 'packages/system/tsconfig.json'),
          path.join(projectRoot, 'packages/types/tsconfig.json'),
          path.join(projectRoot, 'packages/react/tsconfig.json'),
        ],
        tsconfigRootDir: projectRoot,
      },
    },
  },
];

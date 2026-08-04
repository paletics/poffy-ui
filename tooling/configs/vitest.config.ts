import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'path';
import { defineConfig } from 'vitest/config';

const rootDir = path.resolve(__dirname, '../..');

export default defineConfig({
  plugins: [],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'motion/react',
      '@floating-ui/react',
      'storybook/viewport',
    ],
  },
  resolve: {
    alias: [
      {
        find: /^@poffy-ui\/behavior\/(.+)$/,
        replacement: path.resolve(rootDir, 'packages/behavior/src') + '/$1/index.ts',
      },
      {
        find: '@poffy-ui/behavior',
        replacement: path.resolve(rootDir, 'packages/behavior/src/index.ts'),
      },
      {
        find: /^@poffy-ui\/system\/preset$/,
        replacement: path.resolve(rootDir, 'packages/system/src/preset.ts'),
      },
      {
        find: '@poffy-ui/system',
        replacement: path.resolve(rootDir, 'packages/system/src/index.ts'),
      },
      {
        find: '@poffy-ui/types',
        replacement: path.resolve(rootDir, 'packages/types/src/index.ts'),
      },
      {
        find: '@/styled-system',
        replacement: path.resolve(rootDir, 'packages/react/src/styled-system'),
      },
      {
        find: '@',
        replacement: path.resolve(rootDir, 'packages/react/src'),
      },
    ],
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/react/src/**/*.{ts,tsx}', 'packages/behavior/src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'packages/react/src/**/stories/**',
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          setupFiles: './tests/setup.ts',
          include: [
            'packages/react/src/**/*.test.{ts,tsx}',
            'packages/behavior/src/**/*.test.{ts,tsx}',
          ],
          exclude: [
            'packages/react/src/**/*.browser.test.{ts,tsx}',
            'packages/react/src/**/*.stories.{ts,tsx}',
            'packages/behavior/src/**/*.stories.{ts,tsx}',
          ],
        },
      },
      {
        extends: true,
        test: {
          name: 'behavior',
          environment: 'jsdom',
          globals: true,
          setupFiles: './tests/setup.ts',
          include: ['packages/behavior/src/**/*.test.{ts,tsx}'],
          exclude: ['packages/behavior/src/**/*.stories.{ts,tsx}'],
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.resolve(rootDir, '.storybook') })],
        test: {
          name: 'storybook',
          fileParallelism: false,
          globals: true,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['packages/react/src/**/*.browser.test.{ts,tsx}'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});

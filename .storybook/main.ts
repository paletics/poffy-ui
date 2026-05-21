import type { StorybookConfig } from '@storybook/react-vite';
import { readFileSync } from 'fs';
import path from 'path';
import { mergeConfig } from 'vite';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const config: StorybookConfig = {
  stories: ['../packages/react/src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      define: {
        'process.env.UI_VERSION': JSON.stringify(packageJson.version),
        'process.env.NODE_ENV': JSON.stringify(config.mode),
      },
      resolve: {
        alias: [
          {
            find: /^@poffy-ui\/behavior\/(.+)$/,
            replacement: path.resolve(process.cwd(), 'packages/behavior/src') + '/$1/index.ts',
          },
          {
            find: '@poffy-ui/behavior',
            replacement: path.resolve(process.cwd(), 'packages/behavior/src/index.ts'),
          },
          {
            find: /^@poffy-ui\/system\/preset$/,
            replacement: path.resolve(process.cwd(), 'packages/system/src/preset.ts'),
          },
          {
            find: '@poffy-ui/system',
            replacement: path.resolve(process.cwd(), 'packages/system/src/index.ts'),
          },
          {
            find: '@poffy-ui/types',
            replacement: path.resolve(process.cwd(), 'packages/types/src/index.ts'),
          },
          {
            find: '@/styled-system',
            replacement: path.resolve(process.cwd(), 'packages/react/src/styled-system'),
          },
          {
            find: '@',
            replacement: path.resolve(process.cwd(), 'packages/react/src'),
          },
        ],
      },
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
          'motion/react',
          'storybook/viewport',
        ],
      },
      build: {
        cssMinify: 'esbuild',
      },
    });
  },
};
export default config;

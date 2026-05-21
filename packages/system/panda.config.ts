import { defineConfig } from '@pandacss/dev';
import { poffyPreset } from './src/preset';

export default defineConfig({
  preflight: true,
  presets: ['@pandacss/preset-base', poffyPreset],
  include: ['./src/**/*.{ts,tsx}'],
  jsxFramework: 'react',
  prefix: 'poffy',
  outdir: 'src/styled-system',
  outExtension: 'js',
  strictTokens: true,
  hash: false,
  minify: false,
  importMap: '@/styled-system',
});

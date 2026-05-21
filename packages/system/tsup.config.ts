import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    preset: 'src/preset.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  esbuildOptions(options) {
    options.alias = {
      ...options.alias,
      '@/styled-system': path.resolve(__dirname, 'src/styled-system'),
      '@': path.resolve(__dirname, 'src'),
    };
  },
  external: [/^@pandacss\//],
  onSuccess: async () => {
    const generatedCss = path.resolve(__dirname, 'src/styled-system/styles.css');
    if (fs.existsSync(generatedCss)) {
      fs.mkdirSync('dist', { recursive: true });
      fs.copyFileSync(generatedCss, 'dist/styles.css');
    }
  },
});

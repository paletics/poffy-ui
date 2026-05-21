import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '../..');
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const categories = [
  'a11y',
  'animations',
  'layout',
  'typography',
  'inputs',
  'data-display',
  'feedback',
  'navigation',
  'overlay',
  'surfaces',
  'media',
  'tree-view',
];

export default defineConfig({
  entry: {
    index: 'packages/react/src/index.ts',
    ...Object.fromEntries(
      categories.map((category) => [
        `${category}/index`,
        `packages/react/src/components/${category}/index.ts`,
      ]),
    ),
  },
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  minify: true,
  sourcemap: true,
  outDir: 'dist',
  tsconfig: 'tsconfig.lib.json',
  env: {
    UI_VERSION: packageJson.version,
  },
  esbuildOptions(options) {
    options.alias = {
      ...options.alias,
      '@/styled-system': path.resolve(rootDir, 'packages/react/src/styled-system'),
      '@': path.resolve(rootDir, 'packages/react/src'),
    };
  },
  external: [
    ...(packageJson.peerDependencies ? Object.keys(packageJson.peerDependencies) : []),
    ...(packageJson.dependencies ? Object.keys(packageJson.dependencies) : []),
    /\.css$/,
    /^@visx\/.*/,
    /^react-.*/,
  ],

  onSuccess: async () => {
    const copyDir = (src: string, dest: string) => {
      if (!fs.existsSync(src)) return;
      fs.mkdirSync(dest, { recursive: true });
      const entries = fs.readdirSync(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };

    if (fs.existsSync('packages/react/src/assets')) {
      copyDir('packages/react/src/assets', 'dist/assets');
    }

    const generatedCss = path.resolve(rootDir, 'packages/react/src/styled-system/styles.css');
    if (fs.existsSync(generatedCss)) {
      fs.mkdirSync('dist/style', { recursive: true });
      fs.copyFileSync(generatedCss, 'dist/style/poffy-ui.min.css');

      if (fs.existsSync('packages/react/src/style')) {
        copyDir('packages/react/src/style', 'dist/style');
      }
    }
  },
});

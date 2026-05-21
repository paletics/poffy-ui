import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8')) as {
  peerDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
};

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
    index: 'src/index.ts',
    ...Object.fromEntries(
      categories.map((cat) => [cat + '/index', `src/components/${cat}/index.ts`]),
    ),
  },
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  minify: true,
  sourcemap: true,
  outDir: 'dist',
  esbuildOptions(options) {
    options.alias = {
      ...options.alias,
      '@/styled-system': path.resolve(__dirname, 'src/styled-system'),
      '@': path.resolve(__dirname, 'src'),
    };
  },
  external: [
    ...(packageJson.peerDependencies ? Object.keys(packageJson.peerDependencies) : []),
    ...(packageJson.dependencies ? Object.keys(packageJson.dependencies) : []),
    /\.css$/,
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

    const generatedCss = path.resolve(__dirname, 'src/styled-system/styles.css');
    if (fs.existsSync(generatedCss)) {
      fs.mkdirSync('dist', { recursive: true });
      fs.copyFileSync(generatedCss, 'dist/styles.css');

      fs.mkdirSync('dist/style', { recursive: true });
      fs.copyFileSync(generatedCss, 'dist/style/poffy-ui.min.css');

      if (fs.existsSync('src/style')) {
        copyDir('src/style', 'dist/style');
      }
    }
  },
});

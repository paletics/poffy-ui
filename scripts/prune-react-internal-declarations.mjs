import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const reactTypesDir = path.resolve(scriptDir, '../packages/react/dist/types');

const removeIfExists = (targetPath) => {
  if (!fs.existsSync(targetPath)) return;
  fs.rmSync(targetPath, { recursive: true, force: true });
};

const walk = (dir, visit) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath, visit);
    } else {
      visit(entryPath);
    }
  }
};

removeIfExists(path.join(reactTypesDir, 'theme'));

walk(reactTypesDir, (filePath) => {
  if (/\.recipe\.d\.(?:m)?ts(?:\.map)?$/.test(filePath)) {
    removeIfExists(filePath);
  }
});

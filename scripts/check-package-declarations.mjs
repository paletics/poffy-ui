import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reactPackageRoot = path.join(repoRoot, 'packages', 'react');
const smokeDir = path.join(reactPackageRoot, '.declaration-smoke');

const subpaths = [
  '@poffy-ui/react',
  '@poffy-ui/react/ssr',
  '@poffy-ui/react/providers',
  '@poffy-ui/react/hooks',
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
  '@poffy-ui/react/screen-composer',
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
    "import { filterCommandMenuItems } from '@poffy-ui/behavior/command-menu';",
    "import { getInitialMotionAttributes } from '@poffy-ui/react/ssr';",
    "import { getInitialThemeAttributes } from '@poffy-ui/react/ssr';",
    "import { ThemeProvider } from '@poffy-ui/react/providers';",
    "import { useAnchorPosition } from '@poffy-ui/react/hooks';",
    "import type { CustomBrandColors } from '@poffy-ui/react/providers';",
    "import { useCollapsibleState } from '@poffy-ui/behavior/collapsible';",
    "import { AlertDialog, AlertDialogContent, AlertDialogTitle, HoverCard, HoverCardContent, HoverCardDescription, HoverCardTitle, HoverCardTrigger, Portal } from '@poffy-ui/react/overlay';",
    "import { CommandMenu } from '@poffy-ui/react/navigation';",
    "import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@poffy-ui/react/surfaces';",
    "import { coreScreenExtension, createScreenRegistry, defineScreen } from '@poffy-ui/behavior/screen-composer';",
    "import type { ScreenDocument, ScreenExtension } from '@poffy-ui/behavior/screen-composer';",
    "import { coreScreenRendererExtension, createScreenRendererRegistry, ScreenRenderer } from '@poffy-ui/react/screen-composer';",
    "import type { ScreenRendererExtension, ScreenRendererProps } from '@poffy-ui/react/screen-composer';",
    "import type { ButtonProps } from '@poffy-ui/react/inputs';",
    "import type { AlertDialogProps, HoverCardDescriptionProps, HoverCardProps, HoverCardTitleProps, PortalProps } from '@poffy-ui/react/overlay';",
    "import type { CommandMenuItem, CommandMenuProps } from '@poffy-ui/react/navigation';",
    "import type { CollapsibleProps } from '@poffy-ui/react/surfaces';",
    "import type { BoxProps } from '@poffy-ui/react/layout';",
    '',
    'const buttonProps: ButtonProps = { children: "OK" };',
    'const alertDialogProps: AlertDialogProps = { children: null, defaultOpen: true };',
    'const hoverCardProps: HoverCardProps = { children: null, defaultOpen: true };',
    'const portalProps: PortalProps = { children: null, container: () => document.body, disabled: true };',
    'const commandMenuItems: CommandMenuItem[] = [{ id: "open", label: "Open" }];',
    'const commandMenuProps: CommandMenuProps = { items: commandMenuItems };',
    'const hoverCardTitleProps: HoverCardTitleProps = { children: "Title" };',
    'const hoverCardDescriptionProps: HoverCardDescriptionProps = { children: "Description" };',
    'const collapsibleProps: CollapsibleProps = { children: null, defaultOpen: true };',
    'const boxProps: BoxProps = {};',
    'const customBrand: CustomBrandColors = { main: "#8B5CF6" };',
    'const screenDocument: ScreenDocument = { version: 1, root: { id: "root", type: "core.stack", version: 1 } };',
    'const appExtension: ScreenExtension = { id: "app-extension", namespace: "app", nodes: [{ type: "app.notice", version: 1 }] };',
    'const schemaResult = createScreenRegistry([coreScreenExtension, appExtension]);',
    'if (!schemaResult.ok) throw new Error("Expected schema registry");',
    'const appRendererExtension: ScreenRendererExtension = { id: "app-extension", namespace: "app", renderers: [{ type: "app.notice", version: 1, render: () => null }] };',
    'const rendererResult = createScreenRendererRegistry(schemaResult.registry, [coreScreenRendererExtension, appRendererExtension]);',
    'if (!rendererResult.ok) throw new Error("Expected renderer registry");',
    'const screenRendererProps: ScreenRendererProps = { document: screenDocument, schemaRegistry: schemaResult.registry, rendererRegistry: rendererResult.registry };',
    'const definedScreen = defineScreen(screenDocument);',
    'void AlertDialog;',
    'void AlertDialogContent;',
    'void AlertDialogTitle;',
    'void HoverCard;',
    'void HoverCardContent;',
    'void HoverCardDescription;',
    'void HoverCardTitle;',
    'void HoverCardTrigger;',
    'void Portal;',
    'void CommandMenu;',
    'void filterCommandMenuItems;',
    'void getInitialMotionAttributes;',
    'void getInitialThemeAttributes;',
    'void ThemeProvider;',
    'void useAnchorPosition;',
    'void customBrand;',
    'void Collapsible;',
    'void CollapsibleTrigger;',
    'void CollapsibleContent;',
    'void useCollapsibleState;',
    'void ScreenRenderer;',
    `void [${subpaths.map((_, index) => `ns${index}`).join(', ')}];`,
    'void buttonProps;',
    'void alertDialogProps;',
    'void hoverCardProps;',
    'void hoverCardTitleProps;',
    'void hoverCardDescriptionProps;',
    'void portalProps;',
    'void commandMenuProps;',
    'void collapsibleProps;',
    'void boxProps;',
    'void screenRendererProps;',
    'void definedScreen;',
    '',
  ].join('\n'),
);

fs.writeFileSync(
  path.join(smokeDir, 'cjs.cts'),
  [
    "import react = require('@poffy-ui/react');",
    "import ssr = require('@poffy-ui/react/ssr');",
    "import providers = require('@poffy-ui/react/providers');",
    "import hooks = require('@poffy-ui/react/hooks');",
    "import inputs = require('@poffy-ui/react/inputs');",
    "import navigation = require('@poffy-ui/react/navigation');",
    "import overlay = require('@poffy-ui/react/overlay');",
    '',
    'const button = inputs.Button;',
    'const alertDialog = overlay.AlertDialog;',
    'const hoverCard = overlay.HoverCard;',
    'const portal = overlay.Portal;',
    'const commandMenu = navigation.CommandMenu;',
    'const box = react.Box;',
    'const initialMotionAttributes = ssr.getInitialMotionAttributes();',
    'const initialThemeAttributes = ssr.getInitialThemeAttributes();',
    'const themeProvider = providers.ThemeProvider;',
    'const anchorPosition = hooks.useAnchorPosition;',
    'void button;',
    'void alertDialog;',
    'void hoverCard;',
    'void portal;',
    'void commandMenu;',
    'void box;',
    'void initialMotionAttributes;',
    'void initialThemeAttributes;',
    'void themeProvider;',
    'void anchorPosition;',
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

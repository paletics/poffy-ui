import {
  coreScreenExtension,
  createScreenRegistry,
  defineScreen,
} from '@poffy-ui/behavior/screen-composer';
import type {
  ScreenDocument,
  ScreenExtension,
  ScreenNode,
} from '@poffy-ui/behavior/screen-composer';
import {
  coreScreenRendererExtension,
  createScreenRendererRegistry,
  ScreenRenderer,
} from '@/components/screen-composer';
import type { ScreenRendererExtension, ScreenRendererProps } from '@/components/screen-composer';

const appExtension = {
  id: 'app-extension',
  namespace: 'app',
  nodes: [{ type: 'app.notice', version: 1 }],
} satisfies ScreenExtension;

const schemaResult = createScreenRegistry([coreScreenExtension, appExtension]);
if (!schemaResult.ok) throw new Error('Expected schema registry');

const appRendererExtension = {
  id: 'app-extension',
  namespace: 'app',
  renderers: [{ type: 'app.notice', version: 1, render: () => null }],
} satisfies ScreenRendererExtension;

const rendererResult = createScreenRendererRegistry(schemaResult.registry, [
  coreScreenRendererExtension,
  appRendererExtension,
]);
if (!rendererResult.ok) throw new Error('Expected renderer registry');

const document = defineScreen({
  version: 1,
  root: { id: 'root', type: 'app.notice', version: 1 },
} satisfies ScreenDocument);

const props = {
  document,
  schemaRegistry: schemaResult.registry,
  rendererRegistry: rendererResult.registry,
  onAction: (_actionId: string, _node: ScreenNode) => undefined,
} satisfies ScreenRendererProps;

void ScreenRenderer;
void props;

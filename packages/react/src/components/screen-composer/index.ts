/** React rendering bridge for behavior-layer screen-composer documents and extensions. */
export { coreScreenRendererExtension, ScreenRenderer } from './ScreenRenderer';
/** Creates an immutable renderer registry; use extensions to add or override node renderers. */
export { createScreenRendererRegistry } from './createScreenRendererRegistry';
export type {
  ScreenNodeRendererDefinition,
  ScreenRenderContext,
  ScreenRendererExtension,
  ScreenRendererProps,
  ScreenRendererRegistry,
  ScreenRendererRegistryResult,
} from './ScreenRenderer.types';

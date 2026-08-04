import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { gridStyle } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import {
  getFallbackChildrenPreservingVoidHost,
  isNonVoidAsChildHost,
} from '@/components/shared/asChild';
import { CSSProperties, forwardRef, type ElementType } from 'react';
import type { GridComponent, GridProps } from './Grid.types';
import { normalizeGridColumns, normalizeMinChildWidth } from '../gridValidation';

interface GridCSSVars extends CSSProperties {
  '--grid-columns'?: string;
}

interface RuntimeEnv {
  process?: { env?: Record<string, string | undefined> };
}


const GridImpl = forwardRef<Element, GridProps>((props, ref) => {
  const { asChild, columns, gap, ratio, minChildWidth, className, children, style, ...rest } =
    props;

  const [cssProps, elementProps] = splitCssProps(rest);
  const recipeClass = gridStyle({ ratio, gap });

  const canUseAsChild = Boolean(asChild && isNonVoidAsChildHost(children));
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;
  const nodeEnv = (globalThis as RuntimeEnv).process?.env?.['NODE_ENV'];

  if (nodeEnv !== 'production' && ratio && (columns !== undefined || minChildWidth !== undefined)) {
    console.warn(
      '[Grid] `ratio` and `columns`/`minChildWidth` were both specified. `ratio` takes precedence and `columns`/`minChildWidth` will be ignored.',
    );
  }

  const normalizedMinChildWidth = ratio ? undefined : normalizeMinChildWidth(minChildWidth, 'Grid');
  const normalizedColumns = ratio ? undefined : normalizeGridColumns(columns, 'Grid');
  const gridColumns =
    normalizedMinChildWidth !== undefined
      ? `repeat(auto-fit, minmax(min(100%, ${normalizedMinChildWidth}), 1fr))`
      : normalizedColumns
        ? `repeat(${normalizedColumns}, minmax(0, 1fr))`
        : undefined;
  const gridStyleVars = {
    ...style,
    '--grid-columns': gridColumns,
  } satisfies GridCSSVars;

  return (
    <Component
      ref={ref}
      className={cx(recipeClass, css(cssProps), className)}
      {...elementProps}
      style={gridStyleVars}
    >
      {asChild && !canUseAsChild ? getFallbackChildrenPreservingVoidHost(children) : children}
    </Component>
  );
});

GridImpl.displayName = 'Grid';
/**
 * Arranges children in an explicit CSS grid with configurable tracks and placement.
 *
 * A `ratio` layout takes precedence over `columns` and `minChildWidth`; use a non-void single
 * host element with `asChild` when the grid itself must be semantic.
 */
export const Grid = GridImpl as GridComponent;

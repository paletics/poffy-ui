import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { gridStyle } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { CSSProperties, ElementType, forwardRef } from 'react';
import { GridProps } from './Grid.types';

interface GridCSSVars extends CSSProperties {
  '--grid-columns'?: string;
}

interface RuntimeEnv {
  process?: { env?: Record<string, string | undefined> };
}

/**
 * A highly structural layout component powered by CSS Grid, specifically tuned for Silver and Golden ratio asymmetric layouts.
 * The `columns` prop accepts a single number and generates generic equal columns via CSS variable. For complex responsive grids (e.g. `base: 1, md: 3`), use `<SimpleGrid>`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: gridStyle, splitCssProps), Radix Slot
 * - **Props**: PrimitiveProps<'div', GridOwnProps>
 *
 * ### Design Tokens
 * - **spacing**: gap: Applies Silver Ratio spacing tokens.
 * - **ratio**: 'silver-left' (1.414:1), 'silver-right' (1:1.414).
 *
 * ### Variant Logic
 * - **ratio**: Enforces strict mathematical asymmetric column definitions for main/sidebar aesthetics.
 *
 * ### Accessibility
 * - **Role**: generic
 * - **Required**: No inherent semantic meaning. Map to appropriate semantic elements via `asChild` if establishing page-level structure.
 *
 * ### AI Usage
 * - **DO**: Use `<Grid ratio="silver-x">` to instantly construct mathematically balanced asymmetric UI panels.
 *
 * @example Standard usage
 * ```tsx
 * // Creates a layout where the left column is roughly 58% and the right is 42%.
 * <Grid ratio="silver-left" gap="6">
 *   <main>Main Content</main>
 *   <aside>Sidebar</aside>
 * </Grid>
 * ```
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  const { asChild, columns, gap, ratio, minChildWidth, className, children, style, ...rest } =
    props;

  const [cssProps, elementProps] = splitCssProps(rest);
  const recipeClass = gridStyle({ ratio, gap });

  const Component = (asChild ? Slot : 'div') as ElementType;
  const nodeEnv = (globalThis as RuntimeEnv).process?.env?.['NODE_ENV'];

  if (nodeEnv !== 'production' && ratio && (columns !== undefined || minChildWidth !== undefined)) {
    console.warn(
      '[Grid] `ratio` and `columns`/`minChildWidth` were both specified. `ratio` takes precedence and `columns`/`minChildWidth` will be ignored.',
    );
  }

  const gridColumns = minChildWidth
    ? `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`
    : columns
      ? `repeat(${columns}, 1fr)`
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
      {children}
    </Component>
  );
});

Grid.displayName = 'Grid';

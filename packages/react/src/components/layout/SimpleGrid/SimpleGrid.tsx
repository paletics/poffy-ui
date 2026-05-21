import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { simpleGrid } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { CSSProperties, ElementType, forwardRef } from 'react';
import { SimpleGridProps } from './SimpleGrid.types';

type SimpleGridCSSVars = CSSProperties & {
  '--grid-columns'?: string;
  '--min-child-width'?: string;
};

/**
 * A responsive CSS Grid layout primitive for equal-width column configurations.
 * Supports both fixed column counts and fluid auto-fit layouts via `minChildWidth`.
 * Unlike `<Grid>`, `SimpleGrid` columns accept Panda-style responsive objects.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: simpleGrid, splitCssProps), Radix Slot. CSS variables `--grid-columns` and `--min-child-width` are injected via `style` prop.
 * - **Props**: SimpleGridProps
 *
 * ### Design Tokens
 * - **spacing**: gap: Silver Ratio spacing tokens (`none`→`3xl`). Column widths are user-defined; the gap scale ensures consistent rhythm between cells.
 *
 * ### Variant Logic
 * - **columns={N}**: Fixed grid — always `N` equal-width columns regardless of container width.
 * - **minChildWidth="200px"**: Fluid auto-fit — columns fill the row until each would be < 200px.
 *
 * ### Accessibility
 * - **Role**: generic
 * - **Required**: No inherent semantic role. Use `asChild` with a semantic element (e.g., `<ul>`) for list grids.
 *
 * ### AI Usage
 * - **DO**: Use for uniform card grids, photo galleries, or feature grids that need responsive columns.
 * - **DON'T**: Do NOT combine `columns` and `minChildWidth` — `minChildWidth` takes precedence.
 * - **DON'T**: Use `<Grid>` instead when you need asymmetric column ratios (Silver Ratio layouts).
 *
 * @example Fixed 3-column card grid
 * ```tsx
 * <SimpleGrid columns={3} gap="md">
 *   <Card>Product A</Card>
 *   <Card>Product B</Card>
 *   <Card>Product C</Card>
 * </SimpleGrid>
 * ```
 *
 * @example Fluid gallery layout
 * ```tsx
 * <SimpleGrid minChildWidth="220px" gap="lg">
 *   {photos.map(p => <Image key={p.id} src={p.url} />)}
 * </SimpleGrid>
 * ```
 *
 * ### Notes
 * For Silver Ratio asymmetric layouts (e.g., 1.414:1 main/sidebar), use `<Grid ratio="silver-left">` instead.
 */
export const SimpleGrid = forwardRef<HTMLDivElement, SimpleGridProps>((props, ref) => {
  const { asChild, columns, gap, minChildWidth, className, children, style, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = simpleGrid({
    columns: minChildWidth ? 'auto' : columns,
    gap,
  });

  const minWidthValue = typeof minChildWidth === 'number' ? `${minChildWidth}px` : minChildWidth;

  const dynamicStyle = {
    '--min-child-width': minWidthValue,
    '--grid-columns': minChildWidth ? undefined : columns ? `repeat(${columns}, 1fr)` : undefined,
  };

  const Component = (asChild ? Slot : 'div') as ElementType;

  return (
    <Component
      ref={ref}
      className={cx(recipeClass, css(cssProps), className)}
      style={{ ...dynamicStyle, ...style } satisfies SimpleGridCSSVars}
      {...elementProps}
    >
      {children}
    </Component>
  );
});

SimpleGrid.displayName = 'SimpleGrid';

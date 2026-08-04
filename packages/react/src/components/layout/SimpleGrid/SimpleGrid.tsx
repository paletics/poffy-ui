import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { simpleGrid } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { getFallbackChildrenPreservingVoidHost, isAsChildHost } from '@/components/shared/asChild';
import { CSSProperties, forwardRef, type ElementType } from 'react';
import type { SimpleGridComponent, SimpleGridProps } from './SimpleGrid.types';
import { normalizeGridColumns, normalizeMinChildWidth } from '../gridValidation';

type SimpleGridCSSVars = CSSProperties & {
  '--grid-columns'?: string;
  '--min-child-width'?: string;
};

const simpleGridAsChildHostNames = new Set(['article', 'div', 'ol', 'section', 'ul']);


const SimpleGridImpl = forwardRef<Element, SimpleGridProps>((props, ref) => {
  const { asChild, columns, gap, minChildWidth, className, children, style, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const normalizedMinChildWidth = normalizeMinChildWidth(minChildWidth, 'SimpleGrid');
  const hasMinChildWidth = normalizedMinChildWidth !== undefined;
  const recipeClass = simpleGrid({
    columns: hasMinChildWidth ? 'auto' : undefined,
    gap,
  });
  const normalizedColumns = hasMinChildWidth
    ? undefined
    : normalizeGridColumns(columns, 'SimpleGrid');

  const dynamicStyle = {
    '--min-child-width': normalizedMinChildWidth,
    '--grid-columns': hasMinChildWidth
      ? undefined
      : normalizedColumns
        ? `repeat(${normalizedColumns}, minmax(0, 1fr))`
        : undefined,
  };

  const canUseAsChild = Boolean(asChild && isAsChildHost(children, simpleGridAsChildHostNames));
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;

  return (
    <Component
      ref={ref}
      className={cx(recipeClass, css(cssProps), className)}
      style={{ ...style, ...dynamicStyle } satisfies SimpleGridCSSVars}
      {...elementProps}
    >
      {asChild && !canUseAsChild ? getFallbackChildrenPreservingVoidHost(children) : children}
    </Component>
  );
});

SimpleGridImpl.displayName = 'SimpleGrid';
/**
 * Creates an equal-width responsive grid from either a column count or minimum child width.
 *
 * `asChild` is supported only for an `article`, `div`, `ol`, `section`, or `ul` host so the grid
 * can preserve a valid structural element.
 */
export const SimpleGrid = SimpleGridImpl as SimpleGridComponent;

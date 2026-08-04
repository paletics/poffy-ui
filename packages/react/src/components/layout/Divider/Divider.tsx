import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { dividerStyle } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { DividerProps } from './Divider.types';

/**
 * Separates distinct content groups with a semantic horizontal or vertical rule. It always renders
 * an `hr` with separator semantics and manages `aria-orientation` from the orientation prop.
 */
export const Divider = forwardRef<HTMLHRElement, DividerProps>((props, ref) => {
  const {
    orientation,
    variant,
    className,
    role: _role,
    'aria-orientation': _ariaOrientation,
    ...rest
  } = props as DividerProps & { role?: unknown; 'aria-orientation'?: unknown };

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = dividerStyle({
    orientation,
    variant,
  });

  return (
    <hr
      ref={ref}
      role="separator"
      aria-orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
      className={cx(recipeClass, css(cssProps), className)}
      {...elementProps}
    />
  );
});

Divider.displayName = 'Divider';

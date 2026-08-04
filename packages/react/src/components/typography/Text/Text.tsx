import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { text } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ElementType } from 'react';
import type { TextComponent, TextProps } from './Text.types';
import { getTextFallbackChildren, isTextAsChildHost } from './Text.utils';


const TextImpl = forwardRef<Element, TextProps>((props, ref) => {
  const { asChild, className, children, variant, weight, align, transform, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = text({ variant, weight, align, transform });
  const styleClass = css(cssProps);
  const canUseAsChild = asChild && isTextAsChildHost(children);
  const Component = (canUseAsChild ? Slot : 'p') as ElementType;

  return (
    <Component ref={ref} className={cx(recipeClass, styleClass, className)} {...elementProps}>
      {canUseAsChild ? children : asChild ? getTextFallbackChildren(children) : children}
    </Component>
  );
});

TextImpl.displayName = 'Text';
/**
 * Renders body text with selectable typography, using a paragraph (`p`) by default.
 *
 * Use `asChild` with one non-void host when paragraph markup is not valid in the surrounding
 * structure; the caller chooses that host's semantics. An invalid `asChild` child falls back to
 * `p` and retains its content, rather than cloning an arbitrary element.
 */
export const Text = TextImpl as TextComponent;

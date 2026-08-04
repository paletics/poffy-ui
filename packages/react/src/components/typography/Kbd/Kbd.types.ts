import type { JsxStyleProps } from '@/styled-system/types';
import type { PrimitiveProps } from '@poffy-ui/types';

export interface KbdOwnProps extends JsxStyleProps {
  /**
   * Visual key size.
   *
   * @defaultValue `'md'`
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Long-text behavior for constrained containers. Truncation does not add a browser tooltip;
   * wrapping string shortcut chords adds break opportunities after `+`.
   *
   * @defaultValue `'truncate'`
   */
  overflow?: 'truncate' | 'wrap';
  className?: string;
}

/**
 * Keyboard-input props. `asChild` accepts a native `kbd` only; invalid hosts fall back to preserve
 * keyboard-input semantics.
 */
export type KbdProps = PrimitiveProps<'kbd', KbdOwnProps>;

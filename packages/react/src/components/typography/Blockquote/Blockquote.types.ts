import type { JsxStyleProps } from '@/styled-system/types';
import type { PrimitiveProps } from '@poffy-ui/types';

export interface BlockquoteOwnProps extends JsxStyleProps {
  /**
   * Visual tone for the quotation treatment.
   *
   * @defaultValue `'brand'`
   */
  tone?: 'neutral' | 'brand' | 'subtle';
  className?: string;
}

/**
 * Props for quoted prose. `asChild` accepts a native `blockquote` only so the quote and cite
 * semantics remain intact; other hosts fall back to the native element.
 */
export type BlockquoteProps = PrimitiveProps<'blockquote', BlockquoteOwnProps>;

import { ConditionalValue, JsxStyleProps } from '@/styled-system/types';
import { NativeProps } from '@poffy-ui/types';

/**
 * Divider orientation is deliberately static because it also controls the
 * exposed `aria-orientation`. Use a separate Divider when breakpoint-specific
 * visual orientation is required.
 */
export type DividerOrientation = 'horizontal' | 'vertical';

/** Named visual variant for Divider. */
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

/**
 * Public visual variants. Only orientation is narrowed from the generated
 * recipe type because it is also exposed through ARIA.
 */
export interface DividerVariants {
  orientation?: DividerOrientation;
  variant?: ConditionalValue<DividerVariant>;
}

/** Visual options for a semantic separator. */
export type DividerBaseProps = DividerVariants &
  JsxStyleProps & {
    className?: string;
    orientation?: DividerOrientation;
  };

/** Props for the fixed `hr` separator host. */
export type DividerProps = Omit<NativeProps<'hr', DividerBaseProps>, 'role' | 'aria-orientation'>;

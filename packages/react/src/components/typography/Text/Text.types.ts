import { TextVariantProps } from '@/styled-system/recipes';
import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

/**
 * Text-specific style and composition props. Text renders a paragraph by default; choose an
 * appropriate host with `asChild` when paragraph markup would be invalid, and use Heading for
 * document headings.
 */
export interface TextOwnProps extends TextVariantProps, Omit<JsxStyleProps, 'transform'> {
  className?: string;
}

/**
 * Props for the Text component.
 * Extends base props and standard HTML paragraph attributes via PrimitiveProps.
 */
type TextNativeProps = PrimitiveProps<'p', TextOwnProps>;
/** Props for Text rendered with its default host. */
export type TextDefaultProps = DefaultHostProps<TextNativeProps>;
/** Props for Text delegated to an asChild host. */
export type TextAsChildProps = AsChildHostProps<TextNativeProps>;
/** Public props for Text. */
export type TextProps = TextDefaultProps | TextAsChildProps;

/**
 * Component type for Text, preserving ref forwarding compatibility.
 */
export type TextComponent = PolymorphicAsChildComponent<
  TextDefaultProps,
  TextAsChildProps,
  HTMLParagraphElement
>;

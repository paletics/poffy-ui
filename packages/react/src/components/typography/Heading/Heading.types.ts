import { HeadingVariantProps } from '@/styled-system/recipes';
import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

/** Valid semantic heading levels (1-6). */
export type HeadingLevel = '1' | '2' | '3' | '4' | '5' | '6';

/** Props for a semantic heading with independently selectable visual variants. */
export interface HeadingOwnProps extends Omit<HeadingVariantProps, 'level'>, JsxStyleProps {
  /**
   * Heading level that determines the default `h1`–`h6` host. Choose it from the document outline,
   * not from the desired visual size.
   *
   * @defaultValue `'1'`
   */
  level?: HeadingLevel;

  children: ReactNode;
  className?: string;
}

/**
 * Props for the Heading component.
 * Extends base props and standard HTML heading attributes via PrimitiveProps.
 */
type HeadingNativeProps = PrimitiveProps<'h1', HeadingOwnProps>;
/** Props for Heading rendered with its default host. */
export type HeadingDefaultProps = DefaultHostProps<HeadingNativeProps>;
/** Props for Heading delegated to an asChild host. */
export type HeadingAsChildProps = AsChildHostProps<HeadingNativeProps>;
/** Public props for Heading. */
export type HeadingProps = HeadingDefaultProps | HeadingAsChildProps;

/**
 * Component type for Heading, preserving ref forwarding compatibility.
 */
export type HeadingComponent = PolymorphicAsChildComponent<
  HeadingDefaultProps,
  HeadingAsChildProps,
  HTMLHeadingElement
>;

import type { CodeVariantProps } from '@/styled-system/recipes';
import type { JsxStyleProps } from '@/styled-system/types';
import type { PrimitiveProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';

/** Supported Prism languages bundled by the block-code renderer. */
export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'jsx'
  | 'tsx'
  | 'css'
  | 'html'
  | 'json'
  | 'markdown'
  | 'bash';

/** DOM structure used to render code content. */
export type CodeVariant = Exclude<NonNullable<CodeVariantProps['variant']>, object>;

/**
 * Code-specific props. Inline mode supports `asChild` only with a `code` host. Block mode always
 * owns a `pre > code` structure, including when `asChild` is supplied.
 */
export interface CodeOwnProps
  extends Omit<CodeVariantProps, 'variant'>, Omit<JsxStyleProps, 'colorScheme'> {
  /**
   * Semantic code structure. It changes the rendered DOM from `code` to `pre > code`.
   *
   * @defaultValue `'inline'`
   */
  variant?: CodeVariant;
  /**
   * Code content to display. Prefer a plain source string for block syntax highlighting.
   */
  children?: ReactNode;

  /**
   * Programming language used by Prism in block mode. Inline mode only receives the language class.
   *
   * @defaultValue `undefined`
   */
  language?: SupportedLanguage;

  /** Additional CSS class names. */
  className?: string;
}

/** Public Code props, including native inline-code attributes. */
type CodePrimitiveProps = PrimitiveProps<'code', Omit<CodeOwnProps, 'variant'>>;

/** Public props for Code. */
export type CodeProps =
  | (CodePrimitiveProps & { variant?: 'inline' })
  | (Omit<CodePrimitiveProps, 'asChild' | 'role'> & { variant: 'block' });

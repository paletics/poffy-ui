import { IconButtonProps } from '@/components/inputs/IconButton/IconButton.types';
import { PrimitiveProps } from '@poffy-ui/types';

/**
 * Props for `CopyButton`.
 */
export interface CopyButtonProps
  extends
    PrimitiveProps<'button'>,
    Omit<IconButtonProps, 'icon' | 'aria-label' | 'onClick' | 'children' | 'asChild'> {
  /**
   * The text content to copy to the clipboard.
   */
  value: string;

  /**
   * The duration in milliseconds to show the checked state.
   * @defaultValue 2000
   */
  timeout?: number;

  /**
   * Optional callback when copy is performed.
   */
  onCopy?: () => void;

  /**
   * Accessible label for the button.
   * @defaultValue "Copy to clipboard"
   */
  'aria-label'?: string;
}

import { TagRoot } from './TagRoot';
import { TagLabel } from './TagLabel';
import { TagCloseButton } from './TagCloseButton';

/**
 * Displays a compact label and optional dismiss control.
 *
 * Use `Tag.Label` for text and `Tag.CloseButton` when dismissal is available;
 * the close callback owns removal from application state. The root is a
 * non-interactive `span` by default. An `asChild` interactive host is rejected
 * when it would contain the close button, preventing nested controls.
 */
export const Tag = Object.assign(TagRoot, {
  Root: TagRoot,
  Label: TagLabel,
  CloseButton: TagCloseButton,
});

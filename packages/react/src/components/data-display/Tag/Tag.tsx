import { TagRoot } from './TagRoot';
import { TagLabel } from './TagLabel';
import { TagCloseButton } from './TagCloseButton';

/**
 * A compact label element used to annotate or categorize content.
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS (Recipe: tag), Radix Slot
 * ### Design Tokens
 * - padding/gap/borderRadius: silver-ratio tokens
 * ### Variant Logic
 * - variant: solid=high emphasis, subtle=soft background, outline=bordered. colorScheme: Status or category semantic.
 * ### Notes
 * Compound component unifying TagRoot, TagLabel, and TagCloseButton.
 * ### Accessibility
 * - CloseButton must have `aria-label` for screen readers.
 * ### AI Usage
 * - For categorization, filtering chips, or status badges that can be dismissed.
 * @example Dismissible tag
 * ```tsx
 * import { Tag } from '@poffy-ui/react/data-display';
 *
 * <Tag appearance="soft" intent="info">
 *   <Tag.Label>React</Tag.Label>
 *   <Tag.CloseButton onClick={() => removeTag('react')} />
 * </Tag>
 * ```
 *
 * @example Read-only status chip
 * ```tsx
 * import { Tag } from '@poffy-ui/react/data-display';
 *
 * <Tag appearance="soft" intent="success">
 *   <Tag.Label>Active</Tag.Label>
 * </Tag>
 * ```
 */
export const Tag = Object.assign(TagRoot, {
  Root: TagRoot,
  Label: TagLabel,
  CloseButton: TagCloseButton,
});

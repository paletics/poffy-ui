import { defineSlotRecipe } from '@pandacss/dev';
import {
  centeredOverlayStyles,
  fullOverlaySafeAreaStyles,
  overlayBackdropStyles,
  pomeAesthetics,
} from '../../overlay/overlay.shared';

/**
 * Slot recipe for the CommandMenu component.
 */
export const commandMenuRecipe = defineSlotRecipe({
  className: 'command-menu',
  description: 'CommandMenu styling for dialog, search input, list, groups, and command rows',
  slots: [
    'overlay',
    'content',
    'search',
    'list',
    'group',
    'groupLabel',
    'item',
    'itemIcon',
    'itemText',
    'itemLabel',
    'itemDescription',
    'empty',
  ],
  base: {
    overlay: {
      ...overlayBackdropStyles,
      ...centeredOverlayStyles,
      ...fullOverlaySafeAreaStyles,
      '--command-menu-start-offset': 'min({spacing.3xl}, 12vh)',
      '--command-menu-available-block-size':
        'calc(100vh - var(--command-menu-start-offset) - {spacing.sm} - {spacing.sm} - var(--overlay-safe-block-start, 0px) - var(--overlay-safe-block-end, 0px))',
      alignItems: 'flex-start',
      paddingBlockStart:
        'calc(var(--command-menu-start-offset) + {spacing.sm} + var(--overlay-safe-block-start, 0px))',
      paddingBlockEnd: 'calc({spacing.sm} + var(--overlay-safe-block-end, 0px))',
      paddingInlineStart: 'calc({spacing.sm} + var(--overlay-safe-inline-start, 0px))',
      paddingInlineEnd: 'calc({spacing.sm} + var(--overlay-safe-inline-end, 0px))',
      boxSizing: 'border-box',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      '@supports (height: 100dvh)': {
        '--command-menu-start-offset': 'min({spacing.3xl}, 12dvh)',
        '--command-menu-available-block-size':
          'calc(100dvh - var(--command-menu-start-offset) - {spacing.sm} - {spacing.sm} - var(--overlay-safe-block-start, 0px) - var(--overlay-safe-block-end, 0px))',
      },
    },
    content: {
      bg: '{colors.layout.surface}',
      color: '{colors.text.primary}',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '{colors.layout.divider}',
      borderRadius: '{radii.md}',
      boxShadow: '{shadows.lg}',
      width: '{sizes.full}',
      maxWidth: '{sizes.lg}',
      maxInlineSize: '{sizes.full}',
      minWidth: 0,
      minInlineSize: 0,
      boxSizing: 'border-box',
      maxHeight: 'max({sizes.root.2}, min(72vh, 640px, var(--command-menu-available-block-size)))',
      '@supports (height: 100dvh)': {
        maxHeight:
          'max({sizes.root.2}, min(72dvh, 640px, var(--command-menu-available-block-size)))',
      },
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      outline: 'none',
      ...pomeAesthetics,
    },
    search: {
      width: '{sizes.full}',
      minBlockSize: '{sizes.control.minimumTarget}',
      px: '{spacing.lg}',
      py: '{spacing.md}',
      borderWidth: '0',
      borderBottomWidth: '1px',
      borderBottomColor: '{colors.layout.divider}',
      bg: 'transparent',
      color: '{colors.text.primary}',
      fontSize: 'md',
      outline: 'none',
      _placeholder: {
        color: '{colors.text.secondary}',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: '{colors.brand.main}',
        outlineOffset: '-2px',
      },
      '@media (max-height: 4rem)': {
        py: '{spacing.2xs}',
      },
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '0',
      gap: '{spacing.2xs}',
      p: '{spacing.xs}',
      overflowY: 'auto',
    },
    group: {
      display: 'flex',
      flexDirection: 'column',
      gap: '{spacing.2xs}',
    },
    groupLabel: {
      px: '{spacing.sm}',
      pt: '{spacing.sm}',
      pb: '{spacing.2xs}',
      color: '{colors.text.secondary}',
      fontSize: 'xs',
      fontWeight: 'semibold',
      textTransform: 'uppercase',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.sm}',
      px: '{spacing.sm}',
      py: '{spacing.sm}',
      borderRadius: '{radii.sm}',
      cursor: 'pointer',
      userSelect: 'none',
      color: '{colors.text.primary}',
      _hover: {
        bg: '{colors.brand.tint}',
      },
      '&[data-highlighted]': {
        bg: '{colors.brand.tint}',
      },
      '&[data-disabled]': {
        color: '{colors.text.disabled}',
        cursor: 'not-allowed',
      },
    },
    itemIcon: {
      display: 'inline-flex',
      color: '{colors.text.secondary}',
    },
    itemText: {
      display: 'flex',
      minWidth: '0',
      flexDirection: 'column',
      gap: '{spacing.2xs}',
    },
    itemLabel: {
      truncate: true,
      fontSize: 'sm',
      fontWeight: 'medium',
    },
    itemDescription: {
      truncate: true,
      color: '{colors.text.secondary}',
      fontSize: 'xs',
    },
    empty: {
      px: '{spacing.lg}',
      py: '{spacing.2xl}',
      color: '{colors.text.secondary}',
      fontSize: 'sm',
      textAlign: 'center',
    },
  },
  variants: {
    size: {
      sm: {
        content: { maxWidth: '{sizes.md}' },
        search: { fontSize: 'sm', py: '{spacing.sm}' },
      },
      md: {},
      lg: {
        content: { maxWidth: '{sizes.xl}' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

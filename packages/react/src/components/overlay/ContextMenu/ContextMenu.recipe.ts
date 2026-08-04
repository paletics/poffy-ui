import { defineSlotRecipe } from '@pandacss/dev';
import { pomeAesthetics } from '../overlay.shared';
import {
  floatingAvailableHeight,
  floatingAvailableWidth,
  floatingViewportFallbackStyles,
} from '@/components/shared/floatingViewportFallback';

/**
 * Slot recipe for the ContextMenu component.
 * Defines styles for the menu container, items, labels, icons, and separators.
 *
 * ### Variant Logic
 * Per-item `danger` styling is driven by `data-intent="danger"` CSS attribute selectors
 * instead of a slot variant, because items are heterogeneous within a single menu instance.
 * Hover/focus states use `:not([aria-disabled="true"])` to avoid `!important` overrides.
 */
export const contextMenuRecipe = defineSlotRecipe({
  className: 'context-menu',
  description: 'Context menu styling for content, item, icon, label, shortcut, and separator slots',
  slots: ['content', 'item', 'itemContent', 'itemIcon', 'itemLabel', 'itemShortcut', 'separator'],
  base: {
    content: {
      ...floatingViewportFallbackStyles,
      // Mirrors ContextMenu's Floating UI shift/size middleware padding.
      '--floating-fallback-padding': '10px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      minW: `min({sizes.ratio.sm}, ${floatingAvailableWidth})`,
      maxW: floatingAvailableWidth,
      maxH: floatingAvailableHeight,
      py: '{spacing.sm}',
      bg: '{colors.layout.surface}',
      border: '2px solid',
      borderColor: '{colors.layout.divider}',
      borderRadius: '{radii.xl}',
      boxShadow: '{shadows.lg}',
      outline: 'none',
      zIndex: 'modal',
      overflowX: 'hidden',
      overflowY: 'auto',
      ...pomeAesthetics,
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: '{spacing.base}',
      py: '{spacing.md}',
      cursor: 'pointer',
      fontSize: 'md',
      fontWeight: 'bold',
      color: '{colors.text.primary}',
      transition: 'all 0.2s {easings.soft}',
      _motionSubtle: { transition: 'all {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'all {durations.standard} {easings.bounce}' },
      userSelect: 'none',
      outline: 'none',
      gap: '{spacing.md}',

      '&:hover:not([aria-disabled="true"])': {
        bg: '{colors.brand.surface}',
        color: '{colors.brand.main}',
      },
      '&:focus-visible:not([aria-disabled="true"])': {
        bg: '{colors.brand.surface}',
        boxShadow: 'inset 0 0 0 2px {colors.brand.main}',
      },

      // `_disabled` maps to `&:disabled` which does not apply to div elements.
      // Using the aria-disabled attribute selector to match our accessibility approach.
      '&[aria-disabled="true"]': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      '&[data-intent="danger"]': {
        color: '{colors.variants.danger.main}',
      },
      '&[data-intent="danger"]:hover:not([aria-disabled="true"])': {
        bg: '{colors.variants.danger.surface}',
        color: '{colors.variants.danger.main}',
      },
      '&[data-intent="danger"]:focus-visible:not([aria-disabled="true"])': {
        bg: '{colors.variants.danger.surface}',
        boxShadow: 'inset 0 0 0 2px {colors.variants.danger.main}',
      },
    },
    itemContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.sm}',
      flex: 1,
      minW: 0,
    },
    itemIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      w: '{sizes.silver.1}',
      h: '{sizes.silver.1}',
      color: '{colors.text.secondary}',
      '.context-menu__item:hover:not([aria-disabled="true"]) &': {
        color: '{colors.brand.main}',
      },
      '.context-menu__item[data-intent="danger"]:hover:not([aria-disabled="true"]) &': {
        color: '{colors.variants.danger.main}',
      },
    },
    itemLabel: {
      flex: 1,
      minW: 0,
      overflowWrap: 'anywhere',
    },
    itemShortcut: {
      fontSize: 'sm',
      color: '{colors.text.disabled}',
      marginInlineStart: '{spacing.base}',
      minWidth: 0,
      maxWidth: '50%',
      flexShrink: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    separator: {
      h: '1px',
      bg: '{colors.layout.divider}',
      my: '{spacing.xs}',
      mx: '{spacing.sm}',
    },
  },
});

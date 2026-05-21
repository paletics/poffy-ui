import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the Avatar Group component with Panda CSS recipe variants.
 */
export const avatarGroupRecipe = defineRecipe({
  className: 'avatar-group',
  description: 'Avatar group styling for overlapping stacks and excess indicators',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    flexDirection: 'row',
    '--avatar-group-spacing': 'calc({spacing.sm} * -1)',
    '& > .avatar': {
      borderWidth: '2px',
      borderColor: 'layout.background',
      boxSizing: 'content-box', // Ensure border doesn't shrink avatar if size is fixed content
      position: 'relative',
    },
    '& > .avatar:not(:first-child)': {
      marginLeft: 'var(--avatar-group-spacing)',
    },
    '& > .avatar-excess[data-clickable]': {
      cursor: 'pointer',
    },
  },
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      xs: {
        '& > .avatar': { width: '{sizes.silver.1}', height: '{sizes.silver.1}', fontSize: 'sm' },
      },
      sm: { '& > .avatar': { width: '{sizes.root.1}', height: '{sizes.root.1}', fontSize: 'sm' } },
      md: {
        '& > .avatar': { width: '{sizes.silver.2}', height: '{sizes.silver.2}', fontSize: 'md' },
      },
      lg: { '& > .avatar': { width: '{sizes.root.2}', height: '{sizes.root.2}', fontSize: 'lg' } },
      xl: {
        '& > .avatar': { width: '{sizes.silver.3}', height: '{sizes.silver.3}', fontSize: 'xl' },
      },
    },
    spacing: {
      none: { '--avatar-group-spacing': '{spacing.none}' },
      '2xs': { '--avatar-group-spacing': '{spacing.2xs}' },
      xs: { '--avatar-group-spacing': '{spacing.xs}' },
      sm: { '--avatar-group-spacing': '{spacing.sm}' },
      md: { '--avatar-group-spacing': '{spacing.md}' },
      base: { '--avatar-group-spacing': '{spacing.base}' },
      lg: { '--avatar-group-spacing': '{spacing.lg}' },
      xl: { '--avatar-group-spacing': '{spacing.xl}' },
      '2xl': { '--avatar-group-spacing': '{spacing.2xl}' },
      '3xl': { '--avatar-group-spacing': '{spacing.3xl}' },
      '-none': { '--avatar-group-spacing': 'calc({spacing.none} * -1)' },
      '-2xs': { '--avatar-group-spacing': 'calc({spacing.2xs} * -1)' },
      '-xs': { '--avatar-group-spacing': 'calc({spacing.xs} * -1)' },
      '-sm': { '--avatar-group-spacing': 'calc({spacing.sm} * -1)' },
      '-md': { '--avatar-group-spacing': 'calc({spacing.md} * -1)' },
      '-base': { '--avatar-group-spacing': 'calc({spacing.base} * -1)' },
      '-lg': { '--avatar-group-spacing': 'calc({spacing.lg} * -1)' },
      '-xl': { '--avatar-group-spacing': 'calc({spacing.xl} * -1)' },
      '-2xl': { '--avatar-group-spacing': 'calc({spacing.2xl} * -1)' },
      '-3xl': { '--avatar-group-spacing': 'calc({spacing.3xl} * -1)' },
    },
  },
});

/**
 * Shared base styles for native input-like fields.
 */
export const inputBaseStyles = {
  appearance: 'none',
  width: '100%',
  minWidth: 0,
  outline: 0,
  position: 'relative',
  color: 'text.primary',
  transitionDuration: '{durations.standard}',
  transitionProperty: 'box-shadow, border-color, color, background',
  transitionTimingFunction: 'default',
  _motionSubtle: { transitionDuration: '{durations.fast}' },
  _motionPop: {
    transitionDuration: '{durations.complex}',
    transitionTimingFunction: '{easings.bounce}',
  },
  _placeholder: {
    color: 'text.secondary',
  },
  _readOnly: {
    cursor: 'var(--poffy-input-readonly-cursor, default)',
    color: 'text.secondary',
  },
  '&[data-datepicker-trigger]': {
    '--poffy-input-readonly-cursor': 'pointer',
  },
  _disabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
};

/**
 * Shared wrapper styles for input fields with decorators.
 */
export const inputShellRootStyles = {
  position: 'relative',
  width: '100%',
};

/**
 * Shared right-side decorator positioning styles for input fields.
 */
export const inputEndDecoratorStyles = {
  position: 'absolute',
  insetInlineEnd: '0',
  insetBlockStart: '0',
  insetBlockEnd: '0',
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'text.secondary',
  _disabled: {
    cursor: 'not-allowed',
    opacity: 0.4,
  },
};

/**
 * Right-side padding values that reserve room for input decorators.
 */
export const inputEndDecoratorPadding = {
  sm: '{spacing.xl}',
  md: '{spacing.2xl}',
  lg: '{sizes.root.2}',
};

/**
 * Right-side offset values for input decorators.
 */
export const inputEndDecoratorOffsets = {
  sm: '{spacing.xs}',
  md: '{spacing.sm}',
  lg: '{spacing.md}',
};

/**
 * Icon sizes used by right-side input decorators.
 */
export const inputEndDecoratorIconSizes = {
  sm: 'sm',
  md: 'md',
  lg: 'xl',
};

/**
 * Visual variants applied directly to native input fields.
 */
export const inputVisualVariants = {
  outline: {
    borderWidth: '{borderWidths.default}',
    borderColor: 'brand.border',
    bg: 'brand.surface',
    _focusVisible: {
      zIndex: 1,
      borderColor: '{colors.brand.main}',
      boxShadow: '0 0 0 {focusRing.width} {colors.brand.main}',
    },
  },
  filled: {
    borderWidth: '{borderWidths.default}',
    borderColor: 'transparent',
    bg: 'brand.surface',
    _focusVisible: {
      borderColor: '{colors.brand.main}',
      bg: 'brand.surface',
    },
  },
  flushed: {
    borderBottomWidth: '{borderWidths.default}',
    borderBottomColor: 'brand.border',
    borderRadius: '0',
    px: '0',
    bg: 'transparent',
    _focusVisible: {
      borderColor: '{colors.brand.main}',
      boxShadow: '0 {focusRing.underlineWidth} 0 0 {colors.brand.main}',
    },
  },
};

/**
 * Visual variants applied to input container wrappers.
 */
export const inputContainerVisualVariants = {
  outline: {
    borderWidth: '{borderWidths.default}',
    borderColor: 'brand.border',
    bg: 'brand.surface',
    _focusWithin: {
      zIndex: 1,
      borderColor: '{colors.brand.main}',
      boxShadow: '0 0 0 {focusRing.width} {colors.brand.main}',
    },
  },
  filled: {
    borderWidth: '{borderWidths.default}',
    borderColor: 'transparent',
    bg: 'brand.surface',
    _focusWithin: {
      borderColor: '{colors.brand.main}',
      bg: 'brand.surface',
    },
  },
  flushed: {
    borderBottomWidth: '{borderWidths.default}',
    borderBottomColor: 'brand.border',
    borderRadius: '0',
    px: '0',
    bg: 'transparent',
    _focusWithin: {
      borderColor: '{colors.brand.main}',
      boxShadow: '0 {focusRing.underlineWidth} 0 0 {colors.brand.main}',
    },
  },
};

/**
 * Size variants shared by input-like components.
 */
export const inputSizeVariants = {
  sm: {
    height: '{sizes.silver.2}',
    fontSize: 'sm',
    px: '{spacing.md}',
    borderRadius: 'xl',
  },
  md: {
    height: '{sizes.root.2}',
    fontSize: 'md',
    px: '{spacing.base}',
    borderRadius: '2xl',
  },
  lg: {
    height: '{sizes.silver.3}',
    fontSize: 'lg',
    px: '{spacing.lg}',
    borderRadius: '3xl',
  },
};

/**
 * Error state styles applied directly to native input fields.
 */
export const inputErrorState = {
  true: {
    borderColor: '{colors.variants.danger.main}',
    _focusVisible: {
      borderColor: '{colors.variants.danger.main}',
      boxShadow: '0 0 0 {focusRing.width} {colors.variants.danger.main}',
    },
  },
};

/**
 * Error state styles applied to input container wrappers.
 */
export const inputContainerErrorState = {
  true: {
    borderColor: '{colors.variants.danger.main}',
    _focusWithin: {
      borderColor: '{colors.variants.danger.main}',
      boxShadow: '0 0 0 {focusRing.width} {colors.variants.danger.main}',
    },
  },
};

import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the File Uploader component slots with Panda CSS recipe variants.
 */
export const fileUploaderRecipe = defineSlotRecipe({
  className: 'file-uploader',
  description: 'File uploader styling for dropzone, file list, previews, and actions',
  slots: [
    'root',
    'dropZone',
    'input',
    'fileList',
    'fileItem',
    'fileInfo',
    'previewPlaceholder',
    'fileName',
    'fileSize',
    'removeButton',
    'preview',
    'uploadIcon',
  ],
  base: {
    root: {
      '--file-uploader-main': 'var(--poffy-colors-variants-primary-main)',
      '--file-uploader-surface': 'var(--poffy-colors-brand-surface)',
      '--file-uploader-tint': 'var(--poffy-colors-brand-tint)',
      display: 'flex',
      flexDirection: 'column',
      gap: '{spacing.sm}',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      containerType: 'inline-size',
      containerName: 'file-uploader',
      // Keep the established default width in shrink-to-fit layouts while the
      // root supplies inline-size queries to its slots.
      // Keep the established shrink-to-fit width while giving inline-size
      // containment a non-zero fallback before the container is measured.
      containIntrinsicInlineSize: 'calc({sizes.ratio.md} + {spacing.xl})',
    },
    dropZone: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '{spacing.xs}',
      p: '{spacing.xl}',
      borderRadius: '{radii.md}',
      borderWidth: '2px',
      borderStyle: 'dashed',
      borderColor: '{colors.brand.border}',
      bg: 'var(--file-uploader-surface)',
      color: '{colors.text.secondary}',
      cursor: 'pointer',
      transition: 'all 0.2s',
      _motionSubtle: { transition: 'all {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'all {durations.standard} {easings.bounce}' },
      textAlign: 'center',
      boxSizing: 'border-box',
      maxWidth: '100%',
      minWidth: 0,
      overflowWrap: 'anywhere',
      '@container file-uploader (max-width: 8rem)': {
        gap: '{spacing.2xs}',
        p: '{spacing.md}',
      },
      '@container file-uploader (max-width: 4rem)': {
        p: '{spacing.xs}',
      },
      _hover: {
        borderColor: 'var(--file-uploader-main)',
        bg: 'var(--file-uploader-tint)',
      },
      _active: {
        borderColor: 'var(--file-uploader-main)',
        bg: 'var(--file-uploader-tint)',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'var(--file-uploader-main)',
        outlineOffset: '2px',
      },
      '&[data-drag]': {
        borderColor: 'var(--file-uploader-main)',
        bg: 'var(--file-uploader-tint)',
      },
    },
    input: {
      display: 'none',
    },
    fileList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '{spacing.xs}',
      maxWidth: '100%',
      minWidth: 0,
    },
    fileItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.sm}',
      p: '{spacing.xs}',
      borderRadius: '{radii.sm}',
      borderWidth: '1px',
      borderColor: '{colors.brand.border}',
      bg: 'var(--file-uploader-surface)',
      boxSizing: 'border-box',
      maxWidth: '100%',
      minWidth: 0,
      '@container file-uploader (max-width: 8rem)': {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
      },
      '@container file-uploader (max-width: 4rem)': {
        gridTemplateColumns: 'minmax(0, 1fr)',
      },
    },
    preview: {
      width: '{sizes.silver.3}',
      height: '{sizes.silver.3}',
      objectFit: 'cover',
      borderRadius: '{radii.sm}',
      bg: '{colors.brand.tint}',
      flexShrink: 0,
      '@container file-uploader (max-width: 8rem)': {
        display: 'none',
      },
    },
    previewPlaceholder: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      '@container file-uploader (max-width: 8rem)': {
        display: 'none',
      },
    },
    uploadIcon: {
      width: '2rem',
      height: '2rem',
      '@container file-uploader (max-width: 4rem)': {
        display: 'none',
      },
    },
    fileInfo: {
      flex: '1',
      minWidth: 0,
      overflow: 'hidden',
    },
    fileName: {
      flex: '1',
      fontSize: 'sm',
      fontWeight: 'medium',
      color: '{colors.text.primary}',
      truncate: true,
    },
    fileSize: {
      fontSize: 'xs',
      color: '{colors.text.secondary}',
    },
    removeButton: {
      color: '{colors.text.secondary}',
      cursor: 'pointer',
      p: '{spacing.2xs}',
      borderRadius: '{radii.sm}',
      flexShrink: 0,
      '@container file-uploader (max-width: 4rem)': {
        justifySelf: 'end',
      },
      _hover: {
        color: '{colors.variants.danger.main}',
        bg: '{colors.variants.danger.surface}',
      },
    },
  },
  defaultVariants: {
    appearance: 'outline',
    intent: 'primary',
  },
  variants: {
    appearance: {
      outline: {},
      soft: {
        dropZone: {
          borderColor: 'transparent',
          bg: 'var(--file-uploader-tint)',
        },
        fileItem: {
          borderColor: 'transparent',
          bg: 'var(--file-uploader-tint)',
        },
      },
      ghost: {
        dropZone: {
          bg: 'transparent',
        },
        fileItem: {
          bg: 'transparent',
        },
      },
    },
    intent: {
      primary: {
        root: {
          '--file-uploader-main': 'var(--poffy-colors-variants-primary-main)',
          '--file-uploader-surface': 'var(--poffy-colors-brand-surface)',
          '--file-uploader-tint': 'var(--poffy-colors-brand-tint)',
        },
      },
      secondary: {
        root: {
          '--file-uploader-main': 'var(--poffy-colors-variants-secondary-main)',
          '--file-uploader-surface': 'var(--poffy-colors-brand-surface)',
          '--file-uploader-tint': 'var(--poffy-colors-variants-secondary-surface)',
        },
      },
      success: {
        root: {
          '--file-uploader-main': 'var(--poffy-colors-variants-success-main)',
          '--file-uploader-surface': 'var(--poffy-colors-brand-surface)',
          '--file-uploader-tint': 'var(--poffy-colors-variants-success-surface)',
        },
      },
      danger: {
        root: {
          '--file-uploader-main': 'var(--poffy-colors-variants-danger-main)',
          '--file-uploader-surface': 'var(--poffy-colors-brand-surface)',
          '--file-uploader-tint': 'var(--poffy-colors-variants-danger-surface)',
        },
      },
    },
  },
});

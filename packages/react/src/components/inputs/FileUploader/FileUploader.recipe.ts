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
      textAlign: 'center',
      _hover: {
        borderColor: 'var(--file-uploader-main)',
        bg: 'var(--file-uploader-tint)',
      },
      _active: {
        borderColor: 'var(--file-uploader-main)',
        bg: 'var(--file-uploader-tint)',
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
    },
    preview: {
      width: '{sizes.silver.3}',
      height: '{sizes.silver.3}',
      objectFit: 'cover',
      borderRadius: '{radii.sm}',
      bg: '{colors.brand.tint}',
    },
    previewPlaceholder: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadIcon: {
      width: '2rem',
      height: '2rem',
    },
    fileInfo: {
      flex: '1',
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

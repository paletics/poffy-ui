import type { SemanticTokens } from '@pandacss/dev';

/**
 * Maps semantic color intents to blue, pome, and CSS-variable-backed custom brands across light and
 * dark conditions.
 */
export const semanticTokens = {
  colors: {
    // Brand Intent Tokens
    brand: {
      main: {
        value: {
          base: '{colors.blue.600}',
          _dark: '{colors.blue.400}',
          _pome: '{colors.pome.500}',
          _pomeDark: '{colors.pome.400}',
          _custom: 'var(--poffy-custom-main, {colors.blue.500})',
          _customDark: 'var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400}))',
        },
      },
      contrast: {
        value: {
          base: '#FFFFFF',
          _pome: '{colors.slate.950}',
          _dark: '{colors.slate.950}',
          _pomeDark: '{colors.slate.950}',
          _custom: 'var(--poffy-custom-contrast, #FFFFFF)',
          _customDark:
            'var(--poffy-custom-contrast-dark, var(--poffy-custom-contrast, {colors.slate.950}))',
        },
      },
      surface: {
        value: {
          base: '{colors.blue.50}',
          _dark: 'color-mix(in srgb, {colors.blue.400} 15%, transparent)',
          _pome: '{colors.pome.50}',
          _pomeDark: 'color-mix(in srgb, {colors.pome.400} 15%, transparent)',
          _custom:
            'color-mix(in srgb, var(--poffy-custom-main, {colors.blue.500}) 15%, transparent)',
          _customDark:
            'color-mix(in srgb, var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400})) 15%, transparent)',
        },
      },
      tint: {
        value: {
          base: '{colors.blue.100}',
          _dark: 'color-mix(in srgb, {colors.blue.400} 25%, transparent)',
          _pome: '{colors.pome.100}',
          _pomeDark: 'color-mix(in srgb, {colors.pome.400} 25%, transparent)',
          _custom:
            'color-mix(in srgb, var(--poffy-custom-main, {colors.blue.500}) 25%, transparent)',
          _customDark:
            'color-mix(in srgb, var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400})) 25%, transparent)',
        },
      },
      border: {
        value: {
          base: 'color-mix(in srgb, {colors.brand.main}, black 40%)',
          _dark: 'color-mix(in srgb, {colors.blue.400}, white 30%)',
          _pome: 'color-mix(in srgb, {colors.brand.main}, black 40%)',
          _pomeDark: 'color-mix(in srgb, {colors.pome.400}, white 30%)',
          _custom: 'color-mix(in srgb, var(--poffy-custom-main, {colors.blue.500}), black 40%)',
          _customDark:
            'color-mix(in srgb, var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400})), white 30%)',
        },
      },
      hover: {
        value: {
          base: 'color-mix(in srgb, {colors.blue.600}, black 10%)',
          _dark: 'color-mix(in srgb, {colors.blue.400}, white 10%)',
          _pome: 'color-mix(in srgb, {colors.pome.500}, black 10%)',
          _pomeDark: 'color-mix(in srgb, {colors.pome.400}, white 10%)',
          _custom: 'color-mix(in srgb, var(--poffy-custom-main, {colors.blue.500}), black 10%)',
          _customDark:
            'color-mix(in srgb, var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400})), white 10%)',
        },
      },
      active: {
        value: {
          base: 'color-mix(in srgb, {colors.blue.600}, black 20%)',
          _dark: 'color-mix(in srgb, {colors.blue.400}, white 20%)',
          _pome: 'color-mix(in srgb, {colors.pome.500}, black 20%)',
          _pomeDark: 'color-mix(in srgb, {colors.pome.400}, white 20%)',
          _custom: 'color-mix(in srgb, var(--poffy-custom-main, {colors.blue.500}), black 20%)',
          _customDark:
            'color-mix(in srgb, var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400})), white 20%)',
        },
      },
      accent: {
        value: {
          base: 'color-mix(in srgb, {colors.blue.500}, white 30%)',
          _dark: 'color-mix(in srgb, {colors.blue.400}, white 40%)',
          _pome: 'color-mix(in srgb, {colors.pome.500}, white 30%)',
          _pomeDark: 'color-mix(in srgb, {colors.pome.400}, white 40%)',
          _custom: 'color-mix(in srgb, var(--poffy-custom-main, {colors.blue.500}), white 30%)',
          _customDark:
            'color-mix(in srgb, var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400})), white 40%)',
        },
      },
    },

    // UI Content Tokens
    text: {
      primary: { value: { base: '{colors.slate.800}', _dark: '{colors.slate.50}' } },
      secondary: { value: { base: '{colors.slate.600}', _dark: '{colors.slate.400}' } },
      disabled: { value: { base: '{colors.slate.300}', _dark: '{colors.slate.600}' } },
      inverse: { value: { base: '#FFFFFF', _dark: '{colors.slate.950}' } },
    },
    layout: {
      background: { value: { base: '{colors.slate.50}', _dark: '{colors.slate.950}' } },
      surface: { value: { base: '#FFFFFF', _dark: '{colors.slate.800}' } },
      divider: { value: { base: '{colors.slate.200}', _dark: '{colors.slate.700}' } },
      overlay: { value: { base: 'rgba(15, 23, 42, 0.6)', _dark: 'rgba(0, 0, 0, 0.75)' } },
    },

    // Poffy-themed semantic aliases for expressive surfaces and accents.
    poffy: {
      cloud: {
        main: { value: { base: '{colors.slate.100}', _dark: '{colors.zinc.800}' } },
        contrast: { value: { base: '{colors.zinc.950}', _dark: '{colors.white}' } },
        surface: { value: { base: '{colors.white}', _dark: '{colors.zinc.900}' } },
        border: { value: { base: '{colors.slate.300}', _dark: '{colors.zinc.700}' } },
        hover: { value: { base: '{colors.slate.200}', _dark: '{colors.zinc.700}' } },
        active: { value: { base: '{colors.slate.300}', _dark: '{colors.zinc.600}' } },
        accent: { value: { base: '{colors.pink.500}', _dark: '{colors.pink.400}' } },
      },
      night: {
        main: { value: { base: '{colors.indigo.700}', _dark: '{colors.indigo.300}' } },
        contrast: { value: { base: '{colors.white}', _dark: '{colors.zinc.950}' } },
        surface: {
          value: {
            base: '{colors.indigo.50}',
            _dark: 'color-mix(in srgb, {colors.indigo.300} 18%, transparent)',
          },
        },
        border: {
          value: {
            base: 'color-mix(in srgb, {colors.indigo.700}, black 30%)',
            _dark: 'color-mix(in srgb, {colors.indigo.300}, white 28%)',
          },
        },
        hover: {
          value: {
            base: 'color-mix(in srgb, {colors.indigo.700}, black 10%)',
            _dark: 'color-mix(in srgb, {colors.indigo.300}, white 10%)',
          },
        },
        active: {
          value: {
            base: 'color-mix(in srgb, {colors.indigo.700}, black 20%)',
            _dark: 'color-mix(in srgb, {colors.indigo.300}, white 20%)',
          },
        },
        accent: { value: { base: '{colors.orange.500}', _dark: '{colors.orange.400}' } },
      },
      berry: {
        main: { value: { base: '{colors.pink.500}', _dark: '{colors.pink.400}' } },
        contrast: { value: { base: '{colors.zinc.950}', _dark: '{colors.zinc.950}' } },
        surface: {
          value: {
            base: '{colors.pink.50}',
            _dark: 'color-mix(in srgb, {colors.pink.400} 18%, transparent)',
          },
        },
        border: {
          value: {
            base: 'color-mix(in srgb, {colors.pink.500}, black 30%)',
            _dark: 'color-mix(in srgb, {colors.pink.400}, white 28%)',
          },
        },
        hover: {
          value: {
            base: 'color-mix(in srgb, {colors.pink.500}, black 10%)',
            _dark: 'color-mix(in srgb, {colors.pink.400}, white 10%)',
          },
        },
        active: {
          value: {
            base: 'color-mix(in srgb, {colors.pink.500}, black 20%)',
            _dark: 'color-mix(in srgb, {colors.pink.400}, white 20%)',
          },
        },
        accent: { value: { base: '{colors.teal.500}', _dark: '{colors.teal.400}' } },
      },
      plum: {
        main: { value: { base: '{colors.violet.500}', _dark: '{colors.violet.400}' } },
        contrast: { value: { base: '{colors.zinc.950}', _dark: '{colors.zinc.950}' } },
        surface: {
          value: {
            base: '{colors.violet.50}',
            _dark: 'color-mix(in srgb, {colors.violet.400} 18%, transparent)',
          },
        },
        border: {
          value: {
            base: 'color-mix(in srgb, {colors.violet.500}, black 30%)',
            _dark: 'color-mix(in srgb, {colors.violet.400}, white 28%)',
          },
        },
        hover: {
          value: {
            base: 'color-mix(in srgb, {colors.violet.500}, black 10%)',
            _dark: 'color-mix(in srgb, {colors.violet.400}, white 10%)',
          },
        },
        active: {
          value: {
            base: 'color-mix(in srgb, {colors.violet.500}, black 20%)',
            _dark: 'color-mix(in srgb, {colors.violet.400}, white 20%)',
          },
        },
        accent: { value: { base: '{colors.sky.500}', _dark: '{colors.sky.400}' } },
      },
      mint: {
        main: { value: { base: '{colors.teal.500}', _dark: '{colors.teal.400}' } },
        contrast: { value: { base: '{colors.zinc.950}', _dark: '{colors.zinc.950}' } },
        surface: {
          value: {
            base: '{colors.teal.50}',
            _dark: 'color-mix(in srgb, {colors.teal.400} 18%, transparent)',
          },
        },
        border: {
          value: {
            base: 'color-mix(in srgb, {colors.teal.500}, black 30%)',
            _dark: 'color-mix(in srgb, {colors.teal.400}, white 28%)',
          },
        },
        hover: {
          value: {
            base: 'color-mix(in srgb, {colors.teal.500}, black 10%)',
            _dark: 'color-mix(in srgb, {colors.teal.400}, white 10%)',
          },
        },
        active: {
          value: {
            base: 'color-mix(in srgb, {colors.teal.500}, black 20%)',
            _dark: 'color-mix(in srgb, {colors.teal.400}, white 20%)',
          },
        },
        accent: { value: { base: '{colors.pink.500}', _dark: '{colors.pink.400}' } },
      },
      soda: {
        main: { value: { base: '{colors.sky.500}', _dark: '{colors.sky.400}' } },
        contrast: { value: { base: '{colors.zinc.950}', _dark: '{colors.zinc.950}' } },
        surface: {
          value: {
            base: '{colors.sky.50}',
            _dark: 'color-mix(in srgb, {colors.sky.400} 18%, transparent)',
          },
        },
        border: {
          value: {
            base: 'color-mix(in srgb, {colors.sky.500}, black 30%)',
            _dark: 'color-mix(in srgb, {colors.sky.400}, white 28%)',
          },
        },
        hover: {
          value: {
            base: 'color-mix(in srgb, {colors.sky.500}, black 10%)',
            _dark: 'color-mix(in srgb, {colors.sky.400}, white 10%)',
          },
        },
        active: {
          value: {
            base: 'color-mix(in srgb, {colors.sky.500}, black 20%)',
            _dark: 'color-mix(in srgb, {colors.sky.400}, white 20%)',
          },
        },
        accent: { value: { base: '{colors.orange.500}', _dark: '{colors.orange.400}' } },
      },
      leaf: {
        main: { value: { base: '{colors.lime.500}', _dark: '{colors.lime.400}' } },
        contrast: { value: { base: '{colors.zinc.950}', _dark: '{colors.zinc.950}' } },
        surface: {
          value: {
            base: '{colors.lime.50}',
            _dark: 'color-mix(in srgb, {colors.lime.400} 18%, transparent)',
          },
        },
        border: {
          value: {
            base: 'color-mix(in srgb, {colors.lime.500}, black 38%)',
            _dark: 'color-mix(in srgb, {colors.lime.400}, white 28%)',
          },
        },
        hover: {
          value: {
            base: 'color-mix(in srgb, {colors.lime.500}, black 10%)',
            _dark: 'color-mix(in srgb, {colors.lime.400}, white 10%)',
          },
        },
        active: {
          value: {
            base: 'color-mix(in srgb, {colors.lime.500}, black 20%)',
            _dark: 'color-mix(in srgb, {colors.lime.400}, white 20%)',
          },
        },
        accent: { value: { base: '{colors.indigo.700}', _dark: '{colors.indigo.300}' } },
      },
      marmalade: {
        main: { value: { base: '{colors.orange.500}', _dark: '{colors.orange.400}' } },
        contrast: { value: { base: '{colors.zinc.950}', _dark: '{colors.zinc.950}' } },
        surface: {
          value: {
            base: '{colors.orange.50}',
            _dark: 'color-mix(in srgb, {colors.orange.400} 18%, transparent)',
          },
        },
        border: {
          value: {
            base: 'color-mix(in srgb, {colors.orange.500}, black 30%)',
            _dark: 'color-mix(in srgb, {colors.orange.400}, white 28%)',
          },
        },
        hover: {
          value: {
            base: 'color-mix(in srgb, {colors.orange.500}, black 10%)',
            _dark: 'color-mix(in srgb, {colors.orange.400}, white 10%)',
          },
        },
        active: {
          value: {
            base: 'color-mix(in srgb, {colors.orange.500}, black 20%)',
            _dark: 'color-mix(in srgb, {colors.orange.400}, white 20%)',
          },
        },
        accent: { value: { base: '{colors.indigo.700}', _dark: '{colors.indigo.300}' } },
      },
    },

    // Component Variant Mappings
    variants: {
      primary: {
        main: {
          value: {
            base: '{colors.brand.main}',
            _pome: '{colors.brand.main}',
            _dark: '{colors.brand.main}',
            _pomeDark: '{colors.brand.main}',
            _custom: 'var(--poffy-custom-main, {colors.blue.500})',
            _customDark:
              'var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400}))',
          },
        },
        contrast: {
          value: {
            base: '{colors.brand.contrast}',
            _pome: '{colors.brand.contrast}',
            _dark: '{colors.brand.contrast}',
            _pomeDark: '{colors.brand.contrast}',
            _custom: 'var(--poffy-custom-contrast, #FFFFFF)',
            _customDark:
              'var(--poffy-custom-contrast-dark, var(--poffy-custom-contrast, {colors.slate.950}))',
          },
        },
        hover: {
          value: {
            base: '{colors.brand.hover}',
            _pome: '{colors.brand.hover}',
            _dark: '{colors.brand.hover}',
            _pomeDark: '{colors.brand.hover}',
            _custom: 'color-mix(in srgb, var(--poffy-custom-main, {colors.blue.500}), black 10%)',
            _customDark:
              'color-mix(in srgb, var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400})), white 10%)',
          },
        },
        active: {
          value: {
            base: '{colors.brand.active}',
            _pome: '{colors.brand.active}',
            _dark: '{colors.brand.active}',
            _pomeDark: '{colors.brand.active}',
            _custom: 'color-mix(in srgb, var(--poffy-custom-main, {colors.blue.500}), black 20%)',
            _customDark:
              'color-mix(in srgb, var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400})), white 20%)',
          },
        },
        surface: {
          value: {
            base: '{colors.brand.surface}',
            _pome: '{colors.brand.surface}',
            _dark: '{colors.brand.surface}',
            _pomeDark: '{colors.brand.surface}',
            _custom:
              'color-mix(in srgb, var(--poffy-custom-main, {colors.blue.500}) 15%, transparent)',
            _customDark:
              'color-mix(in srgb, var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400})) 15%, transparent)',
          },
        },
        tint: {
          value: {
            base: '{colors.brand.tint}',
            _pome: '{colors.brand.tint}',
            _dark: '{colors.brand.tint}',
            _pomeDark: '{colors.brand.tint}',
            _custom:
              'color-mix(in srgb, var(--poffy-custom-main, {colors.blue.500}) 25%, transparent)',
            _customDark:
              'color-mix(in srgb, var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400})) 25%, transparent)',
          },
        },
        border: {
          value: {
            base: '{colors.brand.border}',
            _pome: '{colors.brand.border}',
            _dark: '{colors.brand.border}',
            _pomeDark: '{colors.brand.border}',
            _custom: 'color-mix(in srgb, var(--poffy-custom-main, {colors.blue.500}), black 40%)',
            _customDark:
              'color-mix(in srgb, var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400})), white 30%)',
          },
        },
        accent: {
          value: {
            base: '{colors.brand.accent}',
            _pome: '{colors.brand.accent}',
            _dark: '{colors.brand.accent}',
            _pomeDark: '{colors.brand.accent}',
            _custom: 'color-mix(in srgb, var(--poffy-custom-main, {colors.blue.500}), white 30%)',
            _customDark:
              'color-mix(in srgb, var(--poffy-custom-main-dark, var(--poffy-custom-main, {colors.blue.400})), white 40%)',
          },
        },
      },
      secondary: {
        main: { value: { base: '{colors.slate.500}', _dark: '{colors.slate.400}' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#0F172A' } },
        hover: {
          value: {
            base: 'color-mix(in srgb, {colors.slate.500}, black 10%)',
            _dark: 'color-mix(in srgb, {colors.slate.400}, white 10%)',
          },
        },
        active: {
          value: {
            base: 'color-mix(in srgb, {colors.slate.500}, black 20%)',
            _dark: 'color-mix(in srgb, {colors.slate.400}, white 20%)',
          },
        },
        surface: { value: { base: '{colors.slate.50}', _dark: 'rgba(148, 163, 184, 0.15)' } },
        tint: { value: { base: '{colors.slate.200}', _dark: 'rgba(148, 163, 184, 0.25)' } },
        border: {
          value: {
            base: '#111827',
            _dark: 'color-mix(in srgb, {colors.slate.400}, white 30%)',
          },
        },
        accent: {
          value: {
            base: 'color-mix(in srgb, {colors.slate.500}, white 30%)',
            _dark: 'color-mix(in srgb, {colors.slate.400}, white 40%)',
          },
        },
      },
      info: {
        main: { value: { base: '{colors.cyan.500}', _dark: '{colors.cyan.400}' } },
        contrast: { value: { base: '{colors.slate.950}', _dark: '#0F172A' } },
        hover: {
          value: {
            base: 'color-mix(in srgb, {colors.cyan.500}, black 10%)',
            _dark: 'color-mix(in srgb, {colors.cyan.400}, white 10%)',
          },
        },
        active: {
          value: {
            base: 'color-mix(in srgb, {colors.cyan.500}, black 20%)',
            _dark: 'color-mix(in srgb, {colors.cyan.400}, white 20%)',
          },
        },
        surface: { value: { base: '{colors.cyan.50}', _dark: 'rgba(34, 211, 238, 0.15)' } },
        tint: {
          value: {
            base: '{colors.cyan.100}',
            _dark: 'color-mix(in srgb, {colors.cyan.400} 25%, transparent)',
          },
        },
        border: {
          value: {
            base: '#111827',
            _dark: 'color-mix(in srgb, {colors.cyan.400}, white 30%)',
          },
        },
        accent: {
          value: {
            base: 'color-mix(in srgb, {colors.cyan.500}, white 30%)',
            _dark: 'color-mix(in srgb, {colors.cyan.400}, white 40%)',
          },
        },
      },
      success: {
        main: { value: { base: '{colors.emerald.500}', _dark: '{colors.emerald.400}' } },
        contrast: { value: { base: '{colors.slate.950}', _dark: '{colors.emerald.900}' } },
        hover: {
          value: {
            base: 'color-mix(in srgb, {colors.emerald.500}, black 10%)',
            _dark: 'color-mix(in srgb, {colors.emerald.400}, white 10%)',
          },
        },
        active: {
          value: {
            base: 'color-mix(in srgb, {colors.emerald.500}, black 20%)',
            _dark: 'color-mix(in srgb, {colors.emerald.400}, white 20%)',
          },
        },
        surface: {
          value: { base: '{colors.emerald.50}', _dark: 'rgba(74, 222, 128, 0.15)' },
        },
        tint: {
          value: {
            base: '{colors.emerald.100}',
            _dark: 'color-mix(in srgb, {colors.emerald.400} 25%, transparent)',
          },
        },
        border: {
          value: {
            base: '#111827',
            _dark: 'color-mix(in srgb, {colors.emerald.400}, white 30%)',
          },
        },
        accent: {
          value: {
            base: 'color-mix(in srgb, {colors.emerald.500}, white 30%)',
            _dark: 'color-mix(in srgb, {colors.emerald.400}, white 40%)',
          },
        },
      },
      warning: {
        main: { value: { base: '{colors.yellow.500}', _dark: '{colors.yellow.400}' } },
        contrast: { value: { base: '#000000', _dark: '{colors.yellow.950}' } },
        hover: {
          value: {
            base: 'color-mix(in srgb, {colors.yellow.500}, black 10%)',
            _dark: 'color-mix(in srgb, {colors.yellow.400}, white 10%)',
          },
        },
        active: {
          value: {
            base: 'color-mix(in srgb, {colors.yellow.500}, black 20%)',
            _dark: 'color-mix(in srgb, {colors.yellow.400}, white 20%)',
          },
        },
        surface: { value: { base: '{colors.yellow.50}', _dark: 'rgba(250, 204, 21, 0.15)' } },
        tint: {
          value: {
            base: '{colors.yellow.100}',
            _dark: 'color-mix(in srgb, {colors.yellow.400} 25%, transparent)',
          },
        },
        border: {
          value: {
            base: '#422006',
            _dark: 'color-mix(in srgb, {colors.yellow.400}, white 30%)',
          },
        },
        accent: {
          value: {
            base: 'color-mix(in srgb, {colors.yellow.500}, white 30%)',
            _dark: 'color-mix(in srgb, {colors.yellow.400}, white 40%)',
          },
        },
      },
      danger: {
        main: { value: { base: '{colors.rose.500}', _dark: '{colors.rose.400}' } },
        contrast: { value: { base: '{colors.slate.950}', _dark: '{colors.rose.900}' } },
        hover: {
          value: {
            base: 'color-mix(in srgb, {colors.rose.500}, black 10%)',
            _dark: 'color-mix(in srgb, {colors.rose.400}, white 10%)',
          },
        },
        active: {
          value: {
            base: 'color-mix(in srgb, {colors.rose.500}, black 20%)',
            _dark: 'color-mix(in srgb, {colors.rose.400}, white 20%)',
          },
        },
        surface: { value: { base: '{colors.rose.50}', _dark: 'rgba(248, 113, 113, 0.15)' } },
        tint: {
          value: {
            base: '{colors.rose.100}',
            _dark: 'color-mix(in srgb, {colors.rose.400} 25%, transparent)',
          },
        },
        border: {
          value: {
            base: '#111827',
            _dark: 'color-mix(in srgb, {colors.rose.400}, white 30%)',
          },
        },
        accent: {
          value: {
            base: 'color-mix(in srgb, {colors.rose.500}, white 30%)',
            _dark: 'color-mix(in srgb, {colors.rose.400}, white 40%)',
          },
        },
      },
      light: {
        main: { value: { base: '#F1F5F9', _dark: '#F8FAFC' } },
        contrast: { value: { base: '#1E293B', _dark: '#0F172A' } },
        hover: {
          value: { base: 'rgba(30, 41, 59, 0.05)', _dark: 'rgba(255, 255, 255, 0.08)' },
        },
        active: {
          value: { base: 'rgba(30, 41, 59, 0.1)', _dark: 'rgba(255, 255, 255, 0.15)' },
        },
        surface: { value: { base: '#CBD5E1', _dark: '#FFFFFF' } },
        tint: { value: { base: '{colors.slate.100}', _dark: 'rgba(255, 255, 255, 0.1)' } },
        border: { value: { base: '#1E293B', _dark: '#F8FAFC' } },
        accent: { value: { base: '#CBD5E1', _dark: '#FFFFFF' } },
      },
      dark: {
        main: { value: { base: '#1E293B', _dark: '#020617' } },
        contrast: { value: { base: '#FFFFFF', _dark: '#F8FAFC' } },
        hover: {
          value: { base: 'rgba(30, 41, 59, 0.05)', _dark: 'rgba(255, 255, 255, 0.08)' },
        },
        active: {
          value: { base: 'rgba(30, 41, 59, 0.1)', _dark: 'rgba(255, 255, 255, 0.15)' },
        },
        surface: { value: { base: '#475569', _dark: '#334155' } },
        tint: { value: { base: '{colors.slate.500}', _dark: '{colors.slate.500}' } },
        border: { value: { base: '#1E293B', _dark: '#F8FAFC' } },
        accent: { value: { base: '#475569', _dark: '#334155' } },
      },
      outline: {
        main: { value: 'transparent' },
        contrast: { value: { base: '{colors.slate.800}', _dark: '{colors.slate.50}' } },
        border: { value: { base: '{colors.slate.800}', _dark: '{colors.slate.50}' } },
        hover: {
          value: { base: 'rgba(30, 41, 59, 0.05)', _dark: 'rgba(255, 255, 255, 0.08)' },
        },
        active: {
          value: { base: 'rgba(30, 41, 59, 0.1)', _dark: 'rgba(255, 255, 255, 0.15)' },
        },
        surface: { value: 'transparent' },
        accent: { value: 'transparent' },
      },
      ghost: {
        main: { value: 'transparent' },
        contrast: { value: 'inherit' },
        border: { value: 'transparent' },
        hover: {
          value: { base: 'rgba(30, 41, 59, 0.05)', _dark: 'rgba(255, 255, 255, 0.08)' },
        },
        active: {
          value: { base: 'rgba(30, 41, 59, 0.1)', _dark: 'rgba(255, 255, 255, 0.15)' },
        },
        surface: { value: 'transparent' },
        accent: { value: 'transparent' },
      },
    },
  },
} satisfies SemanticTokens;

'use client';

import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '@/components/inputs/Button';
import { Spinner } from '@/components/feedback/Spinner';
import { Box, Flex, Stack } from '@/components/layout';
import { Text } from '@/components/typography';

const meta = {
  title: 'Inputs/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    intent: {
      options: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
      control: { type: 'select' },
      description: 'Color palette based on the button intent.',
    },
    appearance: {
      options: ['solid', 'soft', 'neo', 'glass', 'minimal', 'outline', 'ghost'],
      control: { type: 'select' },
      description: 'Visual style and texture variation.',
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'inline-radio' },
    },
    shape: {
      options: ['rounded', 'pill', 'square'],
      control: { type: 'inline-radio' },
      description: 'Corner radius for the button (pill is recommended for Poffy feel).',
    },
    animationType: {
      options: [
        'press',
        'bouncy',
        'vibrant',
        'sharp',
        'physical',
        'subtle',
        'squish',
        'glow',
        'pulse',
        'shake',
        'stagger',
      ],
      control: { type: 'select' },
      description: 'Physics configuration for interaction feedback.',
    },
    loading: { control: 'boolean' },
    loadingIcon: {
      control: false,
      description:
        'Custom element rendered as the loading indicator when `loading` is `true`. Replaces the default `Spinner`. Pass any ReactNode (e.g. a branded animation).',
    },
    isGrow: { control: 'boolean' },
    glow: { control: 'boolean' },
  },
  args: {
    children: 'Poffy Button',
    intent: 'primary',
    appearance: 'solid',
    size: 'md',
    shape: 'pill',
    loading: false,
    glow: false,
  },
  decorators: [
    (Story) => (
      <Flex justify="center" align="center" minH="[150px]" p="2xl" bg="layout.background">
        <Story />
      </Flex>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const cssCoverageClass = css({
  display: 'none',
});

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Standard usage with the pill shape. Verifies corner smoothing, balanced padding, and correct focus state after click.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Poffy Button/i });

    await userEvent.hover(button);
    await userEvent.click(button);
    await expect(button).toHaveFocus();
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const ConstrainedLocalizedLabel: Story = {
  render: () => (
    <Box width="[10rem]" aria-label="Constrained button container">
      <Button lang="de" startIcon={<span aria-hidden="true">+</span>}>
        Einstellungen dauerhaft übernehmen
      </Button>
    </Box>
  ),
};

export const LogicalIconPlacement: Story = {
  render: () => (
    <Stack gap="sm">
      <Button
        data-testid="button-icons-ltr"
        startIcon={<span data-testid="button-start-ltr">S</span>}
        endIcon={<span data-testid="button-end-ltr">E</span>}
      >
        LTR
      </Button>
      <div dir="rtl">
        <Button
          data-testid="button-icons-rtl"
          startIcon={<span data-testid="button-start-rtl">S</span>}
          endIcon={<span data-testid="button-end-rtl">E</span>}
        >
          RTL
        </Button>
      </div>
    </Stack>
  ),
};

export const HyperPop: Story = {
  args: {
    children: 'Hoppy Poffy!',
    intent: 'primary',
    animationType: 'vibrant',
    glow: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Combines `animationType="vibrant"` with `glow` to showcase high-frequency jitter on hover and a pulsing glow cycle. Use sparingly; reserved for marketing / hero CTAs.',
      },
    },
  },
};

export const CharacterizedMotions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side comparison of the four physics-based interaction profiles. Observe the difference in "weight" and "elasticity" on click: Vibrant (excited), Bouncy (standard), Sharp (dignified), Physical (heavyweight).',
      },
    },
  },
  render: (args) => (
    <Flex gap="base" wrap="wrap">
      <Stack align="center" gap="xs">
        <Button {...args} animationType="vibrant">
          Vibrant
        </Button>
        <Text textStyle="caption" color="text.secondary">
          Excited Pom
        </Text>
      </Stack>
      <Stack align="center" gap="xs">
        <Button {...args} animationType="bouncy">
          Bouncy
        </Button>
        <Text textStyle="caption" color="text.secondary">
          Standard Pom
        </Text>
      </Stack>
      <Stack align="center" gap="xs">
        <Button {...args} animationType="sharp">
          Sharp
        </Button>
        <Text textStyle="caption" color="text.secondary">
          Dignified Pom
        </Text>
      </Stack>
      <Stack align="center" gap="xs">
        <Button {...args} animationType="physical">
          Physical
        </Button>
        <Text textStyle="caption" color="text.secondary">
          Heavyweight Pom
        </Text>
      </Stack>
    </Flex>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Processing...',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sets `aria-busy="true"` and `aria-disabled="true"`, renders the `Spinner` component, and disables all interaction. Use during async operations to prevent double-submission. Pass `loadingIcon` to replace the default spinner with a custom element.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Processing/i });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await expect(button).toHaveAttribute('data-loading', '');
  },
};

export const LoadingCustomIcon: Story = {
  args: {
    loading: true,
    children: 'Uploading...',
    loadingIcon: <Spinner size={16} />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the `loadingIcon` prop. When provided, the custom element replaces the default `Spinner`. The button retains all loading state semantics (`aria-busy`, `aria-disabled`, `data-loading`).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Uploading/i });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAttribute('data-loading', '');
  },
};

export const NeoStyle: Story = {
  args: {
    appearance: 'neo',
    animationType: 'physical',
    children: 'Neo Brutalism',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Neo-Brutalist style with thick solid border and hard shadow offsets. Automatically uses `physical` animation for tactile depth feedback. Ideal for statement or hero CTAs.',
      },
    },
  },
};

export const Polymorphic: Story = {
  args: {
    asChild: true,
    intent: 'secondary',
    appearance: 'outline',
  },
  render: (args) => (
    <Button {...args}>
      <a href="/dashboard">Go to Dashboard</a>
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the `asChild` pattern via Radix Slot. The `<Button>` renders as an `<a>` tag while retaining all button styles and animation. Prefer this over wrapping in a native `<a>` to avoid invalid HTML nesting.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Unavailable',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Applies `aria-disabled="true"` and suppresses all interaction feedback. The component does not add `disabled` to polymorphic (asChild) children to maintain valid HTML across element types.',
      },
    },
  },
};

// Internal story - excluded from autodocs and dev mode.
// Renders all intent x appearance combinations as literal JSX so Panda CSS's static scanner
// can detect and generate compound variant CSS for every combination.
// NOTE: The staticCss option does not cover compound variants in Panda CSS v1.8.x;
// this story exists solely to force compound variant generation at build time.
export const _CSSCoverage: Story = {
  tags: ['!autodocs', '!dev'],
  render: () => (
    <Box className={cssCoverageClass}>
      <Button intent="primary" appearance="solid">
        _
      </Button>
      <Button intent="primary" appearance="soft">
        _
      </Button>
      <Button intent="primary" appearance="neo">
        _
      </Button>
      <Button intent="primary" appearance="glass">
        _
      </Button>
      <Button intent="primary" appearance="minimal">
        _
      </Button>
      <Button intent="primary" appearance="outline">
        _
      </Button>
      <Button intent="primary" appearance="ghost">
        _
      </Button>
      <Button intent="secondary" appearance="solid">
        _
      </Button>
      <Button intent="secondary" appearance="soft">
        _
      </Button>
      <Button intent="secondary" appearance="neo">
        _
      </Button>
      <Button intent="secondary" appearance="glass">
        _
      </Button>
      <Button intent="secondary" appearance="minimal">
        _
      </Button>
      <Button intent="secondary" appearance="outline">
        _
      </Button>
      <Button intent="secondary" appearance="ghost">
        _
      </Button>
      <Button intent="info" appearance="solid">
        _
      </Button>
      <Button intent="info" appearance="soft">
        _
      </Button>
      <Button intent="info" appearance="neo">
        _
      </Button>
      <Button intent="info" appearance="glass">
        _
      </Button>
      <Button intent="info" appearance="minimal">
        _
      </Button>
      <Button intent="info" appearance="outline">
        _
      </Button>
      <Button intent="info" appearance="ghost">
        _
      </Button>
      <Button intent="success" appearance="solid">
        _
      </Button>
      <Button intent="success" appearance="soft">
        _
      </Button>
      <Button intent="success" appearance="neo">
        _
      </Button>
      <Button intent="success" appearance="glass">
        _
      </Button>
      <Button intent="success" appearance="minimal">
        _
      </Button>
      <Button intent="success" appearance="outline">
        _
      </Button>
      <Button intent="success" appearance="ghost">
        _
      </Button>
      <Button intent="warning" appearance="solid">
        _
      </Button>
      <Button intent="warning" appearance="soft">
        _
      </Button>
      <Button intent="warning" appearance="neo">
        _
      </Button>
      <Button intent="warning" appearance="glass">
        _
      </Button>
      <Button intent="warning" appearance="minimal">
        _
      </Button>
      <Button intent="warning" appearance="outline">
        _
      </Button>
      <Button intent="warning" appearance="ghost">
        _
      </Button>
      <Button intent="danger" appearance="solid">
        _
      </Button>
      <Button intent="danger" appearance="soft">
        _
      </Button>
      <Button intent="danger" appearance="neo">
        _
      </Button>
      <Button intent="danger" appearance="glass">
        _
      </Button>
      <Button intent="danger" appearance="minimal">
        _
      </Button>
      <Button intent="danger" appearance="outline">
        _
      </Button>
      <Button intent="danger" appearance="ghost">
        _
      </Button>
      <Button intent="light" appearance="solid">
        _
      </Button>
      <Button intent="light" appearance="soft">
        _
      </Button>
      <Button intent="light" appearance="neo">
        _
      </Button>
      <Button intent="light" appearance="glass">
        _
      </Button>
      <Button intent="light" appearance="minimal">
        _
      </Button>
      <Button intent="light" appearance="outline">
        _
      </Button>
      <Button intent="light" appearance="ghost">
        _
      </Button>
      <Button intent="dark" appearance="solid">
        _
      </Button>
      <Button intent="dark" appearance="soft">
        _
      </Button>
      <Button intent="dark" appearance="neo">
        _
      </Button>
      <Button intent="dark" appearance="glass">
        _
      </Button>
      <Button intent="dark" appearance="minimal">
        _
      </Button>
      <Button intent="dark" appearance="outline">
        _
      </Button>
      <Button intent="dark" appearance="ghost">
        _
      </Button>
    </Box>
  ),
};

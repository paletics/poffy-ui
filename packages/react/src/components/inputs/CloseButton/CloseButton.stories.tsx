import { CloseButton } from '@/components/inputs/CloseButton';
import { Box, Flex } from '@/components/layout';
import { Heading, Text } from '@/components/typography';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

/**
 * A specialized dismiss button that renders a static X SVG icon.
 * Used consistently across overlays, notifications, and tag components.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`closeButton` recipe), Radix Slot + Slottable
 */
const meta = {
  title: 'Inputs/CloseButton',
  component: CloseButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CloseButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Default `md` close button. Tab to focus, then press Enter or Space to activate. Verify that `aria-label="Close"` is correctly announced by screen readers.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /close/i });
    await userEvent.hover(button);
    await userEvent.click(button);
    await expect(button).toHaveFocus();
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'All three sizes (`sm`, `md`, `lg`) side by side. Verify that width/height scale proportionally via Silver Ratio tokens.',
      },
    },
  },
  render: () => (
    <Flex gap="md" align="center">
      <CloseButton size="sm" />
      <CloseButton size="md" />
      <CloseButton size="lg" />
    </Flex>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state. `aria-disabled="true"` is set. The button does not fire click events while disabled.',
      },
    },
  },
};

export const Appearances: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Utility-surface subset for dismiss controls. `ghost` is the default; `soft` and `outline` are available for denser framed layouts.',
      },
    },
  },
  render: () => (
    <Flex gap="md" align="center">
      <CloseButton appearance="ghost" />
      <CloseButton appearance="soft" />
      <CloseButton appearance="outline" />
    </Flex>
  ),
};

export const Shapes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'CloseButton exposes a narrow geometry subset. Use `rounded` for general dismiss affordances and `square` when aligning to rigid grids.',
      },
    },
  },
  render: () => (
    <Flex gap="md" align="center">
      <CloseButton shape="rounded" />
      <CloseButton shape="square" />
    </Flex>
  ),
};

export const InModalHeader: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Realistic modal header composition. Verify icon alignment with the modal title and correct focus management.',
      },
    },
  },
  render: () => (
    <Box
      width="400px"
      p="4"
      bg="layout.surface"
      borderRadius="lg"
      border="1px solid"
      borderColor="layout.divider"
    >
      <Flex justify="space-between" align="center" mb="4">
        <Heading level="3" fontSize="lg" fontWeight="bold">
          Modal Title
        </Heading>
        <CloseButton />
      </Flex>
      <Text color="text.secondary">This is modal content. Click the X button to close.</Text>
    </Box>
  ),
};

export const InToast: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Toast notification composition. Uses `size="sm"` to match the compact content area. Verify vertical alignment with the toast text.',
      },
    },
  },
  render: () => (
    <Flex
      justify="space-between"
      align="flex-start"
      gap="sm"
      maxWidth="360px"
      p="3"
      bg="variants.success.surface"
      borderRadius="md"
      border="1px solid"
      borderColor="variants.success.border"
    >
      <Box>
        <Text fontWeight="bold" mb="1">
          Success!
        </Text>
        <Text fontSize="sm" color="text.secondary">
          Your changes have been saved.
        </Text>
      </Box>
      <CloseButton size="sm" />
    </Flex>
  ),
};

export const InAlert: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Alert banner composition. Uses default `md` size with a warning surface. Verify `flex-start` alignment preserves correct vertical positioning when alert text wraps.',
      },
    },
  },
  render: () => (
    <Flex
      justify="space-between"
      align="flex-start"
      gap="sm"
      maxWidth="600px"
      p="4"
      bg="variants.warning.surface"
      borderRadius="md"
      borderLeft="4px solid"
      borderColor="variants.warning.main"
    >
      <Box>
        <Text fontWeight="bold" mb="1" color="variants.warning.main">
          Warning
        </Text>
        <Text fontSize="sm" color="text.secondary">
          This action cannot be undone. Please review your changes before proceeding.
        </Text>
      </Box>
      <CloseButton />
    </Flex>
  ),
};

export const InDrawer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Drawer panel header composition. Renders as a fixed sidebar panel. Verify the button is correctly right-aligned and the bottom border separates header from body.',
      },
    },
  },
  render: () => (
    <Flex
      width="320px"
      height="100vh"
      bg="layout.surface"
      borderLeft="1px solid"
      borderColor="layout.divider"
      direction="column"
    >
      <Flex
        justify="space-between"
        align="center"
        p="4"
        borderBottom="1px solid"
        borderColor="layout.divider"
      >
        <Heading level="3" fontSize="lg" fontWeight="bold">
          Drawer Title
        </Heading>
        <CloseButton />
      </Flex>
      <Box p="4">
        <Text color="text.secondary">Drawer content goes here.</Text>
      </Box>
    </Flex>
  ),
};

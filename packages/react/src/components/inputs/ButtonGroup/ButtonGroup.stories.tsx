'use client';

import { Button } from '@/components/inputs/Button';
import { ButtonGroup } from '@/components/inputs/ButtonGroup';
import { Box, Divider, Flex, Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

/**
 * A layout molecule for grouping related `Button` atoms with consistent spacing
 * and a connected visual mode for toolbar-style segmented controls.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`buttonGroup` recipe), `ButtonGroupContext`, `ActionMotion`
 */
const meta = {
  title: 'Inputs/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Standard horizontal grouping with default (`md`) spacing. Verify equal Silver Ratio gaps between each button and correct focus ring on Tab navigation.',
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');

    await userEvent.click(buttons[0]);
    await expect(buttons[0]).toHaveFocus();

    await userEvent.tab();
    await expect(buttons[1]).toHaveFocus();
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Spacing: Story = {
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story:
          'Showcase for all Silver Ratio spacing tokens: `none`, `sm`, `md` (default), `lg`. Observe the proportional gap scaling.',
      },
    },
  },
  render: () => (
    <Stack gap="md">
      <Box>
        <Text fontSize="sm" mb="2" color="text.secondary">
          None
        </Text>
        <ButtonGroup spacing="none">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Text fontSize="sm" mb="2" color="text.secondary">
          Small
        </Text>
        <ButtonGroup spacing="sm">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Text fontSize="sm" mb="2" color="text.secondary">
          Medium (default)
        </Text>
        <ButtonGroup spacing="md">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Text fontSize="sm" mb="2" color="text.secondary">
          Large
        </Text>
        <ButtonGroup spacing="lg">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Box>
    </Stack>
  ),
};

export const Connected: Story = {
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story:
          'Connected mode where buttons visually merge into a single block. Interior corners have 0 border-radius and shared borders do not double up. Child `ActionMotion` is automatically set to `subtle`.',
      },
    },
  },
  render: () => (
    <ButtonGroup connected>
      <Button>Cut</Button>
      <Button>Copy</Button>
      <Button>Paste</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story:
          'Vertical orientation for sidebars or menu groups. Buttons stack in a column with correct alignment.',
      },
    },
  },
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button>Top</Button>
      <Button>Middle</Button>
      <Button>Bottom</Button>
    </ButtonGroup>
  ),
};

export const VerticalConnected: Story = {
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story:
          'Vertical layout with connected borders. Verify that top and bottom border-radius resets apply correctly on interior buttons.',
      },
    },
  },
  render: () => (
    <ButtonGroup orientation="vertical" connected>
      <Button>Option 1</Button>
      <Button>Option 2</Button>
      <Button>Option 3</Button>
    </ButtonGroup>
  ),
};

export const FullWidth: Story = {
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story:
          'Full-width layout where all buttons stretch equally to fill the container. Verify equal width sharing regardless of label length.',
      },
    },
  },
  render: () => (
    <Box width="[400px]">
      <ButtonGroup fullWidth>
        <Button>Left</Button>
        <Button>Center</Button>
        <Button>Right</Button>
      </ButtonGroup>
    </Box>
  ),
};

export const Toolbar: Story = {
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story:
          'Practical text editor toolbar example. Two connected groups separated by a visual divider - demonstrates real-world composition with multiple `ButtonGroup` instances on the same surface.',
      },
    },
  },
  render: () => (
    <Box
      p="2"
      bg="layout.surface"
      borderRadius="md"
      border="[1px solid]"
      borderColor="layout.divider"
    >
      <Flex gap="md">
        <ButtonGroup connected>
          <Button>Bold</Button>
          <Button>Italic</Button>
          <Button>Underline</Button>
        </ButtonGroup>
        <Divider orientation="vertical" my="1" />
        <ButtonGroup connected>
          <Button>Left</Button>
          <Button>Center</Button>
          <Button>Right</Button>
        </ButtonGroup>
      </Flex>
    </Box>
  ),
};

export const Pagination: Story = {
  args: {
    children: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pagination example combining standalone Previous/Next buttons with a connected page-number group. Demonstrates correct mixed composition on the same row.',
      },
    },
  },
  render: () => (
    <Flex gap="xs" align="center">
      <Button>Previous</Button>
      <ButtonGroup connected>
        <Button>1</Button>
        <Button>2</Button>
        <Button>3</Button>
        <Button>4</Button>
        <Button>5</Button>
      </ButtonGroup>
      <Button>Next</Button>
    </Flex>
  ),
};

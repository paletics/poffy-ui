'use client';

import { Button } from '@/components/inputs/Button';
import { ButtonGroup } from '@/components/inputs/ButtonGroup';
import { Box, Divider, Flex, Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

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
    <Box width="[min(400px, calc(100vw - 4rem))]">
      <ButtonGroup wrap>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </Box>
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

export const ConstrainedWrapping: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A full-width wrapping group. Buttons move as whole flex items, while a single long label can wrap within the parent width.',
      },
    },
  },
  render: () => (
    <Box width="[10rem]" maxWidth="100%" aria-label="Constrained wrapping container">
      <ButtonGroup fullWidth wrap aria-label="Constrained actions">
        <Button>A deliberately long primary action</Button>
        <Button>Cancel</Button>
      </ButtonGroup>
    </Box>
  ),
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
        <Text fontSize="sm" mb="sm" color="text.secondary">
          None
        </Text>
        <ButtonGroup spacing="none">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Text fontSize="sm" mb="sm" color="text.secondary">
          Small
        </Text>
        <ButtonGroup spacing="sm">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Text fontSize="sm" mb="sm" color="text.secondary">
          Medium (default)
        </Text>
        <ButtonGroup spacing="md">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Text fontSize="sm" mb="sm" color="text.secondary">
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

export const AsChildConnected: Story = {
  args: { children: null },
  render: () => (
    <ButtonGroup asChild connected aria-label="Clipboard actions">
      <section>
        <Button>Cut</Button>
        <Button>Copy</Button>
        <Button>Paste</Button>
      </section>
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
    <Box width="[min(400px, calc(100vw - 4rem))]">
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
      width="[min(360px, calc(100vw - 4rem))]"
      p="sm"
      bg="layout.surface"
      borderRadius="md"
      borderWidth="thin"
      borderStyle="solid"
      borderColor="layout.divider"
    >
      <Flex gap="xs" wrap="wrap" justify="center">
        <ButtonGroup connected>
          <Button size="sm">Bold</Button>
          <Button size="sm">Italic</Button>
          <Button size="sm">Underline</Button>
        </ButtonGroup>
        <Divider orientation="vertical" my="2xs" />
        <ButtonGroup connected>
          <Button size="sm">Left</Button>
          <Button size="sm">Center</Button>
          <Button size="sm">Right</Button>
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
    <Flex gap="xs" align="center" wrap="wrap" justify="center">
      <Button size="sm">Previous</Button>
      <ButtonGroup connected>
        <Button size="sm">1</Button>
        <Button size="sm">2</Button>
        <Button size="sm">3</Button>
        <Button size="sm">4</Button>
        <Button size="sm">5</Button>
      </ButtonGroup>
      <Button size="sm">Next</Button>
    </Flex>
  ),
};

export const NarrowConnectedRtl: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="md" width="[160px]" dir="rtl">
      <ButtonGroup connected fullWidth aria-label="إجراءات">
        <Button>الإجراء الأول الطويل</Button>
        <Button>الإجراء الثاني الطويل</Button>
        <Button>الثالث</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical" connected fullWidth aria-label="خيارات">
        <Button>الخيار الأول الطويل</Button>
        <Button>الخيار الثاني</Button>
        <Button>الثالث</Button>
      </ButtonGroup>
    </Stack>
  ),
};

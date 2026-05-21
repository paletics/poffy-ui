import type { Meta, StoryObj } from '@storybook/react';
import { SplitButton } from '@/components/inputs/SplitButton';
import { Flex, Stack } from '@/components/layout';
import { Text } from '@/components/typography/Text';
import { DownloadIcon, SaveIcon, ShareIcon } from '@/components/media/Icon/icons';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';

/**
 * Storybook documentation and visual review surface for SplitButton.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta = {
  title: 'Inputs/SplitButton',
  component: SplitButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Combines a primary action button with a dropdown menu of secondary options. Arrow Up/Down navigates menu items; Enter selects; Escape closes.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Save',
    items: [
      { id: '1', label: 'Save and Close', onClick: () => undefined },
      { id: '2', label: 'Save as Draft', onClick: () => undefined },
      { id: '3', label: 'Save as Template', onClick: () => undefined },
    ],
    onClick: () => undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Primary "Save" action with three secondary options in the dropdown. Click the chevron to open the menu.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chevron = canvas.getByRole('button', { name: /more options/i });
    await expect(chevron).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(chevron);
    await expect(chevron).toHaveAttribute('aria-expanded', 'true');
    const menuItem = await canvas.findByRole('menuitem', { name: /save as draft/i });
    await expect(menuItem).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(chevron).toHaveAttribute('aria-expanded', 'false');
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
          '`sm`, `md`, `lg` sizes - both the main button and the chevron button scale together.',
      },
    },
  },
  args: { children: 'Sizes', items: [] },
  render: () => {
    const items = [
      { id: '1', label: 'Option 1', onClick: () => undefined },
      { id: '2', label: 'Option 2', onClick: () => undefined },
    ];

    return (
      <Flex gap="md" align="center">
        <SplitButton size="sm" items={items}>
          Small
        </SplitButton>
        <SplitButton size="md" items={items}>
          Medium
        </SplitButton>
        <SplitButton size="lg" items={items}>
          Large
        </SplitButton>
      </Flex>
    );
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`solid`, `soft`, `outline`, `ghost`, and `minimal` appearances. `solid` is the default high-emphasis surface.',
      },
    },
  },
  args: { children: 'Variants', items: [] },
  render: () => {
    const items = [
      { id: '1', label: 'Option 1', onClick: () => undefined },
      { id: '2', label: 'Option 2', onClick: () => undefined },
    ];

    return (
      <Flex gap="md" align="center" wrap="wrap">
        <Stack gap="xs">
          <Text variant="caption" color="text.secondary">
            Solid
          </Text>
          <SplitButton appearance="solid" items={items}>
            Action
          </SplitButton>
        </Stack>
        <Stack gap="xs">
          <Text variant="caption" color="text.secondary">
            Soft
          </Text>
          <SplitButton appearance="soft" items={items}>
            Action
          </SplitButton>
        </Stack>
        <Stack gap="xs">
          <Text variant="caption" color="text.secondary">
            Outline
          </Text>
          <SplitButton appearance="outline" items={items}>
            Action
          </SplitButton>
        </Stack>
        <Stack gap="xs">
          <Text variant="caption" color="text.secondary">
            Ghost
          </Text>
          <SplitButton appearance="ghost" items={items}>
            Action
          </SplitButton>
        </Stack>
        <Stack gap="xs">
          <Text variant="caption" color="text.secondary">
            Minimal
          </Text>
          <SplitButton appearance="minimal" items={items}>
            Action
          </SplitButton>
        </Stack>
      </Flex>
    );
  },
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: { story: 'Main action and dropdown items both support a leading `icon` prop.' },
    },
  },
  args: { children: 'With Icons', items: [] },
  render: () => (
    <SplitButton
      icon={<SaveIcon />}
      items={[
        {
          id: '1',
          label: 'Download as PDF',
          icon: <DownloadIcon />,
          onClick: () => undefined,
        },
        {
          id: '2',
          label: 'Download as Word',
          icon: <DownloadIcon />,
          onClick: () => undefined,
        },
        { id: '3', label: 'Share', icon: <ShareIcon />, onClick: () => undefined },
      ]}
      onClick={() => undefined}
    >
      Save File
    </SplitButton>
  ),
};

export const DisabledItems: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Individual menu items can be disabled with `disabled: true`. Disabled items are skipped during keyboard navigation.',
      },
    },
  },
  args: { children: 'Disabled Items', items: [] },
  render: () => (
    <SplitButton
      items={[
        { id: '1', label: 'Enabled Option', onClick: () => undefined },
        {
          id: '2',
          label: 'Disabled Option',
          disabled: true,
          onClick: () => undefined,
        },
        { id: '3', label: 'Another Enabled', onClick: () => undefined },
      ]}
      onClick={() => undefined}
    >
      Action
    </SplitButton>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Both the primary button and the dropdown chevron are disabled. Neither can be clicked or focused.',
      },
    },
  },
  args: {
    children: 'Disabled',
    disabled: true,
    items: [
      { id: '1', label: 'Option 1', onClick: () => undefined },
      { id: '2', label: 'Option 2', onClick: () => undefined },
    ],
  },
};

export const PublishExample: Story = {
  args: { children: 'Publish', items: [] },
  parameters: {
    docs: {
      description: {
        story:
          'Real-world publish flow: primary posts immediately; dropdown offers schedule or draft options. Status feedback is shown below.',
      },
    },
  },
  render: function PublishExampleStory() {
    const [status, setStatus] = useState<string>('');

    return (
      <Stack gap="md" align="flex-start">
        <SplitButton
          items={[
            {
              id: '1',
              label: 'Publish and Notify',
              onClick: () => setStatus('Published with notifications'),
            },
            {
              id: '2',
              label: 'Schedule Publish',
              onClick: () => setStatus('Scheduled for later'),
            },
            {
              id: '3',
              label: 'Save as Draft',
              onClick: () => setStatus('Saved as draft'),
            },
          ]}
          onClick={() => setStatus('Published immediately')}
        >
          Publish
        </SplitButton>
        {status && (
          <Text variant="caption" color="text.secondary">
            Status: <strong>{status}</strong>
          </Text>
        )}
      </Stack>
    );
  },
};

export const ExportExample: Story = {
  args: { children: 'Export', items: [] },
  parameters: {
    docs: {
      description: {
        story:
          'Export-format selection pattern. XML is intentionally disabled to demonstrate the disabled-item API.',
      },
    },
  },
  render: () => (
    <SplitButton
      icon={<DownloadIcon />}
      items={[
        {
          id: 'pdf',
          label: 'Export as PDF',
          icon: <DownloadIcon />,
          onClick: () => undefined,
        },
        {
          id: 'csv',
          label: 'Export as CSV',
          icon: <DownloadIcon />,
          onClick: () => undefined,
        },
        {
          id: 'json',
          label: 'Export as JSON',
          icon: <DownloadIcon />,
          onClick: () => undefined,
        },
        {
          id: 'xml',
          label: 'Export as XML',
          disabled: true,
          icon: <DownloadIcon />,
          onClick: () => undefined,
        },
      ]}
      onClick={() => undefined}
    >
      Export
    </SplitButton>
  ),
};

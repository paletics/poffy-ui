import { Box } from '@/components/layout/Box';
import { Flex } from '@/components/layout/Flex';
import { Stack } from '@/components/layout/Stack';
import { CopyIcon, CutIcon, ShareIcon } from '@/components/media/Icon/icons';
import { Text } from '@/components/typography/Text';
import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { ContextMenuCombinedProps } from '@/components/overlay/ContextMenu/ContextMenu.types';
import { useContextMenuTrigger } from '@poffy-ui/behavior/context-menu';
import { ContextMenu, ContextMenuItem } from '@/components/overlay/ContextMenu';

/**
 * Storybook documentation and visual review surface for ContextMenu.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, overlay primitives
 */
const meta: Meta<typeof ContextMenu> = {
  title: 'Overlay/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      table: {
        disable: true,
      },
    },
    position: {
      table: {
        disable: true,
      },
    },
    target: {
      table: {
        disable: true,
      },
    },
    onClose: {
      table: {
        disable: true,
      },
    },
    items: {
      control: 'object',
      description: 'List of menu items.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

const triggerClass = css({
  width: '[300px]',
  height: '[200px]',
  bg: 'layout.background',
  borderWidth: '2px',
  borderStyle: 'dashed',
  borderColor: 'layout.divider',
  borderRadius: 'md',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'text.secondary',
  userSelect: 'none',
});
const rowClass = css({ display: 'flex', gap: 'lg' });
const wrapClass = css({ display: 'flex', gap: 'lg', flexWrap: 'wrap' });
const labelClass = css({ fontSize: 'xs', mb: 'xs', color: 'text.secondary' });

const items: ContextMenuItem[] = [
  {
    id: 'view',
    label: 'View',
    onClick: () => undefined,
  },
  {
    id: 'edit',
    label: 'Edit',
    shortcut: 'Ctrl+E',
    onClick: () => undefined,
  },
  {
    type: 'separator',
    id: 'sep1',
  },
  {
    id: 'delete',
    label: 'Delete',
    danger: true,
    shortcut: 'Del',
    onClick: () => undefined,
  },
];

const ContextMenuDemo = (props: Partial<ContextMenuCombinedProps>) => {
  const { open, position, target, onContextMenu, onClose } = useContextMenuTrigger();

  return (
    <Box onContextMenu={onContextMenu} className={triggerClass}>
      <Text>Right Click ({props.brand ?? 'default'})</Text>
      <ContextMenu
        open={open}
        position={position}
        onClose={onClose}
        items={items}
        target={target}
        {...props}
      />
    </Box>
  );
};

export const Default: Story = {
  render: () => <ContextMenuDemo />,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Interaction: Story = {
  render: () => <ContextMenuDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByText(/right click/i);
    await userEvent.pointer([{ target: trigger, keys: '[MouseRight]' }]);
    await waitFor(async () => {
      await expect(body.getByRole('menuitem', { name: /Edit/ })).toBeVisible();
    });
  },
};

export const Brands: Story = {
  render: () => (
    <Flex className={rowClass}>
      <ContextMenuDemo brand="pome" />
      <ContextMenuDemo brand="blue" />
    </Flex>
  ),
};

export const Animations: Story = {
  render: () => (
    <Flex className={wrapClass}>
      <Stack>
        <Text className={labelClass}>popover</Text>
        <ContextMenuDemo animationType="popover" />
      </Stack>
      <Stack>
        <Text className={labelClass}>modal</Text>
        <ContextMenuDemo animationType="modal" />
      </Stack>
      <Stack>
        <Text className={labelClass}>fade</Text>
        <ContextMenuDemo animationType="fade" />
      </Stack>
      <Stack>
        <Text className={labelClass}>zoom</Text>
        <ContextMenuDemo animationType="zoom" />
      </Stack>
      <Stack>
        <Text className={labelClass}>puff</Text>
        <ContextMenuDemo animationType="puff" />
      </Stack>
    </Flex>
  ),
};

const ContextMenuWithIconDemo = ({ brand }: { brand?: ContextMenuCombinedProps['brand'] }) => {
  const { open, position, target, onContextMenu, onClose } = useContextMenuTrigger();

  const iconItems: ContextMenuItem[] = [
    {
      id: 'copy',
      label: 'Copy',
      icon: <CopyIcon size="sm" />,
      onClick: () => undefined,
    },
    {
      id: 'cut',
      label: 'Cut',
      icon: <CutIcon size="sm" />,
      onClick: () => undefined,
    },
    { type: 'separator', id: 's1' },
    {
      id: 'share',
      label: 'Share',
      icon: <ShareIcon size="sm" />,
    },
  ];

  return (
    <Box onContextMenu={onContextMenu} className={triggerClass}>
      <Text>Right Click (Icons)</Text>
      <ContextMenu
        open={open}
        position={position}
        onClose={onClose}
        items={iconItems}
        target={target}
        brand={brand}
      />
    </Box>
  );
};

export const WithIcons: Story = {
  render: (args) => <ContextMenuWithIconDemo {...args} />,
};

import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '@/components/data-display/Avatar';
import { AvatarGroup } from '@/components/data-display/AvatarGroup';
import { Box } from '@/components/layout/Box';

/**
 * Renders a horizontal stack of Avatar components with optional overflow count and click handler.
 * Use to represent multiple users in a compact, overlapping layout.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (avatarGroup recipe), React Context
 */
const meta: Meta<typeof AvatarGroup> = {
  title: 'Display/AvatarGroup',
  component: AvatarGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    total: { control: 'number' },
    onExcessClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const avatarSvg = (label: string, background: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="${background}"/><text x="48" y="57" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="white">${label}</text></svg>`,
  )}`;

export const Default: Story = {
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar name="Aoi Tanaka" src={avatarSvg('AT', '#2563eb')} />
      <Avatar name="Mika Sato" src={avatarSvg('MS', '#0f766e')} />
      <Avatar name="Ren Ito" src={avatarSvg('RI', '#7c3aed')} />
    </AvatarGroup>
  ),
  args: {
    size: 'md',
    spacing: '-sm',
    children: null,
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithMax: Story = {
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar name="User 1" />
      <Avatar name="User 2" />
      <Avatar name="User 3" />
      <Avatar name="User 4" />
      <Avatar name="User 5" />
    </AvatarGroup>
  ),
  args: {
    max: 3,
    size: 'lg',
    children: null,
  },
};

export const WithTotalOverride: Story = {
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar name="User 1" />
      <Avatar name="User 2" />
      <Avatar name="User 3" />
    </AvatarGroup>
  ),
  args: {
    max: 3,
    total: 100,
    size: 'lg',
    children: null,
    onExcessClick: () => undefined,
  },
};

export const AsChild: Story = {
  render: (args) => (
    <AvatarGroup {...args} asChild>
      <Box
        display="flex"
        borderWidth="thin"
        borderStyle="dashed"
        borderColor="variants.danger.border"
        p="xs"
      >
        <Avatar name="User 1" />
        <Avatar name="User 2" />
        <Avatar name="User 3" />
      </Box>
    </AvatarGroup>
  ),
  args: {
    max: 3,
    children: null,
  },
};

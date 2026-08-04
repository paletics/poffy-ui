import { Avatar } from '@/components/data-display/Avatar';
import { Flex } from '@/components/layout/Flex';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Avatar> = {
  title: 'Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    shape: {
      control: 'select',
      options: ['rounded', 'square'],
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to use the asChild pattern',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

const avatarSvg = (label: string, background = '#2563eb') =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="${background}"/><text x="48" y="57" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="white">${label}</text></svg>`,
  )}`;

export const Default: Story = {
  args: {
    src: avatarSvg('AT'),
    alt: 'User Avatar',
    name: 'Aoi Tanaka',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Fallback: Story = {
  args: {
    name: 'John Doe',
  },
};

export const BrokenImage: Story = {
  args: {
    src: '/missing-avatar.png',
    name: 'Broken Link',
  },
};

export const Sizes = () => (
  <Flex gap="xs" align="center">
    <Avatar size="xs" name="Xs" />
    <Avatar size="sm" name="Sm" />
    <Avatar size="md" name="Md" />
    <Avatar size="lg" name="Lg" />
    <Avatar size="xl" name="Xl" />
  </Flex>
);

export const Shapes = () => (
  <Flex gap="md" align="center">
    <Avatar shape="rounded" name="Round" />
    <Avatar shape="square" name="Square" />
  </Flex>
);

export const AsChild: Story = {
  args: {
    asChild: true,
    src: avatarSvg('MS', '#0f766e'),
    name: 'Mika Sato',
    children: (
      <a
        href="https://example.com/profile"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Mika Sato profile"
      />
    ),
  },
};

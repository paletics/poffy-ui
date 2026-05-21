import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@/components/layout/Box';
import { Flex } from '@/components/layout/Flex';
import { HomeIcon, LockIcon, SettingsIcon, UserIcon } from '@/components/media/Icon/icons';
import { Text } from '@/components/typography/Text';
import { css } from '@/styled-system/css';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
} from '@/components/navigation/Sidebar';

/**
 * Storybook documentation and visual review surface for Sidebar.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline'],
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const shellClass = css({
  height: '100vh',
  display: 'flex',
});

const contentClass = css({
  flex: '1',
  p: '5',
});

export const Default: Story = {
  args: {
    appearance: 'soft',
  },
  render: (args) => (
    <Flex className={shellClass}>
      <Sidebar {...args}>
        <SidebarHeader>Logo</SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Main">
            <SidebarItem isActive icon={<HomeIcon size="sm" />}>
              Dashboard
            </SidebarItem>
            <SidebarItem icon={<UserIcon size="sm" />}>Profile</SidebarItem>
          </SidebarGroup>
          <SidebarGroup label="Settings">
            <SidebarItem icon={<SettingsIcon size="sm" />}>General</SidebarItem>
            <SidebarItem icon={<LockIcon size="sm" />}>Security</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>Footer Content</SidebarFooter>
      </Sidebar>
      <Box className={contentClass}>
        <Text>Main Content</Text>
      </Box>
    </Flex>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Collapsed: Story = {
  args: {
    collapsed: true,
  },
  render: (args) => (
    <Flex className={shellClass}>
      <Sidebar {...args}>
        <SidebarHeader>
          <LockIcon size="sm" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem isActive icon={<HomeIcon size="sm" />}>
              Dashboard
            </SidebarItem>
            <SidebarItem icon={<UserIcon size="sm" />}>Profile</SidebarItem>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarItem icon={<SettingsIcon size="sm" />}>General</SidebarItem>
            <SidebarItem icon={<LockIcon size="sm" />}>Security</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SettingsIcon size="sm" />
        </SidebarFooter>
      </Sidebar>
      <Box className={contentClass}>
        <Text>Main Content</Text>
      </Box>
    </Flex>
  ),
};

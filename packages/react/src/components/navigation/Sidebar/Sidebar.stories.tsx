import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@/components/layout/Box';
import { Flex } from '@/components/layout/Flex';
import { HomeIcon, LockIcon, SettingsIcon, UserIcon } from '@/components/media/Icon/icons';
import { Text } from '@/components/typography/Text';
import { LocaleProvider } from '@/providers/LocaleProvider';
import { css } from '@/styled-system/css';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
} from '@/components/navigation/Sidebar';


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
  height: '[100vh]',
  display: 'flex',
});

const contentClass = css({
  flex: '1',
  p: 'lg',
});

const constrainedSidebarClass = css({ width: '[8rem]' });

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
            <SidebarItem href="#dashboard" isActive icon={<HomeIcon size="sm" />}>
              Dashboard
            </SidebarItem>
            <SidebarItem href="#profile" icon={<UserIcon size="sm" />}>
              Profile
            </SidebarItem>
          </SidebarGroup>
          <SidebarGroup label="Settings">
            <SidebarItem href="#general" icon={<SettingsIcon size="sm" />}>
              General
            </SidebarItem>
            <SidebarItem href="#security" icon={<LockIcon size="sm" />}>
              Security
            </SidebarItem>
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
            <SidebarItem href="#dashboard" isActive icon={<HomeIcon size="sm" />}>
              Dashboard
            </SidebarItem>
            <SidebarItem href="#profile" icon={<UserIcon size="sm" />}>
              Profile
            </SidebarItem>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarItem href="#general" icon={<SettingsIcon size="sm" />}>
              General
            </SidebarItem>
            <SidebarItem href="#security" icon={<LockIcon size="sm" />}>
              Security
            </SidebarItem>
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

export const ConstrainedWidth: Story = {
  render: () => (
    <div className={constrainedSidebarClass} aria-label="Constrained sidebar container">
      <Sidebar>
        <SidebarHeader>Workspace</SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Navigationwithanunusuallylongunbrokenlocalizedheading">
            <SidebarItem href="#dashboard" icon={<HomeIcon size="sm" />}>
              Dashboard with a long label
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  ),
};

export const ScrollableItems: Story = {
  render: () => (
    <div className={shellClass}>
      <Sidebar>
        <SidebarHeader>Workspace</SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Projects">
            {Array.from({ length: 16 }, (_, index) => {
              const item = index + 1;
              return (
                <SidebarItem key={item} href={`#project-${item}`} icon={<HomeIcon size="sm" />}>
                  Project {item}
                </SidebarItem>
              );
            })}
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>Footer Content</SidebarFooter>
      </Sidebar>
    </div>
  ),
};

export const JapaneseAccessibleName: Story = {
  render: () => (
    <LocaleProvider defaultLocale="ja-JP" global={false}>
      <Sidebar>
        <SidebarHeader>ワークスペース</SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="ナビゲーション">
            <SidebarItem href="#dashboard" isActive icon={<HomeIcon size="sm" />}>
              ダッシュボード
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </LocaleProvider>
  ),
};

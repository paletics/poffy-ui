import type { Meta, StoryObj } from '@storybook/react';
import { List, ListItem, ListItemIcon, ListItemText } from '@/components/data-display/List';
import { HomeIcon, SettingsIcon, StarIcon, UploadIcon } from '@/components/media/Icon/icons';
import { css } from '@/styled-system/css';

const meta: Meta<typeof List> = {
  title: 'Display/List',
  component: List,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof List>;

const linkItemClass = css({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'text.primary',
});
const constrainedListClass = css({ width: '[200px]', maxWidth: '100%' });

export const Default: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem>
        <ListItemText>Item 1</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>Item 2</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>Item 3</ListItemText>
      </ListItem>
    </List>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithIcons: Story = {
  render: () => (
    <List>
      <ListItem>
        <ListItemIcon>
          <UploadIcon />
        </ListItemIcon>
        <ListItemText primary="Launch" secondary="Start the rocket" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <StarIcon />
        </ListItemIcon>
        <ListItemText primary="Star" secondary="Star the repo" />
      </ListItem>
    </List>
  ),
};

export const Ordered: Story = {
  render: (args) => (
    <List variant="ordered" {...args}>
      <ListItem>
        <ListItemText>First item</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>Second item</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>Third item</ListItemText>
      </ListItem>
    </List>
  ),
};

export const AsChild: Story = {
  render: (args) => (
    <nav aria-label="Example navigation">
      <List {...args} asChild>
        <ul>
          <ListItem>
            <a href="#1" className={linkItemClass}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Link Item 1" secondary="This is an anchor tag" />
            </a>
          </ListItem>
          <ListItem>
            <a href="#2" className={linkItemClass}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Link Item 2" secondary="This is also an anchor tag" />
            </a>
          </ListItem>
        </ul>
      </List>
    </nav>
  ),
};

export const ConstrainedRtlLongContent: Story = {
  render: () => (
    <List
      variant="ordered"
      dir="rtl"
      className={constrainedListClass}
      aria-label="قائمة ضيقة بمحتوى طويل"
    >
      <ListItem>
        <ListItemText
          primary="معرّف-إصدار-طويل-جداً-بدون-فواصل-release-configuration-identifier"
          secondary="https://example.com/releases/2026/07/rtl-long-destination"
        />
      </ListItem>
      <ListItem>
        <ListItemText primary="عنصر ثانٍ" secondary="وصف موجز" />
      </ListItem>
    </List>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Ordered markers use logical start padding and long primary or secondary text wraps in a narrow RTL container.',
      },
    },
  },
};

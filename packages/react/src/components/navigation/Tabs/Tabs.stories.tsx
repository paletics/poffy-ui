import type { Meta, StoryObj } from '@storybook/react';
import { css } from '@/styled-system/css';
import { Tabs, TabList, TabTrigger, TabContent } from '.';

/**
 * Storybook documentation and visual review surface for Tabs.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['ghost', 'outline', 'soft'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    indicatorAnimation: {
      control: 'select',
      options: ['stable', 'pop', 'morph', 'switch', 'translate', 'elastic'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const variantsStackClass = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8',
});

export const Default: Story = {
  args: {
    defaultValue: 'tab1',
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList>
        <TabTrigger value="tab1">Tab 1</TabTrigger>
        <TabTrigger value="tab2">Tab 2</TabTrigger>
        <TabTrigger value="tab3">Tab 3</TabTrigger>
      </TabList>
      <TabContent value="tab1">Content 1</TabContent>
      <TabContent value="tab2">Content 2</TabContent>
      <TabContent value="tab3">Content 3</TabContent>
    </Tabs>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Appearances = () => (
  <div className={variantsStackClass}>
    <Tabs defaultValue="a" appearance="ghost">
      <TabList>
        <TabTrigger value="a">Line A</TabTrigger>
        <TabTrigger value="b">Line B</TabTrigger>
      </TabList>
      <TabContent value="a">Line Content A</TabContent>
      <TabContent value="b">Line Content B</TabContent>
    </Tabs>
    <Tabs defaultValue="a" appearance="outline">
      <TabList>
        <TabTrigger value="a">Enclosed A</TabTrigger>
        <TabTrigger value="b">Enclosed B</TabTrigger>
      </TabList>
      <TabContent value="a">Enclosed Content A</TabContent>
      <TabContent value="b">Enclosed Content B</TabContent>
    </Tabs>
    <Tabs defaultValue="a" appearance="soft">
      <TabList>
        <TabTrigger value="a">Pill A</TabTrigger>
        <TabTrigger value="b">Pill B</TabTrigger>
      </TabList>
      <TabContent value="a">Pill Content A</TabContent>
      <TabContent value="b">Pill Content B</TabContent>
    </Tabs>
  </div>
);

export const PopIndicator: Story = {
  args: {
    defaultValue: 'tab1',
    indicatorAnimation: 'pop',
  },
  render: Default.render,
};

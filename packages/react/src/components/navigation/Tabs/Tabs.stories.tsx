import type { Meta, StoryObj } from '@storybook/react';
import { css } from '@/styled-system/css';
import { tabs as tabsRecipe } from '@/styled-system/recipes';
import { Tabs, TabList, TabTrigger, TabContent } from '.';


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
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
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
  gap: 'xl',
});

const constrainedTabsClass = css({ width: '[11rem]' });
const verticalTabsClass = css({ minHeight: '[12rem]' });
const constrainedVerticalTabsClass = css({ width: '[12rem]', minHeight: '[12rem]' });
const verticalLineCoverage = tabsRecipe({ orientation: 'vertical', variant: 'line' });
const verticalEnclosedCoverage = tabsRecipe({
  orientation: 'vertical',
  variant: 'enclosed',
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

export const ConstrainedWidth: Story = {
  render: () => (
    <div className={constrainedTabsClass} aria-label="Constrained tabs example">
      <Tabs defaultValue="overview">
        <TabList>
          <TabTrigger value="overview">Overview</TabTrigger>
          <TabTrigger value="activity">Recent activity</TabTrigger>
          <TabTrigger value="permissions">Permissions</TabTrigger>
          <TabTrigger value="integrations">Integrations</TabTrigger>
        </TabList>
        <TabContent value="overview">Overview content</TabContent>
        <TabContent value="activity">Activity content</TabContent>
        <TabContent value="permissions">Permissions content</TabContent>
        <TabContent value="integrations">Integrations content</TabContent>
      </Tabs>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className={variantsStackClass}>
      {(['ghost', 'outline'] as const).map((appearance) => (
        <Tabs
          key={appearance}
          className={verticalTabsClass}
          defaultValue="overview"
          appearance={appearance}
          orientation="vertical"
        >
          <TabList aria-label={`${appearance} vertical tabs`}>
            <TabTrigger value="overview">Overview</TabTrigger>
            <TabTrigger value="activity">Activity</TabTrigger>
            <TabTrigger value="settings">Settings</TabTrigger>
          </TabList>
          <TabContent value="overview">Overview content</TabContent>
          <TabContent value="activity">Activity content</TabContent>
          <TabContent value="settings">Settings content</TabContent>
        </Tabs>
      ))}
    </div>
  ),
};

export const VerticalConstrainedLongLabel: Story = {
  render: () => (
    <div
      className={constrainedVerticalTabsClass}
      aria-label="Constrained vertical tabs example"
      dir="rtl"
    >
      <Tabs defaultValue="overview" orientation="vertical" dir="rtl">
        <TabList aria-label="Constrained vertical tabs">
          <TabTrigger value="overview">
            Overviewwithanunusuallylongunbrokenlocalizedlabel
          </TabTrigger>
          <TabTrigger value="activity">Activity</TabTrigger>
          <TabTrigger value="settings">Settings</TabTrigger>
        </TabList>
        <TabContent value="overview">Overview content</TabContent>
        <TabContent value="activity">Activity content</TabContent>
        <TabContent value="settings">Settings content</TabContent>
      </Tabs>
    </div>
  ),
};

// Internal story - excluded from autodocs and dev mode.
// Panda CSS v1.8 does not emit slot-recipe compound variants from staticCss,
// so keep the two defined vertical combinations as literal JSX.
export const _CSSCoverage: Story = {
  tags: ['!autodocs', '!dev'],
  render: () => (
    <div className={variantsStackClass}>
      <Tabs
        className={verticalLineCoverage.root}
        defaultValue="line"
        orientation="vertical"
        appearance="ghost"
      >
        <TabList>
          <TabTrigger value="line">Line</TabTrigger>
        </TabList>
        <TabContent value="line">Line content</TabContent>
      </Tabs>
      <Tabs
        className={verticalEnclosedCoverage.root}
        defaultValue="enclosed"
        orientation="vertical"
        appearance="outline"
      >
        <TabList>
          <TabTrigger value="enclosed">Enclosed</TabTrigger>
        </TabList>
        <TabContent value="enclosed">Enclosed content</TabContent>
      </Tabs>
    </div>
  ),
};

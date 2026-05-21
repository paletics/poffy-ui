import type { Meta, StoryObj } from '@storybook/react';
import { css } from '@/styled-system/css';
import { Grid } from './Grid';
import { Box } from '../Box/Box';

/**
 * A CSS Grid layout primitive tuned for Silver and Golden ratio asymmetric column layouts, with support for equal-column and custom responsive grids.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: gridStyle, splitCssProps), Radix Slot
 */
const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    gap: { control: 'text' },
    columns: { control: 'number' },
    ratio: {
      control: 'select',
      options: ['silver-left', 'silver-right', 'golden-left', 'golden-right', 'equal-2', 'equal-3'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

const contentsListClass = css({
  display: 'contents',
  listStyle: 'none',
  p: '0',
  m: '0',
});

type ItemColor = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal' | 'cyan' | 'gray';

const itemClass = css({
  h: '20',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
});

const itemColorClass = {
  blue: css({ bg: 'blue.200' }),
  green: css({ bg: 'emerald.200' }),
  orange: css({ bg: 'orange.200' }),
  purple: css({ bg: 'violet.200' }),
  red: css({ bg: 'rose.200' }),
  teal: css({ bg: 'teal.200' }),
  cyan: css({ bg: 'cyan.200' }),
  gray: css({ bg: 'slate.200' }),
} satisfies Record<ItemColor, string>;

const renderItem = (children: React.ReactNode, color: ItemColor = 'blue') => (
  <Box className={`${itemClass} ${itemColorClass[color]}`}>{children}</Box>
);

export const Default: Story = {
  args: {
    gap: 'md',
    columns: 3,
  },
  render: (args) => (
    <Grid {...args}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Box key={i} className={`${itemClass} ${itemColorClass.blue}`}>
          {i}
        </Box>
      ))}
    </Grid>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const SilverRatioLeft: Story = {
  args: {
    ratio: 'silver-left',
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      {renderItem('1.414 / 2.414 (58.6%)', 'blue')}
      {renderItem('1 / 2.414 (41.4%)', 'green')}
    </Grid>
  ),
};

export const SilverRatioRight: Story = {
  args: {
    ratio: 'silver-right',
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      {renderItem('1 / 2.414 (41.4%)', 'green')}
      {renderItem('1.414 / 2.414 (58.6%)', 'blue')}
    </Grid>
  ),
};

export const GoldenRatioLeft: Story = {
  args: {
    ratio: 'golden-left',
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      {renderItem('1.618 / 2.618 (61.8%)', 'orange')}
      {renderItem('1 / 2.618 (38.2%)', 'purple')}
    </Grid>
  ),
};

export const GoldenRatioRight: Story = {
  args: {
    ratio: 'golden-right',
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      {renderItem('1 / 2.618 (38.2%)', 'purple')}
      {renderItem('1.618 / 2.618 (61.8%)', 'orange')}
    </Grid>
  ),
};

export const EqualColumns2: Story = {
  args: {
    ratio: 'equal-2',
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      {renderItem('Column 1', 'red')}
      {renderItem('Column 2', 'red')}
    </Grid>
  ),
};

export const EqualColumns3: Story = {
  args: {
    ratio: 'equal-3',
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      {renderItem('Column 1', 'teal')}
      {renderItem('Column 2', 'teal')}
      {renderItem('Column 3', 'teal')}
    </Grid>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Grid
      gap="md"
      gridTemplateColumns={{
        base: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(4, 1fr)',
      }}
    >
      {renderItem('1 (Base: 1col)')}
      {renderItem('2 (MD: 2col)')}
      {renderItem('3 (LG: 4col)')}
      {renderItem('4')}
    </Grid>
  ),
};

export const SemanticList: Story = {
  args: {
    asChild: true,
    gap: 'md',
    columns: 2,
  },
  render: (args) => (
    <Grid {...args}>
      <ul className={contentsListClass}>
        <li>{renderItem('List Item 1', 'cyan')}</li>
        <li>{renderItem('List Item 2', 'cyan')}</li>
        <li>{renderItem('List Item 3', 'cyan')}</li>
        <li>{renderItem('List Item 4', 'cyan')}</li>
      </ul>
    </Grid>
  ),
};

export const Nested: Story = {
  render: () => (
    <Grid columns={2} gap="lg">
      {renderItem('Left Column', 'gray')}
      <Grid columns={2} gap="xs">
        {renderItem('Nested 1', 'teal')}
        {renderItem('Nested 2', 'teal')}
        {renderItem('Nested 3', 'teal')}
        {renderItem('Nested 4', 'teal')}
      </Grid>
    </Grid>
  ),
};

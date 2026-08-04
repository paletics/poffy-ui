import type { Meta, StoryObj } from '@storybook/react';
import { css } from '@/styled-system/css';
import { Center } from '@/components/layout/Center';
import { Flex } from '@/components/layout/Flex';
import { SimpleGrid } from '@/components/layout/SimpleGrid';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';
import { Grid } from './Grid';
import { Box } from '../Box/Box';


const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    gap: { control: 'text' },
    columns: { control: 'number' },
    ratio: {
      control: 'select',
      options: [
        'silver-left',
        'silver-right',
        'silver-start',
        'silver-end',
        'golden-left',
        'golden-right',
        'golden-start',
        'golden-end',
        'equal-2',
        'equal-3',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

const contentsListClass = css({
  display: 'contents',
  listStyle: 'none',
  p: 'none',
  m: 'none',
});

type ItemColor = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal' | 'cyan' | 'gray';

const itemClass = css({
  h: '[5rem]',
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

const directionContractGridClass = css({ width: '[20rem]', maxWidth: '100%' });

const renderDirectionContractGrid = (
  label: string,
  ratio: 'silver-left' | 'silver-right' | 'silver-start' | 'silver-end' | 'golden-right',
) => (
  <Grid aria-label={label} className={directionContractGridClass} gap="xs" ratio={ratio}>
    <Box className={`${itemClass} ${itemColorClass.blue}`}>First</Box>
    <Box className={`${itemClass} ${itemColorClass.green}`}>Second</Box>
  </Grid>
);

export const DirectionContracts: Story = {
  render: () => (
    <Stack gap="lg">
      <Stack asChild gap="sm">
        <section dir="ltr" aria-label="LTR ratio examples">
          {renderDirectionContractGrid('Silver physical left LTR', 'silver-left')}
          {renderDirectionContractGrid('Silver physical right LTR', 'silver-right')}
          {renderDirectionContractGrid('Silver logical start LTR', 'silver-start')}
          {renderDirectionContractGrid('Silver logical end LTR', 'silver-end')}
        </section>
      </Stack>
      <Stack asChild gap="sm">
        <section dir="rtl" aria-label="Inherited RTL ratio examples">
          {renderDirectionContractGrid('Silver physical left inherited RTL', 'silver-left')}
          {renderDirectionContractGrid('Silver physical right inherited RTL', 'silver-right')}
          {renderDirectionContractGrid('Silver logical start inherited RTL', 'silver-start')}
          {renderDirectionContractGrid('Silver logical end inherited RTL', 'silver-end')}
          {renderDirectionContractGrid('Golden physical right inherited RTL', 'golden-right')}
        </section>
      </Stack>
      <Grid asChild gap="xs" ratio="silver-left">
        <section
          aria-label="Silver physical left asChild RTL"
          className={directionContractGridClass}
          dir="rtl"
        >
          <Box className={`${itemClass} ${itemColorClass.blue}`}>First</Box>
          <Box className={`${itemClass} ${itemColorClass.green}`}>Second</Box>
        </section>
      </Grid>
    </Stack>
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

export const ConstrainedAutoFit: Story = {
  render: () => (
    <Box w="[160px]" borderWidth="thin" borderStyle="dashed" borderColor="layout.divider">
      <Grid minChildWidth="200px" aria-label="Constrained auto-fit grid">
        {renderItem('Fits parent', 'blue')}
      </Grid>
    </Box>
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

const nestedLongToken = `https://example.com/${'nested-responsive-segment-'.repeat(10)}`;

export const NestedConstrainedLongToken: Story = {
  render: () => (
    <Stack gap="md" width="[240px]" aria-label="Constrained nested layouts">
      <Flex>
        <Grid ratio="silver-left" gap="xs" aria-label="Constrained ratio grid">
          <Text>{nestedLongToken}</Text>
          <Text>Secondary column</Text>
        </Grid>
      </Flex>
      <Center width="[160px]">
        <SimpleGrid columns={2} gap="xs" width="100%" aria-label="Constrained simple grid">
          <Text>{nestedLongToken}</Text>
          <Text>Second</Text>
        </SimpleGrid>
      </Center>
    </Stack>
  ),
};

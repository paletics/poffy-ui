import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Box } from '@/components/layout/Box';
import { Stack } from '@/components/layout/Stack';
import { css } from '@/styled-system/css';


const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
    },
    align: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
      ],
    },
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'none'],
    },
    wrap: {
      control: 'boolean',
    },
    motion: {
      control: 'select',
      options: ['none', 'pop'],
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

const boxColorClass = {
  blue: css({ bg: 'variants.primary.main' }),
  purple: css({ bg: 'variants.secondary.main' }),
  red: css({ bg: 'variants.danger.main' }),
  green: css({ bg: 'variants.success.main' }),
} as const;

type BoxColor = keyof typeof boxColorClass;

const boxItemClass = css({
  width: '[100px]',
  height: '[100px]',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: 'md',
});

const renderBoxItem = (children: ReactNode, color: BoxColor = 'blue') => (
  <Box className={`${boxItemClass} ${boxColorClass[color]}`}>{children}</Box>
);

type AlignmentHeight = '[20px]' | '[32px]';

const alignmentBaseClass = css({ width: '[80px]' });
const alignmentHeightClass = {
  '[20px]': css({ height: '[20px]' }),
  '[32px]': css({ height: '[32px]' }),
} satisfies Record<AlignmentHeight, string>;

const renderAlignmentItem = (children: ReactNode, height: AlignmentHeight, color: BoxColor) => (
  <Box className={`${alignmentBaseClass} ${alignmentHeightClass[height]} ${boxColorClass[color]}`}>
    {children}
  </Box>
);

export const Default: Story = {
  args: {
    direction: 'column',
    gap: 'md',
    children: (
      <>
        {renderBoxItem('1')}
        {renderBoxItem('2')}
        {renderBoxItem('3')}
      </>
    ),
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Horizontal: Story = {
  args: {
    direction: 'row',
    gap: 'md',
    children: (
      <>
        {renderBoxItem('1')}
        {renderBoxItem('2')}
        {renderBoxItem('3')}
      </>
    ),
  },
};

export const Pop: Story = {
  args: {
    direction: 'row',
    gap: 'md',
    motion: 'pop',
    children: (
      <>
        {renderBoxItem('1')}
        {renderBoxItem('2')}
        {renderBoxItem('3')}
      </>
    ),
  },
};

export const Alignment: Story = {
  render: () => (
    <Stack gap="lg">
      <Stack
        direction="row"
        align="flex-start"
        borderWidth="thin"
        borderStyle="dashed"
        borderColor="layout.divider"
        p="md"
      >
        {renderAlignmentItem('Start', '[20px]', 'blue')}
        {renderAlignmentItem('Start', '[32px]', 'blue')}
      </Stack>
      <Stack
        direction="row"
        align="center"
        borderWidth="thin"
        borderStyle="dashed"
        borderColor="layout.divider"
        p="md"
      >
        {renderAlignmentItem('Center', '[20px]', 'red')}
        {renderAlignmentItem('Center', '[32px]', 'red')}
      </Stack>
      <Stack
        direction="row"
        align="flex-end"
        borderWidth="thin"
        borderStyle="dashed"
        borderColor="layout.divider"
        p="md"
      >
        {renderAlignmentItem('End', '[20px]', 'green')}
        {renderAlignmentItem('End', '[32px]', 'green')}
      </Stack>
    </Stack>
  ),
};

export const Justification: Story = {
  render: () => (
    <Stack gap="lg" width="[min(600px,calc(100vw - 3rem))]">
      <Stack
        direction="row"
        justify="flex-start"
        borderWidth="thin"
        borderStyle="dashed"
        borderColor="layout.divider"
        p="xs"
      >
        {renderBoxItem('Start')}
        {renderBoxItem('Start')}
      </Stack>
      <Stack
        direction="row"
        justify="center"
        borderWidth="thin"
        borderStyle="dashed"
        borderColor="layout.divider"
        p="xs"
      >
        {renderBoxItem('Center')}
        {renderBoxItem('Center')}
      </Stack>
      <Stack
        direction="row"
        justify="space-between"
        borderWidth="thin"
        borderStyle="dashed"
        borderColor="layout.divider"
        p="xs"
      >
        {renderBoxItem('Between')}
        {renderBoxItem('Between')}
      </Stack>
    </Stack>
  ),
};

export const Nested: Story = {
  render: () => (
    <Stack direction="row" gap="xl" align="flex-start">
      <Stack gap="sm">
        {renderBoxItem('A1', 'purple')}
        {renderBoxItem('A2', 'purple')}
      </Stack>
      <Stack gap="sm">
        {renderBoxItem('B1', 'blue')}
        {renderBoxItem('B2', 'blue')}
        {renderBoxItem('B3', 'blue')}
      </Stack>
    </Stack>
  ),
};

export const Polymorphic: Story = {
  render: () => (
    <Stack asChild>
      <section>
        <Box asChild p="md" bg="layout.surface">
          <header>Header</header>
        </Box>
        <Box asChild p="md" bg="brand.surface">
          <main>Content</main>
        </Box>
        <Box asChild p="md" bg="layout.surface">
          <footer>Footer</footer>
        </Box>
      </section>
    </Stack>
  ),
};

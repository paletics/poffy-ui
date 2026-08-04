import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Box } from '@/components/layout/Box';
import { SimpleGrid } from '@/components/layout/SimpleGrid';
import { Stack } from '@/components/layout/Stack';


const meta: Meta<typeof SimpleGrid> = {
  title: 'Layout/SimpleGrid',
  component: SimpleGrid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'select',
      options: [1, 2, 3, 4, 6, 12],
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    asChild: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SimpleGrid>;

const renderItem = (children: ReactNode) => (
  <Box
    p="md"
    bg="layout.background"
    borderWidth="thin"
    borderStyle="solid"
    borderColor="layout.divider"
    fontWeight="bold"
    textAlign="center"
  >
    {children}
  </Box>
);

const items = (
  <>
    {renderItem('Item 1')}
    {renderItem('Item 2')}
    {renderItem('Item 3')}
    {renderItem('Item 4')}
    {renderItem('Item 5')}
    {renderItem('Item 6')}
  </>
);

export const Default: Story = {
  args: {
    columns: 3,
    gap: 'md',
    children: items,
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const GapVariations: Story = {
  render: () => (
    <Stack gap="xl" width="full">
      <Stack gap="xs">
        <Box fontWeight="bold">Gap: xs</Box>
        <SimpleGrid columns={4} gap="xs">
          {renderItem('XS')}
          {renderItem('XS')}
          {renderItem('XS')}
          {renderItem('XS')}
        </SimpleGrid>
      </Stack>
      <Stack gap="xs">
        <Box fontWeight="bold">Gap: md</Box>
        <SimpleGrid columns={4} gap="md">
          {renderItem('MD')}
          {renderItem('MD')}
          {renderItem('MD')}
          {renderItem('MD')}
        </SimpleGrid>
      </Stack>
      <Stack gap="xs">
        <Box fontWeight="bold">Gap: xl</Box>
        <SimpleGrid columns={4} gap="xl">
          {renderItem('XL')}
          {renderItem('XL')}
          {renderItem('XL')}
          {renderItem('XL')}
        </SimpleGrid>
      </Stack>
    </Stack>
  ),
};

export const Responsive: Story = {
  args: {
    minChildWidth: '140px',
    gap: 'md',
    children: items,
  },
};

export const MinChildWidth: Story = {
  args: {
    minChildWidth: '200px',
    gap: 'md',
    children: items,
  },
  render: (args) => (
    <Box
      w="[min(600px,calc(100vw - 3rem))]"
      borderWidth="thin"
      borderStyle="dashed"
      borderColor="layout.divider"
      p="md"
    >
      <SimpleGrid {...args} aria-label="Constrained responsive grid" />
    </Box>
  ),
};

export const SemanticList: Story = {
  args: {
    asChild: true,
    columns: 3,
    gap: 'md',
  },
  render: (args) => (
    <SimpleGrid {...args}>
      <Box asChild display="contents" listStyle="none" p="none" m="none">
        <ul>
          <li>{renderItem('List Item 1')}</li>
          <li>{renderItem('List Item 2')}</li>
          <li>{renderItem('List Item 3')}</li>
          <li>{renderItem('List Item 4')}</li>
          <li>{renderItem('List Item 5')}</li>
        </ul>
      </Box>
    </SimpleGrid>
  ),
};

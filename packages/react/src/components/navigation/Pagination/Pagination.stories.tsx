import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';
import type { PaginationProps } from './Pagination.types';

/**
 * Storybook documentation and visual review surface for Pagination.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline', 'ghost'],
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
type Story = StoryObj<typeof Pagination>;

const PaginationWithState = (args: PaginationProps) => {
  const [page, setPage] = useState(args.page ?? 1);
  return <Pagination {...args} page={page} onChange={setPage} />;
};

export const Default: Story = {
  args: {
    count: 10,
    page: 1,
  },
  render: (args) => <PaginationWithState {...args} />,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const ManyPages: Story = {
  args: {
    count: 20,
    page: 10,
  },
  render: (args) => <PaginationWithState {...args} />,
};

export const Small: Story = {
  args: {
    count: 5,
    page: 1,
    size: 'sm',
  },
  render: (args) => <PaginationWithState {...args} />,
};

export const PopIndicator: Story = {
  args: {
    count: 10,
    page: 4,
    indicatorAnimation: 'pop',
  },
  render: (args) => <PaginationWithState {...args} />,
};

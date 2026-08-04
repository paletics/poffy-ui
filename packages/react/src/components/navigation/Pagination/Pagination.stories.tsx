import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@/components/layout';
import { useState } from 'react';
import { Pagination } from './Pagination';
import type { PaginationProps } from './Pagination.types';


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
  const [page, setPage] = useState(args.page);
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

export const LocalizedRtl: Story = {
  render: () => (
    <div dir="rtl">
      <PaginationWithState count={20} page={10} locale="ja-JP" size="sm" />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const ConstrainedLongLabelsRtl: Story = {
  render: () => (
    <Box width="[120px]" maxWidth="100%" aria-label="Constrained pagination container" dir="rtl">
      <PaginationWithState
        count={3}
        page={2}
        locale="en-US"
        labels={{
          previous: 'Previous-page-with-an-unbroken-localized-label',
          next: 'Next-page-with-an-unbroken-localized-label',
        }}
        formatPage={(page) => `Page-${page}-with-an-unbroken-formatted-label`}
      />
    </Box>
  ),
  parameters: {
    layout: 'centered',
  },
};

export const FullWidthNarrow: Story = {
  render: () => (
    <Box width="100%" data-testid="pagination-full-width-parent">
      <PaginationWithState count={20} page={10} size="sm" />
    </Box>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const CenteredWide: Story = {
  render: () => (
    <Box width="100%" data-testid="pagination-centered-parent">
      <PaginationWithState count={5} page={3} />
    </Box>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { Reference } from './Reference';
import { ReferenceList } from './ReferenceList';
import { Box } from '@/components/layout/Box';

const meta = {
  title: 'Display/Reference',
  component: Reference,
  parameters: {
    docs: {
      description: {
        component:
          'Compact source and reference links for documents, search results, reports, citations, and audit trails.',
      },
    },
  },
  argTypes: {
    appearance: { control: 'select', options: ['plain', 'soft'] },
    size: { control: 'select', options: ['sm', 'md'] },
    overflow: { control: 'select', options: ['truncate', 'wrap'] },
  },
  args: {
    index: 1,
    label: 'Design docs',
    href: '/docs/design',
    appearance: 'plain',
    size: 'md',
  },
} satisfies Meta<typeof Reference>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Basic: Story = {};

export const WithDescription: Story = {
  args: {
    appearance: 'soft',
    description: 'Source excerpt',
  },
};

export const List: Story = {
  render: () => (
    <ReferenceList
      references={[
        { label: 'Design docs', href: '/docs/design' },
        { label: 'API reference', href: '/docs/api' },
        { label: 'Release notes', href: '/docs/releases', description: '2026 update' },
      ]}
    />
  ),
};

export const ConstrainedLongContent: Story = {
  render: () => (
    <Box width="[180px]">
      <Reference
        index={12}
        label="A deliberately long reference label that must truncate safely"
        description="Supporting detail that also remains within the available width"
        href="/docs/long-reference"
        appearance="soft"
      />
    </Box>
  ),
};

export const WrappedLongContent: Story = {
  render: () => (
    <Box width="[180px]">
      <Reference
        index={12}
        label="A deliberately long reference label that wraps in constrained layouts"
        description="Supporting detail also wraps without requiring a tooltip"
        href="/docs/wrapped-reference"
        appearance="soft"
        overflow="wrap"
      />
    </Box>
  ),
};

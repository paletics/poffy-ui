import type { Meta, StoryObj } from '@storybook/react';
import { Reference } from './Reference';
import { ReferenceList } from './ReferenceList';

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

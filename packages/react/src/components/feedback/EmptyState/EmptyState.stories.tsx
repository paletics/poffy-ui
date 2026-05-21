import { Button } from '@/components/inputs/Button';
import { Stack } from '@/components/layout';
import { CrossIcon, InfoIcon } from '@/components/media/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { EmptyStateActions } from './EmptyStateActions';
import { EmptyStateDescription } from './EmptyStateDescription';
import { EmptyStateIcon } from './EmptyStateIcon';
import { EmptyStateTitle } from './EmptyStateTitle';

/**
 * Placeholder layout composed of an icon, title, description, and optional actions shown when a content region has no data.
 * Use to guide users toward a meaningful next step when a list or feed is empty.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (emptyState recipe), Radix Slot, EmptyStateContext
 */
const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    appearance: { control: 'select', options: ['soft', 'outline'] },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'info', 'success', 'warning', 'danger'],
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <EmptyState>
      <EmptyStateIcon>
        <CrossIcon />
      </EmptyStateIcon>
      <EmptyStateTitle>No results found</EmptyStateTitle>
      <EmptyStateDescription>
        We couldn&apos;t find any results matching your search.
      </EmptyStateDescription>
    </EmptyState>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithActions: Story = {
  render: () => (
    <EmptyState>
      <EmptyStateIcon>
        <InfoIcon />
      </EmptyStateIcon>
      <EmptyStateTitle>No projects yet</EmptyStateTitle>
      <EmptyStateDescription>Get started by creating a new project.</EmptyStateDescription>
      <EmptyStateActions>
        <Button appearance="outline">Create Project</Button>
      </EmptyStateActions>
    </EmptyState>
  ),
};

export const NoIcon: Story = {
  render: () => (
    <EmptyState>
      <EmptyStateTitle>Nothing to see here</EmptyStateTitle>
      <EmptyStateDescription>This section is currently empty.</EmptyStateDescription>
    </EmptyState>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack gap="xl">
      <EmptyState size="sm">
        <EmptyStateIcon>
          <InfoIcon />
        </EmptyStateIcon>
        <EmptyStateTitle>Small</EmptyStateTitle>
        <EmptyStateDescription>Compact empty state.</EmptyStateDescription>
      </EmptyState>
      <EmptyState size="md">
        <EmptyStateIcon>
          <InfoIcon />
        </EmptyStateIcon>
        <EmptyStateTitle>Medium</EmptyStateTitle>
        <EmptyStateDescription>Default empty state.</EmptyStateDescription>
      </EmptyState>
      <EmptyState size="lg">
        <EmptyStateIcon>
          <InfoIcon />
        </EmptyStateIcon>
        <EmptyStateTitle>Large</EmptyStateTitle>
        <EmptyStateDescription>Large empty state.</EmptyStateDescription>
      </EmptyState>
    </Stack>
  ),
};

export const Appearances: Story = {
  render: () => (
    <Stack gap="xl">
      <EmptyState appearance="outline">
        <EmptyStateTitle>Outline</EmptyStateTitle>
        <EmptyStateDescription>
          Outline treatment for low-emphasis empty states.
        </EmptyStateDescription>
      </EmptyState>
      <EmptyState appearance="soft">
        <EmptyStateTitle>Soft</EmptyStateTitle>
        <EmptyStateDescription>
          Soft surface treatment for default contextual messaging.
        </EmptyStateDescription>
      </EmptyState>
    </Stack>
  ),
};

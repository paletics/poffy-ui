import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../Badge';
import { Box, Stack } from '@/components/layout';
import { KeyValueViewer } from './KeyValueViewer';
import { css } from '@/styled-system/css';

const meta: Meta<typeof KeyValueViewer> = {
  title: 'Display/KeyValueViewer',
  component: KeyValueViewer,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    columns: {
      control: 'select',
      options: [1, 2],
    },
  },
};

export default meta;
type Story = StoryObj<typeof KeyValueViewer>;

const shrinkToFitHostClass = css({
  display: 'inline-flex',
  maxWidth: '100%',
});

export const Default: Story = {
  args: {
    caption: 'Deployment',
    items: [
      { id: 'owner', label: 'Owner', value: 'Platform' },
      { id: 'environment', label: 'Environment', value: 'Production' },
      { id: 'status', label: 'Status', value: <Badge content="Active" intent="success" /> },
      { id: 'region', label: 'Region', value: '' },
    ],
  },
};

export const TwoColumns: Story = {
  args: {
    ...Default.args,
    columns: 2,
  },
};

export const ShrinkToFit: Story = {
  render: () => (
    <div className={shrinkToFitHostClass} data-testid="key-value-shrink-host">
      <KeyValueViewer
        aria-label="Shrink-to-fit metadata"
        caption="Deployment"
        items={[
          { id: 'owner', label: 'Owner', value: 'Platform' },
          { id: 'status', label: 'Status', value: <Badge content="Active" intent="success" /> },
        ]}
      />
    </div>
  ),
};

export const ConstrainedWidths: Story = {
  render: () => (
    <Stack gap="lg" width="[calc(100vw - 32px)]" maxWidth="[700px]">
      <Box width="[700px]" maxWidth="100%" aria-label="Wide key value container">
        <KeyValueViewer {...Default.args} columns={2} />
      </Box>
      <Box width="[560px]" maxWidth="100%" aria-label="Medium key value container">
        <KeyValueViewer {...Default.args} columns={2} />
      </Box>
      <Box width="[200px]" maxWidth="100%" aria-label="Narrow key value container">
        <KeyValueViewer
          caption="Localized metadata"
          columns={2}
          items={[
            {
              id: 'identifier',
              label: 'Deploymentidentifierwithoutbreakopportunities',
              value: 'valuewithoutbreakopportunitiesvaluewithoutbreakopportunities',
            },
            { id: 'region', label: 'Region', value: 'Asia Pacific' },
          ]}
        />
      </Box>
    </Stack>
  ),
};

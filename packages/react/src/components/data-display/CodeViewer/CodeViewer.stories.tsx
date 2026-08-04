import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@/components/layout';
import { CodeViewer } from './CodeViewer';

const meta: Meta<typeof CodeViewer> = {
  title: 'Display/CodeViewer',
  component: CodeViewer,
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: 'select',
      options: ['javascript', 'typescript', 'jsx', 'tsx', 'css', 'html', 'json', 'markdown', 'bash'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    wrap: {
      control: 'boolean',
    },
    showLineNumbers: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeViewer>;

const source = `type Status = 'idle' | 'ready';

export function readStatus(value: Status) {
  return value === 'ready';
}`;

export const Default: Story = {
  args: {
    caption: 'status.ts',
    children: source,
    language: 'typescript',
    showLineNumbers: true,
  },
};

export const Wrapping: Story = {
  render: () => (
    <Stack gap="md">
      <CodeViewer caption="No wrap" language="bash">
        {'pnpm --filter @poffy-ui/react run typecheck && pnpm --filter @poffy-ui/react run build'}
      </CodeViewer>
      <CodeViewer caption="Wrap" language="bash" wrap>
        {'pnpm --filter @poffy-ui/react run typecheck && pnpm --filter @poffy-ui/react run build'}
      </CodeViewer>
    </Stack>
  ),
};

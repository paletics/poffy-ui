import type { Meta, StoryObj } from '@storybook/react';
import { DiffViewer } from './DiffViewer';

const hunks = [
  {
    header: '@@ -1,4 +1,4 @@',
    lines: [
      { kind: 'unchanged' as const, oldLineNumber: 1, newLineNumber: 1, content: 'name: app' },
      { kind: 'removed' as const, oldLineNumber: 2, content: 'enabled: false' },
      { kind: 'added' as const, newLineNumber: 2, content: 'enabled: true' },
      { kind: 'modified' as const, oldLineNumber: 3, newLineNumber: 3, content: 'mode: review' },
    ],
  },
];

const meta = {
  title: 'Display/DiffViewer',
  component: DiffViewer,
  parameters: {
    docs: {
      description: {
        component: 'Display-only diff primitive for code, configuration, prose, and audit changes.',
      },
    },
  },
  argTypes: {
    mode: { control: 'select', options: ['unified', 'split'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: {
    caption: 'Configuration change',
    hunks,
    mode: 'unified',
    size: 'md',
  },
} satisfies Meta<typeof DiffViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Unified: Story = {};

export const Split: Story = {
  args: {
    mode: 'split',
  },
};

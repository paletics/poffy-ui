import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@/components/layout/Box';
import { DiffViewer } from './DiffViewer';

const hunks = [
  {
    header: '@@ -1,4 +1,4 @@',
    lines: [
      { kind: 'unchanged' as const, oldLineNumber: 1, newLineNumber: 1, content: 'name: app' },
      { kind: 'removed' as const, oldLineNumber: 2, content: 'enabled: false' },
      { kind: 'added' as const, newLineNumber: 2, content: 'enabled: true' },
      {
        kind: 'modified' as const,
        oldLineNumber: 3,
        newLineNumber: 3,
        content: 'mode: review',
        oldContent: 'mode: draft',
        newContent: 'mode: review',
      },
    ],
  },
];

const constrainedCaption = `release/${'unbroken-diff-caption-segment-'.repeat(12)}`;

const meta = {
  title: 'Display/DiffViewer',
  component: DiffViewer,
  decorators: [
    (Story) => (
      <Box w="[calc(100vw - 3rem)]" maxWidth="100%">
        <Story />
      </Box>
    ),
  ],
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

export const ConstrainedLongCaption: Story = {
  render: () => (
    <Box width="[160px]" maxWidth="100%" data-testid="constrained-caption-diff">
      <DiffViewer
        aria-label="Constrained caption diff"
        caption={constrainedCaption}
        hunks={hunks}
      />
    </Box>
  ),
};

export const CaptionDisclosure: Story = {
  render: () => (
    <Box width="[200px]" maxWidth="100%" data-testid="caption-disclosure-diff">
      <DiffViewer
        caption="Configuration change"
        captionDisclosure={{
          summary: 'Show comparison scope',
          content: (
            <>
              Generated files are excluded from this comparison.
              {'release/unbroken-supporting-caption-segment-'.repeat(4)}
            </>
          ),
        }}
        hunks={hunks}
      />
    </Box>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Keep the identifying caption visible and defer only optional supporting context through the explicit captionDisclosure API.',
      },
    },
  },
};

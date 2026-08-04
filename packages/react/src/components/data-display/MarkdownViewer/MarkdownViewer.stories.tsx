import type { Meta, StoryObj } from '@storybook/react';
import { css } from '@/styled-system/css';
import { MarkdownViewer } from './MarkdownViewer';

const constrainedMarkdownClass = css({ width: '[240px]', maxWidth: '100%' });

const meta: Meta<typeof MarkdownViewer> = {
  title: 'Display/MarkdownViewer',
  component: MarkdownViewer,
  tags: ['autodocs'],
  argTypes: {
    baseHeadingLevel: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownViewer>;

const source = `## Release notes

Use \`pnpm test\` before publishing.

- Run unit tests
- Run typecheck
- Review package exports

> Keep Markdown support intentionally limited in core.

\`\`\`json
{"status":"ok"}
\`\`\`

[Documentation](/docs) and [unsafe link](javascript:alert(1)).
`;

export const Default: Story = {
  args: {
    source,
    baseHeadingLevel: 2,
  },
};

export const ConstrainedRtlLongContent: Story = {
  args: {
    source: `## ملاحظات الإصدار

release-configuration-with-an-unusually-long-unbroken-identifier

- https://example.com/releases/2026/07/rtl-long-destination

> اقتباس-طويل-جداً-بدون-فواصل-يجب-أن-يبقى-داخل-الحاوية

\`\`\`text
this-code-line-intentionally-keeps-the-code-viewer-wrapping-contract
\`\`\``,
    baseHeadingLevel: 2,
    dir: 'rtl',
    className: constrainedMarkdownClass,
    'aria-label': 'مستند ماركداون ضيق',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Long prose wraps locally and the blockquote border follows logical start in a narrow RTL container.',
      },
    },
  },
};

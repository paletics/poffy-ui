import type { Meta, StoryObj } from '@storybook/react';
import { JsonViewer } from './JsonViewer';

const meta: Meta<typeof JsonViewer> = {
  title: 'Display/JsonViewer',
  component: JsonViewer,
  tags: ['autodocs'],
  argTypes: {
    indent: {
      control: 'number',
    },
    showLineNumbers: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof JsonViewer>;

export const Default: Story = {
  args: {
    caption: 'Response',
    showLineNumbers: true,
    value: {
      status: 'ok',
      requestId: 'req_123',
      data: {
        count: 2,
        items: ['alpha', 'beta'],
      },
    },
  },
};

export const RawString: Story = {
  args: {
    caption: 'Raw JSON',
    value: '{"status":"ok","count":2}',
  },
};

export const StringValue: Story = {
  args: {
    caption: 'String value',
    stringMode: 'value',
    value: 'A value rendered as a JSON string',
  },
};

export const OversizedValue: Story = {
  args: {
    caption: 'Limited response',
    maxSerializedCharacters: 12,
    oversizedValueText: 'Response omitted because it exceeds the display limit.',
    value: { status: 'This response is intentionally longer than the configured limit.' },
  },
};

export const LongLine: Story = {
  args: {
    caption: 'Long JSON value',
    wrap: true,
    value: { token: 'unbroken-json-value-that-must-wrap-within-a-narrow-mobile-viewport' },
  },
};

export const LongLineNoWrap: Story = {
  args: {
    caption: 'Long JSON value without wrapping',
    value: { token: 'unbroken-json-value-that-scrolls-inside-the-code-viewer-without-expanding-the-page' },
  },
};

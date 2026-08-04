import { CopyButton } from '@/components/inputs/CopyButton';
import { Flex } from '@/components/layout';
import { Code } from '@/components/typography';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta<typeof CopyButton> = {
  title: 'Inputs/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Text copied to the clipboard.',
    },
    timeout: {
      control: 'number',
      description: 'Duration in milliseconds before returning to the copy state.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: {
    value: 'npm install @poffy-ui/react',
  },
  render: (args) => (
    <Flex display="inline-flex" align="center" gap="sm">
      <Code px="md" py="sm" borderWidth="thin" borderColor="layout.divider" bg="layout.surface">
        {args.value}
      </Code>
      <CopyButton {...args} />
    </Flex>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithCallback: Story = {
  render: function WithCallbackStory() {
    const [count, setCount] = useState(0);

    return (
      <Flex display="inline-flex" align="center" gap="sm">
        <Code px="md" py="sm" borderWidth="thin" borderColor="layout.divider" bg="layout.surface">
          {`copied ${count} times`}
        </Code>
        <CopyButton value="callback text" onCopy={() => setCount((value) => value + 1)} />
      </Flex>
    );
  },
};

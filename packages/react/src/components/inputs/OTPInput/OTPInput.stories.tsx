import type { Meta, StoryObj } from '@storybook/react';
import { OTPInput } from '@/components/inputs/OTPInput';
import { Box, Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';


const meta: Meta<typeof OTPInput> = {
  title: 'Inputs/OTPInput',
  component: OTPInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Multi-segment one-time password input. Automatically advances focus on entry, supports Backspace navigation, and handles paste of full codes. Segment count is controlled by the `length` prop.',
      },
    },
  },
  argTypes: {
    appearance: { control: 'select', options: ['outline', 'soft'] },
  },
};

export default meta;
type Story = StoryObj<typeof OTPInput>;

export const Default: Story = {
  args: {
    length: 6,
  },
  parameters: {
    docs: {
      description: {
        story:
          '6-segment OTP input. Type a digit in each segment; focus advances automatically. Backspace clears and moves focus backward.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('textbox');
    await expect(inputs).toHaveLength(6);
    await userEvent.type(inputs[0]!, '1');
    await userEvent.type(inputs[1]!, '2');
    await userEvent.type(inputs[2]!, '3');
    await expect(inputs[0]).toHaveValue('1');
    await expect(inputs[1]).toHaveValue('2');
    await expect(inputs[2]).toHaveValue('3');
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Controlled interactive demo. Displays current code below and calls `onComplete` when all 6 segments are filled.',
      },
    },
  },
  render: function InteractiveOtpInputStory() {
    const [code, setCode] = useState<string[]>([]);
    return (
      <Stack gap="sm">
        <OTPInput value={code} onChange={setCode} onComplete={() => undefined} />
        <Text>Current: {code.join('')}</Text>
      </Stack>
    );
  },
};

export const NarrowContainer: Story = {
  render: () => (
    <Box width="[200px]" aria-label="Constrained OTP container">
      <OTPInput aria-label="Constrained verification code" length={8} size="lg" />
    </Box>
  ),
};

export const NarrowRtl: Story = {
  render: () => (
    <Box width="[200px]" aria-label="Constrained RTL OTP container">
      <OTPInput
        aria-label="Constrained RTL verification code"
        dir="rtl"
        locale="ja-JP"
        length={8}
        size="lg"
      />
    </Box>
  ),
};

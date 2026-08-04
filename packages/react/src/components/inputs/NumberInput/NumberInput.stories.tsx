import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '@/components/inputs/Button';
import { NumberInput } from '@/components/inputs/NumberInput';
import { Box, Flex, Stack } from '@/components/layout';
import { Text } from '@/components/typography/Text';


const meta = {
  title: 'Inputs/NumberInput',
  component: NumberInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A specialized input field for numeric values, equipped with increment and decrement stepper buttons. Supports controlled limits (`min`, `max`) and custom `step` intervals.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    appearance: { control: 'select', options: ['outline', 'soft', 'flushed'] },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 10,
    placeholder: 'Enter a number',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default uncontrolled number input. Stepper buttons or keyboard arrows can modify the value.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton');
    const incrementBtn = canvas.getByRole('button', { name: /increment/i });
    const decrementBtn = canvas.getByRole('button', { name: /decrement/i });

    await expect(input).toHaveValue(10);

    await userEvent.click(incrementBtn);
    await expect(input).toHaveValue(11);

    await userEvent.click(decrementBtn);
    await expect(input).toHaveValue(10);
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Available sizes: `sm`, `md`, and `lg`. Typography and padding scale with Silver Ratio tokens; `sm` and `md` share the 52px accessibility floor required by two stacked 24px targets.',
      },
    },
  },
  render: () => (
    <Flex gap="md" align="center" wrap="wrap">
      <Box width="[240px]" maxWidth="100%">
        <NumberInput size="sm" defaultValue={1} />
      </Box>
      <Box width="[240px]" maxWidth="100%">
        <NumberInput size="md" defaultValue={2} />
      </Box>
      <Box width="[240px]" maxWidth="100%">
        <NumberInput size="lg" defaultValue={3} />
      </Box>
    </Flex>
  ),
};

export const Appearances: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Available appearances: `outline` and `soft`. Matches the public input surface subset used across form controls.',
      },
    },
  },
  render: () => (
    <Flex gap="md" align="center" wrap="wrap">
      <Box width="[240px]" maxWidth="100%">
        <NumberInput appearance="outline" defaultValue={0} placeholder="Outline" />
      </Box>
      <Box width="[240px]" maxWidth="100%">
        <NumberInput appearance="soft" defaultValue={0} placeholder="Soft" />
      </Box>
    </Flex>
  ),
};

export const MinMaxStep: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Constrain the input values using `min` and `max`. Use `step` to define the jump per increment/decrement (e.g., increments by 5). Limits are enforced automatically.',
      },
    },
  },
  args: {
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 20,
  },
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully controlled state using `value` and `onChange`. External events can independently update the inner state securely.',
      },
    },
  },
  render: function ControlledNumberInputStory() {
    const [value, setValue] = useState(50);
    return (
      <Stack gap="md">
        <NumberInput min={0} max={100} value={value} onChange={setValue} />
        <Text variant="caption" color="text.secondary">
          Current Value: <strong>{value}</strong>
        </Text>
        <Flex gap="xs">
          <Button size="sm" appearance="outline" onClick={() => setValue(0)}>
            Set to 0
          </Button>
          <Button size="sm" appearance="outline" onClick={() => setValue(100)}>
            Set to 100
          </Button>
        </Flex>
      </Stack>
    );
  },
};

export const ErrorState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Applies destructive styling when validation fails (`error={true}`). Applies the `aria-invalid="true"` attribute to the inner field.',
      },
    },
  },
  render: () => (
    <Flex gap="md" align="center" wrap="wrap">
      <Box width="[240px]" maxWidth="100%">
        <NumberInput error defaultValue={0} />
      </Box>
      <Box width="[240px]" maxWidth="100%">
        <NumberInput error appearance="soft" defaultValue={0} />
      </Box>
    </Flex>
  ),
};

export const DisabledAndReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`disabled` completely deactivates the input and stepper buttons. `readOnly` prevents input modifications while preserving tab focusibility.',
      },
    },
  },
  render: () => (
    <Stack gap="md" align="center">
      <NumberInput disabled defaultValue={10} min={0} max={20} />
      <NumberInput readOnly defaultValue={10} min={0} max={20} />
    </Stack>
  ),
};

export const MinimumTargetsAndRtl: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Both steppers remain at least 24px tall in LTR and RTL. Typography and padding follow size while the complete control preserves its 52px accessibility floor.',
      },
    },
  },
  render: () => (
    <Stack gap="md" width="[240px]">
      <NumberInput aria-label="LTR quantity" locale="en-US" size="sm" defaultValue={1} />
      <NumberInput aria-label="数量" locale="ja-JP" size="sm" defaultValue={1} dir="rtl" />
    </Stack>
  ),
};

export const ConstrainedWidths: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The field and both minimum-target steppers remain usable across the emergency narrow-width threshold and in 40px LTR/RTL containers.',
      },
    },
  },
  render: () => (
    <Flex gap="lg" align="start" wrap="wrap">
      <Stack gap="sm" width="[40px]">
        <NumberInput aria-label="40 pixel LTR quantity" size="sm" defaultValue={8} />
      </Stack>
      <Stack gap="sm" width="[64px]">
        <NumberInput aria-label="64 pixel LTR quantity" defaultValue={8} />
      </Stack>
      <Stack gap="sm" width="[65px]">
        <NumberInput aria-label="65 pixel LTR quantity" defaultValue={10} />
      </Stack>
      <Stack gap="sm" width="[97px]">
        <NumberInput aria-label="97 pixel LTR quantity" defaultValue={10} />
      </Stack>
      <Stack gap="sm" width="[113px]">
        <NumberInput aria-label="113 pixel LTR quantity" defaultValue={10} />
      </Stack>
      <Stack gap="sm" width="[40px]" dir="rtl">
        <NumberInput aria-label="40 pixel RTL quantity" size="sm" defaultValue={8} />
      </Stack>
      <Stack gap="sm" width="[64px]" dir="rtl">
        <NumberInput aria-label="64 pixel RTL quantity" defaultValue={8} />
      </Stack>
    </Flex>
  ),
};

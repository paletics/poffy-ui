import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/inputs/Button';
import { Box, Flex, Stack } from '@/components/layout';
import { Stepper } from './Stepper';
import { Step } from './Step';
import type { StepperProps } from './index';

/**
 * Storybook documentation and visual review surface for Stepper.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta: Meta<typeof Stepper> = {
  title: 'Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline'],
    },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const StepperDemo = (args: StepperProps) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Stepper {...args} activeStep={activeStep} onStepChange={setActiveStep}>
      <Step title="Step 1" description="Personal Info" />
      <Step title="Step 2" description="Account Details" />
      <Step title="Step 3" description="Review" />
    </Stepper>
  );
};

export const Default: Story = {
  args: {
    appearance: 'soft',
    intent: 'primary',
    linear: true,
  },
  render: (args) => <StepperDemo {...args} />,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    linear: false,
  },
  render: (args) => (
    <Box p="xl">
      <StepperDemo {...args} />
    </Box>
  ),
};

const StepperWithContentDemo = (args: StepperProps) => {
  const [activeStep, setActiveStep] = useState(0);
  return (
    <Stepper {...args} activeStep={activeStep} onStepChange={setActiveStep} orientation="vertical">
      <Step title="Contact Info" description="Add your contact details">
        <Stack gap="md">
          <Box>Step 1 Content Form...</Box>
          <Flex gap="sm" align="center">
            <Button
              size="sm"
              appearance="outline"
              onClick={() => setActiveStep((prev) => prev + 1)}
            >
              Next
            </Button>
          </Flex>
        </Stack>
      </Step>
      <Step title="Shipping Info" description="Add your shipping details">
        <Stack gap="md">
          <Box>Step 2 Content Form...</Box>
          <Flex gap="sm" align="center">
            <Button
              size="sm"
              appearance="outline"
              onClick={() => setActiveStep((prev) => prev - 1)}
            >
              Prev
            </Button>
            <Button
              size="sm"
              appearance="outline"
              onClick={() => setActiveStep((prev) => prev + 1)}
            >
              Next
            </Button>
          </Flex>
        </Stack>
      </Step>
      <Step title="Review" description="Review your order">
        <Stack gap="md">
          <Box>Step 3 Content Review...</Box>
          <Flex gap="sm" align="center">
            <Button
              size="sm"
              appearance="outline"
              onClick={() => setActiveStep((prev) => prev - 1)}
            >
              Prev
            </Button>
          </Flex>
        </Stack>
      </Step>
    </Stepper>
  );
};

export const WithContent: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => <StepperWithContentDemo {...args} />,
};

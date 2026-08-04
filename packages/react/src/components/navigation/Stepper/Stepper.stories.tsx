import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/inputs/Button';
import { Box, Flex, Stack } from '@/components/layout';
import { css } from '@/styled-system/css';
import { Stepper } from './Stepper';
import { Step } from './Step';
import type { StepperProps } from './index';

const narrowStepperClass = css({ width: '[240px]', maxWidth: '100%' });


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
    completed: {
      control: 'boolean',
      description: 'Renders the workflow as fully completed.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const StepperDemo = (args: StepperProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const resolvedActiveStep = args.activeStep ?? activeStep;

  return (
    <Stepper {...args} activeStep={resolvedActiveStep} onStepChange={setActiveStep}>
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

export const Completed: Story = {
  args: {
    ...Default.args,
    activeStep: 2,
    completed: true,
  },
  render: (args) => <StepperDemo {...args} />,
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
  const resolvedActiveStep = args.activeStep ?? activeStep;
  return (
    <Stepper
      {...args}
      activeStep={resolvedActiveStep}
      onStepChange={setActiveStep}
      orientation="vertical"
    >
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

export const NarrowAndRtl: Story = {
  args: {
    orientation: 'horizontal',
    linear: false,
    size: 'sm',
    className: narrowStepperClass,
  },
  render: (args) => (
    <Stack gap="lg">
      <StepperDemo {...args} />
      <div dir="rtl">
        <Stepper
          {...args}
          activeStep={1}
          onStepChange={() => undefined}
          aria-label="التقدم"
          data-testid="horizontal-stepper-rtl"
        >
          <Step title="بيانات الحساب الطويلة جدًا" description="وصف طويل يلتف في المساحة الضيقة" />
          <Step title="averylongunbrokensteptitle" description="averylongunbrokendescription" />
          <Step title="المراجعة" />
        </Stepper>
      </div>
    </Stack>
  ),
};

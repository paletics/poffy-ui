import { Button } from '@/components/inputs/Button';
import { Box } from '@/components/layout/Box';
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '@/components/media/Icon/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { Result, ResultIcon, ResultTitle, ResultDescription, ResultActions } from '.';

const meta = {
  title: 'Feedback/Result',
  component: Result,
  tags: ['autodocs'],
  argTypes: {
    intent: {
      control: 'select',
      options: ['success', 'danger', 'warning', 'info'],
    },
    appearance: {
      control: 'select',
      options: ['soft', 'outline'],
    },
    live: {
      control: 'select',
      options: ['off', 'polite', 'assertive'],
    },
  },
} satisfies Meta<typeof Result>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Result intent="success">
      <ResultIcon>
        <SuccessIcon />
      </ResultIcon>
      <ResultTitle>Payment Successful!</ResultTitle>
      <ResultDescription>Your order has been confirmed and will be shipped soon.</ResultDescription>
      <ResultActions>
        <Button appearance="outline">View Order</Button>
      </ResultActions>
    </Result>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Error: Story = {
  render: () => (
    <Result intent="danger">
      <ResultIcon>
        <ErrorIcon />
      </ResultIcon>
      <ResultTitle>Payment Failed</ResultTitle>
      <ResultDescription>
        There was a problem processing your payment. Please try again.
      </ResultDescription>
      <ResultActions>
        <Button appearance="outline" intent="danger">
          Try Again
        </Button>
      </ResultActions>
    </Result>
  ),
};

export const Warning: Story = {
  render: () => (
    <Result intent="warning">
      <ResultIcon>
        <WarningIcon />
      </ResultIcon>
      <ResultTitle>Action Required</ResultTitle>
      <ResultDescription>Please verify your email address to continue.</ResultDescription>
      <ResultActions>
        <Button appearance="outline" intent="warning">
          Resend Email
        </Button>
      </ResultActions>
    </Result>
  ),
};

export const Info: Story = {
  render: () => (
    <Result intent="info">
      <ResultIcon>
        <InfoIcon />
      </ResultIcon>
      <ResultTitle>Processing</ResultTitle>
      <ResultDescription>
        Your request is being processed. This may take a few moments.
      </ResultDescription>
    </Result>
  ),
};

export const ConstrainedLongContent: Story = {
  render: () => (
    <Box width="[180px]" aria-label="Constrained result">
      <Result intent="warning">
        <ResultIcon>
          <WarningIcon />
        </ResultIcon>
        <ResultTitle>Paymentverificationrequiresadditionalinformation</ResultTitle>
        <ResultDescription>
          https://example.com/verification/without-any-natural-break-opportunities
        </ResultDescription>
        <ResultActions>
          <Button size="sm">Try again</Button>
          <Button size="sm" appearance="outline">
            Contact support
          </Button>
        </ResultActions>
      </Result>
    </Box>
  ),
};

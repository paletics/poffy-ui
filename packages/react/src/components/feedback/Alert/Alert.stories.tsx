import type { Meta, StoryObj } from '@storybook/react';
import { css } from '@/styled-system/css';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '.';
import { Stack } from '../../layout/Stack';

/**
 * Contextual feedback banner combining an icon, title, and description to communicate status to the user.
 * Use for non-blocking success, warning, info, or error messages within page content.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (alert recipe), Radix Slot, AlertContext
 */
const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    variant: {
      control: 'select',
      options: ['subtle', 'solid', 'left-accent', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertIcon />
      <Stack gap="xs" className={css({ width: 'full' })}>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>This is a description of the alert.</AlertDescription>
      </Stack>
    </Alert>
  ),
  args: {
    status: 'info',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Statuses = () => (
  <Stack gap="md">
    <Alert status="info">
      <AlertIcon />
      <AlertTitle>Info Alert</AlertTitle>
    </Alert>
    <Alert status="success">
      <AlertIcon />
      <AlertTitle>Success Alert</AlertTitle>
    </Alert>
    <Alert status="warning">
      <AlertIcon />
      <AlertTitle>Warning Alert</AlertTitle>
    </Alert>
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Error Alert</AlertTitle>
    </Alert>
  </Stack>
);

export const WithClose: Story = {
  render: (args) => (
    <Alert {...args} onClose={() => undefined}>
      <AlertIcon />
      <AlertTitle>Dismissible Alert</AlertTitle>
      <AlertDescription>Click the close button to dismiss.</AlertDescription>
    </Alert>
  ),
  args: {
    status: 'warning',
  },
};

export const Variants = () => (
  <Stack gap="md">
    <Alert status="success" variant="subtle">
      <AlertIcon />
      <AlertTitle>Subtle</AlertTitle>
    </Alert>
    <Alert status="success" variant="solid">
      <AlertIcon />
      <AlertTitle>Solid</AlertTitle>
    </Alert>
    <Alert status="success" variant="left-accent">
      <AlertIcon />
      <AlertTitle>Left Accent</AlertTitle>
    </Alert>
    <Alert status="success" variant="outline">
      <AlertIcon />
      <AlertTitle>Outline</AlertTitle>
    </Alert>
  </Stack>
);

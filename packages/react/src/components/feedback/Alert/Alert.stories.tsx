import type { Meta, StoryObj } from '@storybook/react';
import { css } from '@/styled-system/css';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '.';
import { Stack } from '@/components/layout/Stack';
import { useState } from 'react';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    live: {
      control: 'select',
      options: ['auto', 'polite', 'assertive', 'off'],
    },
    variant: {
      control: 'select',
      options: ['subtle', 'solid', 'start-accent', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

const constrainedAlertGalleryClass = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: 'xl',
});

const alertAtSeventyPixelsClass = css({
  width: '[70px]',
});

const practicalAlertClass = css({
  width: '[10rem]',
  maxWidth: '100%',
});

const practicalClosableAlertClass = css({
  width: '[12rem]',
  maxWidth: '100%',
});

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertIcon />
      <Stack gap="xs" className={css({ width: 'full', minWidth: 0 })}>
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
    <Alert status="success" variant="start-accent">
      <AlertIcon />
      <AlertTitle>Start Accent</AlertTitle>
    </Alert>
    <Alert status="success" variant="outline">
      <AlertIcon />
      <AlertTitle>Outline</AlertTitle>
    </Alert>
  </Stack>
);

export const LogicalStartAccent = () => (
  <Stack gap="md">
    <div dir="ltr" data-testid="start-accent-ltr">
      <Alert status="info" variant="start-accent">
        <AlertIcon />
        <AlertTitle>LTR start accent</AlertTitle>
      </Alert>
    </div>
    <div dir="rtl" data-testid="start-accent-rtl">
      <Alert status="info" variant="start-accent">
        <AlertIcon />
        <AlertTitle>RTL start accent</AlertTitle>
      </Alert>
    </div>
  </Stack>
);

export const ConstrainedLongText: Story = {
  render: () => (
    <div className={css({ width: '[160px]' })}>
      <Alert status="warning" onClose={() => undefined}>
        <AlertIcon />
        <Stack gap="xs" className={css({ minWidth: 0 })}>
          <AlertTitle>Deploymentidentifierwithoutbreakopportunities</AlertTitle>
          <AlertDescription>
            https://example.com/reports/2026/alert-width-regression-check
          </AlertDescription>
        </Stack>
      </Alert>
    </div>
  ),
};

export const PracticalMinimum: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Recommended readable widths: 10rem for a non-closable alert and 12rem when icon, title, description, and close action are combined. Narrower widths are containment stress cases rather than a readability guarantee.',
      },
    },
  },
  render: () => (
    <Stack gap="lg">
      <div className={practicalAlertClass}>
        <Alert status="info">
          <AlertIcon />
          <Stack gap="xs">
            <AlertTitle>Import ready</AlertTitle>
            <AlertDescription>Review the mapped columns.</AlertDescription>
          </Stack>
        </Alert>
      </div>
      <div className={practicalClosableAlertClass} data-testid="practical-alert-closable">
        <Alert status="warning" closeLabel="Close practical alert" onClose={() => undefined}>
          <AlertIcon />
          <Stack gap="xs">
            <AlertTitle>Review required</AlertTitle>
            <AlertDescription>Confirm the deployment settings.</AlertDescription>
          </Stack>
        </Alert>
      </div>
    </Stack>
  ),
};

export const ConstrainedClosable: Story = {
  render: function ConstrainedClosableStory() {
    const [showDirectLtr, setShowDirectLtr] = useState(true);

    return (
      <div className={constrainedAlertGalleryClass}>
        <div className={alertAtSeventyPixelsClass} data-testid="alert-direct-ltr">
          {showDirectLtr ? (
            <Alert
              status="warning"
              closeLabel="Close direct LTR alert"
              onClose={() => setShowDirectLtr(false)}
            >
              <AlertIcon />
              <AlertTitle>DirectTitle</AlertTitle>
              <AlertDescription>DirectDescription</AlertDescription>
            </Alert>
          ) : (
            <span>Closed direct LTR alert</span>
          )}
        </div>
        <div className={alertAtSeventyPixelsClass} data-testid="alert-direct-rtl" dir="rtl">
          <Alert status="info" closeLabel="Close direct RTL alert" onClose={() => undefined}>
            <AlertIcon />
            <AlertTitle>DirectTitle</AlertTitle>
            <AlertDescription>DirectDescription</AlertDescription>
          </Alert>
        </div>
        <div className={alertAtSeventyPixelsClass} data-testid="alert-stack-ltr">
          <Alert status="success" closeLabel="Close stack LTR alert" onClose={() => undefined}>
            <AlertIcon />
            <Stack gap="xs">
              <AlertTitle>StackTitle</AlertTitle>
              <AlertDescription>StackDescription</AlertDescription>
            </Stack>
          </Alert>
        </div>
        <div className={alertAtSeventyPixelsClass} data-testid="alert-stack-rtl" dir="rtl">
          <Alert status="error" closeLabel="Close stack RTL alert" onClose={() => undefined}>
            <AlertIcon />
            <Stack gap="xs">
              <AlertTitle>StackTitle</AlertTitle>
              <AlertDescription>StackDescription</AlertDescription>
            </Stack>
          </Alert>
        </div>
      </div>
    );
  },
};

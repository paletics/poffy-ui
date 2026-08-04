import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { ProgressBar } from '@/components/feedback/ProgressBar';
import { Grid } from '@/components/layout/Grid';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';
import { css } from '@/styled-system/css';

const renderProgressItem = (label: string, children: ReactNode) => (
  <Stack gap="xs">
    <Text variant="body2" weight="medium" color="text.secondary">
      {label}
    </Text>
    {children}
  </Stack>
);

const responsiveProgressWidthClass = css({
  '--responsive-progress-width': '[min(100%, 28rem)]',
} as Parameters<typeof css>[0]);

const meta: Meta<typeof ProgressBar> = {
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
  decorators: [
    (Story) => (
      <Stack minHeight="[100vh]" align="center" justify="center" p="md" width="100%">
        <Story />
      </Stack>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['solid', 'soft', 'outline'],
      description: 'Public surface treatment applied to the track and wrapper.',
    },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'warning', 'info'],
      description: 'Semantic color intent applied to the track, bar, border, and label.',
    },
    animationType: {
      control: 'select',
      options: ['progress', 'load', false],
      description: '`load` renders an indeterminate bar and omits `aria-valuenow`.',
    },
    size: {
      control: 'text',
      description: 'Positive numbers are pixels; strings accept any non-empty CSS width.',
    },
    thickness: {
      control: { type: 'number', min: 4, max: 40, step: 2 },
      description: 'Height in pixels. Auto label placement changes at 16px.',
    },
    progressPercent: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Determinate progress value from 0 to 100.',
    },
    showProgress: { control: 'boolean' },
    shape: {
      control: 'select',
      options: ['rounded', 'square'],
      description: 'Track and bar geometry.',
    },
    pattern: {
      control: 'select',
      options: ['simple', 'dashed'],
      description: 'Internal fill treatment for the progress bar.',
    },
    borderType: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted', 'none'],
      description: 'Optional border style for the track.',
    },
    labelPosition: {
      control: 'select',
      options: ['auto', 'center', 'right', 'top', 'bottom', 'inside'],
      description: 'Position for the percentage label when `showProgress` is enabled.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    progressPercent: 50,
    size: 300,
    'aria-label': 'Upload progress',
  },
};

export const Playground: Story = {
  args: {
    appearance: 'solid',
    intent: 'primary',
    shape: 'rounded',
    pattern: 'simple',
    animationType: 'progress',
    progressPercent: 60,
    size: 300,
    thickness: 10,
    showProgress: true,
    labelPosition: 'auto',
    borderType: 'none',
    'aria-label': 'Upload progress',
  },
};

export const Intents: Story = {
  render: () => (
    <Grid minChildWidth="280px" gap="lg" width="[min(680px, calc(100vw - 32px))]">
      {renderProgressItem(
        'Primary',
        <ProgressBar intent="primary" progressPercent={70} showProgress />,
      )}
      {renderProgressItem(
        'Secondary',
        <ProgressBar intent="secondary" progressPercent={70} showProgress />,
      )}
      {renderProgressItem('Info', <ProgressBar intent="info" progressPercent={70} showProgress />)}
      {renderProgressItem(
        'Success',
        <ProgressBar intent="success" progressPercent={70} showProgress />,
      )}
      {renderProgressItem(
        'Warning',
        <ProgressBar intent="warning" progressPercent={70} showProgress />,
      )}
      {renderProgressItem(
        'Danger',
        <ProgressBar intent="danger" progressPercent={70} showProgress />,
      )}
      {renderProgressItem(
        'Light',
        <ProgressBar intent="light" progressPercent={70} showProgress />,
      )}
      {renderProgressItem('Dark', <ProgressBar intent="dark" progressPercent={70} showProgress />)}
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Fixed semantic intent gallery. Values are literal JSX so Panda emits each recipe branch.',
      },
    },
  },
};

export const Widths: Story = {
  render: () => (
    <Stack gap="lg" width="[min(520px, calc(100vw - 32px))]">
      <ProgressBar size={200} progressPercent={30} showProgress />
      <ProgressBar size={300} progressPercent={50} showProgress />
      <ProgressBar size={420} progressPercent={70} showProgress />
    </Stack>
  ),
};

export const ResponsiveWidths: Story = {
  render: () => (
    <Stack
      gap="lg"
      width="[min(520px, calc(100vw - 32px))]"
      className={responsiveProgressWidthClass}
    >
      <ProgressBar
        data-testid="percentage-width"
        size="50%"
        progressPercent={60}
        showProgress
        aria-label="Percentage width"
      />
      <ProgressBar
        data-testid="functional-width"
        size="min(100%, 24rem)"
        progressPercent={60}
        showProgress
        aria-label="Functional CSS width"
      />
      <ProgressBar
        data-testid="custom-property-width"
        size="var(--responsive-progress-width)"
        progressPercent={60}
        showProgress
        aria-label="Custom property width"
      />
    </Stack>
  ),
};

export const Thickness: Story = {
  render: () => (
    <Stack gap="lg" width="[min(520px, calc(100vw - 32px))]">
      <ProgressBar thickness={6} progressPercent={45} showProgress />
      <ProgressBar thickness={10} progressPercent={55} showProgress />
      <ProgressBar thickness={16} progressPercent={65} showProgress />
      <ProgressBar thickness={24} progressPercent={75} showProgress />
    </Stack>
  ),
};

export const AutoLabelPlacement: Story = {
  render: () => (
    <Stack gap="lg" width="[min(520px, calc(100vw - 32px))]">
      {renderProgressItem(
        'Thin bar: right',
        <ProgressBar thickness={8} progressPercent={64} showProgress labelPosition="auto" />,
      )}
      {renderProgressItem(
        'Low progress: right',
        <ProgressBar thickness={20} progressPercent={8} showProgress labelPosition="auto" />,
      )}
      {renderProgressItem(
        'Short label fits: inside',
        <ProgressBar thickness={20} progressPercent={64} showProgress labelPosition="auto" />,
      )}
      {renderProgressItem(
        'Long label does not fit: right',
        <ProgressBar
          thickness={20}
          progressPercent={42}
          showProgress
          labelPosition="auto"
          label="Syncing a long task name"
        />,
      )}
      {renderProgressItem(
        'Long label fits: inside',
        <ProgressBar
          size={420}
          thickness={20}
          progressPercent={82}
          showProgress
          labelPosition="auto"
          label="Syncing a long task name"
        />,
      )}
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`auto` measures text/native label content and the available filled area, and responds to resizes without placement oscillation. Opaque custom label components stay at inline-end to avoid rendering component effects twice; explicit `inside` still forces an inside label with ellipsis.',
      },
    },
  },
};

export const CenterLabels: Story = {
  render: () => (
    <Stack gap="lg" width="[min(300px, calc(100vw - 32px))]">
      <ProgressBar
        size={160}
        thickness={10}
        progressPercent={50}
        showProgress
        labelPosition="center"
        label="Syncing a long task name"
      />
      <ProgressBar
        size={300}
        thickness={24}
        progressPercent={50}
        showProgress
        labelPosition="center"
        label="Syncing a long task name"
      />
    </Stack>
  ),
};

export const States: Story = {
  render: () => (
    <Stack gap="lg" width="[min(520px, calc(100vw - 32px))]">
      <ProgressBar progressPercent={0} showProgress />
      <ProgressBar progressPercent={42} showProgress label="Processing" />
      <ProgressBar progressPercent={100} showProgress />
      <ProgressBar animationType="load" showProgress label="Loading" />
    </Stack>
  ),
};

export const Patterns: Story = {
  render: () => (
    <Grid minChildWidth="280px" gap="lg" width="[min(680px, calc(100vw - 32px))]">
      {renderProgressItem(
        'Simple primary',
        <ProgressBar intent="primary" pattern="simple" progressPercent={60} showProgress />,
      )}
      {renderProgressItem(
        'Dashed primary',
        <ProgressBar intent="primary" pattern="dashed" progressPercent={60} showProgress />,
      )}
      {renderProgressItem(
        'Simple secondary',
        <ProgressBar intent="secondary" pattern="simple" progressPercent={60} showProgress />,
      )}
      {renderProgressItem(
        'Dashed secondary',
        <ProgressBar intent="secondary" pattern="dashed" progressPercent={60} showProgress />,
      )}
      {renderProgressItem(
        'Simple warning',
        <ProgressBar intent="warning" pattern="simple" progressPercent={60} showProgress />,
      )}
      {renderProgressItem(
        'Dashed warning',
        <ProgressBar intent="warning" pattern="dashed" progressPercent={60} showProgress />,
      )}
    </Grid>
  ),
};

export const Appearances: Story = {
  render: () => (
    <Grid minChildWidth="280px" gap="lg" width="[min(680px, calc(100vw - 32px))]">
      {renderProgressItem(
        'Solid',
        <ProgressBar appearance="solid" progressPercent={55} showProgress />,
      )}
      {renderProgressItem(
        'Soft',
        <ProgressBar appearance="soft" progressPercent={55} showProgress />,
      )}
      {renderProgressItem(
        'Outline',
        <ProgressBar appearance="outline" progressPercent={55} showProgress />,
      )}
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Border appearance gallery for the track wrapper.',
      },
    },
  },
};

export const Animations: Story = {
  render: () => (
    <Stack gap="lg" width="[min(520px, calc(100vw - 32px))]">
      <ProgressBar animationType="progress" progressPercent={70} showProgress />
      <ProgressBar animationType="load" showProgress label="Loading" />
      <ProgressBar animationType={false} progressPercent={70} showProgress />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Animation modes: determinate transition, indeterminate load, and no animation.',
      },
    },
  },
};

export const EdgeCases: Story = {
  render: () => (
    <Stack gap="lg" width="[min(520px, calc(100vw - 32px))]">
      <ProgressBar
        size={160}
        thickness={8}
        progressPercent={1}
        showProgress
        labelPosition="right"
      />
      <ProgressBar
        size={160}
        thickness={8}
        progressPercent={99}
        showProgress
        labelPosition="right"
      />
      <ProgressBar
        size={220}
        thickness={18}
        progressPercent={48}
        showProgress
        labelPosition="inside"
        label="Syncing a long task name"
      />
      <ProgressBar
        size={220}
        thickness={10}
        progressPercent={64}
        showProgress
        labelPosition="top"
      />
      <ProgressBar
        size={220}
        thickness={10}
        progressPercent={64}
        showProgress
        labelPosition="bottom"
      />
    </Stack>
  ),
};

export const ConstrainedLocalizedLabels: Story = {
  render: () => (
    <Stack gap="lg" width="[180px]" aria-label="Constrained progress bars">
      <ProgressBar
        size={300}
        thickness={12}
        progressPercent={42}
        showProgress
        labelPosition="right"
        aria-label="Localized upload progress"
        label="VerarbeitungdesmehrsprachigenDokuments"
      />
      <ProgressBar
        size={300}
        thickness={12}
        progressPercent={64}
        showProgress
        labelPosition="top"
        aria-label="Top label progress"
        label="長い処理状況ラベル"
      />
    </Stack>
  ),
};

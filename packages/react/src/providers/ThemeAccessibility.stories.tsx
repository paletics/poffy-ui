import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertIcon, AlertTitle } from '@/components/feedback/Alert';
import { CircleProgress } from '@/components/feedback/CircleProgress';
import { Button } from '@/components/inputs/Button';
import { Checkbox } from '@/components/inputs/Checkbox';
import { Stack } from '@/components/layout/Stack';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { css } from '@/styled-system/css';

const meta: Meta = {
  title: 'Theme/Accessibility Matrix',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj;

const matrixClass = css({
  display: 'grid',
  gridTemplateColumns: {
    base: '1fr',
    md: 'repeat(2, minmax(0, 1fr))',
  },
  gap: 'lg',
  width: '[min(44rem,100%)]',
  maxWidth: '100%',
});

const panelClass = css({
  display: 'grid',
  alignContent: 'start',
  gap: 'md',
  minWidth: 0,
  p: 'lg',
  borderWidth: 'thin',
  borderStyle: 'solid',
  borderColor: 'layout.divider',
  borderRadius: 'lg',
  bg: 'layout.background',
  color: 'text.primary',
});

const customPalette = {
  main: '#5B21B6',
  contrast: '#FFFFFF',
  mainDark: '#C4B5FD',
  contrastDark: '#1E1B4B',
} as const;

const CustomPanel = ({ mode }: { mode: 'light' | 'dark' }) => (
  <ThemeProvider
    defaultBrand="custom"
    customBrand={customPalette}
    defaultColorMode={mode}
    global={false}
  >
    <div className={panelClass} data-testid={`custom-theme-${mode}`}>
      <Stack gap="sm">
        <strong>{mode === 'light' ? 'Custom light' : 'Custom dark'}</strong>
        <Button>Primary action</Button>
        <Button appearance="outline">Secondary action</Button>
        <Checkbox defaultChecked>Selected option</Checkbox>
        <Alert status="info" variant="start-accent">
          <AlertIcon />
          <AlertTitle>Informational status</AlertTitle>
        </Alert>
        <CircleProgress
          value={72}
          size={64}
          showValue
          aria-label={`${mode} custom theme progress`}
        />
      </Stack>
    </div>
  </ThemeProvider>
);

/** A bounded safe-palette smoke fixture for both custom color modes. */
export const CustomPalette: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A representative safe custom palette in light and dark modes. Consumer-supplied palette validation remains an application responsibility.',
      },
    },
  },
  render: () => (
    <div className={matrixClass}>
      <CustomPanel mode="light" />
      <CustomPanel mode="dark" />
    </div>
  ),
};

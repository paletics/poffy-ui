import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@/components/feedback/Alert';
import { CircleProgress } from '@/components/feedback/CircleProgress';
import { Button } from '@/components/inputs/Button';
import { Checkbox } from '@/components/inputs/Checkbox';
import { SearchInput } from '@/components/inputs/SearchInput';
import { Stack } from '@/components/layout/Stack';
import { css } from '@/styled-system/css';

const meta: Meta = {
  title: 'QA/Accessibility Conditions',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj;

const matrixClass = css({
  display: 'grid',
  gap: 'lg',
  width: '[min(32rem,100%)]',
  maxWidth: '100%',
  minWidth: 0,
});

const actionsClass = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'md',
  alignItems: 'center',
});

const practicalSearchClass = css({
  width: '[10rem]',
  maxWidth: '100%',
});

/**
 * Representative semantic controls for browser accessibility media emulation.
 * This is intentionally a small cross-component smoke fixture, not a full theme matrix.
 */
export const ForcedColorsRepresentative: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Representative controls, status feedback, and SVG progress used as a Chromium forced-colors emulation proxy for focus, boundaries, and non-color state cues. This does not certify behavior in Windows High Contrast Mode or every browser/OS combination.',
      },
    },
  },
  render: () => (
    <div className={matrixClass} data-testid="forced-colors-representative">
      <div className={actionsClass}>
        <Button>Save changes</Button>
        <Button appearance="outline">Review changes</Button>
        <div data-testid="forced-colors-checkbox">
          <Checkbox defaultChecked>Include archived records</Checkbox>
        </div>
      </div>
      <div className={practicalSearchClass}>
        <SearchInput aria-label="Search audit records" defaultValue="deployment" />
      </div>
      <Alert status="warning" variant="start-accent">
        <AlertIcon />
        <Stack gap="xs">
          <AlertTitle>Review required</AlertTitle>
          <AlertDescription>Two deployment settings need confirmation.</AlertDescription>
        </Stack>
      </Alert>
      <CircleProgress value={68} size={64} showValue aria-label="Accessibility audit progress" />
    </div>
  ),
};

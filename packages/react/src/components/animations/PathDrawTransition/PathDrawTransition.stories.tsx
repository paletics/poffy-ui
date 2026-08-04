import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/inputs/Button';
import { Stack } from '@/components/layout';
import { PathDrawTransition } from './PathDrawTransition';
import { pathDrawVariants } from './PathDrawTransition.presets';

const meta: Meta<typeof PathDrawTransition> = {
  title: 'Animations/PathDrawTransition',
  component: PathDrawTransition,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    animationType: {
      control: 'select',
      options: Object.keys(pathDrawVariants),
      description: 'The SVG path drawing animation preset to use.',
    },
    isVisible: {
      control: 'boolean',
      description: 'Whether child stroke primitives should be drawn.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PathDrawTransition>;

const iconClass = css({
  width: '[72px]',
  height: '[72px]',
  color: 'blue.600',
});

const galleryClass = css({
  display: 'grid',
  gridTemplateColumns: '[repeat(auto-fit, minmax(min(120px, 100%), 1fr))]',
  gap: 'lg',
  alignItems: 'center',
  justifyItems: 'center',
  width: '[min(380px, calc(100vw - 4rem))]',
});

export const Default: Story = {
  args: {
    animationType: 'draw',
    isVisible: true,
  },
  render: (args) => (
    <PathDrawTransition
      {...args}
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <PathDrawTransition.Polyline points="20 6 9 17 4 12" />
    </PathDrawTransition>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Toggle: Story = {
  render: function ToggleStory() {
    const [visible, setVisible] = useState(true);

    return (
      <Stack gap="md" align="center">
        <Button appearance="outline" onClick={() => setVisible((value) => !value)}>
          Toggle drawing
        </Button>
        <PathDrawTransition
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          isVisible={visible}
          aria-hidden="true"
        >
          <PathDrawTransition.Polyline points="20 6 9 17 4 12" />
        </PathDrawTransition>
      </Stack>
    );
  },
};

export const Gallery: Story = {
  render: () => (
    <div className={galleryClass}>
      <PathDrawTransition
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <PathDrawTransition.Polyline points="20 6 9 17 4 12" />
      </PathDrawTransition>
      <PathDrawTransition
        className={iconClass}
        animationType="dash"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <PathDrawTransition.Line x1="4" y1="12" x2="20" y2="12" />
      </PathDrawTransition>
      <PathDrawTransition
        className={iconClass}
        animationType="draw"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <PathDrawTransition.Path d="M12 3v18" />
        <PathDrawTransition.Path d="M3 12h18" customData={{ duration: 0.35 }} />
      </PathDrawTransition>
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/inputs/Button';
import { Box, Grid, Stack } from '@/components/layout';
import { IconSwapTransition } from './IconSwapTransition';
import { iconSwapVariants } from './IconSwapTransition.presets';
import type { IconSwapTransitionProps } from './IconSwapTransition.types';

/**
 * Animates compact icon and status content replacements with a keyed transition boundary.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: motion/react (AnimatePresence), IconSwapTransition presets, Radix Slot
 */
const meta: Meta<typeof IconSwapTransition> = {
  title: 'Animations/IconSwapTransition',
  component: IconSwapTransition,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    animationType: {
      control: 'select',
      options: Object.keys(iconSwapVariants),
      description: 'The icon replacement animation preset to use.',
    },
    transitionKey: {
      control: 'text',
      description: 'Key used to trigger enter and exit replacement.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconSwapTransition>;

const renderIcon = (active: boolean) => (
  <Box
    asChild
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    width="[20px]"
    height="[20px]"
  >
    <span aria-hidden="true">{active ? 'OK' : '...'}</span>
  </Box>
);

const InteractiveTemplate = (args: IconSwapTransitionProps) => {
  const [active, setActive] = useState(false);

  return (
    <Button appearance="outline" onClick={() => setActive((value) => !value)}>
      <IconSwapTransition {...args} transitionKey={active ? 'active' : 'idle'}>
        {renderIcon(active)}
      </IconSwapTransition>
      {active ? 'Copied' : 'Copy'}
    </Button>
  );
};

export const Default: Story = {
  args: {
    animationType: 'pop',
    transitionKey: 'idle',
  },
  render: InteractiveTemplate,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Rotate: Story = {
  args: {
    animationType: 'rotate',
    transitionKey: 'idle',
  },
  render: InteractiveTemplate,
};

export const Gallery: Story = {
  render: function GalleryStory() {
    const [active, setActive] = useState(false);
    const presets = Object.keys(iconSwapVariants) as NonNullable<
      IconSwapTransitionProps['animationType']
    >[];

    return (
      <Stack gap="md">
        <Button appearance="outline" onClick={() => setActive((value) => !value)}>
          Toggle all
        </Button>
        <Grid gridTemplateColumns="[repeat(2, minmax(160px, 1fr))]" gap="md">
          {presets.map((preset) => (
            <Button key={preset} appearance="outline">
              <IconSwapTransition transitionKey={active ? 'active' : 'idle'} animationType={preset}>
                {renderIcon(active)}
              </IconSwapTransition>
              {preset}
            </Button>
          ))}
        </Grid>
      </Stack>
    );
  },
};

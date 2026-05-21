import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/inputs/Button';
import { Box, Stack } from '@/components/layout';
import { CollapseTransition } from './CollapseTransition';
import { collapseVariants } from './CollapseTransition.presets';
import type { CollapseTransitionProps } from './CollapseTransition.types';

/**
 * Provides controlled open and close animation for vertical content regions such as accordion
 * panels, tree groups, and step bodies.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: motion/react (AnimatePresence), CollapseTransition presets, Radix Slot
 */
const meta: Meta<typeof CollapseTransition> = {
  title: 'Animations/CollapseTransition',
  component: CollapseTransition,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    animationType: {
      control: 'select',
      options: Object.keys(collapseVariants),
      description: 'The collapse animation preset to use.',
    },
    isOpen: {
      control: 'boolean',
      description: 'Whether the collapsible region is open.',
    },
    keepMounted: {
      control: 'boolean',
      description: 'Whether the region remains mounted when closed.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CollapseTransition>;

const InteractiveTemplate = (args: CollapseTransitionProps) => {
  const [isOpen, setIsOpen] = useState(args.isOpen ?? true);

  return (
    <Stack gap="sm" align="flex-start">
      <Button
        appearance="outline"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        Toggle region
      </Button>
      <CollapseTransition {...args} isOpen={isOpen}>
        <Box
          mt="sm"
          width="[320px]"
          p="md"
          borderWidth="1px"
          borderColor="blue.200"
          borderRadius="md"
          bg="blue.50"
          color="slate.900"
          fontSize="sm"
        >
          Collapsible content can contain multiple lines, controls, or nested groups while the
          wrapper owns height and opacity motion.
        </Box>
      </CollapseTransition>
    </Stack>
  );
};

export const Default: Story = {
  args: {
    animationType: 'height-fade',
    isOpen: true,
  },
  render: InteractiveTemplate,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const HeightOnly: Story = {
  args: {
    animationType: 'height',
    isOpen: true,
  },
  render: InteractiveTemplate,
};

export const ScaleY: Story = {
  args: {
    animationType: 'scale-y',
    isOpen: true,
  },
  render: InteractiveTemplate,
};

export const KeepMounted: Story = {
  args: {
    animationType: 'height-fade',
    isOpen: true,
    keepMounted: true,
  },
  render: InteractiveTemplate,
};

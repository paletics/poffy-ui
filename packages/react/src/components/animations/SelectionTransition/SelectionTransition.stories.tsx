import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/inputs/Button';
import { Box } from '@/components/layout';
import { SelectionTransition } from './SelectionTransition';
import { selectionVariants } from './SelectionTransition.presets';
import type { SelectionTransitionProps } from './SelectionTransition.types';

/**
 * Animates selected-state indicators for controls and selectable options without owning the
 * control semantics.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: motion/react (AnimatePresence), SelectionTransition presets, Radix Slot
 */
const meta: Meta<typeof SelectionTransition> = {
  title: 'Animations/SelectionTransition',
  component: SelectionTransition,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    animationType: {
      control: 'select',
      options: Object.keys(selectionVariants),
      description: 'The selection indicator animation preset to use.',
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether the indicator is visible.',
    },
    keepMounted: {
      control: 'boolean',
      description: 'Whether the indicator remains mounted when unselected.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectionTransition>;

const InteractiveTemplate = (args: SelectionTransitionProps) => {
  const [selected, setSelected] = useState(args.isSelected ?? true);

  return (
    <Button
      appearance="outline"
      aria-pressed={selected}
      onClick={() => setSelected((value) => !value)}
    >
      <SelectionTransition {...args} isSelected={selected}>
        <Box
          asChild
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          width="[22px]"
          height="[22px]"
          borderRadius="full"
          bg="blue.600"
          color="white"
          fontSize="xs"
          fontWeight="bold"
        >
          <span aria-hidden="true">v</span>
        </Box>
      </SelectionTransition>
      Selectable option
    </Button>
  );
};

export const Default: Story = {
  args: {
    animationType: 'check',
    isSelected: true,
  },
  render: InteractiveTemplate,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Pop: Story = {
  args: {
    animationType: 'pop',
    isSelected: true,
  },
  render: InteractiveTemplate,
};

export const KeepMounted: Story = {
  args: {
    animationType: 'fade',
    isSelected: true,
    keepMounted: true,
  },
  render: InteractiveTemplate,
};

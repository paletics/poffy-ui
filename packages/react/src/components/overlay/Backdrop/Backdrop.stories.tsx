import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@/components/layout/Box';
import { Text } from '@/components/typography/Text';
import { css } from '@/styled-system/css';
import { Backdrop } from '@/components/overlay/Backdrop/Backdrop';

/**
 * Storybook documentation and visual review surface for Backdrop.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, overlay primitives
 */
const meta: Meta<typeof Backdrop> = {
  title: 'Overlay/Backdrop',
  component: Backdrop,
  tags: ['autodocs'],
  argTypes: {
    asChild: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Backdrop>;

const containerClass = css({
  height: '[300px]',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'layout.divider',
});
const copyClass = css({ p: 'lg' });
const absoluteBackdropClass = css({ position: 'absolute' });
const customBackdropClass = css({
  position: 'absolute',
  bg: '[rgba(255, 0, 0, 0.2)]',
  backdropFilter: 'blur(4px)',
});

export const Default: Story = {
  render: (args) => (
    <Box className={containerClass}>
      <Text className={copyClass}>
        The backdrop is rendered inside this container with absolute positioning.
      </Text>
      <Backdrop {...args} className={absoluteBackdropClass} />
    </Box>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const CustomStyle: Story = {
  args: {
    className: customBackdropClass,
  },
  render: (args) => (
    <Box className={containerClass}>
      <Text className={copyClass}>Custom red tinted backdrop with blur.</Text>
      <Backdrop {...args} />
    </Box>
  ),
};

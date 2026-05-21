import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';

/**
 * The most fundamental layout primitive, acting as the base building block for the entire Poffy UI system with full Panda CSS prop support.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: boxStyle, splitCssProps), Radix Slot
 */
const meta: Meta<typeof Box> = {
  title: 'Layout/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    bg: { control: 'color' },
    color: { control: 'color' },
    p: { control: 'text' },
    m: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  args: {
    bg: 'blue.700',
    color: 'white',
    p: '4',
    m: '2',
    children: 'I am a Box',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const CustomElement: Story = {
  render: () => (
    <Box asChild bg="emerald.100" p="4">
      <section>I am a &lt;section&gt;</section>
    </Box>
  ),
};

export const CssOverride: Story = {
  render: () => (
    <Box
      className={css({
        bg: 'violet.700',
        color: 'white',
        p: '6',
        borderRadius: 'xl',
        _hover: { bg: 'violet.700', transform: 'scale(1.05)' },
        transition: 'all 0.2s',
      })}
    >
      Hover me!
    </Box>
  ),
};

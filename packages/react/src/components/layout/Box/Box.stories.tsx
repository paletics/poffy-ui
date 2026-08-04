import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';


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
    p: 'base',
    m: 'sm',
    children: 'I am a Box',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const CustomElement: Story = {
  render: () => (
    <Box asChild bg="emerald.100" p="base">
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
        p: 'lg',
        borderRadius: 'xl',
        _hover: { bg: 'violet.700', transform: 'scale(1.05)' },
        transition: 'all 0.2s',
      })}
    >
      Hover me!
    </Box>
  ),
};

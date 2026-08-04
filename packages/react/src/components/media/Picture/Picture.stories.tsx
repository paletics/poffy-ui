import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from '@/components/layout/AspectRatio';
import { Picture } from './Picture';

const artDirectionImage = (label: string, background: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="800" height="400" fill="${background}"/><text x="400" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="700" fill="white">${label}</text></svg>`,
  )}`;


const meta = {
  title: 'Media/Picture',
  component: Picture,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
    },
    sizing: {
      control: 'select',
      options: ['intrinsic', 'fluid', 'fill'],
    },
  },
} satisfies Meta<typeof Picture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Picture {...args}>
      <source media="(min-width: 800px)" srcSet={artDirectionImage('Desktop', '#2563eb')} />
      <source media="(min-width: 400px)" srcSet={artDirectionImage('Tablet', '#16a34a')} />
      <img src={artDirectionImage('Mobile', '#dc2626')} alt="Responsive Art Direction" />
    </Picture>
  ),
  args: {
    fit: 'cover',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WideFallback: Story = {
  render: () => (
    <Picture>
      <img
        src={artDirectionImage('Wide fallback', '#7c3aed')}
        alt="Wide responsive fallback"
        width={1600}
        height={400}
      />
    </Picture>
  ),
};

export const StableAspectRatioFrame: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9} w="[320px]" aria-label="Stable picture frame">
      <Picture sizing="fill" fit="cover">
        <source media="(min-width: 800px)" srcSet={artDirectionImage('Desktop', '#2563eb')} />
        <img src={artDirectionImage('Framed', '#0f766e')} alt="Framed art direction" />
      </Picture>
    </AspectRatio>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'AspectRatio owns the frame and sizing="fill" gives object-fit a constrained image box.',
      },
    },
  },
};

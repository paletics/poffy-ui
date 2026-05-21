import type { Meta, StoryObj } from '@storybook/react';
import { Picture } from './Picture';

const artDirectionImage = (label: string, background: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="800" height="400" fill="${background}"/><text x="400" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="700" fill="white">${label}</text></svg>`,
  )}`;

/**
 * A styled native `<picture>` wrapper that enables responsive art direction and next-gen image format delivery via `<source>` elements.
 * Use instead of `Image` when viewport-based image swapping or WebP/AVIF format negotiation is required.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS recipe (`picture` - variant: `fit`), native `<picture>` element
 */
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

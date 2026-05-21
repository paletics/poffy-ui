import type { Meta, StoryObj } from '@storybook/react';
import { Center } from '@/components/layout/Center';
import { Image } from '@/components/media/Image';

/**
 * A resilient image primitive with load-state awareness that automatically renders a URL or React node fallback when the source fails.
 * Use as the standard image component throughout the design system whenever graceful error handling or aspect-ratio control is needed.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS recipe (`image` - variants: `fit`, `aspectRatio`, `radius`), `useImage` hook
 */
const meta = {
  title: 'Media/Image',
  component: Image,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
    },
    aspectRatio: {
      control: 'select',
      options: ['square', 'video', 'auto'],
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
    },
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImageSrc =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23dbeafe"/%3E%3Ccircle cx="420" cy="120" r="70" fill="%23f59e0b"/%3E%3Cpath d="M0 310 130 185l95 80 95-70 280 205H0z" fill="%232563eb"/%3E%3Cpath d="M0 350 180 230l110 76 80-50 230 154H0z" fill="%230f766e"/%3E%3C/svg%3E';

export const Default: Story = {
  args: {
    src: sampleImageSrc,
    alt: 'Sample Image',
    width: 300,
    height: 200,
    fit: 'cover',
    radius: 'md',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithFallbackUrl: Story = {
  args: {
    src: 'invalid-url.jpg',
    fallback: sampleImageSrc,
    alt: 'Image with Fallback URL',
    width: 300,
    height: 200,
  },
};

export const WithFallbackElement: Story = {
  args: {
    src: 'invalid-url.jpg',
    fallback: (
      <Center w="[300px]" h="[200px]" bg="layout.background" color="text.secondary">
        Custom Fallback Component
      </Center>
    ),
    alt: 'Image with Fallback Element',
  },
};

export const AspectRatioVideo: Story = {
  args: {
    src: sampleImageSrc,
    alt: '16/9 Aspect Ratio',
    aspectRatio: 'video',
    width: 400,
  },
};

export const Circular: Story = {
  args: {
    src: sampleImageSrc,
    alt: 'Circular Image',
    width: 200,
    height: 200,
    aspectRatio: 'square',
    radius: 'full',
    fit: 'cover',
  },
};

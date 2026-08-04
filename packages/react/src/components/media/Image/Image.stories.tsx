import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/inputs/Button';
import { AspectRatio } from '@/components/layout/AspectRatio';
import { Center } from '@/components/layout/Center';
import { Stack } from '@/components/layout/Stack';
import { Image } from '@/components/media/Image';


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
    sizing: {
      control: 'select',
      options: ['intrinsic', 'fluid', 'fill'],
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

const StableFallbackFrameExample = () => {
  const [src, setSrc] = useState(sampleImageSrc);

  return (
    <Stack gap="md" alignItems="center">
      <AspectRatio ratio={16 / 9} w="[320px]" aria-label="Stable image frame">
        <Image
          src={src}
          alt="Framed preview"
          fallback={
            <Center bg="layout.background" color="text.secondary">
              Preview unavailable
            </Center>
          }
          loading="lazy"
          sizing="fill"
          fit="cover"
        />
      </AspectRatio>
      <Button onClick={() => setSrc('/missing-framed-preview.png')}>Break image source</Button>
    </Stack>
  );
};

export const StableFallbackFrame: Story = {
  render: () => <StableFallbackFrameExample />,
  parameters: {
    docs: {
      description: {
        story:
          'AspectRatio owns the frame while sizing="fill" keeps the image and a React-node fallback at identical dimensions.',
      },
    },
  },
};

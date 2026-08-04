import type { Meta, StoryObj } from '@storybook/react';
import { css } from '@/styled-system/css';
import { Button } from '../../inputs/Button/Button';
import { AspectRatio } from './AspectRatio';
import { Box } from '../Box/Box';


const meta: Meta<typeof AspectRatio> = {
  title: 'Layout/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: 'number',
      description: 'The aspect ratio (width / height)',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as child element (Slot pattern)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

const embedClass = css({ border: 'none', width: '100%', height: '100%' });
const coverImageClass = css({ width: '100%', height: '100%', objectFit: 'cover' });
const containImageClass = css({ width: '100%', height: '100%', objectFit: 'contain' });
const storyWidth = (width: number) => `[min(${width}px,calc(100vw - 3rem))]`;
const sampleImageSrc =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"%3E%3Crect width="800" height="500" fill="%23dbeafe"/%3E%3Ccircle cx="560" cy="150" r="90" fill="%23fbbf24"/%3E%3Cpath d="M0 390 180 220l130 120 120-95 370 260H0z" fill="%232563eb"/%3E%3Cpath d="M0 430 240 270l150 105 110-70 300 210H0z" fill="%230f766e"/%3E%3C/svg%3E';
const mapEmbedSrcDoc = `
<!doctype html>
<html>
  <head>
    <style>
      body {
        margin: 0;
        display: grid;
        place-items: center;
        width: 100vw;
        height: 100vh;
        background: #dbeafe;
        color: #1e3a8a;
        font: 600 24px sans-serif;
      }
    </style>
  </head>
  <body>Static map preview</body>
</html>
`;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Standard 16:9 aspect ratio, commonly used for video content (YouTube, Netflix, etc.)',
      },
    },
  },
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <Box w={storyWidth(560)}>
      <AspectRatio {...args}>
        <Box
          bg="slate.800"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          w="100%"
          h="100%"
        >
          16:9 Video
        </Box>
      </AspectRatio>
    </Box>
  ),
};

export const FocusableContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A focusable child keeps its external focus ring visible at the aspect-ratio edge.',
      },
    },
  },
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <Box w={storyWidth(400)}>
      <AspectRatio {...args}>
        <Button w="100%" h="100%">
          Focusable content
        </Button>
      </AspectRatio>
    </Box>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Video4x3: Story = {
  parameters: {
    docs: {
      description: { story: 'Classic 4:3 aspect ratio, used in older TVs and presentations.' },
    },
  },
  args: {
    ratio: 4 / 3,
  },
  render: (args) => (
    <Box w={storyWidth(400)}>
      <AspectRatio {...args}>
        <Box
          bg="slate.800"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          w="100%"
          h="100%"
        >
          4:3 Video
        </Box>
      </AspectRatio>
    </Box>
  ),
};

export const UltraWide21x9: Story = {
  parameters: {
    docs: { description: { story: 'Ultra-wide 21:9 aspect ratio for cinematic content.' } },
  },
  args: {
    ratio: 21 / 9,
  },
  render: (args) => (
    <Box w={storyWidth(600)}>
      <AspectRatio {...args}>
        <Box
          bg="violet.800"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          w="100%"
          h="100%"
        >
          21:9 Cinematic
        </Box>
      </AspectRatio>
    </Box>
  ),
};

export const Square1x1: Story = {
  parameters: {
    docs: {
      description: { story: 'Square 1:1 aspect ratio for profile pictures, Instagram posts, etc.' },
    },
  },
  args: {
    ratio: 1,
  },
  render: (args) => (
    <Box w={storyWidth(300)}>
      <AspectRatio {...args}>
        <img src={sampleImageSrc} alt="Profile" className={coverImageClass} />
      </AspectRatio>
    </Box>
  ),
};

export const ImageCover: Story = {
  parameters: {
    docs: { description: { story: 'Image with `object-fit: cover` (default for images).' } },
  },
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <Box w={storyWidth(500)}>
      <AspectRatio {...args}>
        <img src={sampleImageSrc} alt="Modern living room" className={coverImageClass} />
      </AspectRatio>
    </Box>
  ),
};

export const ImageContain: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Image with `object-fit: contain` (maintains aspect ratio, may have letterboxing).',
      },
    },
  },
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <Box w={storyWidth(500)}>
      <AspectRatio {...args} bg="slate.100">
        <img src={sampleImageSrc} alt="Modern living room" className={containImageClass} />
      </AspectRatio>
    </Box>
  ),
};

export const MapEmbed: Story = {
  parameters: {
    docs: { description: { story: 'Google Maps embed with 1:1 ratio.' } },
  },
  args: {
    ratio: 1,
  },
  render: (args) => (
    <Box w={storyWidth(400)}>
      <AspectRatio {...args}>
        <iframe
          srcDoc={mapEmbedSrcDoc}
          title="Google Maps"
          allowFullScreen
          loading="lazy"
          className={embedClass}
        />
      </AspectRatio>
    </Box>
  ),
};

export const CardThumbnail: Story = {
  parameters: {
    docs: { description: { story: 'Card thumbnail with 16:9 ratio.' } },
  },
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <Box w={storyWidth(350)} borderWidth="thin" borderRadius="lg" overflow="hidden">
      <AspectRatio {...args}>
        <img src={sampleImageSrc} alt="House" className={coverImageClass} />
      </AspectRatio>
      <Box p="base">
        <Box fontWeight="bold" fontSize="lg" mb="sm">
          Modern House
        </Box>
        <Box color="slate.600">Perfect family home with 3 bedrooms</Box>
      </Box>
    </Box>
  ),
};

export const AsChildPattern: Story = {
  parameters: {
    docs: { description: { story: 'asChild pattern: Render AspectRatio as a custom element.' } },
  },
  args: {
    asChild: true,
    ratio: 16 / 9,
  },
  render: (args) => (
    <Box w={storyWidth(500)}>
      <AspectRatio {...args}>
        <a href="https://example.com" target="_blank" rel="noopener noreferrer">
          <Box
            w="100%"
            h="100%"
            bg="blue.500"
            color="white"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            cursor="pointer"
            _hover={{ bg: 'blue.600' }}
          >
            <Box fontSize="2xl" mb="sm">
              Click Me
            </Box>
            <Box fontSize="sm" opacity={0.8}>
              Rendered as {'<a>'} tag
            </Box>
          </Box>
        </a>
      </AspectRatio>
    </Box>
  ),
};

export const ResponsiveRatios: Story = {
  parameters: {
    docs: {
      description: { story: 'Responsive usage: Different ratios for different screen sizes.' },
    },
  },
  render: () => (
    <Box w={{ base: '100%', md: storyWidth(600) }}>
      <Box mb="base" fontWeight="bold">
        Resize window to see ratio change (mobile: 1:1, desktop: 16:9)
      </Box>
      <Box display={{ base: 'block', md: 'none' }}>
        <AspectRatio ratio={1}>
          <Box
            bg="emerald.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            fontSize="xl"
            w="100%"
            h="100%"
          >
            Mobile 1:1
          </Box>
        </AspectRatio>
      </Box>
      <Box display={{ base: 'none', md: 'block' }}>
        <AspectRatio ratio={16 / 9}>
          <Box
            bg="emerald.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            fontSize="xl"
            w="100%"
            h="100%"
          >
            Desktop 16:9
          </Box>
        </AspectRatio>
      </Box>
    </Box>
  ),
};

export const MultipleRatios: Story = {
  parameters: {
    docs: { description: { story: 'Multiple aspect ratios in a grid layout.' } },
  },
  render: () => (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
      gap="md"
      w={storyWidth(700)}
    >
      <Box>
        <Box mb="sm" fontSize="sm" fontWeight="bold">
          16:9
        </Box>
        <AspectRatio ratio={16 / 9}>
          <Box bg="blue.400" w="100%" h="100%" />
        </AspectRatio>
      </Box>
      <Box>
        <Box mb="sm" fontSize="sm" fontWeight="bold">
          4:3
        </Box>
        <AspectRatio ratio={4 / 3}>
          <Box bg="emerald.400" w="100%" h="100%" />
        </AspectRatio>
      </Box>
      <Box>
        <Box mb="sm" fontSize="sm" fontWeight="bold">
          1:1
        </Box>
        <AspectRatio ratio={1}>
          <Box bg="violet.400" w="100%" h="100%" />
        </AspectRatio>
      </Box>
    </Box>
  ),
};

import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/inputs/Button';
import { Box } from '@/components/layout/Box';
import { Flex } from '@/components/layout/Flex';
import { Grid } from '@/components/layout/Grid';
import { Stack } from '@/components/layout/Stack';
import { StarIcon } from '@/components/media/Icon/icons';
import { Text } from '@/components/typography/Text';
import { OverlayTransition } from '@/components/animations/OverlayTransition/OverlayTransition';
import { overlayVariants } from '@/components/animations/OverlayTransition/OverlayTransition.presets';
import { OverlayTransitionProps } from '@/components/animations/OverlayTransition/OverlayTransition.types';

/**
 * A self-contained animation wrapper for overlay elements that manages its own `AnimatePresence` wiring based on an `isVisible` prop. Used as the animation layer for modals, drawers, popovers, and tooltips.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: motion/react (AnimatePresence), OverlayTransition presets, Radix Slot
 */
const meta: Meta<typeof OverlayTransition> = {
  title: 'Animations/OverlayTransition',
  component: OverlayTransition,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    animationType: {
      control: 'select',
      options: Object.keys(overlayVariants),
      description: 'The type of animation preset to use.',
    },
    isVisible: {
      control: 'boolean',
      description: 'Whether the component is visible.',
    },
    keepMounted: {
      control: 'boolean',
      description: 'Whether to keep the component in the DOM when closed.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof OverlayTransition>;

const boxStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '[300px]',
  height: '[200px]',
  bg: 'white',
  color: 'slate.800',
  fontWeight: 'bold',
  borderRadius: 'xl',
  boxShadow: 'xl',
  border: '[1px solid]',
  borderColor: 'slate.100',
  fontSize: 'lg',
  textAlign: 'center',
  p: '6',
});

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '[300px]',
});

const renderOverlayGalleryItem = ({
  isOpen,
  type,
}: {
  isOpen: boolean;
  type: NonNullable<OverlayTransitionProps['animationType']>;
}) => (
  <Box key={type} minHeight="[150px]">
    <Text mb="2" fontSize="xs" color="slate.500">
      {type}
    </Text>
    <OverlayTransition isVisible={isOpen} animationType={type}>
      <Box
        className={css({
          bg: 'blue.50',
          border: '[1px solid]',
          borderColor: 'blue.100',
          borderRadius: 'md',
          p: '4',
          textAlign: 'center',
          fontSize: 'sm',
        })}
      >
        {type}
      </Box>
    </OverlayTransition>
  </Box>
);

const InteractiveTemplate = (args: OverlayTransitionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Stack className={containerStyle}>
      <Button mb="8" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close' : 'Open'} {args.animationType}
      </Button>
      <OverlayTransition {...args} isVisible={isOpen}>
        <Flex className={boxStyle}>
          <Stack alignItems="center">
            <StarIcon size="lg" mb="2" />
            {args.animationType?.toUpperCase()}
          </Stack>
        </Flex>
      </OverlayTransition>
    </Stack>
  );
};

export const Default: Story = {
  render: InteractiveTemplate,
  args: {
    animationType: 'fade',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Popover: Story = {
  render: InteractiveTemplate,
  args: {
    animationType: 'popover',
  },
};

export const Zoom: Story = {
  render: InteractiveTemplate,
  args: {
    animationType: 'zoom',
  },
};

export const Modal: Story = {
  render: InteractiveTemplate,
  args: {
    animationType: 'modal',
  },
};

export const SlideUp: Story = {
  render: InteractiveTemplate,
  args: {
    animationType: 'slide-up',
  },
};

export const SlideRight: Story = {
  render: InteractiveTemplate,
  args: {
    animationType: 'slide-right',
  },
};

export const SlideLeft: Story = {
  render: InteractiveTemplate,
  args: {
    animationType: 'slide-left',
  },
};

export const SlideDown: Story = {
  render: InteractiveTemplate,
  args: {
    animationType: 'slide-down',
  },
};

export const Toast: Story = {
  render: InteractiveTemplate,
  args: {
    animationType: 'puff',
  },
};

export const Blur: Story = {
  render: InteractiveTemplate,
  args: {
    animationType: 'blur',
  },
};

export const Gallery: Story = {
  render: function GalleryStory() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Stack p="8" alignItems="center">
        <Button mb="8" onClick={() => setIsOpen(!isOpen)}>
          Toggle All Animations
        </Button>
        <Grid
          className={css({
            display: 'grid',
            gridTemplateColumns: '[repeat(auto-fill, minmax(200px, 1fr))]',
            gap: '6',
            mt: '8',
          })}
        >
          {renderOverlayGalleryItem({ isOpen, type: 'fade' })}
          {renderOverlayGalleryItem({ isOpen, type: 'popover' })}
          {renderOverlayGalleryItem({ isOpen, type: 'zoom' })}
          {renderOverlayGalleryItem({ isOpen, type: 'modal' })}
          {renderOverlayGalleryItem({ isOpen, type: 'slide-up' })}
          {renderOverlayGalleryItem({ isOpen, type: 'slide-right' })}
          {renderOverlayGalleryItem({ isOpen, type: 'slide-left' })}
          {renderOverlayGalleryItem({ isOpen, type: 'slide-down' })}
          {renderOverlayGalleryItem({ isOpen, type: 'puff' })}
          {renderOverlayGalleryItem({ isOpen, type: 'blur' })}
        </Grid>
      </Stack>
    );
  },
};

export const AsChild: Story = {
  render: function AsChildStory(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Stack className={containerStyle}>
        <Button mb="8" onClick={() => setIsOpen(!isOpen)}>
          Toggle AsChild
        </Button>
        <OverlayTransition {...args} isVisible={isOpen} asChild animationType="fade">
          <Box
            className={css({
              width: '[300px]',
              height: '[200px]',
              bg: 'violet.500',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'xl',
              boxShadow: 'xl',
              fontSize: 'xl',
              fontWeight: 'bold',
            })}
          >
            I am a direct child
          </Box>
        </OverlayTransition>
      </Stack>
    );
  },
};

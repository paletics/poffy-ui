import { Box } from '@/components/layout/Box';
import { Flex } from '@/components/layout/Flex';
import { Grid } from '@/components/layout/Grid';
import { Heading } from '@/components/typography/Heading';
import { Text } from '@/components/typography/Text';
import { css, cx } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { TextRevealTransition } from '@/components/animations/TextRevealTransition/TextRevealTransition';
import {
  TextRevealTransitionType,
  textVariants,
} from '@/components/animations/TextRevealTransition/TextRevealTransition.presets';

/**
 * A kinetic typography component that splits text into characters or words and orchestrates staggered reveal animations when the element enters the viewport. Used for hero headings, landing page focal points, and high-impact short text.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: motion/react (whileInView, stagger), TextRevealTransition presets, Panda CSS recipe, Radix Slot
 */
const meta: Meta<typeof TextRevealTransition> = {
  title: 'Animations/TextRevealTransition',
  component: TextRevealTransition,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    animationType: {
      control: 'select',
      options: Object.keys(textVariants),
      description: 'The type of animation preset to use.',
    },
    staggerDelay: {
      control: { type: 'number', min: 0, max: 1, step: 0.01 },
      description: 'Delay between each character/word animation.',
    },
    children: {
      control: 'text',
      description: 'The text content to animate.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextRevealTransition>;

const textStyle = css({
  fontSize: '3xl',
  fontWeight: 'bold',
  letterSpacing: 'tight',
  color: 'slate.800',
  textAlign: 'center',
});

const cursorClass = css({
  display: 'inline-block',
  width: '[2px]',
  height: '[1.1em]',
  bg: 'currentColor',
  ml: '1',
  verticalAlign: 'text-bottom',
  animation: '_cursor-blink 1s step-end infinite',
});

const renderTextGalleryItem = (type: TextRevealTransitionType) => (
  <Box key={type} borderBottom="[1px solid]" borderColor="slate.100" pb="6">
    <Text mb="4" fontSize="xs" color="slate.400" fontFamily="mono">
      {type}
    </Text>
    <TextRevealTransition
      animationType={type}
      className={css({ fontSize: '2xl', fontWeight: 'bold' })}
    >
      Sample text using the {type} preset for beautiful typography.
    </TextRevealTransition>
  </Box>
);

export const Default: Story = {
  args: {
    animationType: 'typewriter',
    children: 'The Art of Digital Craftsmanship.',
    className: textStyle,
  },

  render: () => (
    <Grid gap="2xl" p="8" maxWidth="[800px]">
      <Flex alignItems="center">
        <TextRevealTransition
          animationType="typewriter"
          staggerDelay={0.08}
          className={css({ fontSize: '3xl', fontFamily: 'mono' })}
        >
          Sample text using the typewriter preset for beautiful typography.
        </TextRevealTransition>
        <style>{`@keyframes _cursor-blink { 50% { opacity: 0 } }`}</style>
        <Box aria-hidden className={cursorClass} />
      </Flex>
    </Grid>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Typing: Story = {
  args: {
    animationType: 'typewriter',
    children: 'The Art of Digital Craftsmanship.',
    className: textStyle,
  },
};

export const FadeIn: Story = {
  args: {
    animationType: 'fade-in',
    children: 'Fade In Animation',
    className: textStyle,
  },
};

export const FadeUp: Story = {
  args: {
    animationType: 'fade-up',
    children: 'Fade Up Animation',
    className: textStyle,
  },
};

export const Bounce: Story = {
  args: {
    animationType: 'bounce',
    children: 'Bouncy & Playful Typography',
    className: cx(textStyle, css({ color: 'pink.500' })),
  },
};

export const WordPop: Story = {
  args: {
    animationType: 'word-pop',
    children: 'Every word matters in this design.',
    className: cx(textStyle, css({ color: 'indigo.600' })),
  },
};

export const Gallery: Story = {
  render: () => (
    <Grid gap="2xl" p="8" maxWidth="[800px]">
      {renderTextGalleryItem('typewriter')}
      {renderTextGalleryItem('fade-in')}
      {renderTextGalleryItem('fade-up')}
      {renderTextGalleryItem('blur')}
      {renderTextGalleryItem('bounce')}
      {renderTextGalleryItem('word-pop')}
      {renderTextGalleryItem('none')}
    </Grid>
  ),
};

export const AsChild: Story = {
  args: {
    animationType: 'fade-in',
    asChild: true,
  },
  render: (args) => (
    <TextRevealTransition {...args}>
      <Heading level="1" className={textStyle}>
        I am a direct child Heading
      </Heading>
    </TextRevealTransition>
  ),
};

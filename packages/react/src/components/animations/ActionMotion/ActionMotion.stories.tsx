import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@/components/layout/Box';
import { Grid } from '@/components/layout/Grid';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';
import { ActionMotion } from '@/components/animations/ActionMotion/ActionMotion';
import {
  ActionMotionType,
  actionVariants,
} from '@/components/animations/ActionMotion/ActionMotion.presets';

/**
 * Provides standardized micro-interaction animations (hover, tap, focus) for interactive elements. Used as a mandatory wrapper for every interactive atomic element to enforce system-wide motion consistency.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: motion/react, ActionMotion presets, Radix Slot
 */
const meta: Meta<typeof ActionMotion> = {
  title: 'Animations/ActionMotion',
  component: ActionMotion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    animationType: {
      control: 'select',
      options: Object.keys(actionVariants),
      description: 'The type of animation preset to use.',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActionMotion>;

const buttonBaseClass = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '[120px]',
  height: '[50px]',
  color: '[white]',
  fontWeight: 'bold',
  borderRadius: 'xl',
  cursor: 'pointer',
  userSelect: 'none',
  fontSize: 'xs',
  boxShadow: 'md',
});

const actionColorClass = {
  press: css({ bg: 'blue.700' }),
  physical: css({ bg: 'orange.700' }),
  subtle: css({ bg: 'slate.600' }),
  bouncy: css({ bg: 'pink.700' }),
  vibrant: css({ bg: 'violet.700' }),
  squish: css({ bg: 'emerald.700' }),
  glow: css({ bg: 'cyan.700' }),
  pulse: css({ bg: 'rose.700' }),
  sharp: css({ bg: 'teal.700' }),
} satisfies Record<ActionMotionType, string>;

const getBoxStyle = (type: ActionMotionType): string =>
  `${buttonBaseClass} ${actionColorClass[type]}`;

const buttonResetClass = css({
  border: 'none',
});

const renderActionGalleryItem = (type: ActionMotionType) => (
  <Stack key={type} alignItems="center">
    <Text mb="2" fontSize="2xs" color="slate.500" fontWeight="medium">
      {type.toUpperCase()}
    </Text>
    <ActionMotion animationType={type}>
      <Box className={getBoxStyle(type)}>{type}</Box>
    </ActionMotion>
  </Stack>
);

export const Default: Story = {
  args: {
    animationType: 'press',
    children: <Box className={getBoxStyle('press')}>Press Me</Box>,
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Physical: Story = {
  args: {
    animationType: 'physical',
    children: <Box className={getBoxStyle('physical')}>Physical</Box>,
  },
};

export const Bouncy: Story = {
  args: {
    animationType: 'bouncy',
    children: <Box className={getBoxStyle('bouncy')}>Bouncy</Box>,
  },
};

export const Vibrant: Story = {
  args: {
    animationType: 'vibrant',
    children: <Box className={getBoxStyle('vibrant')}>Vibrant</Box>,
  },
};

export const Squish: Story = {
  args: {
    animationType: 'squish',
    children: <Box className={getBoxStyle('squish')}>Squish</Box>,
  },
};

export const Glow: Story = {
  args: {
    animationType: 'glow',
    children: <Box className={getBoxStyle('glow')}>Glow</Box>,
  },
};

export const AsChild: Story = {
  args: {
    asChild: true,
    animationType: 'bouncy',
    children: (
      <button className={`${getBoxStyle('bouncy')} ${buttonResetClass}`}>I assume props</button>
    ),
  },
};

export const Gallery: Story = {
  render: () => (
    <Grid
      className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8',
        p: '8',
      })}
    >
      {renderActionGalleryItem('press')}
      {renderActionGalleryItem('physical')}
      {renderActionGalleryItem('subtle')}
      {renderActionGalleryItem('bouncy')}
      {renderActionGalleryItem('vibrant')}
      {renderActionGalleryItem('squish')}
      {renderActionGalleryItem('glow')}
      {renderActionGalleryItem('pulse')}
      {renderActionGalleryItem('sharp')}
    </Grid>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/inputs/Button';
import { Box } from '@/components/layout';
import { ContentTransition } from './ContentTransition';
import { useState } from 'react';
import { css } from '@/styled-system/css';

/**
 * Handles smooth content switching between two views with animated enter/exit transitions. Used wherever conditional rendering or tab-style content swaps require choreographed mount/unmount sequences.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: motion/react (AnimatePresence), ContentTransition presets, Radix Slot
 */
const meta: Meta<typeof ContentTransition> = {
  title: 'Animations/ContentTransition',
  component: ContentTransition,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContentTransition>;

type ContentBoxColor = 'blue' | 'red' | 'purple' | 'green' | 'orange' | 'pink';

const contentBoxBaseClass = css({
  w: '[300px]',
  h: '[200px]',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2xl',
  fontWeight: 'bold',
  borderRadius: 'lg',
  boxShadow: 'lg',
});

const contentBoxColorClass = {
  blue: css({ bg: 'blue.700' }),
  red: css({ bg: 'rose.700' }),
  purple: css({ bg: 'violet.700' }),
  green: css({ bg: 'emerald.700' }),
  orange: css({ bg: 'orange.700' }),
  pink: css({ bg: 'pink.700' }),
} satisfies Record<ContentBoxColor, string>;

const renderContentBox = (color: ContentBoxColor, text: string) => (
  <Box className={`${contentBoxBaseClass} ${contentBoxColorClass[color]}`}>{text}</Box>
);

export const Default: Story = {
  render: function BasicStory() {
    const [isA, setIsA] = useState(true);
    return (
      <div className={css({ p: '[32px]' })}>
        <Button mb="[16px]" onClick={() => setIsA(!isA)}>
          Toggle Content
        </Button>
        <div className={css({ position: 'relative' })}>
          <ContentTransition animationType="fade" transitionKey={isA ? 'A' : 'B'}>
            {isA ? renderContentBox('blue', 'Content A') : renderContentBox('red', 'Content B')}
          </ContentTransition>
        </div>
      </div>
    );
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const TrueCrossfade: Story = {
  args: {
    animationType: 'crossfade',
    mode: 'sync',
  },
  render: function CrossfadeStory(args) {
    const [isA, setIsA] = useState(true);
    return (
      <div className={css({ p: '[32px]' })}>
        <Button mb="[16px]" onClick={() => setIsA(!isA)}>
          Crossfade Toggle
        </Button>
        <div className={css({ position: 'relative', h: '[200px]' })}>
          <ContentTransition
            {...args}
            transitionKey={isA ? 'A' : 'B'}
            className={css({ position: 'absolute', top: 0, left: 0 })}
          >
            {isA
              ? renderContentBox('purple', 'Purple View')
              : renderContentBox('green', 'Green View')}
          </ContentTransition>
        </div>
      </div>
    );
  },
};

export const Flip3D: Story = {
  args: {
    animationType: 'flip-x',
  },
  render: function Flip3DStory(args) {
    const [isA, setIsA] = useState(true);
    return (
      <div className={css({ p: '[32px]' })}>
        <Button mb="[16px]" onClick={() => setIsA(!isA)}>
          Flip Transition
        </Button>
        <ContentTransition {...args} transitionKey={isA ? 'A' : 'B'}>
          {isA ? renderContentBox('orange', 'Front Side') : renderContentBox('pink', 'Back Side')}
        </ContentTransition>
      </div>
    );
  },
};

export const Morph: Story = {
  args: {
    animationType: 'morph',
  },
  render: function MorphStory(args) {
    const [isA, setIsA] = useState(true);
    return (
      <div className={css({ p: '[32px]' })}>
        <Button mb="[16px]" onClick={() => setIsA(!isA)}>
          Morph Toggle
        </Button>
        <ContentTransition {...args} transitionKey={isA ? 'A' : 'B'}>
          {isA ? (
            <Box w="[128px]" h="[128px]" bg="blue.700" borderRadius="full" />
          ) : (
            <Box w="[256px]" h="[128px]" bg="rose.700" borderRadius="none" />
          )}
        </ContentTransition>
      </div>
    );
  },
};

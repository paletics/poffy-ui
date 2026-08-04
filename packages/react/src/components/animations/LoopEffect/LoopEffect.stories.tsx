import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/inputs/Button';
import { LoopEffect } from './LoopEffect';
import { LoopEffectType, loopVariants } from './LoopEffect.presets';

const meta: Meta<typeof LoopEffect> = {
  title: 'Animations/LoopEffect',
  component: LoopEffect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    animationType: {
      control: 'select',
      options: Object.keys(loopVariants),
      description: 'The type of loop animation preset to use.',
    },
    duration: {
      control: { type: 'number', min: 0.5, max: 10, step: 0.5 },
      description: 'Custom duration in seconds to override preset default.',
    },
    isPaused: {
      control: 'boolean',
      description: 'Pause the animation.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoopEffect>;

type LoopBoxColor = 'blue' | 'pink' | 'purple' | 'orange' | 'green' | 'gray';

const boxBaseClass = css({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 'sm',
  width: '[120px]',
  height: '[120px]',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: 'xl',
  boxShadow: 'lg',
});

const boxColorClass = {
  blue: css({ bg: 'blue.700' }),
  pink: css({ bg: 'pink.700' }),
  purple: css({ bg: 'violet.700' }),
  orange: css({ bg: 'orange.700' }),
  green: css({ bg: 'emerald.700' }),
  gray: css({ bg: 'slate.700' }),
} satisfies Record<LoopBoxColor, string>;

const boxStyle = (color: LoopBoxColor) => `${boxBaseClass} ${boxColorClass[color]}`;

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'lg',
  p: { base: 'base', md: 'xl' },
  borderWidth: 'thin',
  borderStyle: 'dashed',
  borderColor: 'layout.divider',
  borderRadius: 'xl',
  width: '[min(400px, calc(100vw - 4rem))]',
  maxWidth: '[100%]',
  minHeight: '[300px]',
});

const controlStyle = css({
  display: 'flex',
  gap: 'md',
  alignItems: 'center',
});

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Float animation - gentle up and down floating motion. Perfect for icons, badges, or decorative elements.',
      },
    },
  },
  render: function FloatStory(args) {
    const [isPaused, setIsPaused] = useState(false);

    return (
      <div className={containerStyle}>
        <div className={controlStyle}>
          <Button size="sm" appearance="outline" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>

        <LoopEffect {...args} animationType="float" isPaused={isPaused}>
          <div className={boxStyle('blue')}>
            <div className={css({ fontSize: '3xl' })}>Float</div>
            <div className={css({ fontSize: 'sm' })}>Float</div>
          </div>
        </LoopEffect>
      </div>
    );
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Pulse: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pulse animation - rhythmic scaling for attention. Ideal for notification badges or call-to-action elements.',
      },
    },
  },
  render: function PulseStory(args) {
    const [isPaused, setIsPaused] = useState(false);

    return (
      <div className={containerStyle}>
        <div className={controlStyle}>
          <Button size="sm" appearance="outline" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>

        <LoopEffect {...args} animationType="pulse" isPaused={isPaused}>
          <div className={boxStyle('pink')}>
            <div className={css({ fontSize: '3xl' })}>Pulse</div>
            <div className={css({ fontSize: 'sm' })}>Pulse</div>
          </div>
        </LoopEffect>
      </div>
    );
  },
};

export const Spin: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Spin animation - continuous rotation. Perfect for loading indicators or settings icons.',
      },
    },
  },
  render: function SpinStory(args) {
    const [isPaused, setIsPaused] = useState(false);

    return (
      <div className={containerStyle}>
        <div className={controlStyle}>
          <Button size="sm" appearance="outline" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>

        <LoopEffect {...args} animationType="spin" isPaused={isPaused}>
          <div className={boxStyle('purple')}>
            <div className={css({ fontSize: '3xl' })}>Spin</div>
            <div className={css({ fontSize: 'sm' })}>Spin</div>
          </div>
        </LoopEffect>
      </div>
    );
  },
};

export const Shake: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Shake animation - playful vibrating motion. Great for error states or playful interactions.',
      },
    },
  },
  render: function ShakeStory(args) {
    const [isPaused, setIsPaused] = useState(false);

    return (
      <div className={containerStyle}>
        <div className={controlStyle}>
          <Button size="sm" appearance="outline" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>

        <LoopEffect {...args} animationType="shake" isPaused={isPaused}>
          <div className={boxStyle('orange')}>
            <div className={css({ fontSize: '3xl' })}>Shake</div>
            <div className={css({ fontSize: 'sm' })}>Shake</div>
          </div>
        </LoopEffect>
      </div>
    );
  },
};

export const Bounce: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Bounce animation - energetic bouncing motion. Perfect for highlighting important elements or celebrating actions.',
      },
    },
  },
  render: function BounceStory(args) {
    const [isPaused, setIsPaused] = useState(false);

    return (
      <div className={containerStyle}>
        <div className={controlStyle}>
          <Button size="sm" appearance="outline" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>

        <LoopEffect {...args} animationType="bounce" isPaused={isPaused}>
          <div className={boxStyle('green')}>
            <div className={css({ fontSize: '3xl' })}>Bounce</div>
            <div className={css({ fontSize: 'sm' })}>Bounce</div>
          </div>
        </LoopEffect>
      </div>
    );
  },
};

export const None: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'None - static element with no animation. Useful for conditional animations or accessibility preferences.',
      },
    },
  },
  render: (args) => (
    <div className={containerStyle}>
      <LoopEffect {...args} animationType="none">
        <div className={boxStyle('gray')}>
          <div className={css({ fontSize: '3xl' })}>None</div>
          <div className={css({ fontSize: 'sm' })}>None</div>
        </div>
      </LoopEffect>

      <div className={css({ fontSize: 'xs', color: 'slate.500', textAlign: 'center' })}>
        No animation applied
      </div>
    </div>
  ),
};

export const Gallery: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Gallery view - showcases all loop animation types. Interactive demonstration of all available animations with pause control.',
      },
    },
  },
  render: function GalleryStory() {
    const allTypes = (Object.keys(loopVariants) as LoopEffectType[]).filter(
      (type) => type !== 'none',
    );
    const [isPausedMap, setIsPausedMap] = useState<Record<string, boolean>>(
      Object.fromEntries(allTypes.map((type) => [type, false])),
    );

    const togglePause = (type: string) => {
      setIsPausedMap((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    const toggleAll = () => {
      const allPaused = Object.values(isPausedMap).every((val) => val);
      setIsPausedMap(Object.fromEntries(allTypes.map((type) => [type, !allPaused])));
    };

    const colors: Record<string, LoopBoxColor> = {
      float: 'blue',
      pulse: 'pink',
      spin: 'purple',
      shake: 'orange',
      bounce: 'green',
    };

    const emojis: Record<string, string> = {
      float: 'Float',
      pulse: 'Pulse',
      spin: 'Spin',
      shake: 'Shake',
      bounce: 'Bounce',
    };

    const allPaused = Object.values(isPausedMap).every((val) => val);

    return (
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: 'lg',
          p: { base: 'base', md: 'xl' },
          maxWidth: '[1000px]',
          width: '[min(1000px, calc(100vw - 4rem))]',
        })}
      >
        <div className={css({ display: 'flex', justifyContent: 'center' })}>
          <Button onClick={toggleAll}>{allPaused ? 'Resume All' : 'Pause All'}</Button>
        </div>

        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: '[repeat(auto-fit, minmax(min(160px, 100%), 1fr))]',
            gap: 'lg',
          })}
        >
          {allTypes.map((type) => (
            <div
              key={type}
              className={css({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'md',
                p: 'base',
                bg: 'slate.50',
                borderRadius: 'lg',
                borderWidth: 'thin',
                borderStyle: 'solid',
                borderColor: 'layout.divider',
              })}
            >
              <div
                className={css({
                  fontSize: 'sm',
                  color: 'slate.600',
                  fontWeight: 'semibold',
                  textTransform: 'uppercase',
                  letterSpacing: 'wide',
                })}
              >
                {type}
              </div>

              <LoopEffect animationType={type} isPaused={isPausedMap[type]}>
                <div className={boxStyle(colors[type] ?? 'gray')}>
                  <div className={css({ fontSize: '2xl' })}>{emojis[type] ?? '*'}</div>
                  <div className={css({ fontSize: 'xs' })}>{type}</div>
                </div>
              </LoopEffect>

              <Button size="sm" appearance="outline" onClick={() => togglePause(type)}>
                {isPausedMap[type] ? 'Resume' : 'Pause'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const AsChild: Story = {
  render: (args) => {
    return (
      <div className={containerStyle}>
        <LoopEffect {...args} asChild animationType="pulse">
          <Button shape="pill" appearance="solid">
            Pulsing Button (AsChild)
          </Button>
        </LoopEffect>
      </div>
    );
  },
};

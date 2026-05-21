import { Button } from '@/components/inputs/Button/Button';
import { Box } from '@/components/layout/Box';
import { Flex } from '@/components/layout/Flex';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';
import { css, cx } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LayoutTransition } from '@/components/animations/LayoutTransition/LayoutTransition';
import { layoutVariants } from '@/components/animations/LayoutTransition/LayoutTransition.presets';

/**
 * Automatically animates changes to an element's size or position in the DOM using Framer Motion's layout FLIP technique. Used to wrap elements that dynamically resize, reorder, or reshape (e.g. accordions, switches, morphing shapes).
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: motion/react (layout animation), LayoutTransition presets, Radix Slot
 */
const meta: Meta<typeof LayoutTransition> = {
  title: 'Animations/LayoutTransition',
  component: LayoutTransition,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    animationType: {
      control: 'select',
      options: Object.keys(layoutVariants),
      description: 'The type of animation preset to use.',
    },
    layout: {
      control: 'select',
      options: [true, 'position', 'size'],
      description: 'The type of layout animation.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LayoutTransition>;

const boxClass = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bg: 'blue.700',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: 'md',
  cursor: 'pointer',
});

const boxSizeClass = {
  md: css({ width: '[60px]', height: '[60px]' }),
  sm: css({ width: '[40px]', height: '[40px]' }),
};

const buttonSizeClass = {
  small: css({ width: '[100px]' }),
  big: css({ width: '[200px]' }),
};

const animatedButtonClass = css({
  height: '[50px]',
  bg: 'blue.700',
  color: 'white',
  borderRadius: 'md',
  cursor: 'pointer',
  fontWeight: 'bold',
});

const accordionPanelClass = css({
  width: '[300px]',
  bg: 'blue.50',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'md',
  borderColor: 'blue.200',
});

const accordionPanelStateClass = {
  open: css({ height: '[150px]', border: '[1px solid]' }),
  closed: css({ height: '[0px]', border: '[0px]' }),
};

const switchClass = css({
  width: '[60px]',
  height: '[34px]',
  borderRadius: 'full',
  p: '[2px]',
  cursor: 'pointer',
  display: 'flex',
  transition: '[background 0.2s]',
  border: 'none',
});

const switchStateClass = {
  on: css({ bg: 'blue.700', justifyContent: 'flex-end' }),
  off: css({ bg: 'slate.300', justifyContent: 'flex-start' }),
};

const switchThumbClass = css({
  width: '[30px]',
  height: '[30px]',
  display: 'block',
  bg: 'white',
  borderRadius: 'full',
});

const morphShapeClass = {
  circle: css({ width: '[100px]', height: '[100px]', bg: 'violet.700', borderRadius: 'full' }),
  rect: css({ width: '[200px]', height: '[100px]', bg: 'blue.700', borderRadius: 'md' }),
};

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4',
  p: '8',
  border: '[1px dashed]',
  borderColor: 'slate.200',
  borderRadius: 'xl',
  minWidth: '[400px]',
});

export const Default: Story = {
  render: function AsChildStory(args) {
    const [isBig, setIsBig] = useState(false);
    return (
      <Stack className={containerStyle}>
        <Button appearance="minimal" animationType="subtle" onClick={() => setIsBig(!isBig)}>
          Toggle Size
        </Button>
        <LayoutTransition {...args} asChild layout>
          <Button
            appearance="minimal"
            animationType="subtle"
            className={cx(animatedButtonClass, isBig ? buttonSizeClass.big : buttonSizeClass.small)}
          >
            I am a button
          </Button>
        </LayoutTransition>
      </Stack>
    );
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Reorder: Story = {
  render: function ReorderStory(args) {
    const [items, setItems] = useState(['A', 'B', 'C', 'D']);
    const rotateItems = () => setItems((current) => [...current.slice(1), current[0]]);
    return (
      <Stack className={containerStyle}>
        <Button appearance="minimal" animationType="subtle" onClick={rotateItems}>
          Rotate Items
        </Button>
        <Flex gap="xs">
          {items.map((item) => (
            <LayoutTransition key={item} {...args} animationType="reorder">
              <Box className={cx(boxClass, boxSizeClass.md)}>{item}</Box>
            </LayoutTransition>
          ))}
        </Flex>
      </Stack>
    );
  },
};

export const Accordion: Story = {
  render: function AccordionStory(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Stack className={containerStyle}>
        <Button appearance="minimal" animationType="subtle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Collapse' : 'Expand'} Content
        </Button>
        <LayoutTransition {...args} animationType="accordion">
          <Box
            className={cx(
              accordionPanelClass,
              isOpen ? accordionPanelStateClass.open : accordionPanelStateClass.closed,
            )}
          >
            {isOpen && <Text color="blue.800">Expanded Content</Text>}
          </Box>
        </LayoutTransition>
      </Stack>
    );
  },
};

export const Switch: Story = {
  render: function SwitchStory(args) {
    const [isOn, setIsOn] = useState(false);
    return (
      <Stack className={containerStyle}>
        <Button asChild appearance="minimal" animationType="subtle">
          <button
            role="switch"
            aria-checked={isOn}
            className={cx(switchClass, isOn ? switchStateClass.on : switchStateClass.off)}
            onClick={() => setIsOn(!isOn)}
          >
            <LayoutTransition {...args} asChild animationType="switch" layout>
              <span className={switchThumbClass} />
            </LayoutTransition>
          </button>
        </Button>
        <Text fontSize="sm" color="slate.500">
          Switch is {isOn ? 'ON' : 'OFF'}
        </Text>
      </Stack>
    );
  },
};

export const Morph: Story = {
  render: function MorphStory(args) {
    const [isCircle, setIsCircle] = useState(false);
    return (
      <Stack className={containerStyle}>
        <Button appearance="minimal" animationType="subtle" onClick={() => setIsCircle(!isCircle)}>
          Morph Shape
        </Button>
        <LayoutTransition {...args} animationType="morph" layout>
          <Box className={isCircle ? morphShapeClass.circle : morphShapeClass.rect} />
        </LayoutTransition>
      </Stack>
    );
  },
};

export const Elastic: Story = {
  render: function ElasticStory(args) {
    const [count, setCount] = useState(1);
    return (
      <Stack className={containerStyle}>
        <Flex gap="xs">
          <Button
            appearance="minimal"
            animationType="subtle"
            onClick={() => setCount(Math.max(1, count - 1))}
          >
            -
          </Button>
          <Button appearance="minimal" animationType="subtle" onClick={() => setCount(count + 1)}>
            +
          </Button>
        </Flex>
        <Flex
          className={css({ display: 'flex', flexWrap: 'wrap', gap: '2', justifyContent: 'center' })}
        >
          {Array.from({ length: count }).map((_, i) => (
            <LayoutTransition key={i} {...args} animationType="elastic" layout>
              <Box className={cx(boxClass, boxSizeClass.sm)}>{i + 1}</Box>
            </LayoutTransition>
          ))}
        </Flex>
      </Stack>
    );
  },
};

export const Stable: Story = {
  render: function StableStory(args) {
    const [isLong, setIsLong] = useState(false);
    return (
      <Stack className={containerStyle}>
        <Button appearance="minimal" animationType="subtle" onClick={() => setIsLong(!isLong)}>
          Toggle Content Length
        </Button>
        <Box width="[300px]" p="4" bg="slate.50" borderRadius="md">
          <LayoutTransition {...args} animationType="stable" layout>
            <Text fontSize="sm" lineHeight="relaxed">
              {isLong
                ? 'This is a much longer text that will definitely wrap to multiple lines and cause the container to resize its layout. Notice how the transition is smooth and stable without any jittery movement.'
                : 'Brief text content.'}
            </Text>
          </LayoutTransition>
        </Box>
      </Stack>
    );
  },
};

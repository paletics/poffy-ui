import type { Meta, StoryObj } from '@storybook/react';
import { Box, Flex } from '@/components/layout';
import { DragMotion } from './DragMotion';
import { css } from '@/styled-system/css';
import { useRef } from 'react';

/**
 * Adds 2D drag-and-drop capabilities with physics-based inertia and optional boundary constraints to any child element. Used to build interactive sliders, carousels, and sortable surfaces.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: motion/react (gesture recognizers), Radix Slot
 */
const meta: Meta<typeof DragMotion> = {
  title: 'Animations/DragMotion',
  component: DragMotion,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DragMotion>;

type DragTargetColor = 'blue' | 'red' | 'green' | 'orange';

const dragTargetBaseClass = css({
  w: '[100px]',
  h: '[100px]',
  borderRadius: 'lg',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'grab',
  _active: { cursor: 'grabbing' },
});

const dragTargetColorClass = {
  blue: css({ bg: 'blue.700' }),
  red: css({ bg: 'rose.700' }),
  green: css({ bg: 'emerald.700' }),
  orange: css({ bg: 'orange.700' }),
} satisfies Record<DragTargetColor, string>;

const renderDragTarget = (children: React.ReactNode, color: DragTargetColor = 'blue') => (
  <Box className={`${dragTargetBaseClass} ${dragTargetColorClass[color]}`}>{children}</Box>
);

export const Default: Story = {
  render: () => (
    <Flex p="[100px]" h="[400px]" bg="slate.50" align="center" justify="center">
      <DragMotion>{renderDragTarget('Free Move')}</DragMotion>
    </Flex>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Constrained: Story = {
  render: function ConstrainedStory() {
    const containerRef = useRef(null);
    return (
      <div
        ref={containerRef}
        className={css({
          w: '[500px]',
          h: '[300px]',
          border: '2px dashed',
          borderColor: 'slate.300',
          position: 'relative',
          m: '[50px]',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <DragMotion dragConstraints={containerRef} dragElastic={0.2}>
          {renderDragTarget('Bounded', 'red')}
        </DragMotion>
      </div>
    );
  },
};

export const AxisLocked: Story = {
  render: () => (
    <div className={css({ p: '[100px]', display: 'flex', gap: '[50px]' })}>
      <DragMotion drag="x">{renderDragTarget('X Only', 'green')}</DragMotion>
      <DragMotion drag="y">{renderDragTarget('Y Only', 'orange')}</DragMotion>
    </div>
  ),
};

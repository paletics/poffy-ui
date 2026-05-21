import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/inputs/Button';
import { ListTransition } from './ListTransition';
import { listContainerVariants } from './ListTransition.presets';
import { ListTransitionProps } from './ListTransition.types';

/**
 * Orchestrates staggered entrance animations across a list of items using a container-level variant that propagates timing to child `ListTransition.Item` nodes. Used for animating navigation menus, data arrays, and other repeating semantic structures.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: motion/react (stagger propagation), ListTransition presets, Radix Slot
 */
const meta: Meta<typeof ListTransition> = {
  title: 'Animations/ListTransition',
  component: ListTransition,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    animationType: {
      control: 'select',
      options: Object.keys(listContainerVariants),
      description: 'The stagger pattern for the container.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ListTransition>;

const itemStyle = css({
  p: '4',
  bg: 'blue.700',
  color: 'white',
  borderRadius: 'md',
  textAlign: 'center',
  fontWeight: 'bold',
  width: 'full',
});

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
  width: '[300px]',
  p: '6',
  border: '[1px solid]',
  borderColor: 'slate.100',
  borderRadius: 'xl',
  bg: 'slate.50',
});

const InteractiveTemplate = (args: ListTransitionProps) => {
  const items = [1, 2, 3, 4, 5];
  const [key, setKey] = useState(0);

  const refresh = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className={css({ textAlign: 'center' })}>
      <Button appearance="outline" mb="6" onClick={refresh}>
        Replay Animation
      </Button>
      <div key={key} className={containerStyle}>
        <ListTransition {...args}>
          {items.map((i) => (
            <ListTransition.Item key={i}>
              <div className={itemStyle}>Item {i}</div>
            </ListTransition.Item>
          ))}
        </ListTransition>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: InteractiveTemplate,
  args: {
    animationType: 'flow',
  } as ListTransitionProps,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Burst: Story = {
  render: InteractiveTemplate,
  args: {
    animationType: 'burst',
  } as ListTransitionProps,
};

export const Lazy: Story = {
  render: InteractiveTemplate,
  args: {
    animationType: 'lazy',
  } as ListTransitionProps,
};

export const AsChild: Story = {
  render: (args) => {
    return (
      <div className={containerStyle}>
        <ListTransition {...args} asChild animationType="flow">
          <ul
            className={css({
              listStyle: 'none',
              p: '0',
              m: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
            })}
          >
            {[1, 2, 3].map((i) => (
              <ListTransition.Item key={i} asChild>
                <li className={itemStyle}>Custom Li {i}</li>
              </ListTransition.Item>
            ))}
          </ul>
        </ListTransition>
      </div>
    );
  },
};

export const Mixed: Story = {
  render: function MixedStory() {
    const [key, setKey] = useState(0);
    return (
      <div className={css({ p: '8', textAlign: 'center' })}>
        <Button appearance="outline" mb="6" onClick={() => setKey((k) => k + 1)}>
          Toggle All
        </Button>
        <div
          key={key}
          className={css({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8' })}
        >
          <div>
            <div className={css({ mb: '2', fontSize: 'xs', color: 'slate.500' })}>Flow + Fade</div>
            <ListTransition animationType="flow">
              {[1, 2, 3, 4].map((i) => (
                <ListTransition.Item key={i} animationType="fade">
                  <div className={itemStyle}>Fade {i}</div>
                </ListTransition.Item>
              ))}
            </ListTransition>
          </div>
          <div>
            <div className={css({ mb: '2', fontSize: 'xs', color: 'slate.500' })}>Burst + Pop</div>
            <ListTransition animationType="burst">
              {[1, 2, 3, 4].map((i) => (
                <ListTransition.Item key={i} animationType="pop">
                  <div className={itemStyle}>Pop {i}</div>
                </ListTransition.Item>
              ))}
            </ListTransition>
          </div>
          <div>
            <div className={css({ mb: '2', fontSize: 'xs', color: 'slate.500' })}>Lazy + Slide</div>
            <ListTransition animationType="lazy">
              {[1, 2, 3, 4].map((i) => (
                <ListTransition.Item key={i} animationType="slide">
                  <div className={itemStyle}>Slide {i}</div>
                </ListTransition.Item>
              ))}
            </ListTransition>
          </div>
        </div>
      </div>
    );
  },
};

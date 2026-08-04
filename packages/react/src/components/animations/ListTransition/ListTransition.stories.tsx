import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/inputs/Button';
import { ListTransition } from './ListTransition';
import { listContainerVariants } from './ListTransition.presets';
import { ListTransitionProps } from './ListTransition.types';

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
  p: 'base',
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
  gap: 'md',
  width: '[300px]',
  p: 'lg',
  borderWidth: 'thin',
  borderStyle: 'solid',
  borderColor: 'layout.divider',
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
      <Button appearance="outline" mb="lg" onClick={refresh}>
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
              p: 'none',
              m: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 'sm',
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
      <div className={css({ p: 'xl', textAlign: 'center' })}>
        <Button appearance="outline" mb="lg" onClick={() => setKey((k) => k + 1)}>
          Toggle All
        </Button>
        <div
          key={key}
          className={css({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'xl' })}
        >
          <div>
            <div className={css({ mb: 'sm', fontSize: 'xs', color: 'slate.500' })}>Flow + Fade</div>
            <ListTransition animationType="flow">
              {[1, 2, 3, 4].map((i) => (
                <ListTransition.Item key={i} animationType="fade">
                  <div className={itemStyle}>Fade {i}</div>
                </ListTransition.Item>
              ))}
            </ListTransition>
          </div>
          <div>
            <div className={css({ mb: 'sm', fontSize: 'xs', color: 'slate.500' })}>Burst + Pop</div>
            <ListTransition animationType="burst">
              {[1, 2, 3, 4].map((i) => (
                <ListTransition.Item key={i} animationType="pop">
                  <div className={itemStyle}>Pop {i}</div>
                </ListTransition.Item>
              ))}
            </ListTransition>
          </div>
          <div>
            <div className={css({ mb: 'sm', fontSize: 'xs', color: 'slate.500' })}>
              Lazy + Slide
            </div>
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

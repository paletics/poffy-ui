import { css, cx } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/inputs/Button';
import { ReorderTransition } from './ReorderTransition';

const meta: Meta<typeof ReorderTransition> = {
  title: 'Animations/ReorderTransition',
  component: ReorderTransition,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Runtime add/remove/reorder animations. Combines `AnimatePresence` (enter/exit) with layout FLIP (reorder). Each child must have a stable `key`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ReorderTransition>;

interface Item {
  id: number;
  label: string;
}

const FRUITS: Item[] = [
  { id: 1, label: 'Apple' },
  { id: 2, label: 'Banana' },
  { id: 3, label: 'Cherry' },
];

let nextId = 4;

const itemClass = css({
  py: 'md',
  px: 'base',
  bg: 'slate.100',
  borderRadius: 'md',
  cursor: 'pointer',
  userSelect: 'none',
  fontSize: 'sm',
  border: 'none',
  width: '100%',
  textAlign: 'left',
});

const itemButtonClass = cx(itemClass, css({ justifyContent: 'flex-start' }));

const storyStackClass = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'md',
});

const actionButtonClass = css({
  alignSelf: 'flex-start',
});

const containerClass = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'sm',
  minWidth: '[240px]',
});

const semanticListClass = cx(
  containerClass,
  css({
    listStyle: 'none',
    p: 'none',
    m: 'none',
  }),
);

const semanticItemClass = css({
  listStyle: 'none',
});

const removableLabel = (label: string) => `${label} - click to remove`;

export const Default: Story = {
  render: function DefaultStory() {
    const [items, setItems] = useState<Item[]>(FRUITS);
    const add = () => setItems((prev) => [...prev, { id: nextId, label: `Item ${nextId++}` }]);
    const remove = (id: number) => setItems((prev) => prev.filter((item) => item.id !== id));

    return (
      <div className={storyStackClass}>
        <Button appearance="outline" className={actionButtonClass} onClick={add}>
          + Add item
        </Button>
        <ReorderTransition animationType="pop" className={containerClass}>
          {items.map((item) => (
            <ReorderTransition.Item key={item.id}>
              <Button
                appearance="ghost"
                className={itemButtonClass}
                onClick={() => remove(item.id)}
              >
                {removableLabel(item.label)}
              </Button>
            </ReorderTransition.Item>
          ))}
        </ReorderTransition>
      </div>
    );
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Reorder: Story = {
  render: function ReorderStory() {
    const [items, setItems] = useState<Item[]>(FRUITS);
    const rotateItems = () => setItems((prev) => [...prev.slice(1), prev[0]]);

    return (
      <div className={storyStackClass}>
        <Button appearance="outline" className={actionButtonClass} onClick={rotateItems}>
          Rotate
        </Button>
        <ReorderTransition animationType="fade" className={containerClass}>
          {items.map((item) => (
            <ReorderTransition.Item key={item.id}>
              <div className={itemClass}>{item.label}</div>
            </ReorderTransition.Item>
          ))}
        </ReorderTransition>
      </div>
    );
  },
};

export const Slide: Story = {
  render: function SlideStory() {
    const [items, setItems] = useState<Item[]>(FRUITS);
    const prepend = () => setItems((prev) => [{ id: nextId, label: `Item ${nextId++}` }, ...prev]);
    const remove = (id: number) => setItems((prev) => prev.filter((item) => item.id !== id));

    return (
      <div className={storyStackClass}>
        <Button appearance="outline" className={actionButtonClass} onClick={prepend}>
          + Prepend item
        </Button>
        <ReorderTransition animationType="slide" className={containerClass}>
          {items.map((item) => (
            <ReorderTransition.Item key={item.id}>
              <Button
                appearance="ghost"
                className={itemButtonClass}
                onClick={() => remove(item.id)}
              >
                {removableLabel(item.label)}
              </Button>
            </ReorderTransition.Item>
          ))}
        </ReorderTransition>
      </div>
    );
  },
};

export const AsChild: Story = {
  render: function AsChildStory() {
    const [items, setItems] = useState<Item[]>(FRUITS);
    const remove = (id: number) => setItems((prev) => prev.filter((item) => item.id !== id));

    return (
      <ReorderTransition asChild animationType="fade">
        <ul className={semanticListClass}>
          {items.map((item) => (
            <ReorderTransition.Item key={item.id} asChild>
              <li className={semanticItemClass}>
                <Button
                  appearance="ghost"
                  className={itemButtonClass}
                  onClick={() => remove(item.id)}
                >
                  {removableLabel(item.label)}
                </Button>
              </li>
            </ReorderTransition.Item>
          ))}
        </ul>
      </ReorderTransition>
    );
  },
};

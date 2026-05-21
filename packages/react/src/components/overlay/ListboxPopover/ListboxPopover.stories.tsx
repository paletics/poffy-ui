import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/inputs/Button';
import { css } from '@/styled-system/css';
import { ListboxPopover } from './ListboxPopover';
import { ListboxPopoverAnchor } from './ListboxPopoverAnchor';
import { ListboxPopoverContent } from './ListboxPopoverContent';

const optionListClass = css({
  display: 'grid',
  gap: '2xs',
  p: 'xs',
  minW: '12rem',
});

const optionClass = css({
  px: 'sm',
  py: 'xs',
  borderRadius: 'sm',
  color: 'fg.default',
  _hover: { bg: 'bg.subtle' },
  '&[aria-selected="true"]': {
    bg: 'bg.muted',
    fontWeight: 'semibold',
  },
});

/**
 * Popover preset for listbox/select surfaces that own focus and selection upstream.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Popover with manual trigger mode and listbox role
 */
const meta: Meta<typeof ListboxPopover> = {
  title: 'Overlay/ListboxPopover',
  component: ListboxPopover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ListboxPopover>;

const Options = () => (
  <div className={optionListClass}>
    <div role="option" aria-selected="true" className={optionClass}>
      Apple
    </div>
    <div role="option" aria-selected="false" className={optionClass}>
      Orange
    </div>
    <div role="option" aria-selected="false" className={optionClass}>
      Peach
    </div>
  </div>
);

export const Default: Story = {
  render: () => (
    <ListboxPopover open onOpenChange={() => undefined}>
      <ListboxPopoverAnchor asChild>
        <Button>Choose fruit</Button>
      </ListboxPopoverAnchor>
      <ListboxPopoverContent>
        <Options />
      </ListboxPopoverContent>
    </ListboxPopover>
  ),
};

export const Closed: Story = {
  render: () => (
    <ListboxPopover open={false} onOpenChange={() => undefined}>
      <ListboxPopoverAnchor asChild>
        <Button>Choose fruit</Button>
      </ListboxPopoverAnchor>
      <ListboxPopoverContent>
        <Options />
      </ListboxPopoverContent>
    </ListboxPopover>
  ),
};

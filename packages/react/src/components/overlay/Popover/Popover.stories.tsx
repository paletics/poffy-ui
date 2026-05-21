import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { css } from '@/styled-system/css';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
} from './index';
import { Button } from '@/components/inputs/Button';

/**
 * Storybook documentation and visual review surface for Popover.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, overlay primitives
 */
const meta: Meta<typeof Popover> = {
  title: 'Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

import { PopoverProps } from './Popover.types';

const contentPaddingClass = css({ p: 'base' });
const actionClass = css({ mt: 'sm' });
const placementGridClass = css({ display: 'flex', gap: 'lg', flexWrap: 'wrap', p: '3xl' });
const brandRowClass = css({ display: 'flex', gap: 'lg', p: '3xl' });
const themeRowClass = css({
  display: 'flex',
  gap: 'lg',
  p: '3xl',
  bg: '[#333]',
  borderRadius: 'md',
});

const PopoverDemo = (props: PopoverProps) => (
  <Popover {...props}>
    <PopoverTrigger asChild>
      <Button>Click me ({String(props.placement ?? 'bottom')})</Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverClose />
      <div className={contentPaddingClass}>
        <PopoverTitle>Popover Title</PopoverTitle>
        <PopoverDescription>This is a description inside the popover.</PopoverDescription>
        <div className={actionClass}>
          <Button size="sm">Action</Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

export const Default: Story = {
  render: (args) => <PopoverDemo {...args} />,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Interaction: Story = {
  render: () => <PopoverDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: /click me/i }));
    await waitFor(async () => {
      await expect(body.getByText('Popover Title')).toBeVisible();
    });
  },
};

export const Placements: Story = {
  render: () => (
    <div className={placementGridClass}>
      <PopoverDemo placement="top" />
      <PopoverDemo placement="top-start" />
      <PopoverDemo placement="top-end" />
      <PopoverDemo placement="bottom" />
      <PopoverDemo placement="bottom-start" />
      <PopoverDemo placement="bottom-end" />
      <PopoverDemo placement="left" />
      <PopoverDemo placement="left-start" />
      <PopoverDemo placement="left-end" />
      <PopoverDemo placement="right" />
      <PopoverDemo placement="right-start" />
      <PopoverDemo placement="right-end" />
    </div>
  ),
};

export const Brands: Story = {
  render: () => (
    <div className={brandRowClass}>
      <PopoverDemo brand="pome" />
      <PopoverDemo brand="blue" />
    </div>
  ),
};

export const ThemeOverride: Story = {
  render: () => (
    <div className={themeRowClass}>
      <PopoverDemo theme="light" />
      <PopoverDemo theme="dark" />
    </div>
  ),
};

export const NoArrow: Story = {
  args: {
    showArrow: false,
  },
  render: (args) => <PopoverDemo {...args} />,
};

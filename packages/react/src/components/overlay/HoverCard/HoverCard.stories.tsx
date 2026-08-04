import { Button } from '@/components/inputs/Button';
import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
  HoverCard,
  HoverCardContent,
  HoverCardDescription,
  HoverCardTitle,
  HoverCardTrigger,
} from './index';


const meta: Meta<typeof HoverCard> = {
  title: 'Overlay/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left', 'bottom-start', 'top-start'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

const rowClass = css({ display: 'flex', gap: 'lg', alignItems: 'center', flexWrap: 'wrap' });
const profileClass = css({ display: 'flex', flexDirection: 'column', gap: 'xs' });

const ProfileHoverCard = (args: ComponentProps<typeof HoverCard>) => (
  <HoverCard openDelay={0} closeDelay={80} {...args}>
    <HoverCardTrigger asChild>
      <Button appearance="ghost">Ada Lovelace</Button>
    </HoverCardTrigger>
    <HoverCardContent>
      <div className={profileClass}>
        <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        <HoverCardDescription>
          Mathematician, writer, and collaborator on the Analytical Engine.
        </HoverCardDescription>
        <a href="#profile">View profile</a>
      </div>
    </HoverCardContent>
  </HoverCard>
);

export const Default: Story = {
  args: {
    appearance: 'soft',
  },
  render: (args) => <ProfileHoverCard {...args} />,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Open: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => <ProfileHoverCard {...args} />,
};

export const Variants: Story = {
  render: () => (
    <div className={rowClass}>
      <ProfileHoverCard defaultOpen appearance="soft" size="sm" />
      <ProfileHoverCard defaultOpen appearance="outline" size="md" />
      <ProfileHoverCard defaultOpen appearance="soft" size="lg" />
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className={rowClass}>
      <ProfileHoverCard defaultOpen placement="top" />
      <ProfileHoverCard defaultOpen placement="right" />
      <ProfileHoverCard defaultOpen placement="bottom-start" />
      <ProfileHoverCard defaultOpen placement="left" />
    </div>
  ),
};

export const Brands: Story = {
  render: () => (
    <div className={rowClass}>
      <ProfileHoverCard defaultOpen brand="blue" />
      <ProfileHoverCard defaultOpen brand="pome" />
      <ProfileHoverCard defaultOpen brand="lime" />
    </div>
  ),
};

export const InteractiveContent: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <HoverCard openDelay={0} closeDelay={80} {...args}>
      <HoverCardTrigger asChild>
        <Button appearance="ghost">Project owner</Button>
      </HoverCardTrigger>
      <HoverCardContent focusManagement>
        <HoverCardTitle>Grace Hopper</HoverCardTitle>
        <HoverCardDescription>
          Maintainer for compiler tooling and release automation.
        </HoverCardDescription>
        <Button size="sm">Message</Button>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const FocusOrder: Story = {
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: 'md' })}>
      <Button>Before hover card</Button>
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <Button appearance="ghost">Focus order trigger</Button>
        </HoverCardTrigger>
        <HoverCardContent focusManagement>
          <HoverCardTitle>Focus order card</HoverCardTitle>
          <Button size="sm">Card action</Button>
        </HoverCardContent>
      </HoverCard>
      <Button>After hover card</Button>
    </div>
  ),
};

export const NoArrow: Story = {
  args: {
    defaultOpen: true,
    showArrow: false,
  },
  render: (args) => <ProfileHoverCard {...args} />,
};

export const Interaction: Story = {
  render: () => <ProfileHoverCard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.hover(canvas.getByRole('button', { name: /ada lovelace/i }));
    await expect(await body.findByRole('dialog')).toHaveAttribute('data-state', 'open');
  },
};

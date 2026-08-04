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
import { DirectionProvider } from '@/providers/DirectionProvider';


const meta: Meta<typeof Popover> = {
  title: 'Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

import { PopoverProps } from './Popover.types';

const contentPaddingClass = css({ p: 'base' });
const ownedSurfaceClass = css({
  bg: 'brand.surface',
  borderRadius: 'md',
  borderWidth: '1px',
  borderColor: 'brand.border',
  boxShadow: 'md',
  p: 'base',
});
const actionClass = css({ mt: 'sm' });
const focusOrderClass = css({
  display: 'flex',
  alignItems: 'center',
  gap: 'md',
  flexWrap: 'wrap',
});
const placementGridClass = css({
  display: 'flex',
  gap: 'lg',
  flexWrap: 'wrap',
  maxWidth: '[calc(100vw - 3rem)]',
  boxSizing: 'border-box',
  p: '3xl',
});
const brandRowClass = css({
  display: 'flex',
  gap: 'lg',
  flexWrap: 'wrap',
  maxWidth: '100%',
  boxSizing: 'border-box',
  p: '3xl',
});
const themeRowClass = css({
  display: 'flex',
  gap: 'lg',
  flexWrap: 'wrap',
  maxWidth: '100%',
  boxSizing: 'border-box',
  p: '3xl',
  bg: '[#333]',
  borderRadius: 'md',
});

const PopoverDemo = (props: PopoverProps) => (
  <Popover {...props}>
    <PopoverTrigger asChild>
      <Button>Click me ({String(props.placement ?? 'bottom')})</Button>
    </PopoverTrigger>
    <PopoverContent focusManagement>
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

export const AccessibilityOpen: Story = {
  render: () => <PopoverDemo defaultOpen />,
};

export const NarrowViewport: Story = {
  render: () => (
    <DirectionProvider defaultDir="rtl" global={false}>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm">Open</Button>
        </PopoverTrigger>
        <PopoverContent focusManagement>
          <div className={contentPaddingClass}>
            <PopoverClose aria-label="Close compact popover" />
            <PopoverTitle>
              Compact popover title with enough text to exercise the reserved close-control space
            </PopoverTitle>
            <PopoverDescription>
              Contentwithoutbreakopportunitiesstaysinsidetheviewport
            </PopoverDescription>
          </div>
        </PopoverContent>
      </Popover>
    </DirectionProvider>
  ),
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

export const ManagedFocusOrder: Story = {
  render: () => (
    <div className={focusOrderClass}>
      <Button>Before popover</Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open managed popover</Button>
        </PopoverTrigger>
        <PopoverContent focusManagement>
          <div className={contentPaddingClass}>
            <PopoverTitle>Managed actions</PopoverTitle>
            <Button size="sm">First action</Button>
            <PopoverClose aria-label="Last action">Last action</PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
      <Button>After popover</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive popovers manage initial focus and preserve logical forward and reverse Tab order across the portal.',
      },
    },
  },
};

export const UnmanagedFocusOrder: Story = {
  render: () => (
    <div className={focusOrderClass}>
      <Button>Before unmanaged popover</Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open unmanaged popover</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Unmanaged information" focusManagement={false}>
          <div className={contentPaddingClass}>
            <PopoverTitle>Unmanaged information</PopoverTitle>
            <PopoverDescription>
              This owner-managed mode leaves focus and Tab order with the owning page.
            </PopoverDescription>
          </div>
        </PopoverContent>
      </Popover>
      <Button>After unmanaged popover</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Owner-managed path for non-focusable content. The trigger keeps focus and native Tab order remains outside the portal.',
      },
    },
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

export const ContentOwnedSurface: Story = {
  render: () => (
    <Popover showArrow>
      <PopoverTrigger asChild>
        <Button>Open content-owned surface</Button>
      </PopoverTrigger>
      <PopoverContent surface="none" aria-label="Content-owned surface">
        <div className={ownedSurfaceClass}>The child owns the surface and inner padding.</div>
      </PopoverContent>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use surface="none" when a compound child such as Calendar or a listbox owns its own surface, padding, and focus-ring clearance.',
      },
    },
  },
};

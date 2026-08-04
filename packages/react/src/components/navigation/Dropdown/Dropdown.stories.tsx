import { forwardRef, useState } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { css } from '@/styled-system/css';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from './index';


const meta: Meta<typeof Dropdown> = {
  title: 'Navigation/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const StoryRouterLink = forwardRef<
  HTMLAnchorElement,
  Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { to: string }
>(({ to, ...props }, ref) => <a ref={ref} href={to} {...props} />);
StoryRouterLink.displayName = 'StoryRouterLink';

const StoryButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  (props, ref) => <button ref={ref} {...props} />,
);
StoryButton.displayName = 'StoryButton';

export const Default: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>Actions</DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={() => undefined}>Edit</DropdownItem>
        <DropdownItem onSelect={() => undefined}>Duplicate</DropdownItem>
        <DropdownSeparator />
        <DropdownItem onSelect={() => undefined}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Interaction: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>Actions</DropdownTrigger>
      <DropdownMenu>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Duplicate</DropdownItem>
        <DropdownSeparator />
        <DropdownItem>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByText('Actions'));
    await expect(await body.findByRole('menu')).toHaveAttribute('data-state', 'open');
    await expect(await body.findByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
  },
};

export const TabOrder: Story = {
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: 'md' })}>
      <button type="button">Before dropdown</button>
      <Dropdown>
        <DropdownTrigger>Tab order menu</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>First action</DropdownItem>
          <DropdownItem>Second action</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <button type="button">After dropdown</button>
    </div>
  ),
};

const AllDisabledPortalTabOrderExample = () => {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: 'md' })}>
      <button type="button">Before disabled menu</button>
      <div ref={setPortalContainer} />
      <Dropdown>
        <DropdownTrigger>All disabled menu</DropdownTrigger>
        <DropdownMenu portalContainer={portalContainer}>
          <DropdownItem disabled>Unavailable action</DropdownItem>
          <DropdownItem disabled>Also unavailable</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <button type="button">After disabled menu</button>
    </div>
  );
};

export const AllDisabledPortalTabOrder: Story = {
  render: () => <AllDisabledPortalTabOrderExample />,
};

export const WithLabelsAndGroups: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>More Options</DropdownTrigger>
      <DropdownMenu>
        <DropdownLabel>Actions</DropdownLabel>
        <DropdownItem onSelect={() => undefined}>New</DropdownItem>
        <DropdownItem onSelect={() => undefined}>Open</DropdownItem>
        <DropdownSeparator />
        <DropdownLabel>Edits</DropdownLabel>
        <DropdownItem onSelect={() => undefined}>Cut</DropdownItem>
        <DropdownItem onSelect={() => undefined}>Copy</DropdownItem>
        <DropdownItem onSelect={() => undefined}>Paste</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>File</DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={() => undefined}>Save</DropdownItem>
        <DropdownItem disabled>Save As (Coming Soon)</DropdownItem>
        <DropdownSeparator />
        <DropdownItem onSelect={() => undefined}>Close</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const ConstrainedLongTrigger: Story = {
  render: () => (
    <div className={css({ width: '[6rem]' })} aria-label="Constrained dropdown trigger" dir="rtl">
      <Dropdown>
        <DropdownTrigger>Triggerwithanunusuallylongunbrokenlocalizedlabel</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>First action</DropdownItem>
          <DropdownItem>Second action</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  ),
};

ConstrainedLongTrigger.parameters = {
  docs: {
    description: {
      story:
        'Long text wraps inside the parent down to 24px. Below 24px the trigger intentionally preserves the minimum interaction target.',
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className={css({ display: 'flex', gap: 'base', alignItems: 'flex-start' })}>
      <Dropdown size="sm">
        <DropdownTrigger>Small</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Option 1</DropdownItem>
          <DropdownItem>Option 2</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown size="md">
        <DropdownTrigger>Medium</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Option 1</DropdownItem>
          <DropdownItem>Option 2</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown size="lg">
        <DropdownTrigger>Large</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Option 1</DropdownItem>
          <DropdownItem>Option 2</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledExample() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <p>Menu is {open ? 'open' : 'closed'}</p>
        <Dropdown open={open} onOpenChange={setOpen}>
          <DropdownTrigger>Controlled</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>Item 1</DropdownItem>
            <DropdownItem>Item 2</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  },
};

export const PolymorphicUsage: Story = {
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: 'xl' })}>
      <div>
        <h3 className={css({ mb: 'sm' })}>Anchor host as menu button</h3>
        <Dropdown>
          <DropdownTrigger asChild>
            <a href="#actions">Link Trigger</a>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onSelect={() => undefined}>Action 1</DropdownItem>
            <DropdownItem onSelect={() => undefined}>Action 2</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div>
        <h3 className={css({ mb: 'sm' })}>Label as Heading</h3>
        <Dropdown>
          <DropdownTrigger>Structured Menu</DropdownTrigger>
          <DropdownMenu>
            <DropdownLabel asChild>
              <h4>Primary Actions</h4>
            </DropdownLabel>
            <DropdownItem>New File</DropdownItem>
            <DropdownItem>Open File</DropdownItem>
            <DropdownSeparator />
            <DropdownLabel asChild>
              <h4>Secondary Actions</h4>
            </DropdownLabel>
            <DropdownItem>Settings</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div>
        <h3 className={css({ mb: 'sm' })}>Separator as HR</h3>
        <Dropdown>
          <DropdownTrigger>Custom Elements</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>Top Item</DropdownItem>
            <DropdownSeparator asChild>
              <hr />
            </DropdownSeparator>
            <DropdownItem>Bottom Item</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  ),
};

export const TriggerHostContracts: Story = {
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: 'md' })}>
      <Dropdown>
        <DropdownTrigger asChild>
          <StoryRouterLink to="/unsafe-navigation">Router host fallback</StoryRouterLink>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Fallback action</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownTrigger asChild>
          <StoryButton>Forwarding custom button</StoryButton>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Custom action</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  ),
};

export const SemanticListConstrained: Story = {
  render: () => (
    <div
      aria-label="Constrained semantic dropdown"
      className={css({ minInlineSize: 0, maxInlineSize: '10rem' })}
    >
      <Dropdown>
        <DropdownTrigger>Semantic actions</DropdownTrigger>
        <DropdownMenu asChild>
          <ul>
            <DropdownItem asChild>
              <li>Rename a long project title</li>
            </DropdownItem>
            <DropdownItem asChild>
              <li>Archive</li>
            </DropdownItem>
          </ul>
        </DropdownMenu>
      </Dropdown>
    </div>
  ),
};

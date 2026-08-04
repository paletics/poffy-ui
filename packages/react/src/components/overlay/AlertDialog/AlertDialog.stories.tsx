import { Button } from '@/components/inputs/Button';
import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './index';


const meta: Meta<typeof AlertDialog> = {
  title: 'Overlay/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline'],
    },
    intent: {
      control: 'select',
      options: ['neutral', 'danger', 'warning'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    scrollBehavior: {
      control: 'select',
      options: ['inside', 'outside'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

const rowClass = css({ display: 'flex', gap: 'sm', flexWrap: 'wrap' });

const DestructiveExample = (args: ComponentProps<typeof AlertDialog>) => (
  <AlertDialog {...args}>
    <AlertDialogTrigger asChild>
      <Button intent="danger">Delete project</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete project?</AlertDialogTitle>
        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogBody>
        This permanently removes the project, its environments, and all related audit history.
      </AlertDialogBody>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button appearance="ghost">Cancel</Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button intent="danger">Delete</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const Default: Story = {
  args: {
    intent: 'danger',
  },
  render: (args) => <DestructiveExample {...args} />,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Destructive: Story = {
  args: {
    intent: 'danger',
    defaultOpen: true,
  },
  render: (args) => <DestructiveExample {...args} />,
};

export const Variants: Story = {
  render: () => (
    <div className={rowClass}>
      <DestructiveExample intent="neutral" />
      <DestructiveExample intent="warning" />
      <DestructiveExample intent="danger" />
    </div>
  ),
};

export const NeutralOpen: Story = {
  args: {
    intent: 'neutral',
    defaultOpen: true,
  },
  render: (args) => <DestructiveExample {...args} />,
};

export const WarningOpen: Story = {
  args: {
    intent: 'warning',
    defaultOpen: true,
  },
  render: (args) => <DestructiveExample {...args} />,
};

export const OutlineLarge: Story = {
  args: {
    appearance: 'outline',
    intent: 'warning',
    size: 'lg',
    defaultOpen: true,
  },
  render: (args) => <DestructiveExample {...args} />,
};

export const ScrollOutside: Story = {
  args: {
    scrollBehavior: 'outside',
    size: 'md',
    defaultOpen: true,
  },
  render: (args) => <DestructiveExample {...args} />,
};

export const LongActionLabels: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogTitle>Confirm account deletion?</AlertDialogTitle>
        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel and keep this account</AlertDialogCancel>
          <AlertDialogAction>Delete this account permanently</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const Interaction: Story = {
  render: () => <DestructiveExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: /delete project/i }));
    await expect(await body.findByRole('alertdialog')).toHaveAttribute('data-state', 'open');
  },
};

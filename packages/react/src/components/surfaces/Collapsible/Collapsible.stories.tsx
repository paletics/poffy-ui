import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Stack } from '@/components/layout';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './';

const meta: Meta<typeof Collapsible> = {
  title: 'Surfaces/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline', 'ghost'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  args: {
    children: (
      <>
        <CollapsibleTrigger>Billing settings</CollapsibleTrigger>
        <CollapsibleContent>
          Payment methods, invoice recipients, and tax information are grouped here.
        </CollapsibleContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Billing settings' });

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  },
};

export const Open: Story = {
  args: {
    defaultOpen: true,
    children: (
      <>
        <CollapsibleTrigger>Deployment notes</CollapsibleTrigger>
        <CollapsibleContent>
          Production deploys require a passing build, package export smoke checks, and release
          notes.
        </CollapsibleContent>
      </>
    ),
  },
};

export const Appearances: Story = {
  render: (args) => (
    <Stack gap="md">
      <Collapsible {...args} appearance="soft" defaultOpen>
        <CollapsibleTrigger>Soft</CollapsibleTrigger>
        <CollapsibleContent>Default filled surface.</CollapsibleContent>
      </Collapsible>
      <Collapsible {...args} appearance="outline" defaultOpen>
        <CollapsibleTrigger>Outline</CollapsibleTrigger>
        <CollapsibleContent>Outlined surface treatment.</CollapsibleContent>
      </Collapsible>
      <Collapsible {...args} appearance="ghost" defaultOpen>
        <CollapsibleTrigger>Ghost</CollapsibleTrigger>
        <CollapsibleContent>Minimal inline disclosure.</CollapsibleContent>
      </Collapsible>
    </Stack>
  ),
};

export const States: Story = {
  render: (args) => (
    <Stack gap="md">
      <Collapsible {...args}>
        <CollapsibleTrigger>Closed</CollapsibleTrigger>
        <CollapsibleContent>Closed details.</CollapsibleContent>
      </Collapsible>
      <Collapsible {...args} defaultOpen>
        <CollapsibleTrigger>Open</CollapsibleTrigger>
        <CollapsibleContent>Open details.</CollapsibleContent>
      </Collapsible>
      <Collapsible {...args} disabled>
        <CollapsibleTrigger>Disabled</CollapsibleTrigger>
        <CollapsibleContent>Disabled details.</CollapsibleContent>
      </Collapsible>
    </Stack>
  ),
};

export const FocusableContent: Story = {
  render: () => (
    <Stack gap="md" width="[280px]" maxWidth="100%">
      {(['soft', 'outline', 'ghost'] as const).map((appearance) => (
        <Collapsible
          key={appearance}
          appearance={appearance}
          defaultOpen
          data-testid={`focus-collapsible-${appearance}`}
        >
          <CollapsibleTrigger>{appearance} focus content</CollapsibleTrigger>
          <CollapsibleContent asChild>
            <section>
              <a href={`#collapsible-${appearance}`}>Focusable {appearance} destination</a>
            </section>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </Stack>
  ),
};

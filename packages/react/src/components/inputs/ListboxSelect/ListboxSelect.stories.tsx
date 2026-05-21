import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '@/components/inputs/Button';
import { ListboxSelect } from './ListboxSelect';
import { Stack } from '../../layout/Stack';

/**
 * Storybook documentation and visual review surface for ListboxSelect.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta: Meta<typeof ListboxSelect> = {
  title: 'Inputs/ListboxSelect',
  component: ListboxSelect,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    appearance: {
      control: 'select',
      options: ['outline', 'soft', 'neo'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ListboxSelect>;

export const Default: Story = {
  args: {
    'aria-label': 'Example listbox select',
  },
  render: (args) => (
    <ListboxSelect {...args}>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </ListboxSelect>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Default `outline` listbox select with three options. Click to open the popup, or use Arrow keys and Enter to select. Verify the trigger and popup visually align with ComboBox and MultiSelect.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole('combobox');
    await userEvent.click(select);
    await expect(select).toHaveFocus();
    await userEvent.keyboard('{Escape}');
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Placeholder = () => (
  <ListboxSelect defaultValue="" aria-label="Placeholder ListboxSelect">
    <option value="" disabled>
      Select an option
    </option>
    <option value="1">Item 1</option>
    <option value="2">Item 2</option>
  </ListboxSelect>
);

Placeholder.parameters = {
  docs: {
    description: {
      story:
        'Simulates a placeholder by using a disabled empty first option. Verify the empty label is shown on mount and the placeholder item is not selectable.',
    },
  },
};

export const Sizes = () => (
  <Stack gap="md">
    <ListboxSelect size="sm">
      <option>Small ListboxSelect</option>
    </ListboxSelect>
    <ListboxSelect size="md">
      <option>Medium ListboxSelect</option>
    </ListboxSelect>
    <ListboxSelect size="lg">
      <option>Large ListboxSelect</option>
    </ListboxSelect>
  </Stack>
);

Sizes.parameters = {
  docs: {
    description: {
      story:
        'All three sizes (`sm`, `md`, `lg`) stacked. Verify that padding and font size scale proportionally via Silver Ratio tokens.',
    },
  },
};

export const Variants = () => (
  <Stack gap="md">
    <ListboxSelect appearance="outline">
      <option>Outline</option>
    </ListboxSelect>
    <ListboxSelect appearance="soft">
      <option>Soft</option>
    </ListboxSelect>
    <ListboxSelect appearance="neo">
      <option>Neo</option>
    </ListboxSelect>
  </Stack>
);

Variants.parameters = {
  docs: {
    description: {
      story:
        'Three visual variants: `outline` (bordered), `filled` (solid bg), `flushed` (bottom border only). Verify visual differentiation between variants.',
    },
  },
};

export const States = () => (
  <Stack gap="md">
    <ListboxSelect disabled>
      <option>Disabled</option>
    </ListboxSelect>
    <ListboxSelect error>
      <option>Error</option>
    </ListboxSelect>
  </Stack>
);

States.parameters = {
  docs: {
    description: {
      story:
        'Disabled and error states. Disabled must suppress popup interactions. Error state applies the same danger treatment used across the custom input family.',
    },
  },
};

export const InteractionFlow: Story = {
  render: (args) => (
    <Stack gap="md">
      <ListboxSelect {...args} aria-label="Interaction ListboxSelect">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </ListboxSelect>
      <Button appearance="outline">Outside target</Button>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interaction contract for the custom select: focus alone does not open it, option selection closes it, it can reopen after selection, and outside click closes the popup.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const select = canvas.getByRole('combobox', { name: 'Interaction ListboxSelect' });

    await userEvent.tab();
    await expect(select).toHaveFocus();
    await expect(select).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(select);
    await expect(select).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(body.getByRole('option', { name: 'Option 2' }));
    await expect(select).toHaveAttribute('aria-expanded', 'false');
    await expect(select).toHaveTextContent('Option 2');

    await userEvent.click(select);
    await expect(select).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Outside target' }));
    await expect(select).toHaveAttribute('aria-expanded', 'false');
  },
};

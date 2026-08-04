import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { css } from '@/styled-system/css';
import { MultiSelect } from './MultiSelect';


const meta: Meta<typeof MultiSelect> = {
  title: 'Inputs/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Multi-value selector with tag chips. Type to filter options, click an option to add it, and use the remove button on each chip to clear selections.',
      },
    },
  },
  argTypes: {
    appearance: { control: 'select', options: ['outline', 'soft', 'flushed', 'neo'] },
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

const options = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
];

export const Default: Story = {
  args: {
    'aria-label': 'Frameworks',
    options,
    placeholder: 'Select frameworks...',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default MultiSelect with no pre-selected values. Click the input area to open the dropdown and start selecting.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole('combobox');
    await userEvent.click(input);
    await waitFor(async () => {
      await expect(body.getByRole('option', { name: 'React' })).toBeVisible();
    });
    const option = body.getByRole('option', { name: 'React' });
    await userEvent.click(option);
    await waitFor(async () => {
      await expect(
        canvas.getByText('React', { selector: '[data-multiselect-tag-label="true"]' }),
      ).toBeVisible();
    });
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Interactive = () => {
  const [value, setValue] = useState<string[]>(['react']);
  return (
    <MultiSelect aria-label="Interactive" options={options} value={value} onChange={setValue} />
  );
};

const constrainedExamplesClass = css({
  display: 'grid',
  gap: 'lg',
  justifyItems: 'start',
  maxWidth: '100%',
});
const width40Class = css({ width: '[40px]', maxWidth: '100%' });
const width60Class = css({ width: '[60px]', maxWidth: '100%' });
const practicalWidthClass = css({ width: '[10rem]', maxWidth: '100%' });

export const UltraNarrow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A below-minimum-width containment stress fixture. At 40–60px, readable selected-value labels are not part of the supported contract; selection and removal affordances remain the review target.',
      },
    },
  },
  render: () => (
    <div className={constrainedExamplesClass}>
      <MultiSelect
        className={width40Class}
        data-testid="multi-select-40"
        aria-label="40 pixel frameworks"
        messages={{ toggleOptions: 'Toggle 40 pixel options' }}
        options={options}
        defaultValue={['react']}
      />
      <MultiSelect
        className={width60Class}
        dir="rtl"
        data-testid="multi-select-60"
        aria-label="60 pixel frameworks"
        messages={{ toggleOptions: 'Toggle 60 pixel options' }}
        options={options}
        defaultValue={['vue']}
      />
    </div>
  ),
};

export const ConstrainedTags: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The recommended 10rem practical minimum keeps selected labels, removal controls, and text entry readable together. Narrower stress fixtures guarantee containment and operability only.',
      },
    },
  },
  render: () => (
    <MultiSelect
      className={practicalWidthClass}
      data-testid="multi-select-160"
      aria-label="Constrained frameworks"
      messages={{ toggleOptions: 'Toggle constrained options' }}
      options={[
        ...options,
        { label: 'A framework with an intentionally long label', value: 'long' },
      ]}
      defaultValue={['react', 'vue', 'long']}
    />
  ),
};

export const UltraNarrowCustomTag: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A 40px containment stress fixture for consumer-supplied tags. Custom tag readability remains the renderer’s responsibility below the component’s practical minimum width.',
      },
    },
  },
  render: () => (
    <MultiSelect
      className={width40Class}
      data-testid="multi-select-custom-40"
      aria-label="40 pixel custom frameworks"
      messages={{ toggleOptions: 'Toggle custom options' }}
      options={options}
      defaultValue={['react']}
      renderTag={({ label, removeLabel, disabled, onRemove }) => (
        <button type="button" aria-label={removeLabel} disabled={disabled} onClick={onRemove}>
          Custom selected framework {label}
        </button>
      )}
    />
  ),
};

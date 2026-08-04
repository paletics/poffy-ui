import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { css } from '@/styled-system/css';
import { Select } from './Select';
import { Stack } from '../../layout/Stack';

const constrainedWidthsClass = css({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  alignItems: 'center',
  gap: 'sm',
  width: 'fit-content',
});

const width40Class = css({ width: '[40px]' });
const width64Class = css({ width: '[64px]' });
const width65Class = css({ width: '[65px]' });
const width112Class = css({ width: '[112px]' });
const width113Class = css({ width: '[113px]' });

/**
 * Storybook documentation and visual review surface for native Select.
 * Covers representative usage, controls, and fixed review examples.
 */
const meta: Meta<typeof Select> = {
  title: 'Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    appearance: {
      control: 'select',
      options: ['outline', 'soft', 'flushed', 'neo'],
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
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    'aria-label': 'Example select',
  },
  render: (args) => (
    <Select {...args}>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Native select with three options. Uses the platform picker while sharing the input visual system.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole('combobox');
    await userEvent.click(select);
    await expect(select).toHaveFocus();
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Placeholder = () => (
  <Select defaultValue="" aria-label="Placeholder Select">
    <option value="" disabled>
      Select an option
    </option>
    <option value="1">Item 1</option>
    <option value="2">Item 2</option>
  </Select>
);

export const Sizes = () => (
  <Stack gap="md">
    <Select size="sm" aria-label="Small select">
      <option>Small Select</option>
    </Select>
    <Select size="md" aria-label="Medium select">
      <option>Medium Select</option>
    </Select>
    <Select size="lg" aria-label="Large select">
      <option>Large Select</option>
    </Select>
  </Stack>
);

export const Variants = () => (
  <Stack gap="md">
    <Select appearance="outline" aria-label="Outline select">
      <option>Outline</option>
    </Select>
    <Select appearance="soft" aria-label="Soft select">
      <option>Soft</option>
    </Select>
    <Select appearance="flushed" aria-label="Flushed select">
      <option>Flushed</option>
    </Select>
    <Select appearance="neo" aria-label="Neo select">
      <option>Neo</option>
    </Select>
  </Stack>
);

export const States = () => (
  <Stack gap="md">
    <Select disabled aria-label="Disabled select">
      <option>Disabled</option>
    </Select>
    <Select error aria-label="Error select">
      <option>Error</option>
    </Select>
  </Stack>
);

export const ConstrainedWidths = () => (
  <div className={constrainedWidthsClass}>
    <span>40px</span>
    <div className={width40Class} aria-label="40 pixel native select fixture">
      <Select aria-label="40 pixel native select">
        <option>Supercalifragilisticexpialidocious</option>
      </Select>
    </div>
    <span>64px RTL neo</span>
    <div className={width64Class} dir="rtl" aria-label="64 pixel RTL native select fixture">
      <Select appearance="neo" aria-label="64 pixel RTL native select">
        <option>InternationalizationWithoutBreaks</option>
      </Select>
    </div>
    <span>65px</span>
    <div className={width65Class} aria-label="65 pixel native select fixture">
      <Select aria-label="65 pixel native select">
        <option>BoundaryDecorationVisible</option>
      </Select>
    </div>
    <span>112px</span>
    <div className={width112Class} aria-label="112 pixel native select fixture">
      <Select aria-label="112 pixel native select">
        <option>CompactPaddingBoundary</option>
      </Select>
    </div>
    <span>113px</span>
    <div className={width113Class} aria-label="113 pixel native select fixture">
      <Select aria-label="113 pixel native select">
        <option>NormalPaddingBoundary</option>
      </Select>
    </div>
    <span>112px multiple</span>
    <div className={width112Class} aria-label="112 pixel multiple select fixture">
      <Select multiple aria-label="112 pixel multiple select" defaultValue={['first']}>
        <option value="first">First option</option>
        <option value="second">Second option</option>
      </Select>
    </div>
  </div>
);

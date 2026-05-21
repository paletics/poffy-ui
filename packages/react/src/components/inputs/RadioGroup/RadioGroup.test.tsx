import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { RadioGroup } from './RadioGroup';
import { Radio } from './Radio';

/**
 * ### Test Strategy: RadioGroup
 * - **Focus**: Correct rendering, selection change, disabled state, controlled pattern,
 *   and full WAI-ARIA RadioGroup compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 */
describe('RadioGroup', () => {
  it('renders radio options and respects defaultValue', () => {
    render(
      <RadioGroup defaultValue="1" aria-label="Options">
        <Radio value="1">Option 1</Radio>
        <Radio value="2">Option 2</Radio>
      </RadioGroup>,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(
      <RadioGroup defaultValue="1" aria-label="Fruit">
        <Radio value="1">Option 1</Radio>
        <Radio value="2">Option 2</Radio>
      </RadioGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('calls onChange with the selected value on click', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RadioGroup onChange={onChange} aria-label="Options">
        <Radio value="1">Option 1</Radio>
        <Radio value="2">Option 2</Radio>
      </RadioGroup>,
    );

    await user.click(screen.getAllByRole('radio')[1]);
    expect(onChange).toHaveBeenCalledWith('2');
    expect(screen.getAllByRole('radio')[1]).toBeChecked();
  });

  it('supports controlled value', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RadioGroup value="1" onChange={onChange} aria-label="Options">
        <Radio value="1">Option 1</Radio>
        <Radio value="2">Option 2</Radio>
      </RadioGroup>,
    );

    expect(screen.getAllByRole('radio')[0]).toBeChecked();
    await user.click(screen.getAllByRole('radio')[1]);
    expect(onChange).toHaveBeenCalledWith('2');
  });

  it('disables all radios when group is disabled', () => {
    render(
      <RadioGroup disabled aria-label="Options">
        <Radio value="1">Option 1</Radio>
        <Radio value="2">Option 2</Radio>
      </RadioGroup>,
    );
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled());
  });

  it('does not change selection when disabled', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RadioGroup disabled defaultValue="1" onChange={onChange} aria-label="Options">
        <Radio value="1">Option 1</Radio>
        <Radio value="2">Option 2</Radio>
      </RadioGroup>,
    );

    await user.click(screen.getAllByRole('radio')[1]);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getAllByRole('radio')[0]).toBeChecked();
  });
});

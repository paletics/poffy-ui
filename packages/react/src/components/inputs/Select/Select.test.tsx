import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Select } from './Select';

/**
 * ### Test Strategy: Select
 * - **Focus**: Native select semantics, form-safe label/value behavior, states,
 *   ref forwarding, and WAI-ARIA compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or platform picker internals.
 */
describe('Select', () => {
  it('renders a native combobox', () => {
    render(
      <Select>
        <option value="1">Option 1</option>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toBeInstanceOf(HTMLSelectElement);
  });

  it('supports neo appearance', () => {
    render(
      <Select appearance="neo">
        <option value="1">Option 1</option>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(
      <Select id="test-select" aria-label="Test Select">
        <option value="1">Option 1</option>
      </Select>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('handles native value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Select onChange={handleChange} aria-label="Test Select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>,
    );

    await user.selectOptions(screen.getByRole('combobox'), '2');

    expect(screen.getByRole('combobox')).toHaveValue('2');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('uses option text as the native value when value is omitted', async () => {
    const user = userEvent.setup();
    render(
      <Select aria-label="Test Select">
        <option>Alpha</option>
        <option>Beta</option>
      </Select>,
    );

    await user.selectOptions(screen.getByRole('combobox'), 'Beta');

    expect(screen.getByRole('combobox')).toHaveValue('Beta');
  });

  it('works with a native label', async () => {
    const user = userEvent.setup();
    render(
      <>
        <label htmlFor="fruit-select">Fruit</label>
        <Select id="fruit-select">
          <option value="apple">Apple</option>
          <option value="pear">Pear</option>
        </Select>
      </>,
    );

    const select = screen.getByRole('combobox', { name: 'Fruit' });
    await user.click(screen.getByText('Fruit'));

    expect(select).toHaveFocus();
  });

  it('supports disabled state', () => {
    render(
      <Select disabled>
        <option>Disabled</option>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('reflects error state on the native select', () => {
    render(
      <Select error>
        <option value="1">Option 1</option>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards ref to the native select element', () => {
    const ref = { current: null };
    render(
      <Select ref={ref}>
        <option value="1">Option 1</option>
      </Select>,
    );

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });
});

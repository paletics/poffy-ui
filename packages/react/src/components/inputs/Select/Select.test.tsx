import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Select } from './Select';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';

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

  it('associates FormControl errors when aria-invalid is explicitly true', () => {
    render(
      <FormControl>
        <Select aria-label="Status" error={false} aria-invalid>
          <option value="active">Active</option>
        </Select>
        <FormErrorMessage id="status-error">Status is required.</FormErrorMessage>
      </FormControl>,
    );

    const field = screen.getByRole('combobox', { name: 'Status' });
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAttribute('aria-describedby', 'status-error');
    expect(field).toHaveAttribute('aria-errormessage', 'status-error');
  });

  it('inherits FormControl state and message references', () => {
    render(
      <FormControl id="status" isDisabled isInvalid isRequired>
        <FormLabel>Status</FormLabel>
        <Select>
          <option value="active">Active</option>
        </Select>
        <FormHelperText id="status-help">Choose a status.</FormHelperText>
        <FormErrorMessage id="status-error">Status is required.</FormErrorMessage>
      </FormControl>,
    );

    const field = screen.getByRole('combobox', { name: 'Status' });
    expect(field).toHaveAttribute('id', 'status');
    expect(field).toBeDisabled();
    expect(field).toBeRequired();
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAttribute('aria-describedby', 'status-help status-error');
    expect(field).toHaveAttribute('aria-errormessage', 'status-error');
  });

  it('does not change when FormControl is read-only', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FormControl isReadOnly>
        <FormLabel>Status</FormLabel>
        <Select defaultValue="active" onChange={onChange}>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </Select>
      </FormControl>,
    );

    const field = screen.getByRole('combobox', { name: 'Status' });
    await user.selectOptions(field, 'paused');

    expect(field).toHaveValue('active');
    expect(onChange).not.toHaveBeenCalled();
    expect(field).toHaveAttribute('aria-readonly', 'true');
  });

  it('keeps read-only required semantics without creating an unsatisfiable validity state', () => {
    const { container } = render(
      <form>
        <Select aria-label="Status" readOnly required defaultValue="">
          <option value="">Choose a status</option>
          <option value="active">Active</option>
        </Select>
      </form>,
    );

    const form = container.querySelector('form') as HTMLFormElement;
    const field = screen.getByRole('combobox', { name: 'Status' });
    expect(field).not.toHaveAttribute('required');
    expect(field).toHaveAttribute('aria-required', 'true');
    expect(form.checkValidity()).toBe(true);
  });

  it('retains every selected option when a multiple select is read-only', () => {
    render(
      <Select aria-label="Tags" multiple readOnly defaultValue={['a', 'b']}>
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
        <option value="c">Gamma</option>
      </Select>,
    );

    const field = screen.getByRole('listbox', { name: 'Tags' }) as HTMLSelectElement;
    fireEvent.change(field, { target: { value: 'c' } });

    expect(Array.from(field.selectedOptions, (option) => option.value)).toEqual(['a', 'b']);
  });

  it('omits the disclosure chevron for a native multiple listbox', () => {
    render(
      <Select aria-label="Tags" multiple>
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </Select>,
    );

    const field = screen.getByRole('listbox', { name: 'Tags' });
    expect(field.nextElementSibling).toBeNull();
  });

  it('uses the reset selection when a select later becomes read-only', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <form>
        <Select aria-label="Status" defaultValue="active">
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </Select>
      </form>,
    );
    const field = screen.getByRole('combobox');
    await user.selectOptions(field, 'paused');
    (container.querySelector('form') as HTMLFormElement).reset();
    await waitFor(() => expect(field).toHaveValue('active'));

    rerender(
      <form>
        <Select aria-label="Status" defaultValue="active" readOnly>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </Select>
      </form>,
    );
    fireEvent.change(field, { target: { value: 'paused' } });

    expect(field).toHaveValue('active');
  });

  it('captures reset values from a form referenced by the form attribute', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <>
        <form id="status-form" />
        <Select aria-label="Status" form="status-form" defaultValue="active">
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </Select>
      </>,
    );
    const field = screen.getByRole('combobox');
    await user.selectOptions(field, 'paused');
    (container.querySelector('form') as HTMLFormElement).reset();
    await waitFor(() => expect(field).toHaveValue('active'));

    rerender(
      <>
        <form id="status-form" />
        <Select aria-label="Status" form="status-form" defaultValue="active" readOnly>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </Select>
      </>,
    );
    fireEvent.change(field, { target: { value: 'paused' } });

    expect(field).toHaveValue('active');
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

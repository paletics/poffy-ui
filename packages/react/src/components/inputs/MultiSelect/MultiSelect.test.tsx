import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { MultiSelect } from './MultiSelect';

describe('MultiSelect', () => {
  it('renders correctly', () => {
    render(<MultiSelect aria-label="Test Label" options={[]} />);
    expect(screen.getByPlaceholderText('Select options...')).toBeInTheDocument();
  });

  it('can select options', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];
    render(<MultiSelect options={options} onChange={handleChange} />);

    const input = screen.getByRole('combobox');
    await user.click(input);

    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);

    expect(handleChange).toHaveBeenCalledWith(['1']);
  });

  it('updates selected tags when used uncontrolled', async () => {
    const user = userEvent.setup();
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];
    render(<MultiSelect aria-label="Test Label" options={options} />);

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.click(screen.getByRole('option', { name: 'Option 1' }));

    expect(screen.getByRole('button', { name: 'Remove Option 1' })).toBeInTheDocument();
  });

  it('respects defaultValue when used uncontrolled', () => {
    const options = [{ label: 'Option 1', value: '1' }];
    render(<MultiSelect aria-label="Test Label" options={options} defaultValue={['1']} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('can remove tags', () => {
    const handleChange = vi.fn();
    const options = [{ label: 'Option 1', value: '1' }];
    render(<MultiSelect options={options} value={['1']} onChange={handleChange} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: 'Remove Option 1' });
    fireEvent.click(closeButton);

    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('supports custom selected tag rendering', () => {
    const handleChange = vi.fn();
    const options = [{ label: 'Option 1', value: '1' }];
    render(
      <MultiSelect
        options={options}
        value={['1']}
        onChange={handleChange}
        renderTag={({ label, removeLabel, onRemove }) => (
          <button type="button" onClick={onRemove} aria-label={removeLabel}>
            Custom {label}
          </button>
        )}
      />,
    );

    expect(screen.getByText('Custom Option 1')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove Option 1' }));
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('can add a custom typed value when enabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <MultiSelect
        aria-label="Test Label"
        options={[]}
        value={[]}
        onChange={handleChange}
        allowCustomValues
      />,
    );

    const input = screen.getByRole('combobox');
    await user.type(input, 'Custom tag{Enter}');

    expect(handleChange).toHaveBeenCalledWith(['Custom tag']);
  });

  it('normalizes custom typed values before adding them', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <MultiSelect
        aria-label="Test Label"
        options={[]}
        value={[]}
        onChange={handleChange}
        allowCustomValues
        getCustomValue={(inputValue) => inputValue.trim().toLowerCase()}
      />,
    );

    const input = screen.getByRole('combobox');
    await user.type(input, '  Custom Tag  {Enter}');

    expect(handleChange).toHaveBeenCalledWith(['custom tag']);
  });

  it('exposes the highlighted option via aria-activedescendant', () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];
    render(<MultiSelect aria-label="Test Label" options={options} />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const firstOption = screen.getAllByRole('option')[0];

    expect(input).toHaveAttribute('aria-activedescendant');
    expect(firstOption.id).toBeTruthy();
    expect(input.getAttribute('aria-activedescendant')).toBe(firstOption.id);
  });

  it('skips disabled options during keyboard navigation', () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2', disabled: true },
      { label: 'Option 3', value: '3' },
    ];
    render(<MultiSelect aria-label="Test Label" options={options} />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const optionsByRole = screen.getAllByRole('option');
    expect(input.getAttribute('aria-activedescendant')).toBe(optionsByRole[2].id);
  });

  it('highlights the first enabled option after filtering', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const options = [
      { label: 'Disabled match', value: 'disabled', disabled: true },
      { label: 'Display match', value: 'enabled' },
    ];
    render(<MultiSelect aria-label="Test Label" options={options} onChange={handleChange} />);

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.type(input, 'Dis');
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledWith(['enabled']);
    expect(handleChange).not.toHaveBeenCalledWith(['disabled']);
  });

  it('supports Home and End key navigation', () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
      { label: 'Option 3', value: '3' },
    ];
    render(<MultiSelect aria-label="Test Label" options={options} />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'End' });

    const optionsByRole = screen.getAllByRole('option');
    expect(input.getAttribute('aria-activedescendant')).toBe(optionsByRole[2].id);

    fireEvent.keyDown(input, { key: 'Home' });
    expect(input.getAttribute('aria-activedescendant')).toBe(optionsByRole[0].id);
  });

  it('prevents opening and removing tags when readOnly', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];
    render(
      <MultiSelect
        aria-label="Test Label"
        options={options}
        value={['1']}
        onChange={handleChange}
        readOnly
      />,
    );

    await user.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove Option 1' }));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('reflects error state on the combobox input', () => {
    render(<MultiSelect aria-label="Test Label" options={[]} error />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards tabIndex and required state to the combobox input', () => {
    render(<MultiSelect aria-label="Test Label" options={[]} tabIndex={-1} required />);

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('tabindex', '-1');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('does not report an expanded listbox when filtering leaves no options', async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        aria-label="Test Label"
        options={[{ label: 'Option 1', value: '1' }]}
        allowCustomValues
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');

    await user.type(input, 'missing');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('submits selected values through hidden inputs', () => {
    const { container } = render(
      <MultiSelect
        aria-label="Test Label"
        name="fruits"
        options={[
          { label: 'Apple', value: 'apple' },
          { label: 'Orange', value: 'orange' },
        ]}
        value={['apple', 'orange']}
      />,
    );

    const hiddenInputs = container.querySelectorAll('input[type="hidden"][name="fruits"]');
    expect(hiddenInputs).toHaveLength(2);
    expect(Array.from(hiddenInputs).map((input) => (input as HTMLInputElement).value)).toEqual([
      'apple',
      'orange',
    ]);
    expect(screen.getByRole('combobox')).not.toHaveAttribute('name');
  });

  it('passes a11y checks', async () => {
    const { container } = render(<MultiSelect aria-label="Test Label" options={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

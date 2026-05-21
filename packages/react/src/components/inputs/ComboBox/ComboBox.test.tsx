import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ComboBox } from './ComboBox';

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

/**
 * ### Test Strategy: ComboBox
 * - **Focus**: Rendering, filtering, keyboard navigation (ArrowDown/Up, Enter, Escape),
 *   mouse selection, controlled `onChange` callback, and WAI-ARIA combobox compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 * - **DON'T**: Do not test animation timing or Panda CSS token output.
 */
describe('ComboBox', () => {
  it('renders correctly', async () => {
    render(<ComboBox options={options} placeholder="Select" />);
    expect(screen.getByPlaceholderText('Select')).toBeInTheDocument();
  });

  it('supports neo appearance', async () => {
    render(<ComboBox appearance="neo" options={options} placeholder="Select" />);
    expect(screen.getByPlaceholderText('Select')).toBeInTheDocument();
  });

  it('opens menu on focus', async () => {
    const user = userEvent.setup();
    render(<ComboBox options={options} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('filters options on input', async () => {
    const user = userEvent.setup();
    render(<ComboBox options={options} />);
    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByRole('combobox'), 'Option 1');
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });

  it('calls onChange when option is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ComboBox options={options} onChange={handleChange} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Option 1'));
    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('navigates options with ArrowDown and selects with Enter', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ComboBox options={options} onChange={handleChange} />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledWith('2');
    expect(input).toHaveValue('Option 2');
  });

  it('navigates upward with ArrowUp', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ComboBox options={options} onChange={handleChange} />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowUp}{Enter}');
    expect(handleChange).toHaveBeenCalledWith('2');
  });

  it('does not select disabled filtered options with Enter', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ComboBox
        options={[
          { label: 'Disabled match', value: 'disabled', disabled: true },
          { label: 'Display match', value: 'enabled' },
        ]}
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.type(input, 'Dis');
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledWith('enabled');
    expect(handleChange).not.toHaveBeenCalledWith('disabled');
  });

  it('preserves input filtering and keyboard selection when handlers are provided', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const handleInputChange = vi.fn();
    const handleKeyDown = vi.fn();

    render(
      <ComboBox.Root options={options} onChange={handleChange} aria-label="Options">
        <ComboBox.Input onChange={handleInputChange} onKeyDown={handleKeyDown} />
        <ComboBox.List>
          {options.map((option) => (
            <ComboBox.Item key={option.value} value={option.value} label={option.label} />
          ))}
        </ComboBox.List>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    await user.click(input);
    await user.type(input, 'Option 1');

    expect(handleInputChange).toHaveBeenCalled();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();

    await user.keyboard('{Enter}');

    expect(handleKeyDown.mock.calls.some(([event]) => event.key === 'Enter')).toBe(true);
    expect(handleChange).toHaveBeenCalledWith('1');
    expect(input).toHaveValue('Option 1');
  });

  it('allows input handlers to cancel keyboard selection', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <ComboBox.Root options={options} onChange={handleChange} aria-label="Options">
        <ComboBox.Input
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.preventDefault();
          }}
        />
        <ComboBox.List>
          {options.map((option) => (
            <ComboBox.Item key={option.value} value={option.value} label={option.label} />
          ))}
        </ComboBox.List>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    await user.click(input);
    await user.type(input, 'Option 1');
    await user.keyboard('{Enter}');

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('blocks asChild input bubble handlers while disabled', () => {
    const childPointerDown = vi.fn();
    const childKeyDown = vi.fn();
    const childChange = vi.fn();

    render(
      <ComboBox.Root options={options} disabled aria-label="Options">
        <ComboBox.Input asChild>
          <input onPointerDown={childPointerDown} onKeyDown={childKeyDown} onChange={childChange} />
        </ComboBox.Input>
        <ComboBox.List>
          {options.map((option) => (
            <ComboBox.Item key={option.value} value={option.value} label={option.label} />
          ))}
        </ComboBox.List>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    fireEvent.pointerDown(input, { button: 0 });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.change(input, { target: { value: 'Option' } });

    expect(childPointerDown).not.toHaveBeenCalled();
    expect(childKeyDown).not.toHaveBeenCalled();
    expect(childChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('blocks asChild input capture handlers while disabled', () => {
    const childPointerDownCapture = vi.fn();
    const childKeyDownCapture = vi.fn();
    const childChangeCapture = vi.fn();

    render(
      <ComboBox.Root options={options} disabled aria-label="Options">
        <ComboBox.Input asChild>
          <input
            onPointerDownCapture={childPointerDownCapture}
            onKeyDownCapture={childKeyDownCapture}
            onChangeCapture={childChangeCapture}
          />
        </ComboBox.Input>
        <ComboBox.List>
          {options.map((option) => (
            <ComboBox.Item key={option.value} value={option.value} label={option.label} />
          ))}
        </ComboBox.List>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    fireEvent.pointerDown(input, { button: 0 });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.change(input, { target: { value: 'Option' } });

    expect(childPointerDownCapture).not.toHaveBeenCalled();
    expect(childKeyDownCapture).not.toHaveBeenCalled();
    expect(childChangeCapture).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('blocks asChild input bubble handlers while read only', () => {
    const childPointerDown = vi.fn();
    const childKeyDown = vi.fn();
    const childChange = vi.fn();

    render(
      <ComboBox.Root options={options} readOnly aria-label="Options">
        <ComboBox.Input asChild>
          <input onPointerDown={childPointerDown} onKeyDown={childKeyDown} onChange={childChange} />
        </ComboBox.Input>
        <ComboBox.List>
          {options.map((option) => (
            <ComboBox.Item key={option.value} value={option.value} label={option.label} />
          ))}
        </ComboBox.List>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    fireEvent.pointerDown(input, { button: 0 });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.change(input, { target: { value: 'Option' } });

    expect(childPointerDown).not.toHaveBeenCalled();
    expect(childKeyDown).not.toHaveBeenCalled();
    expect(childChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('blocks asChild input capture handlers while read only', () => {
    const childPointerDownCapture = vi.fn();
    const childKeyDownCapture = vi.fn();
    const childChangeCapture = vi.fn();

    render(
      <ComboBox.Root options={options} readOnly aria-label="Options">
        <ComboBox.Input asChild>
          <input
            onPointerDownCapture={childPointerDownCapture}
            onKeyDownCapture={childKeyDownCapture}
            onChangeCapture={childChangeCapture}
          />
        </ComboBox.Input>
        <ComboBox.List>
          {options.map((option) => (
            <ComboBox.Item key={option.value} value={option.value} label={option.label} />
          ))}
        </ComboBox.List>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    fireEvent.pointerDown(input, { button: 0 });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.change(input, { target: { value: 'Option' } });

    expect(childPointerDownCapture).not.toHaveBeenCalled();
    expect(childKeyDownCapture).not.toHaveBeenCalled();
    expect(childChangeCapture).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it.each([
    ['disabled', { disabled: true }],
    ['read only', { readOnly: true }],
  ] as const)('allows Tab to leave an asChild input while %s', async (_state, rootProps) => {
    const user = userEvent.setup();
    render(
      <>
        <ComboBox.Root options={options} aria-label="Options" {...rootProps}>
          <ComboBox.Input asChild>
            <input />
          </ComboBox.Input>
          <ComboBox.List>
            {options.map((option) => (
              <ComboBox.Item key={option.value} value={option.value} label={option.label} />
            ))}
          </ComboBox.List>
        </ComboBox.Root>
        <button type="button">After</button>
      </>,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    input.focus();

    expect(fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' })).toBe(true);

    input.focus();
    await user.tab();

    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('preserves item selection when item handlers are provided', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const handleClick = vi.fn();
    const handleKeyDown = vi.fn();

    render(
      <ComboBox.Root options={options} onChange={handleChange} aria-label="Options">
        <ComboBox.Input />
        <ComboBox.List>
          <ComboBox.Item
            value="1"
            label="Option 1"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
          />
        </ComboBox.List>
      </ComboBox.Root>,
    );

    await user.click(screen.getByRole('combobox', { name: 'Options' }));
    const option = screen.getByRole('option', { name: 'Option 1' });

    fireEvent.keyDown(option, { key: 'Enter', code: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledWith('1');

    handleChange.mockClear();
    await user.click(screen.getByRole('combobox', { name: 'Options' }));
    await user.click(screen.getByRole('option', { name: 'Option 1' }));

    expect(handleClick).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('allows item handlers to cancel selection', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <ComboBox.Root options={options} onChange={handleChange} aria-label="Options">
        <ComboBox.Input />
        <ComboBox.List>
          <ComboBox.Item value="1" label="Option 1" onClick={(event) => event.preventDefault()} />
        </ComboBox.List>
      </ComboBox.Root>,
    );

    await user.click(screen.getByRole('combobox', { name: 'Options' }));
    await user.click(screen.getByRole('option', { name: 'Option 1' }));

    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('closes menu on Escape', async () => {
    const user = userEvent.setup();
    render(<ComboBox options={options} />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('wires combobox and listbox semantics', async () => {
    const user = userEvent.setup();
    render(<ComboBox options={options} label="Combo Label" />);

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-expanded', 'false');

    await user.click(input);

    const listbox = screen.getByRole('listbox');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-controls', listbox.getAttribute('id'));

    await user.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant');
  });

  it('forwards input accessibility props and form value', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ComboBox
        id="country"
        name="country"
        form="profile"
        required
        aria-label="Country"
        aria-describedby="country-help"
        options={options}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Country' });
    expect(input).toHaveAttribute('id', 'country');
    expect(input).toHaveAttribute('aria-describedby', 'country-help');
    expect(input).toHaveAttribute('aria-required', 'true');

    await user.click(input);
    await user.click(screen.getByText('Option 2'));

    const hiddenInput = container.querySelector('input[type="hidden"][name="country"]');
    expect(hiddenInput).toHaveValue('2');
    expect(hiddenInput).toHaveAttribute('form', 'profile');
  });

  it('does not open or change when read only', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<ComboBox readOnly options={options} onChange={handleChange} aria-label="Readonly" />);

    await user.click(screen.getByRole('combobox', { name: 'Readonly' }));

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('passes a11y checks', async () => {
    const { container } = render(<ComboBox options={options} label="Combo Label" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

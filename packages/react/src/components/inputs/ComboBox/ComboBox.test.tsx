import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ComboBox } from './ComboBox';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';

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
  it('inherits FormControl state and native label association', async () => {
    const { container } = render(
      <FormControl id="country" isInvalid isDisabled isReadOnly isRequired>
        <FormLabel>Country</FormLabel>
        <ComboBox options={options} />
        <FormHelperText>Choose your country.</FormHelperText>
        <FormErrorMessage>Country is required.</FormErrorMessage>
      </FormControl>,
    );

    const input = screen.getByRole('combobox', { name: 'Country' });
    const label = screen.getByText('Country').closest('label');
    expect(label).toHaveAttribute('for', 'country');
    expect(label?.control).toBe(input);
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
    expect(input).toHaveAttribute('aria-errormessage');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('associates FormControl errors when aria-invalid is explicitly true', () => {
    render(
      <FormControl>
        <ComboBox aria-label="Country" error={false} aria-invalid options={options} />
        <FormErrorMessage id="country-error">Country is required.</FormErrorMessage>
      </FormControl>,
    );

    const input = screen.getByRole('combobox', { name: 'Country' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'country-error');
    expect(input).toHaveAttribute('aria-errormessage', 'country-error');
  });

  it('renders correctly', async () => {
    render(<ComboBox options={options} placeholder="Select" />);
    expect(screen.getByPlaceholderText('Select')).toBeInTheDocument();
  });

  it('renders declared compound children through the compound root', async () => {
    const user = userEvent.setup();
    render(
      <ComboBox.Root options={[{ label: 'Custom option', value: 'custom' }]}>
        <ComboBox.Input aria-label="Custom combobox" />
        <ComboBox.List>
          <ComboBox.Item value="custom" label="Custom option" />
        </ComboBox.List>
      </ComboBox.Root>,
    );

    await user.click(screen.getByRole('combobox', { name: 'Custom combobox' }));
    expect(screen.getByRole('option', { name: 'Custom option' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Option 1' })).not.toBeInTheDocument();
  });

  it('applies the root locale to compound input default labels', () => {
    render(
      <ComboBox.Root locale="ja-JP" options={options}>
        <ComboBox.Input aria-label="Country" />
        <ComboBox.List>
          {options.map((option) => (
            <ComboBox.Item key={option.value} {...option} />
          ))}
        </ComboBox.List>
      </ComboBox.Root>,
    );

    expect(screen.getByRole('button', { name: '選択肢を開閉' })).toBeInTheDocument();
  });

  it('forwards the compound input ref directly', () => {
    const childRef = createRef<HTMLInputElement>();
    render(
      <ComboBox.Root options={[{ label: 'Custom option', value: 'custom' }]}>
        <ComboBox.Input ref={childRef} aria-label="Custom combobox" />
        <ComboBox.List>
          <ComboBox.Item value="custom" label="Custom option" />
        </ComboBox.List>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Custom combobox' });
    expect(childRef.current).toBe(input);
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

  it('supports controlled query text for remote option loading', async () => {
    const onInputValueChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <ComboBox
        aria-label="Assignee"
        inputValue="ada"
        isLoading
        loadingContent="Searching people"
        options={[]}
        onInputValueChange={onInputValueChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Assignee' });
    await user.click(input);
    await user.type(input, 'l');

    expect(onInputValueChange).toHaveBeenCalledWith('adal');
    expect(screen.getByRole('status')).toHaveTextContent('Searching people');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('notifies once for each typed input update', async () => {
    const onInputValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ComboBox aria-label="Options" options={options} onInputValueChange={onInputValueChange} />,
    );

    await user.type(screen.getByRole('combobox', { name: 'Options' }), 'ab');

    expect(onInputValueChange).toHaveBeenCalledTimes(2);
    expect(onInputValueChange).toHaveBeenNthCalledWith(1, 'a');
    expect(onInputValueChange).toHaveBeenNthCalledWith(2, 'ab');
  });

  it('notifies once when an option selection updates the input text', async () => {
    const onInputValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ComboBox aria-label="Options" options={options} onInputValueChange={onInputValueChange} />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Options' }));
    await user.click(screen.getByRole('option', { name: 'Option 2' }));
    await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('Option 2'));

    expect(onInputValueChange).toHaveBeenCalledTimes(1);
    expect(onInputValueChange).toHaveBeenCalledWith('Option 2');
  });

  it('notifies once when a controlled selection synchronizes different input text', async () => {
    const onInputValueChange = vi.fn();
    const { rerender } = render(
      <ComboBox
        aria-label="Options"
        options={options}
        value="1"
        onChange={() => undefined}
        onInputValueChange={onInputValueChange}
      />,
    );
    await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('Option 1'));
    onInputValueChange.mockClear();

    rerender(
      <ComboBox
        aria-label="Options"
        options={options}
        value="2"
        onChange={() => undefined}
        onInputValueChange={onInputValueChange}
      />,
    );

    await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('Option 2'));
    expect(onInputValueChange).toHaveBeenCalledTimes(1);
    expect(onInputValueChange).toHaveBeenCalledWith('Option 2');
  });

  it('notifies once when an option label change synchronizes selected input text', async () => {
    const onInputValueChange = vi.fn();
    const { rerender } = render(
      <ComboBox
        aria-label="Options"
        options={options}
        defaultValue="1"
        onInputValueChange={onInputValueChange}
      />,
    );
    await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('Option 1'));
    onInputValueChange.mockClear();

    rerender(
      <ComboBox
        aria-label="Options"
        options={[{ label: 'Renamed option', value: '1' }, ...options.slice(1)]}
        defaultValue="1"
        onInputValueChange={onInputValueChange}
      />,
    );

    await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('Renamed option'));
    expect(onInputValueChange).toHaveBeenCalledTimes(1);
    expect(onInputValueChange).toHaveBeenCalledWith('Renamed option');
  });

  it('renders an empty state when filtering finds no option', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ComboBox aria-label="Country" emptyContent="No countries available" options={options} />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Country' }));
    await user.type(screen.getByRole('combobox', { name: 'Country' }), 'zzz');

    expect(screen.getByRole('status')).toHaveTextContent('No countries available');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('calls onChange when option is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ComboBox options={options} onChange={handleChange} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Option 1'));
    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('retains the latest controlled selection when becoming uncontrolled', async () => {
    const { rerender } = render(<ComboBox options={options} value="1" name="choice" />);

    rerender(<ComboBox options={options} value="2" name="choice" />);
    rerender(<ComboBox options={options} name="choice" />);

    await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('Option 2'));
    expect(screen.getByDisplayValue('2')).toHaveAttribute('name', 'choice');
  });

  it('retains a controlled null selection when becoming uncontrolled', async () => {
    const { container, rerender } = render(<ComboBox options={options} value="1" name="choice" />);

    rerender(<ComboBox options={options} value={null} name="choice" />);
    rerender(<ComboBox options={options} name="choice" />);

    await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue(''));
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('');
  });

  it('restores the latest uncontrolled default value when its form resets', async () => {
    const user = userEvent.setup();
    const onInputValueChange = vi.fn();
    const { container, rerender } = render(
      <form>
        <ComboBox
          name="country"
          defaultValue="1"
          options={options}
          aria-label="Country"
          onInputValueChange={onInputValueChange}
        />
      </form>,
    );
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.clear(input);
    await user.click(screen.getByRole('option', { name: 'Option 2' }));

    rerender(
      <form>
        <ComboBox
          name="country"
          defaultValue="3"
          options={options}
          aria-label="Country"
          onInputValueChange={onInputValueChange}
        />
      </form>,
    );
    onInputValueChange.mockClear();
    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() => expect(input).toHaveValue('Option 3'));
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('3');
    expect(onInputValueChange).not.toHaveBeenCalled();
  });

  it('resets an uncontrolled text axis while preserving a controlled selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onInputValueChange = vi.fn();
    const { container } = render(
      <form>
        <ComboBox
          aria-label="Options"
          name="choice"
          options={options}
          value="1"
          onChange={onChange}
          onInputValueChange={onInputValueChange}
        />
      </form>,
    );
    const input = screen.getByRole('combobox', { name: 'Options' });
    await waitFor(() => expect(input).toHaveValue('Option 1'));
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'zzz');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    onInputValueChange.mockClear();

    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() => expect(input).toHaveValue('Option 1'));
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-activedescendant');
    expect(container.querySelector('input[type="hidden"][name="choice"]')).toHaveValue('1');
    expect(onChange).not.toHaveBeenCalled();
    expect(onInputValueChange).not.toHaveBeenCalled();
  });

  it('resets an uncontrolled selection while preserving a controlled text axis', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onInputValueChange = vi.fn();
    const { container } = render(
      <form>
        <ComboBox
          aria-label="Options"
          defaultValue="1"
          inputValue=""
          name="choice"
          onChange={onChange}
          onInputValueChange={onInputValueChange}
          options={options}
        />
      </form>,
    );
    const input = screen.getByRole('combobox', { name: 'Options' });
    await user.click(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await user.click(screen.getByRole('option', { name: 'Option 2' }));
    expect(container.querySelector('input[type="hidden"][name="choice"]')).toHaveValue('2');
    await user.click(input);
    onChange.mockClear();
    onInputValueChange.mockClear();

    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    expect(input).toHaveValue('');
    expect(container.querySelector('input[type="hidden"][name="choice"]')).toHaveValue('1');
    expect(onChange).not.toHaveBeenCalled();
    expect(onInputValueChange).not.toHaveBeenCalled();
  });

  it('restores the latest default input baseline independently from selection', async () => {
    const user = userEvent.setup();
    const onInputValueChange = vi.fn();
    const { container, rerender } = render(
      <form>
        <ComboBox
          aria-label="Options"
          defaultInputValue="initial query"
          defaultValue="1"
          onInputValueChange={onInputValueChange}
          options={options}
        />
      </form>,
    );
    const input = screen.getByRole('combobox', { name: 'Options' });
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'edited query');
    rerender(
      <form>
        <ComboBox
          aria-label="Options"
          defaultInputValue="latest query"
          defaultValue="1"
          onInputValueChange={onInputValueChange}
          options={options}
        />
      </form>,
    );
    onInputValueChange.mockClear();

    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() => expect(input).toHaveValue('latest query'));
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(onInputValueChange).not.toHaveBeenCalled();
  });

  it('preserves an independent default input baseline on initial mount', async () => {
    const onInputValueChange = vi.fn();
    render(
      <ComboBox
        aria-label="Options"
        defaultInputValue="custom query"
        defaultValue="1"
        onInputValueChange={onInputValueChange}
        options={options}
      />,
    );

    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Options' })).toHaveValue('custom query'),
    );
    expect(onInputValueChange).not.toHaveBeenCalled();
  });

  it('does not emit selection callbacks when the selected option is chosen again', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboBox aria-label="Options" defaultValue="1" onChange={onChange} options={options} />,
    );
    const input = screen.getByRole('combobox', { name: 'Options' });
    await waitFor(() => expect(input).toHaveValue('Option 1'));

    await user.click(input);
    await user.click(screen.getByRole('option', { name: 'Option 1' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('silently clears an orphaned reset default', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container, rerender } = render(
      <form>
        <ComboBox
          aria-label="Options"
          defaultValue="1"
          name="choice"
          onChange={onChange}
          options={options}
        />
      </form>,
    );
    const input = screen.getByRole('combobox', { name: 'Options' });
    await user.click(input);
    await user.clear(input);
    await user.click(screen.getByRole('option', { name: 'Option 2' }));
    rerender(
      <form>
        <ComboBox
          aria-label="Options"
          defaultValue="missing"
          name="choice"
          onChange={onChange}
          options={options}
        />
      </form>,
    );
    onChange.mockClear();

    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() =>
      expect(container.querySelector('input[type="hidden"][name="choice"]')).toHaveValue(''),
    );
    expect(input).toHaveValue('');
    expect(onChange).not.toHaveBeenCalled();
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

  it('preserves native Enter behavior when no option can be selected', () => {
    render(<ComboBox options={options} />);
    const input = screen.getByRole('combobox');

    expect(fireEvent.keyDown(input, { key: 'Enter' })).toBe(true);
    fireEvent.pointerDown(input, { button: 0 });
    expect(fireEvent.keyDown(input, { key: 'Enter' })).toBe(true);
  });

  it('reveals the active option during keyboard navigation', () => {
    render(<ComboBox options={options} />);
    const input = screen.getByRole('combobox');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const secondOption = screen.getByRole('option', { name: 'Option 2' });
    const scrollIntoView = vi.fn();
    Object.assign(secondOption, { scrollIntoView });

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
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

  it('retains the highlighted option when options are reordered', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { rerender } = render(<ComboBox options={options} onChange={handleChange} />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowDown}');

    rerender(<ComboBox options={[options[1], options[0], options[2]]} onChange={handleChange} />);
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledWith('2');
  });

  it('does not select when the highlighted option disappears', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { rerender } = render(<ComboBox options={options} onChange={handleChange} />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowDown}');

    rerender(<ComboBox options={[options[0], options[2]]} onChange={handleChange} />);
    await user.keyboard('{Enter}');

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('clears form state when the selected option disappears', async () => {
    const handleChange = vi.fn();
    const { container, rerender } = render(
      <ComboBox
        aria-label="Options"
        defaultValue="2"
        name="choice"
        onChange={handleChange}
        options={options}
      />,
    );

    rerender(
      <ComboBox
        aria-label="Options"
        defaultValue="2"
        name="choice"
        onChange={handleChange}
        options={[options[0], options[2]]}
      />,
    );

    await waitFor(() => {
      expect(container.querySelector('input[type="hidden"][name="choice"]')).toHaveValue('');
      expect(screen.getByRole('combobox', { name: 'Options' })).toHaveValue('');
    });
    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it('preserves a selected remote value while options are loading', async () => {
    const handleChange = vi.fn();
    const { container, rerender } = render(
      <ComboBox
        aria-label="Options"
        name="choice"
        onChange={handleChange}
        options={options}
        value="2"
      />,
    );
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Options' })).toHaveValue('Option 2'),
    );

    rerender(
      <ComboBox
        aria-label="Options"
        isLoading
        name="choice"
        onChange={handleChange}
        options={[]}
        value="2"
      />,
    );

    expect(container.querySelector('input[type="hidden"][name="choice"]')).toHaveValue('2');
    expect(screen.getByRole('combobox', { name: 'Options' })).toHaveValue('Option 2');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('does not select an option when Enter confirms an IME composition', () => {
    const handleChange = vi.fn();
    render(<ComboBox options={options} onChange={handleChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.pointerDown(input, { button: 0 });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });

    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
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

  it('resolves filtered highlight identity against the next collection', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ComboBox
        options={[
          { label: 'Alpha', value: 'alpha' },
          { label: 'Beta', value: 'beta' },
        ]}
        value="alpha"
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'B');

    const betaOption = screen.getByRole('option', { name: 'Beta' });
    expect(input).toHaveAttribute('aria-activedescendant', betaOption.id);
    expect(betaOption).toHaveAttribute('data-highlighted', '');

    await user.clear(input);
    const alphaOption = screen.getByRole('option', { name: 'Alpha' });
    expect(input).toHaveAttribute('aria-activedescendant', alphaOption.id);

    await user.type(input, 'B');
    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledWith('beta');
  });

  it('keeps active descendant ids aligned when manual items use a different DOM order', async () => {
    const user = userEvent.setup();
    render(
      <ComboBox.Root
        options={[
          { label: 'Alpha', value: 'alpha' },
          { label: 'Beta', value: 'beta' },
        ]}
        aria-label="Reordered options"
      >
        <ComboBox.Input />
        <ComboBox.List>
          <ComboBox.Item value="beta" label="Beta" />
          <ComboBox.Item value="alpha" label="Alpha" />
        </ComboBox.List>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Reordered options' });
    await user.click(input);
    await user.keyboard('{ArrowDown}');

    const alpha = screen.getByRole('option', { name: 'Alpha' });
    expect(input).toHaveAttribute('aria-activedescendant', alpha.id);
    expect(alpha).toHaveAttribute('data-highlighted', '');
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

  it('falls back to a native input for an incompatible asChild host', () => {
    render(
      <ComboBox.Root options={options} aria-label="Options">
        <ComboBox.Input asChild>
          <div data-testid="invalid-input-host">Options</div>
        </ComboBox.Input>
        <ComboBox.List>
          {options.map((option) => (
            <ComboBox.Item key={option.value} value={option.value} label={option.label} />
          ))}
        </ComboBox.List>
      </ComboBox.Root>,
    );

    expect(screen.getByRole('combobox', { name: 'Options' }).tagName).toBe('INPUT');
    expect(screen.queryByTestId('invalid-input-host')).not.toBeInTheDocument();
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
    expect(input).toBeDisabled();
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

  it('exposes read-only semantics on an asChild input', () => {
    render(
      <ComboBox.Root options={options} readOnly aria-label="Options">
        <ComboBox.Input asChild>
          <input />
        </ComboBox.Input>
      </ComboBox.Root>,
    );

    expect(screen.getByRole('combobox', { name: 'Options' })).toHaveAttribute(
      'aria-readonly',
      'true',
    );
  });

  it('owns model scalars on an enabled asChild input', () => {
    render(
      <ComboBox.Root options={options} aria-label="Options">
        <ComboBox.Input asChild>
          <input
            id="wrong-input"
            role="searchbox"
            value="stale"
            defaultValue="also stale"
            disabled
            readOnly
            aria-expanded="true"
            aria-controls="wrong-list"
            aria-haspopup="dialog"
            aria-disabled="true"
            aria-readonly="true"
            tabIndex={-1}
            onChange={() => undefined}
          />
        </ComboBox.Input>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    expect(input).not.toHaveAttribute('id', 'wrong-input');
    expect(input).toHaveValue('');
    expect(input).not.toBeDisabled();
    expect(input).not.toHaveAttribute('readonly');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-controls');
    expect(input).not.toHaveAttribute('aria-haspopup');
    expect(input).not.toHaveAttribute('aria-disabled');
    expect(input).not.toHaveAttribute('aria-readonly');
    expect(input).toHaveAttribute('tabindex', '0');
  });

  it('consumes untyped managed props on the native input path', () => {
    const managedProps = {
      id: 'wrong-input',
      type: 'number',
      role: 'searchbox',
      value: 'stale',
      defaultValue: 'also stale',
      disabled: true,
      readOnly: true,
      required: true,
      'aria-activedescendant': 'wrong-option',
      'aria-autocomplete': 'none',
      'aria-controls': 'wrong-list',
      'aria-disabled': true,
      'aria-expanded': true,
      'aria-haspopup': 'dialog',
      'aria-readonly': true,
      'aria-required': true,
    } as never;

    render(
      <ComboBox.Root options={options} aria-label="Options">
        <ComboBox.Input {...managedProps} />
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    expect(input.id).not.toBe('wrong-input');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('');
    expect(input).not.toHaveAttribute('defaultValue');
    expect(input).not.toBeDisabled();
    expect(input).not.toHaveAttribute('readonly');
    expect(input).not.toBeRequired();
    expect(input).not.toHaveAttribute('aria-activedescendant');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).not.toHaveAttribute('aria-controls');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-haspopup');
    expect(input).not.toHaveAttribute('aria-disabled');
    expect(input).not.toHaveAttribute('aria-readonly');
    expect(input).not.toHaveAttribute('aria-required');
  });

  it('uses one accessible name source and merges description tokens for asChild', () => {
    render(
      <>
        <span id="root-help">Root help</span>
        <span id="child-name">Child name</span>
        <span id="child-help">Child help</span>
        <span id="wrapper-help">Wrapper help</span>
        <ComboBox.Root options={options} aria-label="Root name" aria-describedby="root-help">
          <ComboBox.Input
            asChild
            aria-label="Wrapper name"
            aria-describedby="wrapper-help root-help"
          >
            <input aria-labelledby="child-name" aria-describedby="child-help" />
          </ComboBox.Input>
        </ComboBox.Root>
      </>,
    );

    const input = screen.getByRole('combobox', { name: 'Wrapper name' });
    expect(input).not.toHaveAttribute('aria-labelledby');
    expect(input).toHaveAttribute('aria-describedby', 'root-help child-help wrapper-help');
  });

  it('prefers the local input tabIndex over the root tabIndex', () => {
    render(
      <ComboBox.Root options={options} aria-label="Options" tabIndex={-1}>
        <ComboBox.Input tabIndex={2} />
      </ComboBox.Root>,
    );

    expect(screen.getByRole('combobox', { name: 'Options' })).toHaveAttribute('tabindex', '2');
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

  it('preserves item handlers while suppressing a redundant selection', async () => {
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
    expect(handleChange).not.toHaveBeenCalled();
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

  it('blocks a portalled selection when an ancestor fieldset becomes disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <fieldset>
        <ComboBox aria-label="Country" options={options} onChange={onChange} />
      </fieldset>,
    );
    const fieldset = container.querySelector('fieldset') as HTMLFieldSetElement;
    const input = screen.getByRole('combobox', { name: 'Country' });

    await user.click(input);
    const option = screen.getByRole('option', { name: 'Option 2' });

    // Exercise the interval before the bridge's MutationObserver snapshot rerenders.
    fieldset.disabled = true;
    fireEvent.click(option);

    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));

    fieldset.disabled = false;
    await waitFor(() => expect(input).not.toBeDisabled());
    await user.click(input);
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
  });

  it('wires combobox and listbox semantics', async () => {
    const user = userEvent.setup();
    render(<ComboBox options={options} label="Combo Label" />);

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-controls');

    await user.click(input);

    const listbox = screen.getByRole('listbox');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-controls', listbox.getAttribute('id'));

    await user.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant');
  });

  it('keeps compound list and option ARIA wiring component-owned', async () => {
    const user = userEvent.setup();
    render(
      <ComboBox.Root
        options={[
          { label: 'Available', value: 'available' },
          { label: 'Unavailable', value: 'unavailable', disabled: true },
        ]}
      >
        <ComboBox.Input aria-label="Options" />
        <ComboBox.List id="custom-list" role="presentation">
          <ComboBox.Item
            value="available"
            label="Available"
            id="custom-option"
            {...{ role: 'presentation', 'aria-selected': true, 'aria-disabled': true }}
          />
          <ComboBox.Item
            value="unavailable"
            label="Unavailable"
            disabled
            id="custom-disabled-option"
            {...{ role: 'presentation', 'aria-selected': false, 'aria-disabled': false }}
          />
        </ComboBox.List>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    await user.click(input);
    await user.keyboard('{ArrowDown}');

    const listbox = screen.getByRole('listbox');
    const option = screen.getByRole('option', { name: 'Available' });
    const disabledOption = screen.getByRole('option', { name: 'Unavailable' });
    expect(input).toHaveAttribute('aria-controls', listbox.id);
    expect(input).toHaveAttribute('aria-activedescendant', option.id);
    expect(option).not.toHaveAttribute('aria-disabled');
    expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
  });

  it('uses root option disabled state consistently for compound item interactions', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboBox.Root
        onChange={onChange}
        options={[
          { label: 'Available', value: 'available' },
          { label: 'Unavailable', value: 'unavailable', disabled: true },
        ]}
      >
        <ComboBox.Input aria-label="Options" />
        <ComboBox.List>
          <ComboBox.Item value="available" label="Available" />
          <ComboBox.Item value="unavailable" label="Unavailable" />
        </ComboBox.List>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    await user.click(input);
    await user.keyboard('{ArrowDown}');

    const available = screen.getByRole('option', { name: 'Available' });
    const unavailable = screen.getByRole('option', { name: 'Unavailable' });
    expect(input).toHaveAttribute('aria-activedescendant', available.id);
    expect(unavailable).toHaveAttribute('aria-disabled', 'true');

    await user.click(unavailable);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps the public compound list ref on the outer listbox host', async () => {
    const user = userEvent.setup();
    const listRef = createRef<HTMLDivElement>();
    render(
      <ComboBox.Root options={[{ label: 'Option 1', value: '1' }]}>
        <ComboBox.Input aria-label="Options" />
        <ComboBox.List ref={listRef}>
          <ComboBox.Item value="1" label="Option 1" />
        </ComboBox.List>
      </ComboBox.Root>,
    );

    await user.click(screen.getByRole('combobox', { name: 'Options' }));

    expect(listRef.current).toBe(screen.getByRole('listbox'));
  });

  it('fails closed and warns when duplicate values are supplied', async () => {
    const user = userEvent.setup();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <ComboBox
        aria-label="Options"
        options={[
          { label: 'First option', value: 'duplicate' },
          { label: 'Second option', value: 'duplicate' },
        ]}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    await user.click(input);
    await user.keyboard('{ArrowDown}');

    expect(input).not.toHaveAttribute('aria-activedescendant');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('option values must be unique'));
    warn.mockRestore();
  });

  it('renders an item declared inside a wrapper without child inspection', async () => {
    const user = userEvent.setup();
    const WrappedItem = () => <ComboBox.Item value="wrapped" label="Wrapped option" />;
    render(
      <ComboBox.Root options={[{ label: 'Wrapped option', value: 'wrapped' }]} aria-label="Options">
        <ComboBox.Input />
        <ComboBox.List>
          <WrappedItem />
        </ComboBox.List>
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    await user.click(input);
    await user.keyboard('{ArrowDown}');

    const activeOptionId = input.getAttribute('aria-activedescendant');
    expect(screen.getByRole('option', { name: 'Wrapped option' })).toHaveAttribute(
      'id',
      activeOptionId,
    );
  });

  it.each([
    ['disabled', { disabled: true }],
    ['read only', { readOnly: true }],
  ] as const)('closes an open popup after becoming %s', async (_state, rootProps) => {
    const user = userEvent.setup();
    const { rerender } = render(<ComboBox options={options} aria-label="Options" />);
    const input = screen.getByRole('combobox', { name: 'Options' });

    await user.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    rerender(<ComboBox options={options} aria-label="Options" {...rootProps} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-controls');
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

  it('merges a custom class onto the compound input host', () => {
    render(
      <ComboBox.Root aria-label="Options" options={options}>
        <ComboBox.Input className="custom-input" />
      </ComboBox.Root>,
    );

    expect(screen.getByRole('combobox', { name: 'Options' })).toHaveClass('custom-input');
  });

  it('excludes a read-only required combobox from native constraint validation', () => {
    const { container, rerender } = render(
      <form>
        <ComboBox required options={options} aria-label="Country" />
      </form>,
    );
    const form = container.querySelector('form')!;
    expect(form).toBeInvalid();

    rerender(
      <form>
        <ComboBox required readOnly options={options} aria-label="Country" />
      </form>,
    );
    expect(form).toBeValid();
  });

  it('keeps combobox state attributes owned by the component', () => {
    render(
      <ComboBox.Root options={options} aria-label="Options">
        <ComboBox.Input
          {...{
            role: 'textbox',
            'aria-controls': 'external-list',
            'aria-expanded': 'true',
            'aria-activedescendant': 'external-option',
            'aria-disabled': 'true',
          }}
        />
      </ComboBox.Root>,
    );

    const input = screen.getByRole('combobox', { name: 'Options' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-controls', 'external-list');
    expect(input).not.toHaveAttribute('aria-activedescendant', 'external-option');
    expect(input).not.toHaveAttribute('aria-disabled');
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

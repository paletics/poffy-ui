import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { MultiSelect } from './MultiSelect';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';

describe('MultiSelect', () => {
  it('enforces required selection without adding a submitted proxy value', () => {
    const options = [{ label: 'TypeScript', value: 'ts' }];
    const { container, rerender } = render(
      <form>
        <MultiSelect aria-label="Skills" name="skills" options={options} required value={[]} />
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    const proxy = container.querySelector<HTMLInputElement>('[data-multi-select-validation-proxy]');

    expect(proxy).toBeRequired();
    expect(proxy).toHaveAttribute('aria-hidden', 'true');
    expect(form.checkValidity()).toBe(false);

    rerender(
      <form>
        <MultiSelect aria-label="Skills" name="skills" options={options} required value={['ts']} />
      </form>,
    );

    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).getAll('skills')).toEqual(['ts']);
  });

  it('focuses the combobox when required validation fails', async () => {
    const { container } = render(
      <form>
        <MultiSelect aria-label="Skills" options={[]} required />
      </form>,
    );
    const proxy = container.querySelector<HTMLInputElement>(
      '[data-multi-select-validation-proxy]',
    ) as HTMLInputElement;

    fireEvent.invalid(proxy);
    await act(async () => Promise.resolve());
    expect(screen.getByRole('combobox', { name: 'Skills' })).toHaveFocus();
  });

  it('inherits FormControl state and native label association', async () => {
    const { container } = render(
      <FormControl id="skills" isInvalid isDisabled isReadOnly isRequired>
        <FormLabel>Skills</FormLabel>
        <MultiSelect options={[{ label: 'TypeScript', value: 'ts' }]} />
        <FormHelperText>Choose at least one skill.</FormHelperText>
        <FormErrorMessage>Skills are required.</FormErrorMessage>
      </FormControl>,
    );

    const input = screen.getByRole('combobox', { name: 'Skills' });
    const label = screen.getByText('Skills').closest('label');
    expect(label).toHaveAttribute('for', 'skills');
    expect(label?.control).toBe(input);
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
    expect(input).toHaveAttribute('aria-errormessage');
    expect(await axe(container)).toHaveNoViolations();
  });

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

  it('keeps the latest controlled values when becoming uncontrolled', () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];
    const { rerender } = render(
      <MultiSelect aria-label="Test Label" options={options} value={['1']} />,
    );

    rerender(<MultiSelect aria-label="Test Label" options={options} value={['2']} />);
    rerender(<MultiSelect aria-label="Test Label" options={options} />);

    expect(screen.getByRole('button', { name: 'Remove Option 2' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove Option 1' })).not.toBeInTheDocument();
  });

  it('can remove tags', () => {
    const handleChange = vi.fn();
    const options = [{ label: 'Option 1', value: '1' }];
    render(<MultiSelect options={options} value={['1']} onChange={handleChange} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: 'Remove Option 1' });
    expect(closeButton).toHaveAttribute('data-multiselect-tag-remove');
    expect(closeButton.closest('[data-multiselect-tag]')).toHaveAttribute(
      'data-multiselect-default-tag',
    );
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
    const customRemoveButton = screen.getByRole('button', { name: 'Remove Option 1' });
    expect(customRemoveButton).not.toHaveAttribute('data-multiselect-tag-remove');
    expect(customRemoveButton.closest('[data-multiselect-tag]')).toHaveAttribute(
      'data-multiselect-custom-tag',
    );
    expect(customRemoveButton.closest('[data-multiselect-tag]')).not.toHaveAttribute(
      'data-multiselect-default-tag',
    );
    fireEvent.click(customRemoveButton);
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('keeps default and custom tag removal disabled', () => {
    const handleChange = vi.fn();
    const options = [{ label: 'Option 1', value: '1' }];
    const { rerender } = render(
      <MultiSelect options={options} value={['1']} onChange={handleChange} disabled />,
    );

    const defaultRemoveButton = screen.getByRole('button', { name: 'Remove Option 1' });
    expect(defaultRemoveButton).toBeDisabled();
    fireEvent.click(defaultRemoveButton);
    expect(handleChange).not.toHaveBeenCalled();

    rerender(
      <MultiSelect
        options={options}
        value={['1']}
        onChange={handleChange}
        disabled
        renderTag={({ label, removeLabel, disabled, onRemove }) => (
          <button type="button" aria-label={removeLabel} disabled={disabled} onClick={onRemove}>
            Custom {label}
          </button>
        )}
      />,
    );

    const customRemoveButton = screen.getByRole('button', { name: 'Remove Option 1' });
    expect(customRemoveButton).toBeDisabled();
    fireEvent.click(customRemoveButton);
    expect(handleChange).not.toHaveBeenCalled();
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

  it('does not select an option while an IME composition confirms with Enter', () => {
    const onChange = vi.fn();
    render(
      <MultiSelect
        aria-label="Skills"
        options={[{ label: 'TypeScript', value: 'ts' }]}
        value={[]}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Skills' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });

    expect(onChange).not.toHaveBeenCalled();

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(['ts']);
  });

  it('identifies its popup as a multiselectable listbox', async () => {
    const user = userEvent.setup();
    render(<MultiSelect aria-label="Skills" options={[{ label: 'TypeScript', value: 'ts' }]} />);

    await user.click(screen.getByRole('combobox', { name: 'Skills' }));
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('reveals the active option during keyboard navigation', () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];
    render(<MultiSelect aria-label="Test Label" options={options} />);

    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const secondOption = screen.getByRole('option', { name: 'Option 2' });
    const scrollIntoView = vi.fn();
    Object.assign(secondOption, { scrollIntoView });

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
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

  it('resolves filtered highlight identity against the next collection', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <MultiSelect
        aria-label="Test Label"
        options={[
          { label: 'Alpha', value: 'alpha' },
          { label: 'Beta', value: 'beta' },
        ]}
        value={['alpha']}
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.type(input, 'B');

    const betaOption = screen.getByRole('option', { name: 'Beta' });
    expect(input).toHaveAttribute('aria-activedescendant', betaOption.id);
    expect(betaOption).toHaveAttribute('data-highlighted', '');

    await user.clear(input);
    const alphaOption = screen.getByRole('option', { name: 'Alpha' });
    expect(input).toHaveAttribute('aria-activedescendant', alphaOption.id);

    await user.type(input, 'B');
    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledWith(['alpha', 'beta']);
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

  it('closes a previously opened listbox after becoming disabled', () => {
    const onChange = vi.fn();
    const options = [{ label: 'Option 1', value: '1' }];
    const { rerender } = render(
      <MultiSelect aria-label="Test Label" options={options} value={[]} onChange={onChange} />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    rerender(
      <MultiSelect
        aria-label="Test Label"
        options={options}
        value={[]}
        onChange={onChange}
        disabled
      />,
    );
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('blocks a portalled selection when an ancestor fieldset becomes disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const options = [
      { label: 'TypeScript', value: 'ts' },
      { label: 'Rust', value: 'rs' },
    ];
    const { container } = render(
      <fieldset>
        <MultiSelect aria-label="Skills" options={options} onChange={onChange} />
      </fieldset>,
    );
    const fieldset = container.querySelector('fieldset') as HTMLFieldSetElement;
    const input = screen.getByRole('combobox', { name: 'Skills' });

    await user.click(input);
    const option = screen.getByRole('option', { name: 'Rust' });

    fieldset.disabled = true;
    fireEvent.click(option);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByText('Rust', { selector: '[data-multiselect-tag-label]' })).toBeNull();
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));

    fieldset.disabled = false;
    await waitFor(() => expect(input).not.toBeDisabled());
    await user.click(input);
    expect(screen.getByRole('option', { name: 'Rust' })).toBeInTheDocument();
  });

  it('prevents keyboard selection after becoming readOnly', () => {
    const onChange = vi.fn();
    const options = [{ label: 'Option 1', value: '1' }];
    const { rerender } = render(
      <MultiSelect aria-label="Test Label" options={options} value={[]} onChange={onChange} />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    rerender(
      <MultiSelect
        aria-label="Test Label"
        options={options}
        value={[]}
        onChange={onChange}
        readOnly
      />,
    );
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('only references the listbox while it is mounted', () => {
    const options = [{ label: 'Option 1', value: '1' }];
    render(<MultiSelect aria-label="Test Label" options={options} />);

    const input = screen.getByRole('combobox');
    expect(input).not.toHaveAttribute('aria-controls');

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
  });

  it('prevents a pending custom value from being committed after becoming readOnly', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <MultiSelect
        aria-label="Test Label"
        options={[]}
        value={[]}
        onChange={onChange}
        allowCustomValues
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Custom tag' } });

    rerender(
      <MultiSelect
        aria-label="Test Label"
        options={[]}
        value={[]}
        onChange={onChange}
        allowCustomValues
        readOnly
      />,
    );
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('reflects error state on the combobox input', () => {
    render(<MultiSelect aria-label="Test Label" options={[]} error />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('associates explicit invalid state with the combobox', () => {
    render(
      <FormControl isInvalid>
        <MultiSelect aria-label="Skills" error={false} aria-invalid />
        <FormHelperText id="skills-help">Choose skills.</FormHelperText>
        <FormErrorMessage id="skills-error">Skills are invalid.</FormErrorMessage>
      </FormControl>,
    );
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'skills-help skills-error');
    expect(input).toHaveAttribute('aria-errormessage', 'skills-error');
  });

  it('restores uncontrolled values when its form resets', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <MultiSelect
          aria-label="Skills"
          options={[
            { label: 'TypeScript', value: 'ts' },
            { label: 'React', value: 'react' },
          ]}
          defaultValue={['ts']}
        />
      </form>,
    );
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'React' }));
    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByRole('combobox'), 'Re');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant');
    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });
    expect(screen.getByRole('button', { name: 'Remove TypeScript' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove React' })).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
  });

  it('clears transient state without changing controlled values on form reset', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <form>
        <MultiSelect
          aria-label="Skills"
          options={[
            { label: 'TypeScript', value: 'ts' },
            { label: 'React', value: 'react' },
          ]}
          value={['ts']}
          onChange={onChange}
        />
      </form>,
    );
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.type(input, 'Re');
    expect(input).toHaveAttribute('aria-activedescendant');

    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });

    expect(screen.getByRole('button', { name: 'Remove TypeScript' })).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-activedescendant');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not clear selection or transient state when form reset is cancelled', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form onReset={(event) => event.preventDefault()}>
        <MultiSelect
          aria-label="Skills"
          options={[
            { label: 'TypeScript', value: 'ts' },
            { label: 'React', value: 'react' },
          ]}
          defaultValue={['ts']}
        />
      </form>,
    );
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.click(screen.getByRole('option', { name: 'React' }));
    await user.click(input);
    await user.type(input, 'Re');
    const activeDescendant = input.getAttribute('aria-activedescendant');

    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });

    expect(screen.getByRole('button', { name: 'Remove TypeScript' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
    expect(input).toHaveValue('Re');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', activeDescendant);
  });

  it('keeps focus on the combobox after Escape', () => {
    render(<MultiSelect aria-label="Skills" options={[{ label: 'TypeScript', value: 'ts' }]} />);
    const input = screen.getByRole('combobox');
    input.focus();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveFocus();
  });

  it('keeps the highlighted value when options reorder', () => {
    const { rerender } = render(
      <MultiSelect
        aria-label="Skills"
        options={[
          { label: 'Alpha', value: 'a' },
          { label: 'Beta', value: 'b' },
        ]}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    rerender(
      <MultiSelect
        aria-label="Skills"
        options={[
          { label: 'Beta', value: 'b' },
          { label: 'Alpha', value: 'a' },
        ]}
      />,
    );
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByRole('button', { name: 'Remove Beta' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove Alpha' })).not.toBeInTheDocument();
  });

  it('does not select a replacement option when the highlighted value disappears', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <MultiSelect
        aria-label="Skills"
        value={[]}
        onChange={onChange}
        options={[
          { label: 'Alpha', value: 'a' },
          { label: 'Beta', value: 'b' },
        ]}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    rerender(
      <MultiSelect
        aria-label="Skills"
        value={[]}
        onChange={onChange}
        options={[
          { label: 'Alpha', value: 'a' },
          { label: 'Gamma', value: 'g' },
        ]}
      />,
    );
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).not.toHaveBeenCalled();
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

  it('preserves native Enter behavior when no selection action exists', () => {
    render(
      <MultiSelect
        aria-label="Skills"
        options={[{ label: 'Unavailable', value: 'unavailable', disabled: true }]}
      />,
    );

    expect(fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })).toBe(true);
  });

  it('fails closed for duplicate option values while preserving unique options', async () => {
    const user = userEvent.setup();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const onChange = vi.fn();
    try {
      render(
        <MultiSelect
          aria-label="Skills"
          options={[
            { label: 'First ambiguous', value: 'duplicate' },
            { label: 'Unique', value: 'unique' },
            { label: 'Second ambiguous', value: 'duplicate' },
          ]}
          value={['duplicate']}
          onChange={onChange}
        />,
      );

      expect(screen.getByRole('button', { name: 'Remove duplicate' })).toBeInTheDocument();
      await user.click(screen.getByRole('combobox'));
      expect(screen.queryByText('First ambiguous')).not.toBeInTheDocument();
      expect(screen.queryByText('Second ambiguous')).not.toBeInTheDocument();
      await user.click(screen.getByRole('option', { name: 'Unique' }));
      expect(onChange).toHaveBeenCalledWith(['duplicate', 'unique']);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('duplicate'));
    } finally {
      warn.mockRestore();
    }
  });

  it('does not reintroduce duplicate option values through custom-value entry', async () => {
    const user = userEvent.setup();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const onChange = vi.fn();
    try {
      render(
        <MultiSelect
          allowCustomValues
          aria-label="Skills"
          options={[
            { label: 'First ambiguous', value: 'duplicate' },
            { label: 'Second ambiguous', value: 'duplicate' },
          ]}
          defaultValue={[]}
          onChange={onChange}
        />,
      );

      const input = screen.getByRole('combobox');
      await user.type(input, 'duplicate');
      await user.keyboard('{Enter}');

      expect(onChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('duplicate');
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('duplicate'));
    } finally {
      warn.mockRestore();
    }
  });

  it('passes a11y checks', async () => {
    const { container } = render(<MultiSelect aria-label="Test Label" options={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

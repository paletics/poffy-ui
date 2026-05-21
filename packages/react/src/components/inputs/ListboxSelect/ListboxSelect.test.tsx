import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ListboxSelect } from './ListboxSelect';

/**
 * ### Test Strategy: ListboxSelect
 * - **Focus**: Custom combobox rendering, option selection, disabled/error states,
 *   hidden native select sync, ref forwarding, and WAI-ARIA compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles.
 */
describe('ListboxSelect', () => {
  it('renders with combobox role', () => {
    render(
      <ListboxSelect>
        <option value="1">Option 1</option>
      </ListboxSelect>,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('supports neo appearance', () => {
    render(
      <ListboxSelect appearance="neo">
        <option value="1">Option 1</option>
      </ListboxSelect>,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(
      <ListboxSelect id="test-select" aria-label="Test Select">
        <option value="1">Option 1</option>
      </ListboxSelect>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('handles value change and syncs the hidden native select', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { container } = render(
      <ListboxSelect onChange={handleChange} aria-label="Test Select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </ListboxSelect>,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Option 2' }));

    expect(screen.getByRole('combobox')).toHaveTextContent('Option 2');
    expect(container.querySelector('select')).toHaveValue('2');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('uses option text as the native value when value is omitted', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ListboxSelect aria-label="Test Select">
        <option>Alpha</option>
        <option>Beta</option>
      </ListboxSelect>,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Beta' }));

    expect(screen.getByRole('combobox')).toHaveTextContent('Beta');
    expect(container.querySelector('select')).toHaveValue('Beta');
  });

  it('derives the combobox name and focus behavior from a native label', async () => {
    const user = userEvent.setup();
    render(
      <>
        <label htmlFor="fruit-select">Fruit</label>
        <ListboxSelect id="fruit-select">
          <option value="apple">Apple</option>
          <option value="pear">Pear</option>
        </ListboxSelect>
      </>,
    );

    const combobox = await screen.findByRole('combobox', { name: 'Fruit' });
    await user.click(screen.getByText('Fruit'));

    expect(combobox).toHaveFocus();
  });

  it('does not reuse option ids when option values are duplicated', async () => {
    const user = userEvent.setup();
    render(
      <ListboxSelect aria-label="Test Select">
        <option value="same">First</option>
        <option value="same">Second</option>
      </ListboxSelect>,
    );

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    fireEvent.pointerMove(screen.getByRole('option', { name: 'Second' }));

    const activeDescendant = combobox.getAttribute('aria-activedescendant');
    expect(activeDescendant).toBeTruthy();
    expect(
      Array.from(document.querySelectorAll('[id]')).filter((node) => node.id === activeDescendant),
    ).toHaveLength(1);
  });

  it('treats options inside a disabled optgroup as disabled', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ListboxSelect aria-label="Test Select" defaultValue="available">
        <optgroup label="Unavailable" disabled>
          <option value="blocked">Blocked</option>
        </optgroup>
        <option value="available">Available</option>
      </ListboxSelect>,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Blocked' }));

    expect(screen.getByRole('combobox')).toHaveTextContent('Available');
    expect(container.querySelector('select')).toHaveValue('available');
  });

  it('keeps the popup stable during option pointer focus', async () => {
    const user = userEvent.setup();
    render(
      <ListboxSelect aria-label="Test Select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </ListboxSelect>,
    );

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    expect(combobox).toHaveFocus();

    const option = screen.getByRole('option', { name: 'Option 2' });
    fireEvent.pointerDown(option);
    expect(combobox).toHaveFocus();
    expect(combobox).toHaveAttribute('aria-expanded', 'true');

    await user.click(option);
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).toHaveTextContent('Option 2');
    await waitFor(() => expect(combobox).toHaveAttribute('aria-expanded', 'false'));
  });

  it('toggles once from the icon area without a nested button path', () => {
    const { container } = render(
      <ListboxSelect aria-label="Test Select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </ListboxSelect>,
    );

    const combobox = screen.getByRole('combobox');
    const icon = container.querySelector('[data-select-icon]');
    expect(icon).toBeInTheDocument();

    fireEvent.pointerDown(icon!, { button: 0 });
    expect(combobox).toHaveFocus();
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();

    fireEvent.pointerDown(icon!, { button: 0 });
    expect(combobox).toHaveFocus();
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('option', { name: 'Option 2' })).not.toBeInTheDocument();
  });

  it('keeps the same popup node while pointer highlight changes', async () => {
    const user = userEvent.setup();
    render(
      <ListboxSelect aria-label="Test Select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </ListboxSelect>,
    );

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);

    const listbox = screen.getByRole('listbox');
    fireEvent.pointerMove(screen.getByRole('option', { name: 'Option 2' }));
    expect(screen.getByRole('listbox')).toBe(listbox);

    fireEvent.pointerMove(screen.getByRole('option', { name: 'Option 3' }));
    expect(screen.getByRole('listbox')).toBe(listbox);
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
  });

  it('supports disabled state', () => {
    render(
      <ListboxSelect disabled>
        <option>Disabled</option>
      </ListboxSelect>,
    );

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('combobox')).toHaveAttribute('tabindex', '-1');
  });

  it('reflects error state on the combobox', () => {
    render(
      <ListboxSelect error>
        <option value="1">Option 1</option>
      </ListboxSelect>,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('supports keyboard selection', () => {
    const { container } = render(
      <ListboxSelect aria-label="Test Select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </ListboxSelect>,
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    fireEvent.keyDown(combobox, { key: 'Enter' });

    expect(combobox).toHaveTextContent('Option 2');
    expect(container.querySelector('select')).toHaveValue('2');
  });

  it('does not open from focus alone', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Before</button>
        <ListboxSelect aria-label="Test Select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </ListboxSelect>
      </>,
    );

    await user.tab();
    await user.tab();

    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveFocus();
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('option', { name: 'Option 2' })).not.toBeInTheDocument();
  });

  it('can reopen after selecting an option', async () => {
    const user = userEvent.setup();
    render(
      <ListboxSelect aria-label="Test Select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </ListboxSelect>,
    );

    const combobox = screen.getByRole('combobox');

    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Option 2' }));
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).toHaveTextContent('Option 2');

    await user.click(combobox);
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('option', { name: 'Option 2' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();
    render(
      <>
        <ListboxSelect aria-label="Test Select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </ListboxSelect>
        <button type="button">Outside</button>
      </>,
    );

    const combobox = screen.getByRole('combobox');

    await user.click(combobox);
    expect(combobox).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('option', { name: 'Option 2' })).not.toBeInTheDocument();
  });

  it('forwards ref to the hidden native select element', () => {
    const ref = { current: null };
    render(
      <ListboxSelect ref={ref}>
        <option value="1">Option 1</option>
      </ListboxSelect>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });
});

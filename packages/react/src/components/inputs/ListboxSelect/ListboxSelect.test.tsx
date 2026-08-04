import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import {
  StrictMode,
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ListboxSelect } from './ListboxSelect';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';

const ParentLayoutResetListboxSelect = ({
  defaultValue,
  resetVersion,
}: {
  defaultValue: string;
  resetVersion: number;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  useLayoutEffect(() => {
    if (resetVersion > 0) formRef.current?.reset();
  }, [resetVersion]);

  return (
    <form ref={formRef}>
      <ListboxSelect aria-label="Status" defaultValue={defaultValue}>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </ListboxSelect>
    </form>
  );
};

/**
 * ### Test Strategy: ListboxSelect
 * - **Focus**: Custom combobox rendering, option selection, disabled/error states,
 *   hidden native select sync, ref forwarding, and WAI-ARIA compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles.
 */
describe('ListboxSelect', () => {
  it('inherits FormControl state and labels the visible combobox before hydration effects', async () => {
    const { container } = render(
      <FormControl id="status" isInvalid isDisabled isReadOnly isRequired>
        <FormLabel>Status</FormLabel>
        <ListboxSelect aria-label="   ">
          <option value="open">Open</option>
        </ListboxSelect>
        <FormHelperText>Choose a status.</FormHelperText>
        <FormErrorMessage>Status is required.</FormErrorMessage>
      </FormControl>,
    );

    const label = screen.getByText('Status').closest('label');
    const combobox = screen.getByRole('combobox', { name: 'Status' });
    expect(label).toHaveAttribute('for', 'status');
    expect(container.querySelector('select')).toHaveAttribute('id', 'status');
    expect(combobox).toHaveAttribute('aria-labelledby', 'status-label');
    expect(combobox).toHaveAttribute('aria-disabled', 'true');
    expect(combobox).toHaveAttribute('aria-readonly', 'true');
    expect(combobox).toHaveAttribute('aria-required', 'true');
    expect(combobox).toHaveAttribute('aria-invalid', 'true');
    expect(combobox).toHaveAttribute('aria-describedby');
    expect(combobox).toHaveAttribute('aria-errormessage');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders FormControl labeling for the visible combobox on the server', () => {
    const markup = renderToString(
      <FormControl id="status">
        <FormLabel>Status</FormLabel>
        <ListboxSelect>
          <option value="open">Open</option>
        </ListboxSelect>
      </FormControl>,
    );

    expect(markup).toContain('for="status"');
    expect(markup).toContain('id="status"');
    expect(markup).toContain('aria-labelledby="status-label"');
  });

  it('prefers a trimmed explicit aria-labelledby over aria-label', () => {
    render(
      <>
        <span id="status-name">Publication status</span>
        <label htmlFor="explicit-status">Native status</label>
        <ListboxSelect
          id="explicit-status"
          aria-label="Ignored status"
          aria-labelledby="  status-name  "
        >
          <option value="open">Open</option>
        </ListboxSelect>
      </>,
    );

    const combobox = screen.getByRole('combobox', { name: 'Publication status' });
    expect(combobox).toHaveAttribute('aria-labelledby', 'status-name');
    expect(combobox).not.toHaveAttribute('aria-label');
    expect(screen.getByText('Native status').closest('label')).not.toHaveAttribute('id');
  });

  it('prevents opening and selecting when FormControl is read-only', async () => {
    const user = userEvent.setup();
    render(
      <FormControl isReadOnly>
        <ListboxSelect aria-label="Status">
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </ListboxSelect>
      </FormControl>,
    );

    const combobox = screen.getByRole('combobox', { name: 'Status' });
    await user.click(combobox);
    await user.keyboard('{ArrowDown}{Enter}');

    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(combobox).toHaveTextContent('Open');
  });

  it('keeps read-only values in FormData while excluding required validation', () => {
    const { container } = render(
      <form>
        <ListboxSelect readOnly required name="status" defaultValue="open" aria-label="Status">
          <option value="">Choose a status</option>
          <option value="open">Open</option>
        </ListboxSelect>
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    const select = container.querySelector('select') as HTMLSelectElement;

    expect(select).not.toBeRequired();
    expect(form.checkValidity()).toBe(true);
    expect(Array.from(new FormData(form).entries())).toEqual([['status', 'open']]);
  });

  it('restores the native value and suppresses callbacks from read-only changes', () => {
    const onChange = vi.fn();
    const { container } = render(
      <ListboxSelect readOnly defaultValue="open" aria-label="Status" onChange={onChange}>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </ListboxSelect>,
    );
    const select = container.querySelector('select') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'closed' } });

    expect(select).toHaveValue('open');
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent('Open');
    expect(onChange).not.toHaveBeenCalled();
  });

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

  it('keeps the latest controlled value when becoming uncontrolled', () => {
    const { container, rerender } = render(
      <ListboxSelect aria-label="Test Select" value={1}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </ListboxSelect>,
    );

    rerender(
      <ListboxSelect aria-label="Test Select" value={2}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </ListboxSelect>,
    );
    rerender(
      <ListboxSelect aria-label="Test Select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </ListboxSelect>,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Option 2');
    expect(container.querySelector('select')).toHaveValue('2');
  });

  it('aligns an uncontrolled orphan default with the native first-option fallback', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <form>
        <ListboxSelect aria-label="Status" defaultValue="missing" name="status" onChange={onChange}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </ListboxSelect>
      </form>,
    );
    const nativeSelect = container.querySelector('select') as HTMLSelectElement;

    await waitFor(() => expect(screen.getByRole('combobox')).toHaveTextContent('Open'));
    expect(nativeSelect.value).toBe('open');
    expect(nativeSelect.selectedIndex).toBe(0);
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('status')).toBe(
      'open',
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it('skips disabled options when resolving an uncontrolled orphan default', async () => {
    const { container } = render(
      <form>
        <ListboxSelect aria-label="Status" defaultValue="missing" name="status">
          <option value="disabled" disabled>
            Disabled
          </option>
          <option value="open">Open</option>
        </ListboxSelect>
      </form>,
    );
    const nativeSelect = container.querySelector('select') as HTMLSelectElement;

    await waitFor(() => expect(screen.getByRole('combobox')).toHaveTextContent('Open'));
    expect(nativeSelect.selectedIndex).toBe(1);
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('status')).toBe(
      'open',
    );
  });

  it('aligns a controlled orphan with the native first-option fallback', () => {
    const onChange = vi.fn();
    const { container } = render(
      <form>
        <ListboxSelect aria-label="Status" name="status" value="missing" onChange={onChange}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </ListboxSelect>
      </form>,
    );
    const nativeSelect = container.querySelector('select') as HTMLSelectElement;

    expect(screen.getByRole('combobox')).toHaveTextContent('Open');
    expect(nativeSelect.value).toBe('open');
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('status')).toBe(
      'open',
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it('silently falls back when an uncontrolled selected option is removed', async () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <form>
        <ListboxSelect aria-label="Status" defaultValue="closed" name="status" onChange={onChange}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </ListboxSelect>
      </form>,
    );

    rerender(
      <form>
        <ListboxSelect aria-label="Status" defaultValue="closed" name="status" onChange={onChange}>
          <option value="open">Open</option>
        </ListboxSelect>
      </form>,
    );

    await waitFor(() => expect(screen.getByRole('combobox')).toHaveTextContent('Open'));
    expect((container.querySelector('select') as HTMLSelectElement).value).toBe('open');
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('status')).toBe(
      'open',
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it('silently displays the native fallback when a controlled option is removed', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <form>
        <ListboxSelect aria-label="Status" name="status" value="closed" onChange={onChange}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </ListboxSelect>
      </form>,
    );

    rerender(
      <form>
        <ListboxSelect aria-label="Status" name="status" value="closed" onChange={onChange}>
          <option value="open">Open</option>
        </ListboxSelect>
      </form>,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Open');
    expect((container.querySelector('select') as HTMLSelectElement).value).toBe('open');
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('status')).toBe(
      'open',
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not dispatch change when the selected occurrence is chosen again', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ListboxSelect aria-label="Status" defaultValue="open" onChange={onChange}>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </ListboxSelect>,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Open' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveTextContent('Open');
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

  it('uses a native option label attribute for the visible option text', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ListboxSelect aria-label="Plan" defaultValue="pro">
        <option value="pro" label="Professional" />
        <option value="basic">Basic</option>
      </ListboxSelect>,
    );

    const combobox = screen.getByRole('combobox', { name: 'Plan' });
    expect(combobox).toHaveTextContent('Professional');
    await user.click(combobox);
    expect(screen.getByRole('option', { name: 'Professional' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(container.querySelector('select')).toHaveValue('pro');
  });

  it('enforces single-select form submission when multiple is passed at runtime', () => {
    const { container } = render(
      <form>
        <ListboxSelect
          {...({ multiple: true } as never)}
          aria-label="Plan"
          defaultValue="pro"
          name="plan"
        >
          <option value="basic">Basic</option>
          <option value="pro">Professional</option>
        </ListboxSelect>
      </form>,
    );

    const select = container.querySelector('select')!;
    expect(select).not.toHaveAttribute('multiple');
    expect(Array.from(new FormData(select.form!).entries())).toEqual([['plan', 'pro']]);
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

  it('switches native and explicit label sources without removing a consumer-owned id', async () => {
    const { rerender } = render(
      <>
        <label htmlFor="source-select">Source label</label>
        <ListboxSelect id="source-select">
          <option value="open">Open</option>
        </ListboxSelect>
      </>,
    );
    const label = screen.getByText('Source label').closest('label') as HTMLLabelElement;
    await waitFor(() => expect(label.id).not.toBe(''));
    label.id = 'consumer-source-label';

    rerender(
      <>
        <label id="consumer-source-label" htmlFor="source-select">
          Source label
        </label>
        <ListboxSelect id="source-select" aria-label="Explicit source">
          <option value="open">Open</option>
        </ListboxSelect>
      </>,
    );
    expect(screen.getByRole('combobox', { name: 'Explicit source' })).not.toHaveAttribute(
      'aria-labelledby',
    );
    expect(label).toHaveAttribute('id', 'consumer-source-label');

    rerender(
      <>
        <label id="consumer-source-label" htmlFor="source-select">
          Source label
        </label>
        <ListboxSelect id="source-select" aria-label="   ">
          <option value="open">Open</option>
        </ListboxSelect>
      </>,
    );
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Source label' })).toHaveAttribute(
        'aria-labelledby',
        'consumer-source-label',
      ),
    );
  });

  it('tracks native label id changes without ListboxSelect prop changes', async () => {
    const { rerender } = render(
      <>
        <label id="first-source" htmlFor="dynamic-label-select">
          Source label
        </label>
        <ListboxSelect id="dynamic-label-select">
          <option value="open">Open</option>
        </ListboxSelect>
      </>,
    );
    const combobox = await screen.findByRole('combobox', { name: 'Source label' });
    expect(combobox).toHaveAttribute('aria-labelledby', 'first-source');

    rerender(
      <>
        <label id="second-source" htmlFor="dynamic-label-select">
          Source label
        </label>
        <ListboxSelect id="dynamic-label-select">
          <option value="open">Open</option>
        </ListboxSelect>
      </>,
    );

    await waitFor(() => expect(combobox).toHaveAttribute('aria-labelledby', 'second-source'));
  });

  it('tracks native label association additions and removals', async () => {
    const renderSelect = (withLabel: boolean) => (
      <>
        {withLabel ? <label htmlFor="associated-select">Associated label</label> : null}
        <ListboxSelect id="associated-select">
          <option value="open">Open</option>
        </ListboxSelect>
      </>
    );
    const { rerender } = render(renderSelect(false));
    const combobox = screen.getByRole('combobox');
    expect(combobox).not.toHaveAttribute('aria-labelledby');

    rerender(renderSelect(true));
    await waitFor(() => expect(combobox).toHaveAccessibleName('Associated label'));
    expect(combobox).toHaveAttribute('aria-labelledby');

    rerender(renderSelect(false));
    await waitFor(() => expect(combobox).not.toHaveAttribute('aria-labelledby'));
  });

  it('avoids an existing id when regenerating an owned native label id', async () => {
    const renderSelect = () => (
      <>
        <label htmlFor="collision-select">Collision label</label>
        <ListboxSelect id="collision-select">
          <option value="open">Open</option>
        </ListboxSelect>
      </>
    );
    const { rerender } = render(renderSelect());
    const label = screen.getByText('Collision label').closest('label') as HTMLLabelElement;
    const combobox = screen.getByRole('combobox');
    await waitFor(() => expect(label.id).not.toBe(''));
    const firstOwnedId = label.id;
    const blocker = document.createElement('span');
    blocker.id = firstOwnedId;
    document.body.append(blocker);
    label.removeAttribute('id');

    rerender(renderSelect());

    await waitFor(() => expect(label.id).not.toBe(''));
    expect(label.id).not.toBe(firstOwnedId);
    expect(combobox).toHaveAttribute('aria-labelledby', label.id);
    expect(blocker).toHaveAttribute('id', firstOwnedId);
    blocker.remove();
  });

  it('checks native label id collisions in the select owner document', async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument as Document;
    const renderSelect = () => (
      <>
        <label htmlFor="frame-select">Frame label</label>
        <ListboxSelect id="frame-select">
          <option value="open">Open</option>
        </ListboxSelect>
      </>
    );
    const { rerender, unmount } = render(renderSelect(), { container: frameDocument.body });
    const label = frameDocument.querySelector('label') as HTMLLabelElement;

    await waitFor(() => expect(label.id).not.toBe(''));
    const firstOwnedId = label.id;
    const topLevelBlocker = document.createElement('span');
    topLevelBlocker.id = firstOwnedId;
    document.body.append(topLevelBlocker);
    label.removeAttribute('id');

    rerender(renderSelect());

    await waitFor(() => expect(label.id).toBe(firstOwnedId));
    unmount();
    topLevelBlocker.remove();
    frame.remove();
  });

  it('removes only the native label id it owns on unmount', async () => {
    const label = document.createElement('label');
    label.htmlFor = 'owned-label-select';
    label.textContent = 'Owned label';
    document.body.append(label);
    const { unmount } = render(
      <ListboxSelect id="owned-label-select">
        <option value="open">Open</option>
      </ListboxSelect>,
    );

    await waitFor(() => expect(label.id).not.toBe(''));
    unmount();

    expect(label).not.toHaveAttribute('id');
    label.remove();
  });

  it('hydrates native label discovery without a server markup mismatch', async () => {
    const ui = (
      <>
        <label htmlFor="hydrated-select">Hydrated label</label>
        <ListboxSelect id="hydrated-select">
          <option value="open">Open</option>
        </ListboxSelect>
      </>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(ui);
    document.body.append(container);
    expect(container.querySelector('[role="combobox"]')).not.toHaveAttribute('aria-labelledby');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const root = hydrateRoot(container, ui);
    await act(async () => Promise.resolve());
    await waitFor(() =>
      expect(container.querySelector('[role="combobox"]')).toHaveAccessibleName('Hydrated label'),
    );

    expect(
      consoleError.mock.calls.some((call) => String(call[0]).toLowerCase().includes('hydration')),
    ).toBe(false);
    await act(async () => root.unmount());
    consoleError.mockRestore();
    container.remove();
  });

  it('does not reuse option ids when option values are duplicated', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <form>
        <ListboxSelect aria-label="Test Select" name="choice">
          <option value="same">First</option>
          <option value="same">Second</option>
          <option value="other">Other</option>
        </ListboxSelect>
      </form>,
    );

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    expect(screen.getAllByRole('option', { selected: true })).toHaveLength(1);
    fireEvent.pointerMove(screen.getByRole('option', { name: 'Second' }));

    const activeDescendant = combobox.getAttribute('aria-activedescendant');
    expect(activeDescendant).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Second' })).toHaveAttribute('id', activeDescendant);
    expect(
      Array.from(document.querySelectorAll('[id]')).filter((node) => node.id === activeDescendant),
    ).toHaveLength(1);

    rerender(
      <form>
        <ListboxSelect aria-label="Test Select" name="choice">
          <option value="other">Other</option>
          <option value="same">First</option>
          <option value="same">Second</option>
        </ListboxSelect>
      </form>,
    );

    const reorderedSecond = screen.getByRole('option', { name: 'Second' });
    expect(combobox).toHaveAttribute('aria-activedescendant', reorderedSecond.id);
    await user.click(reorderedSecond);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(combobox).not.toHaveAttribute('aria-activedescendant');
    await waitFor(() =>
      expect((container.querySelector('select') as HTMLSelectElement).selectedIndex).toBe(2),
    );
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('choice')).toBe(
      'same',
    );

    await user.click(combobox);
    expect(screen.getAllByRole('option', { selected: true })).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'First' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('option', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps exact duplicate option ids unique without a dangling active descendant', async () => {
    const user = userEvent.setup();
    render(
      <ListboxSelect aria-label="Test Select">
        <option value="same">Same</option>
        <option value="same">Same</option>
      </ListboxSelect>,
    );

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    const duplicateOptions = screen.getAllByRole('option', { name: 'Same' });
    expect(duplicateOptions[0].id).not.toBe(duplicateOptions[1].id);

    fireEvent.pointerMove(duplicateOptions[1]);
    expect(combobox).toHaveAttribute('aria-activedescendant', duplicateOptions[1].id);

    fireEvent.keyDown(combobox, { key: 'Enter' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(combobox).not.toHaveAttribute('aria-activedescendant');
    await waitFor(() =>
      expect((document.querySelector('select') as HTMLSelectElement).selectedIndex).toBe(1),
    );
  });

  it('reports the operated duplicate index while controlled value resolves to the first match', async () => {
    const user = userEvent.setup();
    const selectedIndexes: number[] = [];
    const { container } = render(
      <ListboxSelect
        aria-label="Test Select"
        value="same"
        onChange={(event) => selectedIndexes.push(event.currentTarget.selectedIndex)}
      >
        <option value="same">First</option>
        <option value="same">Second</option>
      </ListboxSelect>,
    );
    const combobox = screen.getByRole('combobox');

    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Second' }));

    expect(selectedIndexes).toEqual([1]);
    await waitFor(() =>
      expect((container.querySelector('select') as HTMLSelectElement).selectedIndex).toBe(0),
    );
    expect(combobox).toHaveTextContent('First');
  });

  it('hands the first controlled duplicate occurrence back to uncontrolled state', async () => {
    const user = userEvent.setup();
    const duplicateChildren = (
      <>
        <option value="same">First</option>
        <option value="same">Second</option>
      </>
    );
    const { container, rerender } = render(
      <ListboxSelect aria-label="Test Select" defaultValue="same">
        {duplicateChildren}
      </ListboxSelect>,
    );
    const combobox = screen.getByRole('combobox');
    const nativeSelect = container.querySelector('select') as HTMLSelectElement;
    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Second' }));
    await waitFor(() => expect(combobox).toHaveTextContent('Second'));

    rerender(
      <ListboxSelect aria-label="Test Select" value="same" onChange={() => undefined}>
        {duplicateChildren}
      </ListboxSelect>,
    );
    expect(combobox).toHaveTextContent('First');

    rerender(<ListboxSelect aria-label="Test Select">{duplicateChildren}</ListboxSelect>);

    expect(combobox).toHaveTextContent('First');
    expect(nativeSelect.selectedIndex).toBe(0);
  });

  it('resets an uncontrolled duplicate selection to the first default-value occurrence', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <ListboxSelect aria-label="Test Select" defaultValue="same" name="choice">
          <option value="same">First</option>
          <option value="same">Second</option>
        </ListboxSelect>
      </form>,
    );
    const combobox = screen.getByRole('combobox');
    const nativeSelect = container.querySelector('select') as HTMLSelectElement;

    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Second' }));
    await waitFor(() => expect(nativeSelect.selectedIndex).toBe(1));
    await waitFor(() => expect(combobox).toHaveTextContent('Second'));

    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() => expect(nativeSelect.selectedIndex).toBe(0));
    expect(combobox).toHaveTextContent('First');
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('choice')).toBe(
      'same',
    );
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

  it('parses Fragments at every option level without changing native child structure', async () => {
    const user = userEvent.setup();
    const directOptions = [
      <option key="shared" value="available">
        Available
      </option>,
    ];
    const groupedOptions = [
      <option key="shared" value="blocked">
        Blocked
      </option>,
    ];
    const { container } = render(
      <ListboxSelect aria-label="Test Select" defaultValue="available">
        <>{directOptions}</>
        <optgroup label="Unavailable" disabled>
          <>{groupedOptions}</>
        </optgroup>
      </ListboxSelect>,
    );

    const select = container.querySelector('select') as HTMLSelectElement;
    expect(Array.from(select.children, (child) => child.tagName)).toEqual(['OPTION', 'OPTGROUP']);
    expect(select.querySelector('optgroup')?.children).toHaveLength(1);

    await user.click(screen.getByRole('combobox'));
    const popupOptions = screen.getAllByRole('option');
    expect(popupOptions).toHaveLength(2);
    expect(new Set(popupOptions.map((option) => option.id)).size).toBe(2);
    expect(popupOptions[0].id).toMatch(/-option-0$/);
    expect(popupOptions[1].id).toMatch(/-option-1-0$/);
    expect(screen.getByRole('option', { name: 'Blocked' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('renders nested Fragment options consistently on the server', () => {
    const markup = renderToString(
      <ListboxSelect aria-label="Test Select">
        <>
          <option value="available">Available</option>
          <optgroup label="Unavailable" disabled>
            <>
              <option value="blocked">Blocked</option>
            </>
          </optgroup>
        </>
      </ListboxSelect>,
    );

    expect(markup).toContain('<option value="available"');
    expect(markup).toContain('<optgroup label="Unavailable" disabled=""');
    expect(markup).toContain('<option value="blocked"');
    expect(markup.match(/Available/g)).toHaveLength(2);
  });

  it('materializes nested single-use option iterables for native and custom rendering', async () => {
    const user = userEvent.setup();
    function* labelChildren() {
      yield 'Generated';
      yield ' option';
    }
    function* groupedOptions() {
      yield (
        <option key="generated" value="generated">
          {labelChildren()}
        </option>
      );
    }
    function* rootChildren() {
      yield (
        <>
          <option value="available">Available</option>
        </>
      );
      yield (
        <optgroup label="Unavailable" disabled>
          {groupedOptions()}
        </optgroup>
      );
    }
    const children = rootChildren();
    const { container } = render(
      <StrictMode>
        <ListboxSelect aria-label="Test Select" defaultValue="available">
          {children}
        </ListboxSelect>
      </StrictMode>,
    );

    expect(container.querySelector('option[value="generated"]')).toHaveTextContent(
      'Generated option',
    );
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Generated option' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Generated option' })).toBeInTheDocument();
    expect(container.querySelectorAll('select option')).toHaveLength(2);
  });

  it('renders single-use option iterables consistently on the server', () => {
    function* labelChildren() {
      yield 'Generated';
      yield ' option';
    }
    function* rootChildren() {
      yield <option value="generated">{labelChildren()}</option>;
      yield (
        <optgroup label="Other">
          <option value="other">Other</option>
        </optgroup>
      );
    }

    const children = rootChildren();
    const firstMarkup = renderToString(
      <ListboxSelect aria-label="Test Select">{children}</ListboxSelect>,
    );
    const secondMarkup = renderToString(
      <ListboxSelect aria-label="Test Select">{children}</ListboxSelect>,
    );

    expect(firstMarkup).toContain('<option value="generated"');
    expect(firstMarkup).toContain('<optgroup label="Other"');
    expect(firstMarkup.match(/Generated/g)).toHaveLength(2);
    expect(firstMarkup).toContain('Generated<!-- --> option');
    expect(secondMarkup).toBe(firstMarkup);
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

  it('forwards visible trigger keyboard and pointer events before its own interaction', () => {
    const onTriggerKeyDown = vi.fn((event: KeyboardEvent<HTMLDivElement>) => {
      expect(event.currentTarget).toBeInstanceOf(HTMLDivElement);
      event.preventDefault();
    });
    const onTriggerPointerDown = vi.fn((event: PointerEvent<HTMLDivElement>) => {
      expect(event.currentTarget).toBeInstanceOf(HTMLDivElement);
      event.preventDefault();
    });
    render(
      <ListboxSelect
        onTriggerKeyDown={onTriggerKeyDown}
        onTriggerPointerDown={onTriggerPointerDown}
        aria-label="Plan"
      >
        <option value="starter">Starter</option>
        <option value="pro">Pro</option>
      </ListboxSelect>,
    );

    const combobox = screen.getByRole('combobox', { name: 'Plan' });
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    fireEvent.pointerDown(combobox, { button: 0 });

    expect(onTriggerKeyDown).toHaveBeenCalledOnce();
    expect(onTriggerPointerDown).toHaveBeenCalledOnce();
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('follows disabled fieldset participation through its native select', async () => {
    const renderSelect = (fieldsetDisabled: boolean, controlDisabled = false) => (
      <form>
        <fieldset disabled={fieldsetDisabled}>
          <ListboxSelect aria-label="Plan" name="plan" disabled={controlDisabled}>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
          </ListboxSelect>
        </fieldset>
      </form>
    );
    const { container, rerender } = render(renderSelect(true, true));
    const combobox = screen.getByRole('combobox', { name: 'Plan' });

    await waitFor(() => expect(combobox).toHaveAttribute('aria-disabled', 'true'));
    expect(combobox).toHaveAttribute('tabindex', '-1');
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    fireEvent.pointerDown(combobox, { button: 0 });
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('plan')).toBeNull();

    rerender(renderSelect(true));
    await waitFor(() => expect(combobox).toHaveAttribute('aria-disabled', 'true'));

    rerender(renderSelect(false));
    await waitFor(() => expect(combobox).not.toHaveAttribute('aria-disabled'));
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
  });

  it('blocks a portalled option selection immediately after its fieldset becomes disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <fieldset>
        <ListboxSelect
          aria-label="Immediate plan"
          defaultValue="starter"
          name="plan"
          onChange={onChange}
        >
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
        </ListboxSelect>
      </fieldset>,
    );
    const fieldset = container.querySelector('fieldset')!;
    const combobox = screen.getByRole('combobox', { name: 'Immediate plan' });
    const nativeSelect = container.querySelector('select')!;

    await user.click(combobox);
    const portalledOption = screen.getByRole('option', { name: 'Pro' });
    fieldset.disabled = true;
    fireEvent.click(portalledOption);

    expect(onChange).not.toHaveBeenCalled();
    expect(combobox).toHaveTextContent('Starter');
    expect(nativeSelect).toHaveValue('starter');
  });

  it('restores a native selection changed immediately after its fieldset becomes disabled', () => {
    const onChange = vi.fn();
    const { container } = render(
      <fieldset>
        <ListboxSelect
          aria-label="Immediate native plan"
          defaultValue="starter"
          onChange={onChange}
        >
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
        </ListboxSelect>
      </fieldset>,
    );
    const fieldset = container.querySelector('fieldset')!;
    const nativeSelect = container.querySelector('select')!;

    fieldset.disabled = true;
    fireEvent.change(nativeSelect, { target: { value: 'pro' } });

    expect(onChange).not.toHaveBeenCalled();
    expect(nativeSelect).toHaveValue('starter');
    expect(screen.getByRole('combobox', { name: 'Immediate native plan' })).toHaveTextContent(
      'Starter',
    );
  });

  it('keeps selection unchanged when its synthetic native change is prevented', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn((event: ChangeEvent<HTMLSelectElement>) => event.preventDefault());
    const { container } = render(
      <ListboxSelect aria-label="Plan" defaultValue="starter" onChange={onChange}>
        <option value="starter">Starter</option>
        <option value="pro">Pro</option>
      </ListboxSelect>,
    );
    const combobox = screen.getByRole('combobox', { name: 'Plan' });

    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Pro' }));

    expect(onChange).toHaveBeenCalledOnce();
    expect(combobox).toHaveTextContent('Starter');
    expect(container.querySelector('select')).toHaveValue('starter');
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

  it('does not open an empty listbox through keyboard or pointer interaction', () => {
    render(<ListboxSelect aria-label="Empty select" />);
    const combobox = screen.getByRole('combobox', { name: 'Empty select' });

    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    fireEvent.keyDown(combobox, { key: 'Enter' });
    fireEvent.keyDown(combobox, { key: ' ' });
    fireEvent.pointerDown(combobox, { button: 0 });

    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).not.toHaveAttribute('aria-controls');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not select an option while an IME composition confirms with Enter', () => {
    const onChange = vi.fn();
    render(
      <ListboxSelect aria-label="Plan" onChange={onChange}>
        <option value="starter">Starter</option>
        <option value="pro">Pro</option>
      </ListboxSelect>,
    );
    const combobox = screen.getByRole('combobox', { name: 'Plan' });

    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    fireEvent.keyDown(combobox, { key: 'Enter', isComposing: true });
    fireEvent.keyDown(combobox, { key: 'Enter', keyCode: 229 });

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(combobox).toHaveTextContent('Starter');
  });

  it('reveals the active option during keyboard navigation', () => {
    render(
      <ListboxSelect aria-label="Plan">
        <option value="starter">Starter</option>
        <option value="pro">Pro</option>
      </ListboxSelect>,
    );
    const combobox = screen.getByRole('combobox', { name: 'Plan' });

    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    const secondOption = screen.getByRole('option', { name: 'Pro' });
    const scrollIntoView = vi.fn();
    Object.assign(secondOption, { scrollIntoView });

    fireEvent.keyDown(combobox, { key: 'ArrowDown' });

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
  });

  it('forwards focus and blur from the visible combobox trigger once', () => {
    const onTriggerFocus = vi.fn((event: FocusEvent<HTMLDivElement>) => {
      expect(event.currentTarget).toBeInstanceOf(HTMLDivElement);
    });
    const onTriggerBlur = vi.fn((event: FocusEvent<HTMLDivElement>) => {
      expect(event.currentTarget).toBeInstanceOf(HTMLDivElement);
    });
    render(
      <ListboxSelect
        aria-label="Focusable select"
        onTriggerFocus={onTriggerFocus}
        onTriggerBlur={onTriggerBlur}
      >
        <option value="one">One</option>
      </ListboxSelect>,
    );
    const combobox = screen.getByRole('combobox', { name: 'Focusable select' });

    fireEvent.focus(combobox);
    fireEvent.blur(combobox);

    expect(onTriggerFocus).toHaveBeenCalledOnce();
    expect(onTriggerBlur).toHaveBeenCalledOnce();
  });

  it('keeps native select event handlers bound to an HTMLSelectElement', () => {
    const onFocus = vi.fn((event: FocusEvent<HTMLSelectElement>) => {
      expect(event.currentTarget).toBeInstanceOf(HTMLSelectElement);
    });
    const onKeyDown = vi.fn((event: KeyboardEvent<HTMLSelectElement>) => {
      expect(event.currentTarget).toBeInstanceOf(HTMLSelectElement);
    });
    const { container } = render(
      <ListboxSelect aria-label="Native event select" onFocus={onFocus} onKeyDown={onKeyDown}>
        <option value="one">One</option>
      </ListboxSelect>,
    );
    const nativeSelect = container.querySelector('select') as HTMLSelectElement;

    fireEvent.focus(nativeSelect);
    fireEvent.keyDown(nativeSelect, { key: 'ArrowDown' });

    expect(onFocus).toHaveBeenCalledOnce();
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(screen.getByRole('combobox', { name: 'Native event select' })).toHaveFocus();
  });

  it('closes when its options are removed and stays closed when they return', () => {
    const { rerender } = render(
      <ListboxSelect aria-label="Dynamic select">
        <option value="one">One</option>
      </ListboxSelect>,
    );
    const combobox = screen.getByRole('combobox', { name: 'Dynamic select' });
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    rerender(<ListboxSelect aria-label="Dynamic select" />);
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    rerender(
      <ListboxSelect aria-label="Dynamic select">
        <option value="one">One</option>
      </ListboxSelect>,
    );
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes an open popup when it becomes disabled', () => {
    const { rerender } = render(
      <ListboxSelect aria-label="Test Select">
        <option value="1">Option 1</option>
      </ListboxSelect>,
    );
    const combobox = screen.getByRole('combobox');
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    rerender(
      <ListboxSelect aria-label="Test Select" disabled>
        <option value="1">Option 1</option>
      </ListboxSelect>,
    );
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('only references the listbox while it is mounted and exposes required state', () => {
    render(
      <ListboxSelect aria-label="Test Select" required>
        <option value="1">Option 1</option>
      </ListboxSelect>,
    );
    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveAttribute('aria-required', 'true');
    expect(combobox).not.toHaveAttribute('aria-controls');

    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    expect(combobox).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
  });

  it('names the open listbox through its combobox trigger', async () => {
    const { container } = render(
      <ListboxSelect aria-label="Plan">
        <option value="pro">Pro</option>
      </ListboxSelect>,
    );
    const combobox = screen.getByRole('combobox', { name: 'Plan' });

    fireEvent.keyDown(combobox, { key: 'ArrowDown' });

    expect(screen.getByRole('listbox', { name: 'Plan' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('reflects error state on the combobox', () => {
    render(
      <ListboxSelect error>
        <option value="1">Option 1</option>
      </ListboxSelect>,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('associates FormControl errors when aria-invalid is explicitly true', () => {
    render(
      <FormControl>
        <ListboxSelect aria-label="Status" error={false} aria-invalid>
          <option value="open">Open</option>
        </ListboxSelect>
        <FormErrorMessage>Status is required.</FormErrorMessage>
      </FormControl>,
    );

    const combobox = screen.getByRole('combobox', { name: 'Status' });
    expect(combobox).toHaveAttribute('aria-invalid', 'true');
    expect(combobox).toHaveAttribute('aria-errormessage');
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

  it('restores the latest uncontrolled default value when its form resets', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <form>
        <ListboxSelect aria-label="Status" defaultValue="open">
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </ListboxSelect>
      </form>,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Closed' }));
    rerender(
      <form>
        <ListboxSelect aria-label="Status" defaultValue="closed">
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </ListboxSelect>
      </form>,
    );
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Open' }));
    await user.click(screen.getByRole('combobox'));
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() => expect(screen.getByRole('combobox')).toHaveTextContent('Closed'));
    expect(container.querySelector('select')).toHaveValue('closed');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
  });

  it('rebinds reset handling when its external form changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <>
        <form id="first-form" />
        <form id="second-form" />
        <ListboxSelect aria-label="Status" defaultValue="open" form="first-form">
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </ListboxSelect>
      </>,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Closed' }));
    expect(screen.getByRole('combobox')).toHaveTextContent('Closed');

    rerender(
      <>
        <form id="first-form" />
        <form id="second-form" />
        <ListboxSelect aria-label="Status" defaultValue="open" form="second-form">
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </ListboxSelect>
      </>,
    );

    (document.getElementById('first-form') as HTMLFormElement).reset();
    await Promise.resolve();
    expect(screen.getByRole('combobox')).toHaveTextContent('Closed');

    (document.getElementById('second-form') as HTMLFormElement).reset();

    await waitFor(() => expect(screen.getByRole('combobox')).toHaveTextContent('Open'));
  });

  it('resets through a late external form and a same-id replacement without rerendering', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ListboxSelect aria-label="Status" defaultValue="open" form="status-form">
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </ListboxSelect>,
    );
    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Closed' }));

    const firstForm = document.createElement('form');
    firstForm.id = 'status-form';
    container.prepend(firstForm);
    firstForm.reset();
    await waitFor(() => expect(combobox).toHaveTextContent('Open'));

    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Closed' }));
    firstForm.remove();
    const secondForm = document.createElement('form');
    secondForm.id = 'status-form';
    container.prepend(secondForm);

    firstForm.reset();
    await Promise.resolve();
    expect(combobox).toHaveTextContent('Closed');

    secondForm.reset();
    await waitFor(() => expect(combobox).toHaveTextContent('Open'));
  });

  it('uses the latest default selection for a parent layout reset in the update commit', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ParentLayoutResetListboxSelect defaultValue="open" resetVersion={0} />,
    );
    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Closed' }));
    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Open' }));

    rerender(<ParentLayoutResetListboxSelect defaultValue="closed" resetVersion={1} />);

    await waitFor(() => expect(combobox).toHaveTextContent('Closed'));
  });

  it('clears transient state without changing a controlled value on form reset', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <form>
        <ListboxSelect aria-label="Status" name="status" value="closed" onChange={onChange}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </ListboxSelect>
      </form>,
    );
    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    expect(combobox).toHaveAttribute('aria-activedescendant');

    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() => expect(combobox).toHaveAttribute('aria-expanded', 'false'));
    expect(combobox).toHaveTextContent('Closed');
    expect(combobox).not.toHaveAttribute('aria-activedescendant');
    expect(container.querySelector('select')).toHaveValue('closed');
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('status')).toBe(
      'closed',
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not clear selection or transient state when form reset is cancelled', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form onReset={(event) => event.preventDefault()}>
        <ListboxSelect aria-label="Status" defaultValue="open">
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </ListboxSelect>
      </form>,
    );
    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Closed' }));
    await user.click(combobox);
    fireEvent.keyDown(combobox, { key: 'ArrowUp' });
    const activeDescendant = combobox.getAttribute('aria-activedescendant');

    (container.querySelector('form') as HTMLFormElement).reset();
    await Promise.resolve();

    expect(combobox).toHaveTextContent('Closed');
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    expect(combobox).toHaveAttribute('aria-activedescendant', activeDescendant);
  });

  it('closes an open popup when it becomes read-only', () => {
    const { rerender } = render(
      <ListboxSelect aria-label="Status">
        <option value="open">Open</option>
      </ListboxSelect>,
    );
    const combobox = screen.getByRole('combobox');
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    rerender(
      <ListboxSelect aria-label="Status" readOnly>
        <option value="open">Open</option>
      </ListboxSelect>,
    );
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('retains the highlighted option when options are reordered', () => {
    const { rerender } = render(
      <ListboxSelect aria-label="Status">
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </ListboxSelect>,
    );
    const combobox = screen.getByRole('combobox');
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });

    rerender(
      <ListboxSelect aria-label="Status">
        <option value="closed">Closed</option>
        <option value="open">Open</option>
      </ListboxSelect>,
    );
    fireEvent.keyDown(combobox, { key: 'Enter' });

    expect(combobox).toHaveTextContent('Closed');
  });

  it('synchronizes uncontrolled state when the native select changes directly', () => {
    const { container } = render(
      <ListboxSelect aria-label="Status">
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </ListboxSelect>,
    );
    const select = container.querySelector('select') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'closed' } });

    expect(screen.getByRole('combobox')).toHaveTextContent('Closed');
    expect(select).toHaveValue('closed');
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

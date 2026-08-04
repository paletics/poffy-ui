import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { RadioGroup } from './RadioGroup';
import { Radio } from './Radio';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';

/**
 * ### Test Strategy: RadioGroup
 * - **Focus**: Correct rendering, selection change, disabled state, controlled pattern,
 *   and full WAI-ARIA RadioGroup compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 */
describe('RadioGroup', () => {
  it('propagates standalone required state to native radios', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <RadioGroup aria-label="Delivery" name="delivery" required>
          <Radio value="standard">Standard</Radio>
          <Radio value="express">Express</Radio>
        </RadioGroup>
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    const radios = screen.getAllByRole('radio');

    expect(radios[0]).toBeRequired();
    expect(radios[1]).toBeRequired();
    expect(form.checkValidity()).toBe(false);
    await user.click(radios[1]);
    expect(form.checkValidity()).toBe(true);
  });

  it('preserves an individual radio required constraint', () => {
    const { container } = render(
      <form>
        <RadioGroup aria-label="Delivery" name="delivery">
          <Radio value="standard" required>
            Standard
          </Radio>
          <Radio value="express">Express</Radio>
        </RadioGroup>
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    const radios = screen.getAllByRole('radio');

    expect(radios[0]).toBeRequired();
    expect(radios[1]).not.toBeRequired();
    expect(form.checkValidity()).toBe(false);
  });

  it('suspends native required validation while read-only and restores it when writable', () => {
    const { container, rerender } = render(
      <form>
        <RadioGroup aria-label="Delivery" required readOnly>
          <Radio value="standard">Standard</Radio>
        </RadioGroup>
      </form>,
    );

    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
    expect(screen.getByRole('radio')).not.toHaveAttribute('required');
    expect((container.querySelector('form') as HTMLFormElement).checkValidity()).toBe(true);

    rerender(
      <form>
        <RadioGroup aria-label="Delivery" required>
          <Radio value="standard">Standard</Radio>
        </RadioGroup>
      </form>,
    );

    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
    expect(screen.getByRole('radio')).toBeRequired();
    expect((container.querySelector('form') as HTMLFormElement).checkValidity()).toBe(false);
  });

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

  it('fails closed for duplicate values and restores a unique value dynamically', async () => {
    const onChange = vi.fn();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const WrappedDuplicate = () => <Radio value="duplicate">Wrapped duplicate</Radio>;
    const { container, rerender } = render(
      <form>
        <RadioGroup
          aria-label="Options"
          defaultValue="duplicate"
          name="choice"
          onChange={onChange}
          required
        >
          <Radio value="duplicate">First duplicate</Radio>
          <WrappedDuplicate />
          <Radio value="unique">Unique</Radio>
        </RadioGroup>
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: 'First duplicate' })).toBeDisabled();
      expect(screen.getByRole('radio', { name: 'Wrapped duplicate' })).toBeDisabled();
    });
    expect(screen.getByRole('radio', { name: 'First duplicate' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Wrapped duplicate' })).not.toBeChecked();
    expect(new FormData(form).get('choice')).toBeNull();
    expect(form.checkValidity()).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('radio values must be unique'));

    rerender(
      <form>
        <RadioGroup
          aria-label="Options"
          defaultValue="duplicate"
          name="choice"
          onChange={onChange}
          required
        >
          <Radio value="duplicate">First duplicate</Radio>
          <Radio value="unique">Unique</Radio>
        </RadioGroup>
      </form>,
    );

    await waitFor(() =>
      expect(screen.getByRole('radio', { name: 'First duplicate' })).toBeEnabled(),
    );
    expect(screen.getByRole('radio', { name: 'First duplicate' })).toBeChecked();
    expect(new FormData(form).get('choice')).toBe('duplicate');
    expect(form.checkValidity()).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('keeps a required all-duplicate group invalid while ambiguous radios are disabled', async () => {
    const { container } = render(
      <form>
        <RadioGroup aria-label="Options" defaultValue="duplicate" name="choice" required>
          <Radio value="duplicate">First</Radio>
          <Radio value="duplicate">Second</Radio>
        </RadioGroup>
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;

    await waitFor(() =>
      screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled()),
    );
    expect(form.checkValidity()).toBe(false);
    expect(new FormData(form).get('choice')).toBeNull();
  });

  it('hydrates duplicate registration without a server markup mismatch', async () => {
    const ui = (
      <RadioGroup aria-label="Options" defaultValue="duplicate">
        <Radio value="duplicate">First</Radio>
        <Radio value="duplicate">Second</Radio>
      </RadioGroup>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(ui);
    document.body.append(container);
    Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]')).forEach(
      (radio) => {
        expect(radio).toBeDisabled();
        expect(radio).not.toHaveAttribute('name');
      },
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const root = hydrateRoot(container, ui);
    await act(async () => Promise.resolve());
    await waitFor(() =>
      Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]')).forEach(
        (radio) => expect(radio).toBeDisabled(),
      ),
    );

    expect(
      consoleError.mock.calls.some((call) => String(call[0]).toLowerCase().includes('hydration')),
    ).toBe(false);
    await act(async () => root.unmount());
    consoleError.mockRestore();
    consoleWarn.mockRestore();
    container.remove();
  });

  it('fails closed for opaque radio topology in server markup', () => {
    const WrappedRadio = () => <Radio value="wrapped">Wrapped</Radio>;
    const markup = renderToString(
      <RadioGroup aria-label="Options" defaultValue="wrapped" name="choice">
        <WrappedRadio />
      </RadioGroup>,
    );
    const container = document.createElement('div');
    container.innerHTML = markup;

    expect(container.querySelector('input[type="radio"]')).toBeDisabled();
    expect(container.querySelector('input[type="radio"]')).not.toBeChecked();
  });

  it('does not consume one-shot radio children while inspecting server topology', () => {
    function* getRadios() {
      yield (
        <Radio key="one" value="one">
          One
        </Radio>
      );
      yield (
        <Radio key="two" value="two">
          Two
        </Radio>
      );
    }

    const markup = renderToString(
      <RadioGroup aria-label="Options" defaultValue="one" name="choice">
        {getRadios()}
      </RadioGroup>,
    );
    const container = document.createElement('div');
    container.innerHTML = markup;

    expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(2);
    Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]')).forEach(
      (radio) => expect(radio).toBeDisabled(),
    );
  });

  it('omits an internal generated name from no-JS form markup', () => {
    const markup = renderToString(
      <form>
        <RadioGroup aria-label="Options" defaultValue="one">
          <Radio value="one">One</Radio>
          <Radio value="two">Two</Radio>
        </RadioGroup>
      </form>,
    );
    const container = document.createElement('div');
    container.innerHTML = markup;

    Array.from(container.querySelectorAll('input[type="radio"]')).forEach((radio) =>
      expect(radio).not.toHaveAttribute('name'),
    );
    expect(Array.from(new FormData(container.querySelector('form') as HTMLFormElement))).toEqual(
      [],
    );
  });

  it('preserves native radio semantics when runtime props conflict', () => {
    render(
      <RadioGroup aria-label="Options">
        <Radio
          value="one"
          {...({
            'aria-checked': true,
            'aria-disabled': true,
            role: 'button',
            type: 'text',
          } as never)}
        >
          One
        </Radio>
      </RadioGroup>,
    );

    const radio = screen.getByRole('radio', { name: 'One' });
    expect(radio).toHaveAttribute('type', 'radio');
    expect(radio).not.toHaveAttribute('aria-checked');
    expect(radio).not.toHaveAttribute('aria-disabled');
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

  it('synchronizes an uncontrolled value with form reset', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <RadioGroup defaultValue="standard" aria-label="Options">
          <Radio value="standard">Standard</Radio>
          <Radio value="express">Express</Radio>
        </RadioGroup>
      </form>,
    );

    await user.click(screen.getByRole('radio', { name: 'Express' }));
    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Express' })).not.toBeChecked();
  });

  it('keeps its generated grouping name out of form data when name is omitted', async () => {
    const { container } = render(
      <form>
        <RadioGroup defaultValue="standard" aria-label="Options">
          <Radio value="standard">Standard</Radio>
          <Radio value="express">Express</Radio>
        </RadioGroup>
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    const event = new Event('formdata');
    const formData = new FormData();
    Object.defineProperty(event, 'formData', { value: formData });

    const radio = screen.getByRole('radio', { name: 'Standard' });
    await waitFor(() => expect(radio).toHaveAttribute('name'));
    formData.append(radio.getAttribute('name')!, 'standard');
    act(() => form.dispatchEvent(event));

    expect(Array.from(formData.entries())).toEqual([]);
  });

  it('synchronizes an externally associated form reset and submits through that form', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <form id="shipping-form" />
        <RadioGroup
          name="shipping"
          form="shipping-form"
          defaultValue="standard"
          aria-label="Options"
        >
          <Radio value="standard">Standard</Radio>
          <Radio value="express">Express</Radio>
        </RadioGroup>
      </>,
    );

    await user.click(screen.getByRole('radio', { name: 'Express' }));
    const form = container.querySelector('form') as HTMLFormElement;
    expect(new FormData(form).get('shipping')).toBe('express');

    await act(async () => {
      form.reset();
      await Promise.resolve();
    });
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Express' })).not.toBeChecked();
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

  it('does not allow a child to re-enable a disabled group', () => {
    render(
      <RadioGroup disabled aria-label="Options">
        <Radio value="1" disabled={false}>
          Option 1
        </Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('keeps radiogroup semantics and orientation when consumers pass conflicting attributes', () => {
    render(
      <RadioGroup
        {...({ 'aria-orientation': 'vertical', 'aria-readonly': 'false', role: 'group' } as never)}
        orientation="horizontal"
        aria-label="Options"
        readOnly
      >
        <Radio value="1">Option 1</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Options' })).toHaveAttribute(
      'aria-orientation',
      'horizontal',
    );
    expect(screen.getByRole('radiogroup', { name: 'Options' })).toHaveAttribute(
      'aria-readonly',
      'true',
    );
  });

  it('keeps group-managed state when legacy input props are supplied to a child', async () => {
    const user = userEvent.setup();
    const onGroupChange = vi.fn();
    const onChildChange = vi.fn();
    render(
      <RadioGroup name="group-name" defaultValue="1" onChange={onGroupChange} aria-label="Options">
        <Radio value="1">Option 1</Radio>
        <Radio
          value="2"
          {...({
            name: 'child-name',
            checked: true,
            defaultChecked: true,
            onChange: onChildChange,
          } as never)}
        >
          Option 2
        </Radio>
      </RadioGroup>,
    );

    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
    expect(radios[1]).toHaveAttribute('name', 'group-name');
    await user.click(radios[1]);
    expect(onGroupChange).toHaveBeenCalledWith('2');
    expect(onChildChange).not.toHaveBeenCalled();
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

  it('does not change selection when an individual radio is read-only', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RadioGroup defaultValue="standard" onChange={onChange} aria-label="Options">
        <Radio value="standard">Standard</Radio>
        <Radio value="express" readOnly>
          Express
        </Radio>
      </RadioGroup>,
    );

    const express = screen.getByRole('radio', { name: 'Express' });
    await user.click(express);
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked();
    expect(onChange).not.toHaveBeenCalled();

    await user.click(express);
    await user.keyboard(' ');
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not change selection when the group is read-only', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RadioGroup readOnly defaultValue="standard" onChange={onChange} aria-label="Options">
        <Radio value="standard">Standard</Radio>
        <Radio value="express">Express</Radio>
      </RadioGroup>,
    );

    await user.click(screen.getByRole('radio', { name: 'Express' }));

    expect(screen.getByRole('radiogroup', { name: 'Options' })).toHaveAttribute(
      'aria-readonly',
      'true',
    );
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('inherits FormControl state and associations', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FormControl labelTarget="group" isInvalid isRequired isReadOnly>
        <FormLabel>Shipping</FormLabel>
        <RadioGroup defaultValue="standard" onChange={onChange} aria-label="   ">
          <Radio value="standard">Standard</Radio>
          <Radio value="express">Express</Radio>
        </RadioGroup>
        <FormHelperText>Choose one</FormHelperText>
        <FormErrorMessage>Shipping is required</FormErrorMessage>
      </FormControl>,
    );

    const group = screen.getByRole('radiogroup', { name: 'Shipping' });
    expect(group).toHaveAttribute('aria-required', 'true');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAttribute('aria-describedby');
    expect(group).toHaveAttribute('aria-errormessage');
    expect(group).toHaveAttribute('aria-readonly', 'true');
    screen.getAllByRole('radio').forEach((radio) => expect(radio).not.toHaveAttribute('required'));

    await user.click(screen.getByRole('radio', { name: 'Express' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked();
  });

  it('prefers a trimmed explicit aria-labelledby over aria-label', () => {
    render(
      <>
        <span id="shipping-name">Delivery speed</span>
        <RadioGroup aria-label="Ignored shipping" aria-labelledby="  shipping-name  ">
          <Radio value="standard">Standard</Radio>
        </RadioGroup>
      </>,
    );

    const group = screen.getByRole('radiogroup', { name: 'Delivery speed' });
    expect(group).toHaveAttribute('aria-labelledby', 'shipping-name');
    expect(group).not.toHaveAttribute('aria-label');
  });

  it('does not associate FormControl errors when aria-invalid is explicitly false', () => {
    render(
      <FormControl isInvalid>
        <RadioGroup aria-label="Shipping" aria-invalid="false">
          <Radio value="standard">Standard</Radio>
        </RadioGroup>
        <FormHelperText id="shipping-help">Choose one</FormHelperText>
        <FormErrorMessage id="shipping-error">Shipping is required</FormErrorMessage>
      </FormControl>,
    );

    const group = screen.getByRole('radiogroup', { name: 'Shipping' });
    expect(group).toHaveAttribute('aria-invalid', 'false');
    expect(group).toHaveAttribute('aria-describedby', 'shipping-help');
    expect(group).not.toHaveAttribute('aria-errormessage');
  });

  it.each(['grammar', 'spelling'] as const)(
    'associates FormControl errors when aria-invalid is %s',
    (ariaInvalid) => {
      render(
        <FormControl isInvalid>
          <RadioGroup aria-label="Shipping" aria-invalid={ariaInvalid}>
            <Radio value="standard">Standard</Radio>
          </RadioGroup>
          <FormErrorMessage id="shipping-error">Shipping is required</FormErrorMessage>
        </FormControl>,
      );

      const group = screen.getByRole('radiogroup', { name: 'Shipping' });
      expect(group).toHaveAttribute('aria-invalid', ariaInvalid);
      expect(group).toHaveAttribute('aria-errormessage', 'shipping-error');
    },
  );

  it('uses the composite label contract and focuses the first radio from its FormLabel', () => {
    render(
      <FormControl id="shipping" labelTarget="group">
        <FormLabel>Shipping</FormLabel>
        <RadioGroup>
          <Radio value="standard">Standard</Radio>
        </RadioGroup>
      </FormControl>,
    );

    const label = screen.getByText('Shipping').closest('label');
    const group = screen.getByRole('radiogroup', { name: 'Shipping' });
    expect(label).not.toHaveAttribute('for');
    expect(group).toHaveAttribute('id', 'shipping');
    expect(group).toHaveAttribute('aria-labelledby', 'shipping-label');

    fireEvent.click(label!);
    expect(screen.getByRole('radio', { name: 'Standard' })).toHaveFocus();
  });
});

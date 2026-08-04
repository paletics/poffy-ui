import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { renderToStaticMarkup } from 'react-dom/server';
import { useLayoutEffect, useRef } from 'react';
import { Checkbox } from './Checkbox';
import { FormControl, FormErrorMessage, FormLabel } from '../FormControl';

const ParentLayoutResetCheckboxGroup = ({
  defaultValue,
  resetVersion,
}: {
  defaultValue: string[];
  resetVersion: number;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  useLayoutEffect(() => {
    if (resetVersion > 0) formRef.current?.reset();
  }, [resetVersion]);
  return (
    <form ref={formRef}>
      <Checkbox.Group defaultValue={defaultValue} aria-label="Options">
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
      </Checkbox.Group>
    </form>
  );
};

/**

 * ### Test Strategy
 * - **Focus**: The CheckboxGroup component must coordinate multiple checkboxes, supporting both controlled and uncontrolled states.
 * - **Design Verification**: Ensures layout variants (orientation) are applied and Silver Ratio spacing is respected.
 */
describe('Molecules / CheckboxGroup', () => {
  it('enforces one required selection through a group validation proxy', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Checkbox.Group aria-label="Fruit" required>
          <Checkbox value="apple">Apple</Checkbox>
          <Checkbox value="banana">Banana</Checkbox>
        </Checkbox.Group>
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    const proxy = container.querySelector<HTMLInputElement>(
      '[data-checkbox-group-validation-proxy]',
    );

    expect(proxy).toBeRequired();
    expect(proxy).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('group', { name: 'Fruit' })).toHaveAccessibleDescription('Required');
    expect(form.checkValidity()).toBe(false);
    fireEvent.invalid(proxy as HTMLInputElement);
    await act(async () => Promise.resolve());
    expect(screen.getByLabelText('Apple')).toHaveFocus();

    await user.click(screen.getByLabelText('Banana'));
    expect(form.checkValidity()).toBe(true);
  });

  it('associates required validation with an external form and excludes read-only groups', () => {
    const { container, rerender } = render(
      <>
        <form id="fruit-form" />
        <Checkbox.Group aria-label="Fruit" form="fruit-form" required>
          <Checkbox value="apple">Apple</Checkbox>
        </Checkbox.Group>
      </>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);

    rerender(
      <>
        <form id="fruit-form" />
        <Checkbox.Group aria-label="Fruit" form="fruit-form" required readOnly>
          <Checkbox value="apple">Apple</Checkbox>
        </Checkbox.Group>
      </>,
    );
    expect(form.checkValidity()).toBe(true);
  });

  it('reconciles required validity when an external form mounts after the group', async () => {
    const { container, rerender } = render(
      <Checkbox.Group
        aria-label="Fruit"
        form="late-fruit-form"
        onChange={vi.fn()}
        required
        value={['apple']}
      >
        <Checkbox name="fruit" value="apple">
          Apple
        </Checkbox>
      </Checkbox.Group>,
    );

    rerender(
      <>
        <form id="late-fruit-form" />
        <Checkbox.Group
          aria-label="Fruit"
          form="late-fruit-form"
          onChange={vi.fn()}
          required
          value={['apple']}
        >
          <Checkbox name="fruit" value="apple">
            Apple
          </Checkbox>
        </Checkbox.Group>
      </>,
    );

    const form = container.querySelector('#late-fruit-form') as HTMLFormElement;
    await waitFor(() => expect(form.checkValidity()).toBe(true));
    expect(new FormData(form).getAll('fruit')).toEqual(['apple']);
  });

  it('subscribes to late-mounted and replaced external forms for reset', async () => {
    const renderGroup = (formKey?: string) => (
      <>
        {formKey ? <form id="late-reset-form" key={formKey} /> : null}
        <Checkbox.Group aria-label="Fruit" defaultValue={['apple']} form="late-reset-form">
          <Checkbox value="apple">Apple</Checkbox>
          <Checkbox value="banana">Banana</Checkbox>
        </Checkbox.Group>
      </>
    );
    const user = userEvent.setup();
    const { container, rerender } = render(renderGroup());

    await user.click(screen.getByLabelText('Banana'));
    expect(screen.getByLabelText('Banana')).toBeChecked();

    rerender(renderGroup('first'));
    const firstForm = container.querySelector('#late-reset-form') as HTMLFormElement;
    await waitFor(() => {
      firstForm.reset();
      expect(screen.getByLabelText('Banana')).not.toBeChecked();
    });

    await user.click(screen.getByLabelText('Banana'));
    rerender(renderGroup('second'));
    const replacementForm = container.querySelector('#late-reset-form') as HTMLFormElement;
    expect(replacementForm).not.toBe(firstForm);
    await waitFor(() => {
      replacementForm.reset();
      expect(screen.getByLabelText('Banana')).not.toBeChecked();
    });
  });

  it('tracks disabled fieldset participation without changing the controlled value', async () => {
    const renderGroup = (fieldsetDisabled: boolean) => (
      <form>
        <Checkbox.Group aria-label="Fruit" onChange={vi.fn()} required value={['apple']}>
          <fieldset disabled={fieldsetDisabled}>
            <Checkbox name="fruit" value="apple">
              Apple
            </Checkbox>
          </fieldset>
        </Checkbox.Group>
      </form>
    );
    const { container, rerender } = render(renderGroup(true));
    const form = container.querySelector('form') as HTMLFormElement;

    await waitFor(() => expect(form.checkValidity()).toBe(false));
    expect(new FormData(form).getAll('fruit')).toEqual([]);

    rerender(renderGroup(false));
    await waitFor(() => expect(form.checkValidity()).toBe(true));
    expect(new FormData(form).getAll('fruit')).toEqual(['apple']);
  });

  it('tracks disabled participation inside a shadow root', async () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const mountPoint = document.createElement('div');
    shadowRoot.append(mountPoint);
    document.body.append(host);
    const renderGroup = (fieldsetDisabled: boolean) => (
      <form>
        <Checkbox.Group aria-label="Fruit" onChange={vi.fn()} required value={['apple']}>
          <fieldset disabled={fieldsetDisabled}>
            <Checkbox name="fruit" value="apple">
              Apple
            </Checkbox>
          </fieldset>
        </Checkbox.Group>
      </form>
    );
    const { rerender, unmount } = render(renderGroup(true), {
      baseElement: mountPoint,
      container: mountPoint,
    });
    const form = mountPoint.querySelector('form')!;

    await waitFor(() => expect(form.checkValidity()).toBe(false));
    rerender(renderGroup(false));
    await waitFor(() => expect(form.checkValidity()).toBe(true));

    unmount();
    host.remove();
  });

  it('focuses an eligible checkbox associated with the invalid proxy form', async () => {
    const { container } = render(
      <>
        <form id="fruit-form">
          <Checkbox.Group aria-label="Fruit" required>
            <Checkbox form="other-form" value="other">
              Other form choice
            </Checkbox>
            <Checkbox value="apple">Apple</Checkbox>
          </Checkbox.Group>
        </form>
        <form id="other-form" />
      </>,
    );
    const proxy = container.querySelector<HTMLInputElement>(
      '[data-checkbox-group-validation-proxy]',
    );

    fireEvent.invalid(proxy as HTMLInputElement);
    await waitFor(() => expect(screen.getByLabelText('Apple')).toHaveFocus());
  });

  it('keeps an orphan controlled value but fails required validation until its input mounts', async () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <form>
        <Checkbox.Group aria-label="Fruit" onChange={onChange} required value={['ghost']}>
          <Checkbox name="fruit" value="apple">
            Apple
          </Checkbox>
        </Checkbox.Group>
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;

    expect(form.checkValidity()).toBe(false);
    expect(new FormData(form).getAll('fruit')).toEqual([]);
    expect(onChange).not.toHaveBeenCalled();

    rerender(
      <form>
        <Checkbox.Group aria-label="Fruit" onChange={onChange} required value={['ghost']}>
          <Checkbox name="fruit" value="apple">
            Apple
          </Checkbox>
          <Checkbox name="fruit" value="ghost">
            Other
          </Checkbox>
        </Checkbox.Group>
      </form>,
    );

    await waitFor(() => expect(form.checkValidity()).toBe(true));
    expect(new FormData(form).getAll('fruit')).toEqual(['ghost']);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('tracks dynamic disabled and unmounted selected inputs without changing the value', async () => {
    const onChange = vi.fn();
    const renderGroup = (disabled: boolean, mounted: boolean) => (
      <form>
        <Checkbox.Group aria-label="Fruit" onChange={onChange} required value={['apple']}>
          {mounted ? (
            <Checkbox disabled={disabled} name="fruit" value="apple">
              Apple
            </Checkbox>
          ) : null}
        </Checkbox.Group>
      </form>
    );
    const { container, rerender } = render(renderGroup(true, true));
    const form = container.querySelector('form') as HTMLFormElement;

    expect(form.checkValidity()).toBe(false);
    expect(new FormData(form).getAll('fruit')).toEqual([]);

    rerender(renderGroup(false, true));
    await waitFor(() => expect(form.checkValidity()).toBe(true));
    expect(new FormData(form).getAll('fruit')).toEqual(['apple']);

    rerender(renderGroup(false, false));
    await waitFor(() => expect(form.checkValidity()).toBe(false));
    expect(new FormData(form).getAll('fruit')).toEqual([]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('counts only selected inputs associated with the validation proxy form', async () => {
    const { container } = render(
      <>
        <form id="fruit-form">
          <Checkbox.Group aria-label="Fruit" defaultValue={['apple']} required>
            <Checkbox form="other-form" name="fruit" value="apple">
              Apple
            </Checkbox>
          </Checkbox.Group>
        </form>
        <form id="other-form" />
      </>,
    );
    const fruitForm = container.querySelector('#fruit-form') as HTMLFormElement;
    const otherForm = container.querySelector('#other-form') as HTMLFormElement;

    await waitFor(() => expect(fruitForm.checkValidity()).toBe(false));
    expect(new FormData(fruitForm).getAll('fruit')).toEqual([]);
    expect(new FormData(otherForm).getAll('fruit')).toEqual(['apple']);
  });

  it('renders required validation fail-closed before native inputs register', () => {
    const markup = renderToStaticMarkup(
      <form>
        <Checkbox.Group aria-label="Fruit" defaultValue={['apple']} required>
          <Checkbox name="fruit" value="apple">
            Apple
          </Checkbox>
        </Checkbox.Group>
      </form>,
    );

    expect(markup).toContain('data-checkbox-group-validation-proxy=""');
    expect(markup).toContain('value=""');
  });

  it('should pass accessibility compliance', async () => {
    const { container } = render(
      <Checkbox.Group aria-label="Select fruits">
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
      </Checkbox.Group>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('handles uncontrolled selection change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Checkbox.Group defaultValue={['apple']} onChange={onChange}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
      </Checkbox.Group>,
    );

    const apple = screen.getByLabelText('Apple');
    const banana = screen.getByLabelText('Banana');

    expect(apple).toBeChecked();
    expect(banana).not.toBeChecked();

    await user.click(banana);

    expect(banana).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(['apple', 'banana']);
  });

  it('fails duplicate item values closed and excludes them from form data', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container } = render(
      <form>
        <Checkbox.Group aria-label="Options" value={['duplicate']} onChange={vi.fn()}>
          <Checkbox name="option" value="duplicate">
            First
          </Checkbox>
          <Checkbox name="option" value="duplicate">
            Second
          </Checkbox>
          <Checkbox name="option" value="unique">
            Unique
          </Checkbox>
        </Checkbox.Group>
      </form>,
    );

    expect(screen.getByRole('checkbox', { name: 'First' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Second' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Unique' })).toBeEnabled();
    expect(new FormData(container.querySelector('form')!).getAll('option')).toEqual([]);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('duplicate'));
    warn.mockRestore();
  });

  it('respects controlled value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender: _rerender } = render(
      <Checkbox.Group value={['apple']} onChange={onChange}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
      </Checkbox.Group>,
    );

    const banana = screen.getByLabelText('Banana');
    await user.click(banana);

    expect(onChange).toHaveBeenCalledWith(['apple', 'banana']);
  });

  it('retains the latest controlled selection when becoming uncontrolled', () => {
    const { rerender } = render(
      <Checkbox.Group value={['apple']} aria-label="Options">
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
      </Checkbox.Group>,
    );

    rerender(
      <Checkbox.Group value={['banana']} aria-label="Options">
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
      </Checkbox.Group>,
    );
    rerender(
      <Checkbox.Group aria-label="Options">
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
      </Checkbox.Group>,
    );

    expect(screen.getByLabelText('Apple')).not.toBeChecked();
    expect(screen.getByLabelText('Banana')).toBeChecked();
    expect(screen.getByRole('group', { name: 'Options' })).toBeInTheDocument();
  });

  it('synchronizes uncontrolled values with form reset', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Checkbox.Group defaultValue={['apple']} aria-label="Options">
          <Checkbox value="apple">Apple</Checkbox>
          <Checkbox value="banana">Banana</Checkbox>
        </Checkbox.Group>
      </form>,
    );

    await user.click(screen.getByLabelText('Apple'));
    await user.click(screen.getByLabelText('Banana'));
    expect(screen.getByLabelText('Apple')).not.toBeChecked();
    expect(screen.getByLabelText('Banana')).toBeChecked();

    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });
    expect(screen.getByLabelText('Apple')).toBeChecked();
    expect(screen.getByLabelText('Banana')).not.toBeChecked();
  });

  it('uses the latest defaults for a parent layout reset in the update commit', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ParentLayoutResetCheckboxGroup defaultValue={['apple']} resetVersion={0} />,
    );
    await user.click(screen.getByLabelText('Apple'));
    await user.click(screen.getByLabelText('Banana'));

    rerender(<ParentLayoutResetCheckboxGroup defaultValue={['banana']} resetVersion={1} />);

    await act(async () => Promise.resolve());
    expect(screen.getByLabelText('Apple')).not.toBeChecked();
    expect(screen.getByLabelText('Banana')).toBeChecked();
  });

  it('synchronizes an externally associated form reset and submits through that form', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <form id="fruit-form" />
        <Checkbox.Group form="fruit-form" defaultValue={['apple']} aria-label="Options">
          <Checkbox name="fruit" value="apple">
            Apple
          </Checkbox>
          <Checkbox name="fruit" value="banana">
            Banana
          </Checkbox>
        </Checkbox.Group>
      </>,
    );

    await user.click(screen.getByLabelText('Apple'));
    await user.click(screen.getByLabelText('Banana'));
    const form = container.querySelector('form') as HTMLFormElement;
    expect(new FormData(form).getAll('fruit')).toEqual(['banana']);

    await act(async () => {
      form.reset();
      await Promise.resolve();
    });
    expect(screen.getByLabelText('Apple')).toBeChecked();
    expect(screen.getByLabelText('Banana')).not.toBeChecked();
  });

  it('synchronizes an iframe-associated external form reset', async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('The test environment did not create an iframe document.');

    const form = frameDocument.createElement('form');
    form.id = 'fruit-form';
    const host = frameDocument.createElement('div');
    frameDocument.body.append(form, host);

    const { container, unmount } = render(
      <Checkbox.Group form="fruit-form" defaultValue={['apple']} aria-label="Options">
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
      </Checkbox.Group>,
      { baseElement: frameDocument.body, container: host },
    );

    const [apple, banana] = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    if (!apple || !banana) throw new Error('The test did not render checkbox inputs.');
    fireEvent.click(apple);
    fireEvent.click(banana);
    expect(apple).not.toBeChecked();
    expect(banana).toBeChecked();

    await act(async () => {
      form.reset();
      await Promise.resolve();
    });

    expect(apple).toBeChecked();
    expect(banana).not.toBeChecked();
    unmount();
    frame.remove();
  });

  it('disables all checkboxes when group is disabled', () => {
    render(
      <Checkbox.Group disabled>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
      </Checkbox.Group>,
    );

    expect(screen.getByLabelText('Apple')).toBeDisabled();
    expect(screen.getByLabelText('Banana')).toBeDisabled();
  });

  it('keeps its group role when consumers pass a conflicting role', () => {
    render(
      <Checkbox.Group {...({ role: 'list' } as never)} aria-label="Options">
        <Checkbox value="apple">Apple</Checkbox>
      </Checkbox.Group>,
    );

    expect(screen.getByRole('group', { name: 'Options' })).toBeInTheDocument();
  });

  it.each(['grammar', 'spelling'] as const)(
    'preserves %s invalid state and associates the FormControl error',
    (ariaInvalid) => {
      render(
        <FormControl isInvalid>
          <Checkbox.Group aria-label="Options" aria-invalid={ariaInvalid}>
            <Checkbox value="apple">Apple</Checkbox>
          </Checkbox.Group>
          <FormErrorMessage id="fruit-error">Choose a fruit</FormErrorMessage>
        </FormControl>,
      );

      const checkbox = screen.getByRole('checkbox', { name: 'Apple' });
      expect(checkbox).toHaveAttribute('aria-invalid', ariaInvalid);
      expect(checkbox).toHaveAttribute('aria-errormessage', 'fruit-error');
    },
  );

  it('uses the composite label contract and focuses the first checkbox from its FormLabel', () => {
    render(
      <FormControl id="fruits" labelTarget="group">
        <FormLabel>Fruits</FormLabel>
        <Checkbox.Group aria-label="   ">
          <Checkbox value="apple">Apple</Checkbox>
        </Checkbox.Group>
      </FormControl>,
    );

    const label = screen.getByText('Fruits').closest('label');
    const group = screen.getByRole('group', { name: 'Fruits' });
    expect(label).not.toHaveAttribute('for');
    expect(group).toHaveAttribute('id', 'fruits');
    expect(group).toHaveAttribute('aria-labelledby', 'fruits-label');

    fireEvent.click(label!);
    expect(screen.getByRole('checkbox', { name: 'Apple' })).toHaveFocus();
  });

  it('prefers a trimmed explicit aria-labelledby over aria-label', () => {
    render(
      <>
        <span id="fruit-name">Available fruit</span>
        <Checkbox.Group aria-label="Ignored fruit" aria-labelledby="  fruit-name  ">
          <Checkbox value="apple">Apple</Checkbox>
        </Checkbox.Group>
      </>,
    );

    const group = screen.getByRole('group', { name: 'Available fruit' });
    expect(group).toHaveAttribute('aria-labelledby', 'fruit-name');
    expect(group).not.toHaveAttribute('aria-label');
  });
});

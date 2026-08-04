import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { NumberInput } from './NumberInput';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';
import { LocaleProvider } from '@/providers/LocaleProvider';

/**
 * ### Test Strategy: NumberInput
 * - **Focus**: numeric editing, bounded stepping, controlled ownership handoff, form reset,
 *   FormControl integration, native semantics, and accessibility.
 * - **DON'T**: Do not assert recipe class names or visual styling; visual states belong in VRT.
 */
describe('NumberInput', () => {
  it('renders with default value', () => {
    render(<NumberInput aria-label="Quantity" defaultValue={3} />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveValue(3);
  });

  it('renders bounded controlled and uncontrolled values on the server', () => {
    const uncontrolledMarkup = renderToString(
      <NumberInput aria-label="Uncontrolled quantity" defaultValue={10} max={5} />,
    );
    const controlledMarkup = renderToString(
      <NumberInput aria-label="Controlled quantity" value={9} max={4} />,
    );

    expect(uncontrolledMarkup).toContain('value="5"');
    expect(uncontrolledMarkup).toContain('max="5"');
    expect(controlledMarkup).toContain('value="4"');
    expect(controlledMarkup).toContain('max="4"');
  });

  it('increments and decrements value in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(<NumberInput aria-label="Quantity" defaultValue={2} />);

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(input).toHaveValue(3);

    await user.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(input).toHaveValue(2);
  });

  it('clamps to min and max when using steppers', async () => {
    const user = userEvent.setup();
    render(<NumberInput aria-label="Quantity" defaultValue={5} min={4} max={6} />);

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    const increment = screen.getByRole('button', { name: 'Increment' });
    const decrement = screen.getByRole('button', { name: 'Decrement' });

    await user.click(increment);
    expect(input).toHaveValue(6);
    expect(increment).toBeDisabled();

    await user.click(decrement);
    await user.click(decrement);
    expect(input).toHaveValue(4);
    expect(decrement).toBeDisabled();
  });

  it('moves steppers and arrow keys to the adjacent configured step', async () => {
    const user = userEvent.setup();
    render(<NumberInput aria-label="Quantity" defaultValue={2} min={1} max={5} step={2} />);

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(input).toHaveValue(3);

    await user.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(input).toHaveValue(1);

    await user.click(input);
    await user.keyboard('{ArrowUp}');
    expect(input).toHaveValue(3);
  });

  it('preserves a consumer key handler that prevents default stepping', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn((event: React.KeyboardEvent<HTMLInputElement>) =>
      event.preventDefault(),
    );
    render(<NumberInput aria-label="Quantity" defaultValue={2} onKeyDown={onKeyDown} />);

    await user.click(screen.getByRole('spinbutton', { name: 'Quantity' }));
    await user.keyboard('{ArrowUp}');

    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(2);
  });

  it('normalizes uncontrolled values against initial and updated bounds', () => {
    const { rerender } = render(<NumberInput aria-label="Quantity" defaultValue={10} max={5} />);
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(5);

    rerender(<NumberInput aria-label="Quantity" defaultValue={10} max={3} />);
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(3);
  });

  it('normalizes controlled and uncontrolled bound changes without emitting onChange', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <NumberInput aria-label="Quantity" defaultValue={9} max={10} onChange={onChange} />,
    );

    rerender(<NumberInput aria-label="Quantity" defaultValue={9} max={5} onChange={onChange} />);
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(5);

    rerender(<NumberInput aria-label="Quantity" value={9} max={10} onChange={onChange} />);
    rerender(<NumberInput aria-label="Quantity" value={9} max={4} onChange={onChange} />);
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(4);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('discards an empty draft when bounds change', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<NumberInput aria-label="Quantity" defaultValue={9} max={10} />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    await user.clear(input);
    expect(input).toHaveValue(null);

    rerender(<NumberInput aria-label="Quantity" defaultValue={9} max={5} />);

    expect(input).toHaveValue(5);
  });

  it('normalizes reversed bounds, invalid steps, and non-finite values', async () => {
    const user = userEvent.setup();
    render(
      <NumberInput aria-label="Quantity" defaultValue={Number.NaN} min={10} max={5} step={0} />,
    );

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveValue(5);
    expect(input).toHaveAttribute('min', '5');
    expect(input).toHaveAttribute('max', '10');
    expect(input).toHaveAttribute('step', '1');

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(input).toHaveValue(6);
  });

  it('calls onChange in controlled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput aria-label="Quantity" value={10} onChange={onChange} step={2} />);

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(onChange).toHaveBeenCalledWith(12);
  });

  it('does not emit when an interaction clamps to the current semantic value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput aria-label="Quantity" value={5} max={5} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Increment' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps the prop value displayed when a controlled parent does not update', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput aria-label="Quantity" value={1} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(onChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(1);
  });

  it('reports a manual controlled candidate while keeping the prop value displayed', () => {
    const onChange = vi.fn();
    render(<NumberInput aria-label="Quantity" value={3} max={5} onChange={onChange} />);

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    fireEvent.change(input, { target: { value: '9' } });

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(5);
    expect(input).toHaveValue(3);
  });

  it('keeps the last controlled value when control is released', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<NumberInput aria-label="Quantity" value={9} max={10} />);

    rerender(<NumberInput aria-label="Quantity" defaultValue={0} max={10} />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });

    expect(input).toHaveValue(9);
    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(input).toHaveValue(10);
  });

  it('clamps the handoff when control is released as bounds tighten', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <NumberInput aria-label="Quantity" value={9} max={10} onChange={onChange} />,
    );

    rerender(<NumberInput aria-label="Quantity" defaultValue={0} max={5} onChange={onChange} />);

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveValue(5);
    expect(onChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(input).toHaveValue(4);
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('preserves a bounded controlled handoff in StrictMode', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <StrictMode>
        <NumberInput aria-label="Quantity" value={1} min={0} />
      </StrictMode>,
    );

    rerender(
      <StrictMode>
        <NumberInput aria-label="Quantity" defaultValue={0} min={5} />
      </StrictMode>,
    );

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveValue(5);
    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(input).toHaveValue(6);
  });

  it('resets uncontrolled state to its bounded default value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <form>
        <NumberInput aria-label="Quantity" defaultValue={10} max={5} onChange={onChange} />
      </form>,
    );
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    await user.clear(input);
    await user.type(input, '3');
    expect(onChange).toHaveBeenCalledOnce();

    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });

    expect(input).toHaveValue(5);
    expect(onChange).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(input).toHaveValue(4);
  });

  it('submits and resets through an externally associated form', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <form id="quantity-form" />
        <NumberInput form="quantity-form" name="quantity" aria-label="Quantity" defaultValue={2} />
      </>,
    );
    const form = container.querySelector('#quantity-form') as HTMLFormElement;
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(new FormData(form).get('quantity')).toBe('3');

    await act(async () => {
      form.reset();
      await Promise.resolve();
    });

    expect(input).toHaveValue(2);
  });

  it('uses the latest default value and bounds when its form resets', async () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <form>
        <NumberInput aria-label="Quantity" defaultValue={2} max={10} onChange={onChange} />
      </form>,
    );

    rerender(
      <form>
        <NumberInput aria-label="Quantity" defaultValue={8} max={5} onChange={onChange} />
      </form>,
    );

    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });

    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(5);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps the current value when its form reset is cancelled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <form onReset={(event) => event.preventDefault()}>
        <NumberInput aria-label="Quantity" defaultValue={2} onChange={onChange} />
      </form>,
    );
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(onChange).toHaveBeenCalledOnce();

    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });

    expect(input).toHaveValue(3);
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('uses the latest unbounded default value as the step grid base', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <form>
        <NumberInput aria-label="Quantity" defaultValue={0} step={2} />
      </form>,
    );

    rerender(
      <form>
        <NumberInput aria-label="Quantity" defaultValue={1} step={2} />
      </form>,
    );
    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(3);
  });

  it('keeps controlled values unchanged when its form resets', async () => {
    const { container } = render(
      <form>
        <NumberInput aria-label="Quantity" value={7} />
      </form>,
    );

    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });

    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(7);
  });

  it('restores or steps from the committed value after an empty draft', async () => {
    const user = userEvent.setup();
    render(<NumberInput aria-label="Quantity" defaultValue={12} />);

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    await user.clear(input);
    expect(input).toHaveValue(null);

    await user.tab();
    expect(input).toHaveValue(12);

    await user.clear(input);
    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(input).toHaveValue(13);
  });

  it('disables steppers when readOnly', () => {
    render(<NumberInput aria-label="Quantity" defaultValue={1} readOnly />);

    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeDisabled();
  });

  it('resolves stepper labels from locale and explicit overrides', () => {
    render(
      <LocaleProvider defaultLocale="JA-jp" global={false}>
        <NumberInput aria-label="数量" labels={{ increment: '数量を増やす' }} defaultValue={1} />
      </LocaleProvider>,
    );

    expect(screen.getByRole('button', { name: '数量を増やす' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '減らす' })).toBeInTheDocument();
  });

  it('prefers an explicit locale over the optional locale provider', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <NumberInput aria-label="Quantity" locale="en-US" defaultValue={1} />
      </LocaleProvider>,
    );

    expect(screen.getByRole('button', { name: 'Increment' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeInTheDocument();
  });

  it('disables input and steppers when disabled', () => {
    render(<NumberInput aria-label="Quantity" defaultValue={1} disabled />);

    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeDisabled();
  });

  it('inherits FormControl field state and message references', () => {
    render(
      <FormControl id="quantity" isDisabled isInvalid isReadOnly isRequired>
        <FormLabel>Quantity</FormLabel>
        <NumberInput />
        <FormHelperText id="quantity-help">Choose a quantity.</FormHelperText>
        <FormErrorMessage id="quantity-error">Quantity is required.</FormErrorMessage>
      </FormControl>,
    );

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveAttribute('id', 'quantity');
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-readonly', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'quantity-help quantity-error');
    expect(input).toHaveAttribute('aria-errormessage', 'quantity-error');
    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeDisabled();
  });

  it('associates FormControl errors when aria-invalid is explicitly true', () => {
    render(
      <FormControl id="quantity" isInvalid>
        <FormLabel>Quantity</FormLabel>
        <NumberInput error={false} aria-invalid />
        <FormHelperText id="quantity-help">Choose a quantity.</FormHelperText>
        <FormErrorMessage id="quantity-error">Quantity is required.</FormErrorMessage>
      </FormControl>,
    );

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'quantity-help quantity-error');
    expect(input).toHaveAttribute('aria-errormessage', 'quantity-error');
  });

  it.each(['grammar', 'spelling'] as const)(
    'associates FormControl errors when aria-invalid is %s',
    (ariaInvalid) => {
      render(
        <FormControl id="quantity" isInvalid>
          <FormLabel>Quantity</FormLabel>
          <NumberInput error={false} aria-invalid={ariaInvalid} />
          <FormHelperText id="quantity-help">Choose a quantity.</FormHelperText>
          <FormErrorMessage id="quantity-error">Quantity is required.</FormErrorMessage>
        </FormControl>,
      );

      const input = screen.getByRole('spinbutton', { name: 'Quantity' });
      expect(input).toHaveAttribute('aria-invalid', ariaInvalid);
      expect(input).toHaveAttribute('aria-describedby', 'quantity-help quantity-error');
      expect(input).toHaveAttribute('aria-errormessage', 'quantity-error');
    },
  );

  it('forwards ref to the native number input', () => {
    const ref = { current: null };
    render(<NumberInput ref={ref} aria-label="Quantity" defaultValue={1} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute('type', 'number');
  });

  it('keeps the native input type fixed for JavaScript callers', () => {
    const props = { type: 'text' } as unknown as Parameters<typeof NumberInput>[0];
    render(<NumberInput {...props} aria-label="Quantity" defaultValue={1} />);

    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveAttribute('type', 'number');
  });

  it('preserves spinbutton semantics for conflicting runtime props', () => {
    render(<NumberInput {...({ role: 'presentation' } as never)} aria-label="Quantity" />);

    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toBeInTheDocument();
  });

  it('consumes removed runtime stepper target props without leaking them to the DOM', () => {
    render(
      <NumberInput
        {...({ stepperTarget: 'compact' } as never)}
        aria-label="Quantity"
        defaultValue={1}
      />,
    );

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveAttribute('type', 'number');
    expect(input).not.toHaveAttribute('stepperTarget');
    expect(input.parentElement).not.toHaveAttribute('stepperTarget');
  });

  it('has no obvious accessibility violations', async () => {
    const { container } = render(<NumberInput aria-label="Quantity" defaultValue={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

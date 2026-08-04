import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { OTPInput } from './OTPInput';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';
import { LocaleProvider } from '@/providers/LocaleProvider';

/**
 * ### Test Strategy: OTPInput
 * - **Focus**: Correct number of segments, single-character entry with auto-advance, Backspace navigation,
 *   paste handling, `onComplete` callback, disabled state, and WAI-ARIA compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 * - **Note**: `fireEvent.change` is intentional for segment input simulation — `userEvent.type` appends
 *   characters and conflicts with `maxLength=1` single-segment logic in JSDOM.
 */
describe('OTPInput', () => {
  it('owns the overflow viewport that keeps every segment reachable', () => {
    render(<OTPInput length={8} aria-label="Long code" />);

    expect(screen.getByRole('group', { name: 'Long code' })).toHaveAttribute(
      'data-otp-overflow-viewport',
    );
    expect(screen.getAllByRole('textbox')).toHaveLength(8);
  });

  it('does not navigate or clear segments while an IME composition is active', () => {
    render(<OTPInput defaultValue={['1', '2']} length={2} aria-label="Code" />);
    const inputs = screen.getAllByRole('textbox');
    inputs[1].focus();

    fireEvent.keyDown(inputs[1], { key: 'Backspace', isComposing: true });
    expect(inputs[1]).toHaveValue('2');
    expect(inputs[1]).toHaveFocus();

    fireEvent.keyDown(inputs[1], { key: 'ArrowLeft', keyCode: 229 });
    expect(inputs[1]).toHaveFocus();
  });
  it('inherits the composite FormControl contract and focuses a segment from its FormLabel', () => {
    render(
      <FormControl id="verification-code" labelTarget="group" isInvalid isRequired>
        <FormLabel>Verification code</FormLabel>
        <OTPInput aria-label="   " />
        <FormHelperText>Enter all digits.</FormHelperText>
        <FormErrorMessage>Verification code is required.</FormErrorMessage>
      </FormControl>,
    );

    const label = screen.getByText('Verification code').closest('label');
    const group = screen.getByRole('group', { name: 'Verification code' });
    expect(label).not.toHaveAttribute('for');
    expect(group).toHaveAttribute('id', 'verification-code');
    expect(group).toHaveAttribute('aria-labelledby', 'verification-code-label');
    expect(document.querySelector('[data-form-control-validation-proxy]')).toBeNull();
    expect(screen.getAllByRole('textbox')[0]).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getAllByRole('textbox')[0]).toBeRequired();
    fireEvent.click(label!);
    expect(screen.getAllByRole('textbox')[0]).toHaveFocus();
  });

  it('prefers a trimmed explicit aria-labelledby over aria-label', () => {
    render(
      <>
        <span id="otp-name">Account code</span>
        <OTPInput aria-label="Ignored code" aria-labelledby="  otp-name  " />
      </>,
    );

    const group = screen.getByRole('group', { name: 'Account code' });
    expect(group).toHaveAttribute('aria-labelledby', 'otp-name');
    expect(group).not.toHaveAttribute('aria-label');
  });

  it('uses the native segments for required validation', () => {
    const { container } = render(<OTPInput required />);

    expect(container.querySelector('[data-form-control-validation-proxy]')).toBeNull();
    expect(screen.getAllByRole('textbox').every((segment) => segment.required)).toBe(true);
  });

  it('renders the correct number of input segments', () => {
    render(<OTPInput length={4} />);
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(<OTPInput length={4} aria-label="Verification code" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('calls onChange with the updated value when a segment changes', () => {
    const handleChange = vi.fn();
    render(<OTPInput length={4} onChange={handleChange} />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0]!, { target: { value: '1' } });
    expect(handleChange).toHaveBeenCalledWith(['1', '', '', '']);
    expect(inputs[0]).toHaveValue('1');
  });

  it('distributes a multi-digit input event such as OTP autofill', () => {
    const handleChange = vi.fn();
    render(<OTPInput length={4} onChange={handleChange} />);

    fireEvent.change(screen.getAllByRole('textbox')[0]!, { target: { value: '1234' } });

    expect(handleChange).toHaveBeenCalledWith(['1', '2', '3', '4']);
    expect(
      screen.getAllByRole('textbox').map((input) => (input as HTMLInputElement).value),
    ).toEqual(['1', '2', '3', '4']);
  });

  it('commits full-width digits after IME composition ends', () => {
    const handleChange = vi.fn();
    render(<OTPInput length={4} onChange={handleChange} />);

    const input = screen.getAllByRole('textbox')[0]!;
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: '１' } });
    fireEvent.compositionEnd(input, { data: '１' });

    expect(handleChange).toHaveBeenCalledWith(['1', '', '', '']);
    expect(input).toHaveValue('1');
  });

  it('calls onComplete when all segments are filled', () => {
    const handleComplete = vi.fn();
    render(
      <OTPInput
        length={4}
        value={['1', '2', '3', '']}
        onComplete={handleComplete}
        onChange={vi.fn()}
      />,
    );

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[3]!, { target: { value: '4' } });
    expect(handleComplete).toHaveBeenCalledWith('1234');
  });

  it('does not call onComplete when one already-complete code is replaced by another', () => {
    const handleComplete = vi.fn();
    const handleChange = vi.fn();
    render(
      <OTPInput
        length={4}
        value={['1', '2', '3', '4']}
        onComplete={handleComplete}
        onChange={handleChange}
      />,
    );

    fireEvent.change(screen.getAllByRole('textbox')[3]!, { target: { value: '5' } });

    expect(handleChange).toHaveBeenCalledWith(['1', '2', '3', '5']);
    expect(handleComplete).not.toHaveBeenCalled();
  });

  it('does not repeat a complete candidate rejected by a controlled parent', () => {
    const handleComplete = vi.fn();
    render(
      <OTPInput
        length={4}
        value={['1', '2', '3', '']}
        onComplete={handleComplete}
        onChange={vi.fn()}
      />,
    );
    const lastInput = screen.getAllByRole('textbox')[3]!;

    fireEvent.change(lastInput, { target: { value: '4' } });
    fireEvent.change(lastInput, { target: { value: '4' } });

    expect(handleComplete).toHaveBeenCalledTimes(1);
    expect(handleComplete).toHaveBeenCalledWith('1234');
  });

  it('clears the current segment and calls onChange on Backspace', () => {
    const handleChange = vi.fn();
    render(<OTPInput length={4} value={['1', '2', '', '']} onChange={handleChange} />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.keyDown(inputs[1]!, { key: 'Backspace' });
    expect(handleChange).toHaveBeenCalledWith(['1', '', '', '']);
  });

  it('reflects controlled value in segments', () => {
    render(<OTPInput length={4} value={['1', '2', '3', '4']} onChange={vi.fn()} />);
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs[0]!.value).toBe('1');
    expect(inputs[3]!.value).toBe('4');
  });

  it('preserves controlled empty positions and suppresses same-value notifications', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <OTPInput length={4} value={['1', '2', '3', '']} onChange={onChange} />,
    );
    const inputs = screen.getAllByRole('textbox');

    fireEvent.keyDown(inputs[1]!, { key: 'Backspace' });
    expect(onChange).toHaveBeenCalledWith(['1', '', '3', '']);

    rerender(<OTPInput length={4} value={['1', '', '3', '']} onChange={onChange} />);
    expect(
      screen.getAllByRole('textbox').map((input) => (input as HTMLInputElement).value),
    ).toEqual(['1', '', '3', '']);

    onChange.mockClear();
    fireEvent.change(screen.getAllByRole('textbox')[0]!, { target: { value: '1' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses a normalized uncontrolled default value', () => {
    const { container } = render(
      <form>
        <OTPInput length={4} name="verificationCode" defaultValue={['１', '２', '3', '4', '5']} />
      </form>,
    );

    expect(
      screen.getAllByRole('textbox').map((input) => (input as HTMLInputElement).value),
    ).toEqual(['1', '2', '3', '4']);
    expect(new FormData(container.querySelector('form')!).get('verificationCode')).toBe('1234');
  });

  it('preserves empty segment positions across unrelated uncontrolled rerenders', () => {
    const { rerender } = render(<OTPInput length={4} aria-label="First render" />);

    fireEvent.change(screen.getAllByRole('textbox')[2]!, { target: { value: '3' } });
    rerender(<OTPInput length={4} aria-label="Second render" />);

    expect(
      screen.getAllByRole('textbox').map((input) => (input as HTMLInputElement).value),
    ).toEqual(['', '', '3', '']);
  });

  it('resizes uncontrolled holes positionally without resurrecting truncated segments', () => {
    const { rerender } = render(<OTPInput length={4} />);
    let inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0]!, { target: { value: '1' } });
    fireEvent.change(inputs[2]!, { target: { value: '3' } });

    rerender(<OTPInput length={6} />);
    expect(
      screen.getAllByRole('textbox').map((input) => (input as HTMLInputElement).value),
    ).toEqual(['1', '', '3', '', '', '']);

    rerender(<OTPInput length={2} />);
    expect(
      screen.getAllByRole('textbox').map((input) => (input as HTMLInputElement).value),
    ).toEqual(['1', '']);

    rerender(<OTPInput length={4} />);
    inputs = screen.getAllByRole('textbox');
    expect(inputs.map((input) => (input as HTMLInputElement).value)).toEqual(['1', '', '', '']);
  });

  it('moves focus to the last remaining segment when length shrinks', async () => {
    const { rerender } = render(<OTPInput length={4} />);
    screen.getAllByRole('textbox')[3]!.focus();

    rerender(<OTPInput length={2} />);

    await waitFor(() => expect(screen.getAllByRole('textbox')[1]).toHaveFocus());
  });

  it('does not reclaim focus after focus has left the widget', () => {
    const { rerender } = render(
      <>
        <OTPInput length={4} />
        <button type="button">Outside</button>
      </>,
    );
    screen.getAllByRole('textbox')[3]!.focus();
    screen.getByRole('button', { name: 'Outside' }).focus();

    rerender(
      <>
        <OTPInput length={2} />
        <button type="button">Outside</button>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
  });

  it('retains the latest controlled value when becoming uncontrolled', () => {
    const { rerender } = render(
      <OTPInput length={4} value={['1', '2', '3', '4']} onChange={vi.fn()} />,
    );

    rerender(<OTPInput length={4} value={['5', '6', '7', '8']} onChange={vi.fn()} />);
    rerender(<OTPInput length={4} onChange={vi.fn()} />);

    expect(
      screen
        .getAllByRole('textbox')
        .map((input) => (input as HTMLInputElement).value)
        .join(''),
    ).toBe('5678');
  });

  it('does not resurrect controlled digits after shrinking, releasing, and expanding', () => {
    const { rerender } = render(
      <OTPInput length={4} value={['1', '2', '3', '4']} onChange={vi.fn()} />,
    );

    rerender(<OTPInput length={2} value={['1', '2', '3', '4']} onChange={vi.fn()} />);
    rerender(<OTPInput length={2} onChange={vi.fn()} />);
    rerender(<OTPInput length={4} onChange={vi.fn()} />);

    expect(
      screen.getAllByRole('textbox').map((input) => (input as HTMLInputElement).value),
    ).toEqual(['1', '2', '', '']);
  });

  it('commits a positional resize when control is released while length shrinks', () => {
    const { rerender } = render(
      <OTPInput length={4} value={['1', '2', '3', '4']} onChange={vi.fn()} />,
    );

    rerender(<OTPInput length={2} onChange={vi.fn()} />);
    expect(
      screen.getAllByRole('textbox').map((input) => (input as HTMLInputElement).value),
    ).toEqual(['1', '2']);

    rerender(<OTPInput length={4} onChange={vi.fn()} />);
    expect(
      screen.getAllByRole('textbox').map((input) => (input as HTMLInputElement).value),
    ).toEqual(['1', '2', '', '']);
  });

  it('keeps explicit group semantics when consumer props conflict', () => {
    render(
      <OTPInput
        {...({ 'aria-disabled': 'false', role: 'presentation' } as never)}
        length={4}
        aria-label="Verification code"
        disabled
      />,
    );

    expect(screen.getByRole('group', { name: 'Verification code' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('disables all segments when disabled prop is true', () => {
    render(<OTPInput length={4} disabled />);
    screen.getAllByRole('textbox').forEach((input) => expect(input).toBeDisabled());
  });

  it('prevents edits while retaining arrow-key navigation when read-only', () => {
    const onChange = vi.fn();
    render(<OTPInput length={4} value={['1', '2', '', '']} readOnly onChange={onChange} />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0]!, { target: { value: '9' } });
    fireEvent.keyDown(inputs[1]!, { key: 'Backspace' });
    fireEvent.keyDown(inputs[1]!, { key: 'ArrowRight' });

    expect(onChange).not.toHaveBeenCalled();
    expect(inputs[2]).toHaveFocus();
  });

  it('distributes pasted text across segments', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<OTPInput length={4} onChange={handleChange} />);

    const input = screen.getAllByRole('textbox')[0]!;
    await user.click(input);
    await user.paste('5678');

    expect(handleChange).toHaveBeenCalledWith(['5', '6', '7', '8']);
  });

  it('moves horizontal focus visually in RTL without changing Backspace semantics', () => {
    render(<OTPInput dir="rtl" length={4} />);
    const inputs = screen.getAllByRole('textbox');
    inputs[1]!.focus();

    fireEvent.keyDown(inputs[1]!, { key: 'ArrowLeft' });
    expect(inputs[2]).toHaveFocus();
    fireEvent.keyDown(inputs[2]!, { key: 'ArrowRight' });
    expect(inputs[1]).toHaveFocus();
  });

  it('localizes segment labels with partial message overrides', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <OTPInput length={2} messages={{ digit: (index) => `Slot ${index}` }} />
      </LocaleProvider>,
    );

    expect(screen.getByRole('textbox', { name: 'Slot 1' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Slot 2' })).toBeInTheDocument();
  });

  it('submits its combined value through a single hidden form field', () => {
    const { container } = render(
      <form>
        <OTPInput name="verificationCode" value={['1', '2', '3', '4']} onChange={vi.fn()} />
      </form>,
    );
    const form = container.querySelector('form');
    expect(form).not.toBeNull();

    expect(new FormData(form!).get('verificationCode')).toBe('1234');
  });

  it('requires every segment and focuses the first empty segment when invalid', async () => {
    const { container } = render(
      <form>
        <OTPInput length={4} required />
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    const segments = screen.getAllByLabelText(/Digit \d+ of 4/);

    fireEvent.change(segments[0]!, { target: { value: '1' } });
    fireEvent.change(segments[2]!, { target: { value: '3' } });

    expect(form.checkValidity()).toBe(false);
    await act(async () => Promise.resolve());
    expect(segments[1]).toHaveFocus();

    fireEvent.change(segments[1]!, { target: { value: '2' } });
    fireEvent.change(segments[3]!, { target: { value: '4' } });
    expect(form.checkValidity()).toBe(true);
  });

  it('associates required segments with an external form', () => {
    const { container } = render(
      <>
        <form id="verification-form" />
        <OTPInput length={2} form="verification-form" required />
      </>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    const segments = screen.getAllByRole('textbox') as HTMLInputElement[];

    expect(segments.every((segment) => segment.form === form)).toBe(true);
    expect(form.checkValidity()).toBe(false);
    fireEvent.change(segments[0]!, { target: { value: '1' } });
    fireEvent.change(segments[1]!, { target: { value: '2' } });
    expect(form.checkValidity()).toBe(true);
  });

  it('resets uncontrolled segments to the latest default value', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <form>
        <OTPInput length={4} name="verificationCode" defaultValue={['1', '2', '', '']} />
      </form>,
    );

    await user.click(screen.getAllByRole('textbox')[2]!);
    await user.paste('34');
    rerender(
      <form>
        <OTPInput length={4} name="verificationCode" defaultValue={['5', '6', '', '']} />
      </form>,
    );
    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });

    expect(
      screen.getAllByRole('textbox').map((input) => (input as HTMLInputElement).value),
    ).toEqual(['5', '6', '', '']);
  });

  it('associates FormControl errors when aria-invalid is explicitly true', () => {
    render(
      <FormControl isInvalid>
        <OTPInput error={false} aria-invalid="true" />
        <FormHelperText id="otp-help">Enter all digits.</FormHelperText>
        <FormErrorMessage id="otp-error">Verification code is required.</FormErrorMessage>
      </FormControl>,
    );

    const group = screen.getAllByRole('group').at(-1)!;
    expect(group).toHaveAttribute('aria-describedby', 'otp-help otp-error');
    expect(screen.getAllByRole('textbox')[0]).toHaveAttribute('aria-errormessage', 'otp-error');
  });

  it('normalizes invalid runtime lengths', () => {
    const { container } = render(<OTPInput length={0} />);

    expect(container.querySelectorAll('input[inputmode="numeric"]')).toHaveLength(1);
    expect(container.querySelector('[aschild]')).toBeNull();
  });
});

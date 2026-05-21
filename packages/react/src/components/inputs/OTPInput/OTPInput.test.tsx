import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { OTPInput } from './OTPInput';

/**
 * ### Test Strategy: OTPInput
 * - **Focus**: Correct number of segments, single-character entry with auto-advance, Backspace navigation,
 *   paste handling, `onComplete` callback, disabled state, and WAI-ARIA compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 * - **Note**: `fireEvent.change` is intentional for segment input simulation — `userEvent.type` appends
 *   characters and conflicts with `maxLength=1` single-segment logic in JSDOM.
 */
describe('OTPInput', () => {
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
    expect(handleChange).toHaveBeenCalledWith('1');
    expect(inputs[0]).toHaveValue('1');
  });

  it('calls onComplete when all segments are filled', () => {
    const handleComplete = vi.fn();
    render(<OTPInput length={4} value="123" onComplete={handleComplete} onChange={vi.fn()} />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[3]!, { target: { value: '4' } });
    expect(handleComplete).toHaveBeenCalledWith('1234');
  });

  it('clears the current segment and calls onChange on Backspace', () => {
    const handleChange = vi.fn();
    render(<OTPInput length={4} value="12" onChange={handleChange} />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.keyDown(inputs[1]!, { key: 'Backspace' });
    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('reflects controlled value in segments', () => {
    render(<OTPInput length={4} value="1234" onChange={vi.fn()} />);
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs[0]!.value).toBe('1');
    expect(inputs[3]!.value).toBe('4');
  });

  it('disables all segments when disabled prop is true', () => {
    render(<OTPInput length={4} disabled />);
    screen.getAllByRole('textbox').forEach((input) => expect(input).toBeDisabled());
  });

  it('distributes pasted text across segments', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<OTPInput length={4} onChange={handleChange} />);

    const input = screen.getAllByRole('textbox')[0]!;
    await user.click(input);
    await user.paste('5678');

    expect(handleChange).toHaveBeenCalledWith('5678');
  });
});

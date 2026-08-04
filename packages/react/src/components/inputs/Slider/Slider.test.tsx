import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Slider } from './Slider';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';

/**
 * ### Test Strategy: Slider
 * - **Focus**: Correct rendering, optional label, value change callback, disabled state,
 *   ref forwarding, and WAI-ARIA compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 * - **Note**: `fireEvent.change` is intentional for range inputs — `userEvent` does not simulate
 *   drag interactions on `<input type="range">` in JSDOM.
 */
describe('Slider', () => {
  it('renders with slider role', () => {
    render(<Slider aria-label="Volume" />);
    expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
  });

  it('ignores runtime overrides for native range semantics and derived state', () => {
    render(
      <Slider
        aria-label="Volume"
        disabled
        readOnly
        {...({
          required: true,
          type: 'text',
          role: 'button',
          'aria-orientation': 'vertical',
          'aria-valuemin': 500,
          'aria-valuemax': 600,
          'aria-valuenow': 550,
          'aria-disabled': false,
          'aria-readonly': false,
          'aria-required': false,
        } as never)}
      />,
    );

    const input = screen.getByRole('slider', { name: 'Volume' });
    expect(input).toHaveAttribute('type', 'range');
    expect(input).not.toHaveAttribute('aria-orientation');
    expect(input).not.toHaveAttribute('aria-valuemin');
    expect(input).not.toHaveAttribute('aria-valuemax');
    expect(input).not.toHaveAttribute('aria-valuenow');
    expect(input).toHaveAttribute('aria-disabled', 'true');
    expect(input).toHaveAttribute('aria-readonly', 'true');
    expect(input).not.toHaveAttribute('required');
    expect(input).not.toHaveAttribute('aria-required');
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(<Slider aria-label="Volume">Volume</Slider>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders the label when children are provided', () => {
    render(<Slider>Level</Slider>);
    expect(screen.getByText('Level')).toBeInTheDocument();
  });

  it('renders zero as valid label content', () => {
    render(<Slider>{0}</Slider>);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('keeps long unbroken label content available to the accessible name', () => {
    render(<Slider>https://example.com/preferences/audio/output/very-long-device-name</Slider>);

    expect(
      screen.getByRole('slider', {
        name: 'https://example.com/preferences/audio/output/very-long-device-name',
      }),
    ).toBeInTheDocument();
  });

  it('reflects defaultValue in the input', () => {
    render(<Slider defaultValue={30} aria-label="Brightness" />);
    expect(screen.getByRole('slider')).toHaveValue('30');
  });

  it('calls onChange when the slider value changes', () => {
    const handleChange = vi.fn();
    render(<Slider defaultValue={10} aria-label="Volume" onChange={handleChange} />);

    fireEvent.change(screen.getByRole('slider'), { target: { value: '50' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('slider')).toHaveValue('50');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Slider disabled aria-label="Volume" />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });

  it('does not change or notify when read-only', () => {
    const handleChange = vi.fn();
    render(<Slider readOnly defaultValue={10} aria-label="Volume" onChange={handleChange} />);

    const input = screen.getByRole('slider');
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    fireEvent.change(input, { target: { value: '50' } });

    expect(input).toHaveValue('10');
    expect(handleChange).not.toHaveBeenCalled();
    expect(input).toHaveAttribute('aria-readonly', 'true');
  });

  it('restores the latest controlled value when read-only', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Slider readOnly value={10} aria-label="Volume" onChange={onChange} />,
    );
    rerender(<Slider readOnly value={30} aria-label="Volume" onChange={onChange} />);

    const input = screen.getByRole('slider');
    fireEvent.change(input, { target: { value: '50' } });

    expect(input).toHaveValue('30');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('inherits FormControl state and error associations', () => {
    render(
      <FormControl id="volume" isDisabled isInvalid isRequired>
        <FormLabel>Volume</FormLabel>
        <Slider />
        <FormHelperText id="volume-help">Choose a volume.</FormHelperText>
        <FormErrorMessage id="volume-error">Volume is invalid.</FormErrorMessage>
      </FormControl>,
    );

    const input = screen.getByRole('slider', { name: 'Volume' });
    expect(input).toHaveAttribute('id', 'volume');
    expect(input).toBeDisabled();
    expect(input).not.toHaveAttribute('required');
    expect(input).not.toHaveAttribute('aria-required');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'volume-help volume-error');
    expect(input).toHaveAttribute('aria-errormessage', 'volume-error');
  });

  it('associates FormControl errors when aria-invalid is explicitly true', () => {
    render(
      <FormControl isInvalid>
        <Slider aria-label="Volume" aria-invalid />
        <FormHelperText id="volume-help">Choose a volume.</FormHelperText>
        <FormErrorMessage id="volume-error">Volume is invalid.</FormErrorMessage>
      </FormControl>,
    );

    const input = screen.getByRole('slider');
    expect(input).toHaveAttribute('aria-describedby', 'volume-help volume-error');
    expect(input).toHaveAttribute('aria-errormessage', 'volume-error');
  });

  it('forwards ref to the underlying input element', () => {
    const ref = { current: null };
    render(<Slider ref={ref} aria-label="Volume" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

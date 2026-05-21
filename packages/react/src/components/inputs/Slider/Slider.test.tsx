import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Slider } from './Slider';

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

  it('passes accessibility compliance', async () => {
    const { container } = render(<Slider aria-label="Volume">Volume</Slider>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders the label when children are provided', () => {
    render(<Slider>Level</Slider>);
    expect(screen.getByText('Level')).toBeInTheDocument();
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

  it('forwards ref to the underlying input element', () => {
    const ref = { current: null };
    render(<Slider ref={ref} aria-label="Volume" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

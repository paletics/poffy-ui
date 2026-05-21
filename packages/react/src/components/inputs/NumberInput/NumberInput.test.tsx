import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('renders with default value', () => {
    render(<NumberInput aria-label="Quantity" defaultValue={3} />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveValue(3);
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

  it('calls onChange in controlled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput aria-label="Quantity" value={10} onChange={onChange} step={2} />);

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(onChange).toHaveBeenCalledWith(12);
  });

  it('allows the field to be temporarily cleared while editing', async () => {
    const user = userEvent.setup();
    render(<NumberInput aria-label="Quantity" defaultValue={12} />);

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    await user.clear(input);

    expect(input).toHaveValue(null);
  });

  it('disables steppers when readOnly', () => {
    render(<NumberInput aria-label="Quantity" defaultValue={1} readOnly />);

    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeDisabled();
  });

  it('disables input and steppers when disabled', () => {
    render(<NumberInput aria-label="Quantity" defaultValue={1} disabled />);

    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeDisabled();
  });

  it('forwards ref to the native number input', () => {
    const ref = { current: null };
    render(<NumberInput ref={ref} aria-label="Quantity" defaultValue={1} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute('type', 'number');
  });

  it('has no obvious accessibility violations', async () => {
    const { container } = render(<NumberInput aria-label="Quantity" defaultValue={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

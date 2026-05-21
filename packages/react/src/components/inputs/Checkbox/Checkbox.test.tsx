import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(<Checkbox>Accessible Checkbox</Checkbox>);
    expect(await axe(container)).toHaveNoViolations();
  });
  it('renders correctly', () => {
    render(<Checkbox>Label</Checkbox>);
    expect(screen.getByLabelText('Label')).toBeInTheDocument();
  });

  it('handles switching', async () => {
    const user = userEvent.setup();
    render(<Checkbox>Label</Checkbox>);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('supports indeterminate state', () => {
    render(<Checkbox indeterminate>Label</Checkbox>);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('supports controlled state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Checkbox checked={false} onChange={onChange}>
        Label
      </Checkbox>,
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Checkbox disabled>Label</Checkbox>);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('sets aria-invalid when error prop is passed', () => {
    render(<Checkbox error>Label</Checkbox>);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies group disabled state to child inputs', () => {
    render(
      <Checkbox.Group disabled>
        <Checkbox value="a">Option A</Checkbox>
      </Checkbox.Group>,
    );

    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('preserves the input value for native form integration', () => {
    render(<Checkbox value="terms">Accept terms</Checkbox>);

    expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'terms');
  });

  it('does not duplicate values in checkbox groups', async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const [value, setValue] = useState<string[]>([]);

      return (
        <>
          <Checkbox.Group value={value} onChange={setValue}>
            <Checkbox value="a">Option A</Checkbox>
          </Checkbox.Group>
          <output data-testid="value">{value.join(',')}</output>
        </>
      );
    };

    render(<TestComponent />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    await user.click(checkbox);
    await user.click(checkbox);

    expect(screen.getByTestId('value')).toHaveTextContent('a');
  });
});

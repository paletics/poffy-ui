import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Input } from './Input';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';

/**

 * ### Test Strategy
 * - **Focus**: The Input component must render correctly, handle variants/states, and maintain accessibility standards.
 * - **Design Verification**: Verifies that Silver Ratio based sizing and semantic border tokens are applied correctly.
 */
describe('Atoms / Input', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(<Input aria-label="Test input" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders correctly', () => {
    render(<Input placeholder="test input" />);
    expect(screen.getByPlaceholderText('test input')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('supports disabled state', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('supports error state', () => {
    render(<Input error />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when error is false', () => {
    render(<Input error={false} />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('supports readOnly state', () => {
    render(<Input readOnly value="fixed value" aria-label="read only field" />);
    const el = screen.getByRole('textbox');
    expect(el).toHaveAttribute('readonly');
    expect(el).toHaveValue('fixed value');
  });

  it('renders startElement with wrapper', () => {
    render(<Input aria-label="search" startElement={<span data-testid="start-icon" />} />);
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders endElement with wrapper', () => {
    render(<Input aria-label="date" endElement={<span data-testid="end-icon" />} />);
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('forwards ref with adornments', () => {
    const ref = { current: null };
    render(<Input ref={ref} startElement={<span />} endElement={<span />} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes a11y with adornments', async () => {
    const { container } = render(
      <Input aria-label="search" startElement={<span>🔍</span>} endElement={<span>✕</span>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses FormControl context when explicit input props are omitted', () => {
    render(
      <FormControl id="email" isInvalid isRequired isDisabled>
        <FormLabel>Email</FormLabel>
        <Input />
        <FormHelperText>Use your work email.</FormHelperText>
        <FormErrorMessage>Email is required.</FormErrorMessage>
      </FormControl>,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-helper-text email-error-message');
    expect(input).toHaveAttribute('aria-errormessage', 'email-error-message');
  });
});

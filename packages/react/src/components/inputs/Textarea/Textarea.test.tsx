import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Textarea } from './Textarea';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';

/**
 * ### Test Strategy: Textarea
 * - **Focus**: Correct rendering, variant/state props, `aria-invalid` on error, ref forwarding,
 *   and full WAI-ARIA compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles - use Storybook for visual regression.
 */
describe('Textarea', () => {
  it('renders correctly', () => {
    render(<Textarea id="notes" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(
      <label htmlFor="notes">
        Description
        <Textarea id="notes" placeholder="Enter text" />
      </label>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('sets aria-invalid when error is true', () => {
    render(<Textarea error aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when error is false', () => {
    render(<Textarea error={false} aria-label="Notes" />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('supports disabled state', () => {
    render(<Textarea disabled aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('supports readOnly state', () => {
    render(<Textarea readOnly value="fixed value" aria-label="Notes" />);
    const el = screen.getByRole('textbox');
    expect(el).toHaveAttribute('readonly');
    expect(el).toHaveValue('fixed value');
  });

  it('forwards ref to the underlying textarea element', () => {
    const ref = { current: null };
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('uses FormControl context when explicit textarea props are omitted', () => {
    render(
      <FormControl id="notes" isInvalid isRequired isDisabled>
        <FormLabel>Notes</FormLabel>
        <Textarea />
        <FormHelperText>Add context.</FormHelperText>
        <FormErrorMessage>Notes are required.</FormErrorMessage>
      </FormControl>,
    );

    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea).toHaveAttribute('id', 'notes');
    expect(textarea).toBeDisabled();
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby', 'notes-helper-text notes-error-message');
    expect(textarea).toHaveAttribute('aria-errormessage', 'notes-error-message');
  });
});

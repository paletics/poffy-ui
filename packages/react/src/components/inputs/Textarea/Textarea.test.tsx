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
    const describedBy = textarea.getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(describedBy).toHaveLength(2);
    describedBy.forEach((id) => expect(document.getElementById(id)).toBeInTheDocument());
    expect(textarea).toHaveAttribute('aria-errormessage', describedBy[1]);
  });

  it('allows explicit field props and ARIA references to override FormControl state', () => {
    render(
      <FormControl id="context-notes" isInvalid isRequired isDisabled isReadOnly>
        <FormLabel>Notes</FormLabel>
        <Textarea
          id="explicit-notes"
          error={false}
          disabled={false}
          readOnly={false}
          required={false}
          aria-describedby="custom-help"
          aria-errormessage="custom-error"
        />
        <FormHelperText>Context help.</FormHelperText>
        <FormErrorMessage>Context error.</FormErrorMessage>
      </FormControl>,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('id', 'explicit-notes');
    expect(textarea).not.toBeDisabled();
    expect(textarea).not.toHaveAttribute('readonly');
    expect(textarea).not.toBeRequired();
    expect(textarea).not.toHaveAttribute('aria-invalid');
    expect(textarea).toHaveAttribute('aria-describedby', 'custom-help');
    expect(textarea).toHaveAttribute('aria-errormessage', 'custom-error');
  });

  it('associates FormControl errors when aria-invalid is explicitly true', () => {
    render(
      <FormControl id="notes" isInvalid>
        <FormLabel>Notes</FormLabel>
        <Textarea error={false} aria-invalid />
        <FormErrorMessage>Notes are required.</FormErrorMessage>
      </FormControl>,
    );

    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    const error = screen.getByText('Notes are required.');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-errormessage', error.id);
  });

  it.each(['grammar', 'spelling'] as const)(
    'associates FormControl errors when aria-invalid is %s',
    (ariaInvalid) => {
      render(
        <FormControl id="notes" isInvalid>
          <FormLabel>Notes</FormLabel>
          <Textarea error={false} aria-invalid={ariaInvalid} />
          <FormErrorMessage>Notes need attention.</FormErrorMessage>
        </FormControl>,
      );

      const textarea = screen.getByRole('textbox', { name: 'Notes' });
      expect(textarea).toHaveAttribute('aria-invalid', ariaInvalid);
      expect(textarea).toHaveAttribute(
        'aria-errormessage',
        screen.getByText('Notes need attention.').id,
      );
    },
  );

  it('forwards rows without imposing a fixed height through its size recipe', () => {
    render(<Textarea aria-label="Notes" rows={8} />);

    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveAttribute('rows', '8');
  });
});

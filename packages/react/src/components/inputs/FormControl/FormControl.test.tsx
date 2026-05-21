import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from './index';

/**
 * ### Test Strategy: FormControl
 * - **Focus**: Sub-component rendering, `isInvalid` gating of `FormErrorMessage`, `isRequired`
 *   indicator on `FormLabel`, context-auto-wired `htmlFor` / `id` association, and WAI-ARIA compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 */
describe('FormControl', () => {
  it('renders label and helper text', () => {
    render(
      <FormControl>
        <FormLabel>Email</FormLabel>
        <FormHelperText>We will never share your email.</FormHelperText>
      </FormControl>,
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('We will never share your email.')).toBeInTheDocument();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(
      <FormControl>
        <FormLabel>Email</FormLabel>
        <FormHelperText>We will never share your email.</FormHelperText>
      </FormControl>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders FormErrorMessage when isInvalid is true', () => {
    render(
      <FormControl isInvalid>
        <FormLabel>Password</FormLabel>
        <FormErrorMessage>Password is required.</FormErrorMessage>
      </FormControl>,
    );
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });

  it('does not render FormErrorMessage when isInvalid is false', () => {
    render(
      <FormControl>
        <FormLabel>Password</FormLabel>
        <FormErrorMessage>Password is required.</FormErrorMessage>
      </FormControl>,
    );
    expect(screen.queryByText('Password is required.')).not.toBeInTheDocument();
  });

  it('renders the required indicator (*) when isRequired is true', () => {
    render(
      <FormControl isRequired>
        <FormLabel>Required Field</FormLabel>
      </FormControl>,
    );
    expect(document.querySelector('[aria-hidden="true"]')).toHaveTextContent('*');
  });

  it('auto-wires FormLabel htmlFor to the FormControl id', () => {
    render(
      <FormControl>
        <FormLabel>Name</FormLabel>
      </FormControl>,
    );
    const label = screen.getByText('Name').closest('label');
    expect(label).toHaveAttribute('for');
    expect(label!.getAttribute('for')).toBeTruthy();
  });

  it('FormErrorMessage has aria-live="polite" for dynamic announcements', () => {
    render(
      <FormControl isInvalid>
        <FormErrorMessage>Field is invalid</FormErrorMessage>
      </FormControl>,
    );
    expect(screen.getByText('Field is invalid')).toHaveAttribute('aria-live', 'polite');
  });
});

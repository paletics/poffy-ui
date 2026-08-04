import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from './index';
import { Input } from '../Input';

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

  it('honors an explicit FormLabel isRequired prop', () => {
    render(<FormLabel isRequired>Required Field</FormLabel>);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('preserves an explicit FormLabel id outside a FormControl', () => {
    render(<FormLabel id="email-label">Email</FormLabel>);

    expect(screen.getByText('Email')).toHaveAttribute('id', 'email-label');
  });

  it('falls back to a group wrapper for unsafe asChild hosts', () => {
    render(
      <FormControl asChild>
        <input aria-label="Email" />
      </FormControl>,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input.parentElement).toHaveAttribute('role', 'group');
    expect(input).not.toHaveAttribute('role');
  });

  it('preserves the FormControl-owned label ID', () => {
    render(
      <FormControl id="email">
        <FormLabel id="custom-label">Email</FormLabel>
        <Input />
      </FormControl>,
    );

    expect(screen.getByText('Email')).toHaveAttribute('id', 'email-label');
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email');
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email');
    expect(screen.getByText('Email').closest('label')?.control).toBe(screen.getByRole('textbox'));
  });

  it('renders explicit description and error IDREFs on the server', () => {
    const markup = renderToString(
      <FormControl isInvalid describedByIds="email-help" errorMessageIds="email-error">
        <Input />
        <FormHelperText id="email-help">Use a work email.</FormHelperText>
        <FormErrorMessage id="email-error">Email is required.</FormErrorMessage>
      </FormControl>,
    );

    expect(markup).toContain('aria-describedby="email-help email-error"');
    expect(markup).toContain('aria-errormessage="email-error"');
  });

  it('keeps explicit IDs first and deduplicates registered IDs', () => {
    render(
      <FormControl
        isInvalid
        describedByIds={['external-help', 'shared-help']}
        errorMessageIds={['external-error', 'shared-error']}
      >
        <Input />
        <FormHelperText id="shared-help">Shared help</FormHelperText>
        <FormHelperText id="local-help">Local help</FormHelperText>
        <FormErrorMessage id="shared-error">Shared error</FormErrorMessage>
        <FormErrorMessage id="local-error">Local error</FormErrorMessage>
      </FormControl>,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-describedby',
      'external-help shared-help local-help external-error shared-error local-error',
    );
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-errormessage',
      'external-error shared-error local-error',
    );
  });

  it('removes and replaces message registrations when mounted IDs change', () => {
    const { rerender } = render(
      <FormControl isInvalid>
        <Input />
        <FormHelperText id="first-help">First help</FormHelperText>
        <FormErrorMessage id="first-error">First error</FormErrorMessage>
      </FormControl>,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-describedby',
      'first-help first-error',
    );

    rerender(
      <FormControl isInvalid>
        <Input />
        <FormHelperText id="second-help">Second help</FormHelperText>
        <FormErrorMessage id="second-error">Second error</FormErrorMessage>
      </FormControl>,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-describedby',
      'second-help second-error',
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-errormessage', 'second-error');
  });

  it('removes error registration when the field becomes valid', () => {
    const { rerender } = render(
      <FormControl isInvalid>
        <Input />
        <FormHelperText id="field-help">Field help</FormHelperText>
        <FormErrorMessage id="field-error">Field error</FormErrorMessage>
      </FormControl>,
    );

    rerender(
      <FormControl>
        <Input />
        <FormHelperText id="field-help">Field help</FormHelperText>
        <FormErrorMessage id="field-error">Field error</FormErrorMessage>
      </FormControl>,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'field-help');
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-errormessage');
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

  it('uses aria-labelledby instead of an invalid htmlFor association for composite groups', () => {
    render(
      <FormControl id="delivery" labelTarget="group">
        <FormLabel>Delivery method</FormLabel>
        <div id="delivery" role="group" aria-labelledby="delivery-label" />
      </FormControl>,
    );

    const label = screen.getByText('Delivery method').closest('label');
    expect(label).not.toHaveAttribute('for');
    expect(screen.getByRole('group', { name: 'Delivery method' })).toHaveAttribute(
      'aria-labelledby',
      'delivery-label',
    );
  });

  it('focuses a composite control in the label shadow root', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const mount = document.createElement('div');
    shadowRoot.append(mount);
    document.body.append(host);

    const { unmount } = render(
      <FormControl id="shadow-delivery" labelTarget="group">
        <FormLabel>Delivery method</FormLabel>
        <div id="shadow-delivery" role="group" aria-labelledby="shadow-delivery-label">
          <input aria-label="Delivery choice" />
        </div>
      </FormControl>,
      { container: mount },
    );
    const label = shadowRoot.querySelector('label');
    const input = shadowRoot.querySelector('input');
    if (!label || !input) throw new Error('Expected shadow form controls.');

    fireEvent.click(label);

    expect(shadowRoot.activeElement).toBe(input);
    unmount();
    host.remove();
  });

  it('renders the composite label contract during server rendering', () => {
    const markup = renderToString(
      <FormControl id="delivery" labelTarget="group">
        <FormLabel>Delivery method</FormLabel>
        <div id="delivery" role="group" aria-labelledby="delivery-label" />
      </FormControl>,
    );

    expect(markup).toContain('id="delivery-label"');
    expect(markup).toContain('aria-labelledby="delivery-label"');
    expect(markup).not.toContain('for="delivery"');
  });

  it('preserves an explicit FormLabel htmlFor in composite mode', () => {
    render(
      <FormControl id="delivery" labelTarget="group">
        <FormLabel htmlFor="alternative-control">Delivery method</FormLabel>
      </FormControl>,
    );

    expect(screen.getByText('Delivery method').closest('label')).toHaveAttribute(
      'for',
      'alternative-control',
    );
  });

  it('FormErrorMessage has aria-live="polite" for dynamic announcements', () => {
    render(
      <FormControl isInvalid>
        <FormErrorMessage>Field is invalid</FormErrorMessage>
      </FormControl>,
    );
    expect(screen.getByText('Field is invalid')).toHaveAttribute('aria-live', 'polite');
  });

  it('allows field error announcements to be disabled or made assertive', () => {
    render(
      <FormControl isInvalid>
        <FormErrorMessage live="off">Summary owns this error</FormErrorMessage>
        <FormErrorMessage live="assertive">Payment failed</FormErrorMessage>
      </FormControl>,
    );

    expect(screen.getByText('Summary owns this error')).toHaveAttribute('aria-live', 'off');
    expect(screen.getByText('Payment failed')).toHaveAttribute('aria-live', 'assertive');
  });

  it('owns asChild live priority while preserving an explicit role', () => {
    render(
      <FormControl isInvalid>
        <FormErrorMessage asChild live="off">
          <p role="alert" aria-live="assertive">
            Invalid email
          </p>
        </FormErrorMessage>
      </FormControl>,
    );

    const error = screen.getByText('Invalid email');
    expect(error).toHaveAttribute('role', 'alert');
    expect(error).toHaveAttribute('aria-live', 'off');
  });

  it('falls back when passive message hosts carry interactive attributes', () => {
    const helperClick = vi.fn();
    const errorClick = vi.fn();
    render(
      <FormControl isInvalid>
        <FormHelperText asChild>
          <span
            role="button"
            tabIndex={0}
            onClick={helperClick}
            onKeyDown={() => undefined}
          >
            Unsafe helper
          </span>
        </FormHelperText>
        <FormErrorMessage asChild>
          <span
            role="button"
            tabIndex={0}
            contentEditable
            onClick={errorClick}
            onKeyDown={() => undefined}
          >
            Unsafe error
          </span>
        </FormErrorMessage>
      </FormControl>,
    );

    const helper = screen.getByText('Unsafe helper');
    const error = screen.getByText('Unsafe error');
    expect(helper.tagName).toBe('DIV');
    expect(error.tagName).toBe('DIV');
    expect(helper).not.toHaveAttribute('tabindex');
    expect(error).not.toHaveAttribute('contenteditable');
    fireEvent.click(helper);
    fireEvent.click(error);
    expect(helperClick).not.toHaveBeenCalled();
    expect(errorClick).not.toHaveBeenCalled();
  });

  it('does not let wrapper props make delegated message hosts interactive', () => {
    const onClick = vi.fn();
    render(
      <FormControl isInvalid>
        <FormHelperText asChild role="button" tabIndex={0} onClick={onClick}>
          <span>Wrapper-owned interaction</span>
        </FormHelperText>
      </FormControl>,
    );

    const content = screen.getByText('Wrapper-owned interaction');
    const message = content.parentElement;
    expect(message?.tagName).toBe('DIV');
    expect(message).not.toHaveAttribute('role');
    expect(message).not.toHaveAttribute('tabindex');
    fireEvent.click(content);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('prioritizes an explicit aria-live value over the live shortcut', () => {
    render(
      <FormControl isInvalid>
        <FormErrorMessage live="off" aria-live="assertive">
          Urgent validation error
        </FormErrorMessage>
      </FormControl>,
    );

    expect(screen.getByText('Urgent validation error')).toHaveAttribute('aria-live', 'assertive');
  });

  it('lets an explicit role keep its implicit priority when live is omitted', () => {
    render(
      <FormControl isInvalid>
        <FormErrorMessage role="alert">Invalid payment details</FormErrorMessage>
      </FormControl>,
    );

    expect(screen.getByRole('alert')).not.toHaveAttribute('aria-live');
  });

  it('lets an asChild role keep its implicit priority when live is omitted', () => {
    render(
      <FormControl isInvalid>
        <FormErrorMessage asChild>
          <p role="alert">Invalid account number</p>
        </FormErrorMessage>
      </FormControl>,
    );

    expect(screen.getByRole('alert')).not.toHaveAttribute('aria-live');
  });
});

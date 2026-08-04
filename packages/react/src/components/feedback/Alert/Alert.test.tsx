/**

 * ### Test Strategy
 * - **Focus**: Comprehensive verification for Alert functionality and accessibility.
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Alert, AlertIcon, AlertTitle, AlertDescription, type AlertProps } from '.';
import { LocaleProvider } from '@/providers/LocaleProvider';

describe('Alert', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(
      <Alert status="info">
        <AlertIcon />
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Desc</AlertDescription>
      </Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders correctly', () => {
    render(
      <Alert status="info">
        <AlertIcon />
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Desc</AlertDescription>
      </Alert>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });

  it('renders correct icon for Status', () => {
    render(
      <Alert status="error">
        <AlertIcon />
      </Alert>,
    );
    expect(screen.getByRole('alert').querySelector('svg')).toBeInTheDocument();
  });

  it('renders close button and calls onClose when clicked', () => {
    const onClose = vi.fn();
    render(<Alert status="info" onClose={onClose} />);
    screen.getByRole('button', { name: 'Dismiss alert' }).click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('supports a contextual close button label', () => {
    render(<Alert onClose={vi.fn()} closeLabel="Dismiss deployment notice" />);
    expect(screen.getByRole('button', { name: 'Dismiss deployment notice' })).toBeInTheDocument();
  });

  it('normalizes an empty close label to a descriptive default', () => {
    render(<Alert onClose={vi.fn()} closeLabel="   " />);
    expect(screen.getByRole('button', { name: 'Dismiss alert' })).toBeInTheDocument();
  });

  it('localizes the default close label', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Alert onClose={vi.fn()} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: '通知を閉じる' })).toBeInTheDocument();
  });

  it('uses a polite status region when requested', () => {
    render(<Alert live="polite">Saved</Alert>);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Saved');
    expect(status).not.toHaveAttribute('aria-live');
  });

  it('derives announcement priority from status when live is omitted', () => {
    render(
      <>
        <Alert status="info">Info</Alert>
        <Alert status="success">Success</Alert>
        <Alert status="warning">Warning</Alert>
        <Alert status="error">Error</Alert>
      </>,
    );

    for (const label of ['Info', 'Success', 'Warning']) {
      const status = screen.getByText(label);
      expect(status).toHaveAttribute('role', 'status');
      expect(status).not.toHaveAttribute('aria-live');
    }
    const error = screen.getByText('Error');
    expect(error).toHaveAttribute('role', 'alert');
    expect(error).not.toHaveAttribute('aria-live');
  });

  it('does not forward the internal closable recipe variant', () => {
    render(<Alert {...({ closable: true } as AlertProps & { closable?: boolean })}>Notice</Alert>);
    expect(screen.getByRole('status')).not.toHaveAttribute('closable');
  });

  it('keeps alert icons decorative', () => {
    render(
      <Alert>
        <AlertIcon aria-hidden={false} />
      </Alert>,
    );
    expect(screen.getByRole('status').querySelector('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('keeps focusable custom icon content inert', async () => {
    const { container } = render(
      <Alert>
        <AlertIcon>
          <button type="button">Details</button>
          <a href="/details">More details</a>
        </AlertIcon>
      </Alert>,
    );

    const icon = screen.getByText('Details').parentElement;
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('inert');
    expect(screen.queryByRole('button', { name: 'Details' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'More details' })).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('supports asChild with a close button', () => {
    const onClose = vi.fn();
    render(
      <Alert asChild status="info" onClose={onClose}>
        <section>Custom alert</section>
      </Alert>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Custom alert');
    screen.getByRole('button').click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('applies status-derived announcement semantics to a safe asChild host', () => {
    render(
      <Alert asChild>
        <section role="status" aria-live="polite">
          Custom alert
        </section>
      </Alert>,
    );

    const status = screen.getByRole('status');
    expect(status).not.toHaveAttribute('aria-live');
  });

  it('preserves explicit live priority when an explicit status role conflicts', () => {
    render(
      <Alert live="assertive" role="status">
        Urgent status
      </Alert>,
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');
  });

  it('uses status-derived priority for a custom explicit role', () => {
    render(<Alert role="region">Regional notice</Alert>);
    expect(screen.getByRole('region')).toHaveAttribute('aria-live', 'polite');
  });

  it('preserves requested polite alert semantics for a safe asChild host', () => {
    render(
      <Alert asChild live="polite">
        <section role="alert" aria-live="assertive">
          Saved
        </section>
      </Alert>,
    );

    const alert = screen.getByRole('status');
    expect(alert).not.toHaveAttribute('aria-live');
  });

  it('disables a child live region when live is off', () => {
    render(
      <Alert asChild live="off">
        <section role="status" aria-live="polite">
          Stable content
        </section>
      </Alert>,
    );

    const content = screen.getByText('Stable content');
    expect(content).not.toHaveAttribute('role');
    expect(content).toHaveAttribute('aria-live', 'off');
  });

  it('prioritizes explicit aria-live over the live shortcut', () => {
    render(
      <Alert live="polite" aria-live="assertive">
        Saved
      </Alert>,
    );

    const alert = screen.getByRole('status');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('prioritizes an explicit role for an asChild alert', () => {
    render(
      <Alert asChild live="polite" role="alert">
        <section role="status" aria-live="polite">
          Saved
        </section>
      </Alert>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });

  it('falls back to a div for unsafe asChild hosts', () => {
    render(
      <>
        <Alert asChild data-testid="void-alert" onClose={vi.fn()}>
          <img alt="Notice" />
        </Alert>
        <Alert asChild data-testid="interactive-alert" onClose={vi.fn()}>
          <button>Notice</button>
        </Alert>
      </>,
    );

    expect(screen.getByTestId('void-alert').tagName).toBe('DIV');
    expect(screen.getByTestId('interactive-alert').tagName).toBe('DIV');
    expect(screen.getAllByRole('status')).toHaveLength(2);
  });
});

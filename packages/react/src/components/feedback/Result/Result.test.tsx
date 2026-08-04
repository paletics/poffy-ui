/**

 * ### Test Strategy
 * - **Focus**: Comprehensive verification for Result functionality and accessibility.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Result, ResultIcon, ResultTitle, ResultDescription, ResultActions } from './index';
import { LocaleProvider } from '@/providers/LocaleProvider';

describe('Result Component', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(
      <Result intent="success">
        <ResultTitle>Success</ResultTitle>
        <ResultDescription>Operation completed</ResultDescription>
      </Result>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders title and description', () => {
    render(
      <Result intent="success">
        <ResultTitle>Success</ResultTitle>
        <ResultDescription>Operation completed</ResultDescription>
      </Result>,
    );
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Operation completed')).toBeInTheDocument();
  });

  it('uses semantic asChild hosts and safely falls back from block content', () => {
    render(
      <Result>
        <ResultTitle asChild>
          <h2>Safe title</h2>
        </ResultTitle>
        <ResultDescription asChild>
          <p>Safe description</p>
        </ResultDescription>
        <ResultTitle asChild data-testid="fallback-title">
          <div>Fallback title</div>
        </ResultTitle>
        <ResultDescription data-testid="fallback-description">
          <div>Fallback description</div>
        </ResultDescription>
      </Result>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Safe title' })).toBeInTheDocument();
    expect(screen.getByText('Safe description').tagName).toBe('P');
    expect(screen.getByTestId('fallback-title').querySelector('div')).toBeNull();
    expect(screen.getByTestId('fallback-description').querySelector('div')).toBeNull();
  });

  it('renders icon with children', () => {
    render(
      <Result intent="danger">
        <ResultIcon>
          <svg data-testid="test-icon" />
        </ResultIcon>
        <ResultTitle>Error</ResultTitle>
      </Result>,
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders actions', () => {
    render(
      <Result intent="info">
        <ResultTitle>Info</ResultTitle>
        <ResultActions>
          <button>Action</button>
        </ResultActions>
      </Result>,
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('adds a polite live region when explicitly requested', () => {
    const { container } = render(
      <Result intent="warning" live="polite">
        <ResultTitle>Warning</ResultTitle>
      </Result>,
    );
    const resultElement = container.firstChild as HTMLElement;
    expect(resultElement).toHaveAttribute('role', 'status');
    expect(resultElement).not.toHaveAttribute('aria-live');
  });

  it('uses alert semantics for an assertive live result', () => {
    render(
      <Result live="assertive">
        <ResultTitle>Publish failed</ResultTitle>
      </Result>,
    );

    expect(screen.getByRole('alert')).not.toHaveAttribute('aria-live');
  });

  it('preserves explicit role and aria-live overrides', () => {
    render(
      <Result live="assertive" role="status" aria-live="polite">
        <ResultTitle>Queued</ResultTitle>
      </Result>,
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('does not create a live region for stable page content by default', () => {
    const { container } = render(
      <Result>
        <ResultTitle>Project published</ResultTitle>
      </Result>,
    );
    expect(container.firstElementChild).not.toHaveAttribute('role');
    expect(container.firstElementChild).not.toHaveAttribute('aria-live');
  });

  it('keeps action controls outside live announcements by default', () => {
    render(
      <Result>
        <ResultTitle>Project published</ResultTitle>
        <ResultActions>
          <button>Open project</button>
        </ResultActions>
      </Result>,
    );

    expect(screen.getByRole('button', { name: 'Open project' }).closest('[aria-live="off"]')).toBe(
      screen.getByRole('group', { name: 'Result actions' }),
    );
  });

  it('excludes actions from a requested result live region', () => {
    render(
      <Result live="polite">
        <ResultTitle>Project published</ResultTitle>
        <ResultActions>
          <button>Open project</button>
        </ResultActions>
      </Result>,
    );

    expect(screen.getByRole('button', { name: 'Open project' }).closest('[aria-live="off"]')).toBe(
      screen.getByRole('group', { name: 'Result actions' }),
    );
  });

  it('gives action groups an accessible name', () => {
    render(
      <Result>
        <ResultActions aria-label="Next steps">
          <button>Continue</button>
        </ResultActions>
      </Result>,
    );
    expect(screen.getByRole('group', { name: 'Next steps' })).toBeInTheDocument();
  });

  it('localizes the default action-group name', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <ResultActions>
          <button>続ける</button>
        </ResultActions>
      </LocaleProvider>,
    );

    expect(screen.getByRole('group', { name: '結果の操作' })).toBeInTheDocument();
  });

  it('normalizes empty action labels and falls back from interactive asChild hosts', () => {
    render(
      <Result>
        <ResultActions aria-label=" ">
          <button>Continue</button>
        </ResultActions>
        <ResultActions asChild data-testid="actions-root">
          <button>Unsafe host</button>
        </ResultActions>
      </Result>,
    );
    expect(screen.getAllByRole('group', { name: 'Result actions' })).toHaveLength(2);
    expect(screen.getByTestId('actions-root').tagName).toBe('DIV');
  });

  it('preserves explicit accessible action metadata from a safe asChild host', () => {
    render(
      <Result>
        <ResultActions asChild>
          <div aria-label="Project actions" aria-live="polite">
            <button>Continue</button>
          </div>
        </ResultActions>
      </Result>,
    );

    const actions = screen.getByRole('group', { name: 'Project actions' });
    expect(actions).toHaveAttribute('aria-live', 'polite');
  });

  it('falls back from an empty ResultActions label to safe asChild metadata', () => {
    render(
      <Result>
        <ResultActions asChild aria-label=" ">
          <div aria-label="Project actions" aria-live="polite">
            <button>Continue</button>
          </div>
        </ResultActions>
      </Result>,
    );

    const actions = screen.getByRole('group', { name: 'Project actions' });
    expect(actions).toHaveAttribute('aria-live', 'polite');
  });

  it('prioritizes ResultActions metadata over an asChild host', () => {
    render(
      <Result>
        <ResultActions asChild aria-label="Next steps" aria-live="assertive">
          <div aria-label="Project actions" aria-live="polite">
            <button>Continue</button>
          </div>
        </ResultActions>
      </Result>,
    );

    const actions = screen.getByRole('group', { name: 'Next steps' });
    expect(actions).toHaveAttribute('aria-live', 'assertive');
  });

  it('keeps result icons decorative by default and when meaningful intent has no name', () => {
    render(
      <Result>
        <ResultIcon data-testid="default-icon">default icon</ResultIcon>
        <ResultIcon aria-hidden={false} data-testid="unnamed-icon">
          unnamed icon
        </ResultIcon>
      </Result>,
    );
    expect(screen.getByTestId('default-icon')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('default-icon')).toHaveAttribute('inert');
    expect(screen.getByTestId('unnamed-icon')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('unnamed-icon')).toHaveAttribute('inert');
  });

  it('exposes named icons with an image role when meaningful intent is requested', () => {
    render(
      <Result>
        <ResultIcon aria-hidden="false" aria-label="Retry available">
          retry icon
        </ResultIcon>
      </Result>,
    );

    const icon = screen.getByRole('img', { name: 'Retry available' });
    expect(icon).toHaveAttribute('aria-hidden', 'false');
    expect(icon).not.toHaveAttribute('inert');
  });

  it('accepts string false for named meaningful ResultIcon visibility', () => {
    render(
      <Result>
        <ResultIcon aria-hidden="false" aria-label="Retry available" />
      </Result>,
    );

    expect(screen.getByRole('img', { name: 'Retry available' })).toHaveAttribute(
      'aria-hidden',
      'false',
    );
  });

  it('maps danger intent to the internal error status', () => {
    const { container } = render(<Result intent="danger" />);
    expect(container.firstElementChild).toHaveClass('poffy-result__root--status_error');
  });
});

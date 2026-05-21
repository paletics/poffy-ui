/**

 * ### Test Strategy
 * - **Focus**: Comprehensive verification for Result functionality and accessibility.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Result, ResultIcon, ResultTitle, ResultDescription, ResultActions } from './index';

describe('Result Component', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(
      <Result status="success">
        <ResultTitle>Success</ResultTitle>
        <ResultDescription>Operation completed</ResultDescription>
      </Result>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders title and description', () => {
    render(
      <Result status="success">
        <ResultTitle>Success</ResultTitle>
        <ResultDescription>Operation completed</ResultDescription>
      </Result>,
    );
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Operation completed')).toBeInTheDocument();
  });

  it('renders icon with children', () => {
    render(
      <Result status="error">
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
      <Result status="info">
        <ResultTitle>Info</ResultTitle>
        <ResultActions>
          <button>Action</button>
        </ResultActions>
      </Result>,
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    const { container } = render(
      <Result status="warning">
        <ResultTitle>Warning</ResultTitle>
      </Result>,
    );
    const resultElement = container.firstChild as HTMLElement;
    expect(resultElement).toHaveAttribute('role', 'status');
    expect(resultElement).toHaveAttribute('aria-live', 'polite');
  });
});

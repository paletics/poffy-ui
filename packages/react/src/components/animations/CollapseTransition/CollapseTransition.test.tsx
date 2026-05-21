import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { CollapseTransition } from './CollapseTransition';

describe('CollapseTransition', () => {
  it('renders children when open', () => {
    const { getByText } = render(<CollapseTransition isOpen>Details</CollapseTransition>);
    expect(getByText('Details')).toBeInTheDocument();
  });

  it('does not render children when closed by default', () => {
    const { queryByText } = render(<CollapseTransition isOpen={false}>Details</CollapseTransition>);
    expect(queryByText('Details')).not.toBeInTheDocument();
  });

  it('keeps closed content mounted when keepMounted is true', () => {
    const { container, getByText } = render(
      <CollapseTransition isOpen={false} keepMounted>
        Details
      </CollapseTransition>,
    );
    expect(getByText('Details')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CollapseTransition isOpen>Details</CollapseTransition>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

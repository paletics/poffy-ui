import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { SelectionTransition } from './SelectionTransition';

describe('SelectionTransition', () => {
  it('renders selected children', () => {
    const { getByText } = render(<SelectionTransition isSelected>Selected</SelectionTransition>);
    expect(getByText('Selected')).toBeInTheDocument();
  });

  it('does not render children when unselected by default', () => {
    const { queryByText } = render(
      <SelectionTransition isSelected={false}>Selected</SelectionTransition>,
    );
    expect(queryByText('Selected')).not.toBeInTheDocument();
  });

  it('keeps unselected children mounted when keepMounted is true', () => {
    const { getByText } = render(
      <SelectionTransition isSelected={false} keepMounted>
        Selected
      </SelectionTransition>,
    );
    expect(getByText('Selected')).toBeInTheDocument();
    expect(getByText('Selected')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SelectionTransition isSelected>Selected</SelectionTransition>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

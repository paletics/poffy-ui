import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { AnimationProvider } from '@/providers/AnimationProvider';
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

  it('keeps unselected persistent content isolated when callers provide conflicting ARIA', () => {
    const { getByText } = render(
      <SelectionTransition isSelected={false} keepMounted aria-hidden={false}>
        Selected
      </SelectionTransition>,
    );
    expect(getByText('Selected')).toHaveAttribute('aria-hidden', 'true');
    expect(getByText('Selected')).toHaveAttribute('inert');
  });

  it('hides unselected persistent content when motion is disabled', () => {
    const { getByText } = render(
      <AnimationProvider defaultAnimationEnabled={false}>
        <SelectionTransition isSelected={false} keepMounted>
          Selected
        </SelectionTransition>
      </AnimationProvider>,
    );

    expect(getByText('Selected')).toHaveStyle({ opacity: '0', visibility: 'hidden' });
  });

  it('falls back to a span when asChild does not receive one host element', () => {
    const { getByText } = render(
      <SelectionTransition asChild isSelected>
        Selected
      </SelectionTransition>,
    );

    expect(getByText('Selected').tagName).toBe('SPAN');
  });

  it('keeps an unselected asChild indicator inaccessible when the child conflicts', () => {
    const { getByRole } = render(
      <AnimationProvider defaultAnimationEnabled={false}>
        <SelectionTransition asChild isSelected={false} keepMounted>
          <button aria-hidden={false} inert={false} style={{ pointerEvents: 'auto' }}>
            Selected
          </button>
        </SelectionTransition>
      </AnimationProvider>,
    );

    const indicator = getByRole('button', { hidden: true });
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
    expect(indicator).toHaveAttribute('inert');
    expect(indicator).toHaveStyle({ pointerEvents: 'none', visibility: 'hidden' });
  });

  it('falls back to the default preset for unknown runtime values', () => {
    const { getByText } = render(
      <SelectionTransition isSelected animationType={'unknown' as never}>
        Selected
      </SelectionTransition>,
    );
    expect(getByText('Selected')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SelectionTransition isSelected>Selected</SelectionTransition>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

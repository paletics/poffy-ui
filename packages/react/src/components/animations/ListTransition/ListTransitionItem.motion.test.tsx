import { fireEvent, render, screen } from '@testing-library/react';
import { forwardRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/providers/AnimationProvider', () => ({
  useOptionalAnimation: () => ({ isAnimating: true, resolvedMotionStyle: 'full' }),
}));

vi.mock('../useHydrated', () => ({ useHydrated: () => true }));

vi.mock('../utils', async (importOriginal) => {
  const MotionComponent = forwardRef<
    HTMLLIElement,
    {
      children: ReactNode;
      onAnimationComplete?: (definition: string) => void;
      variants?: unknown;
      [key: string]: unknown;
    }
  >(({ children, onAnimationComplete, variants: _variants, ...props }, ref) => (
    <li ref={ref} {...props}>
      {children}
      <button
        type="button"
        hidden
        data-testid="complete-animation"
        onClick={() => onAnimationComplete?.('enter')}
      />
    </li>
  ));
  MotionComponent.displayName = 'MockMotionComponent';

  return {
    ...(await importOriginal<typeof import('../utils')>()),
    getMotionComponent: () => MotionComponent,
  };
});

import { ListTransitionItem } from './ListTransitionItem';

describe('ListTransition.Item animated accessibility', () => {
  it('keeps entering content interactive and forwards animation completion', () => {
    const onAnimationComplete = vi.fn();
    render(
      <ul>
        <ListTransitionItem onAnimationComplete={onAnimationComplete}>
          <button>Action</button>
        </ListTransitionItem>
      </ul>,
    );

    const item = screen.getByRole('listitem');
    expect(item).not.toHaveAttribute('aria-hidden');
    expect(item).not.toHaveAttribute('inert');
    expect(screen.getByRole('button', { name: 'Action' })).toBeEnabled();

    fireEvent.click(screen.getByTestId('complete-animation'));

    expect(onAnimationComplete).toHaveBeenCalledWith('enter');
  });
});

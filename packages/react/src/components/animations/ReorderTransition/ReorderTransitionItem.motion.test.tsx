import { render, screen } from '@testing-library/react';
import { forwardRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/providers/AnimationProvider', () => ({
  useOptionalAnimation: () => ({ isAnimating: true, resolvedMotionStyle: 'full' }),
}));

vi.mock('../useHydrated', () => ({ useHydrated: () => true }));

vi.mock('../utils', async (importOriginal) => {
  const MotionComponent = forwardRef<
    HTMLDivElement,
    {
      children: ReactNode;
      [key: string]: unknown;
    }
  >(
    (
      {
        animate: _animate,
        children,
        exit: _exit,
        initial: _initial,
        layout: _layout,
        transition: _transition,
        variants: _variants,
        ...props
      },
      ref,
    ) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    ),
  );
  MotionComponent.displayName = 'MockMotionComponent';

  return {
    ...(await importOriginal<typeof import('../utils')>()),
    getMotionComponent: () => MotionComponent,
  };
});

import { ReorderTransitionItem } from './ReorderTransitionItem';

describe('ReorderTransition.Item animated styles', () => {
  it('preserves consumer pointer events while the item is present', () => {
    render(
      <ReorderTransitionItem style={{ color: 'red', pointerEvents: 'none' }}>
        Item
      </ReorderTransitionItem>,
    );

    const item = screen.getByText('Item');
    expect(item.style.color).toBe('red');
    expect(item.style.pointerEvents).toBe('none');
  });
});

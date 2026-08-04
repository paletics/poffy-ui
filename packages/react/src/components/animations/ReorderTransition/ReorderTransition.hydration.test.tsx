import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ReorderTransition } from './ReorderTransition';

vi.mock('../useHydrated', () => ({ useHydrated: () => false }));

describe('ReorderTransition hydration', () => {
  it('disables authored motion on an asChild root before hydration', () => {
    render(
      <ReorderTransition asChild>
        <section
          data-testid="root"
          style={{ animation: 'pulse 1s infinite', scrollBehavior: 'smooth', transition: '1s' }}
        >
          <div>Item</div>
        </section>
      </ReorderTransition>,
    );

    expect(screen.getByTestId('root')).toHaveStyle({
      animation: 'none',
      scrollBehavior: 'auto',
      transition: 'none',
    });
  });

  it('disables authored motion on an asChild item before hydration', () => {
    render(
      <ReorderTransition.Item asChild>
        <div
          data-testid="item"
          style={{ animation: 'pulse 1s infinite', scrollBehavior: 'smooth', transition: '1s' }}
        >
          Item
        </div>
      </ReorderTransition.Item>,
    );

    expect(screen.getByTestId('item')).toHaveStyle({
      animation: 'none',
      scrollBehavior: 'auto',
      transition: 'none',
    });
  });
});

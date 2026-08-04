import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./useHydrated', () => ({ useHydrated: () => true }));

import { useOneShotEntranceVariant } from './useOneShotEntranceVariant';

const Probe = ({
  enabled,
  entranceIdentity = 'default',
  shouldEnter = true,
}: {
  enabled: boolean;
  entranceIdentity?: string;
  shouldEnter?: boolean;
}) => {
  const { ownsEntrance, settleEntrance, target } = useOneShotEntranceVariant({
    enabled,
    enter: '__enter',
    entranceIdentity,
    settled: '__settled',
    shouldEnter,
  });

  return (
    <>
      <output aria-label="Entrance target">{target}</output>
      <output aria-label="Owns entrance">{String(ownsEntrance)}</output>
      <button type="button" onClick={settleEntrance}>
        Complete entrance
      </button>
    </>
  );
};

/**
 * ### Test Strategy: useOneShotEntranceVariant
 * - **Focus**: One entrance per mount and permanent terminal state after policy interruption.
 * - **DON'T**: Assert Motion interpolation or timing; the browser suite owns those contracts.
 */
describe('useOneShotEntranceVariant', () => {
  it('does not replay entrance after animation policy is re-enabled', () => {
    const { rerender } = render(<Probe enabled />);
    expect(screen.getByRole('status', { name: 'Entrance target' })).toHaveTextContent('__enter');

    rerender(<Probe enabled={false} />);
    expect(screen.getByRole('status', { name: 'Entrance target' })).toHaveTextContent('__settled');
    expect(screen.getByRole('status', { name: 'Owns entrance' })).toHaveTextContent('true');

    rerender(<Probe enabled />);
    expect(screen.getByRole('status', { name: 'Entrance target' })).toHaveTextContent('__settled');
  });

  it('stays settled when entrance is disabled for the initial mount', () => {
    const { rerender } = render(<Probe enabled shouldEnter={false} />);
    expect(screen.getByRole('status', { name: 'Entrance target' })).toHaveTextContent('__settled');

    rerender(<Probe enabled shouldEnter />);
    expect(screen.getByRole('status', { name: 'Entrance target' })).toHaveTextContent('__settled');
    expect(screen.getByRole('status', { name: 'Owns entrance' })).toHaveTextContent('false');
  });

  it('settles after natural completion or an entrance preset change', () => {
    const { rerender, unmount } = render(<Probe enabled entranceIdentity="flow" />);
    fireEvent.click(screen.getByRole('button', { name: 'Complete entrance' }));
    expect(screen.getByRole('status', { name: 'Entrance target' })).toHaveTextContent('__settled');

    rerender(<Probe enabled entranceIdentity="burst" />);
    expect(screen.getByRole('status', { name: 'Entrance target' })).toHaveTextContent('__settled');

    unmount();
    const second = render(<Probe enabled entranceIdentity="flow" />);
    second.rerender(<Probe enabled entranceIdentity="burst" />);
    expect(second.getByRole('status', { name: 'Entrance target' })).toHaveTextContent('__settled');
  });
});

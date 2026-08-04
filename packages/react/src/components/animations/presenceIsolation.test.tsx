import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const presenceState = vi.hoisted(() => ({ isPresent: true }));

vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('motion/react')>()),
  useIsPresent: () => presenceState.isPresent,
}));

import { isolatePresenceChild, useExitPresenceIsolation } from './presenceIsolation';

describe('isolatePresenceChild', () => {
  it('returns the original node unless isolation applies to a valid element', () => {
    const child = <button>Action</button>;

    expect(isolatePresenceChild(child, false)).toBe(child);
    expect(isolatePresenceChild('Action', true)).toBe('Action');
  });

  it('forces isolation after child and managed style precedence', () => {
    const child = (
      <button aria-hidden={false} inert={false} style={{ color: 'red', pointerEvents: 'auto' }}>
        Action
      </button>
    );

    const isolated = isolatePresenceChild(child, true, {
      color: 'blue',
      visibility: 'hidden',
      pointerEvents: 'auto',
    });

    expect(isolated).toMatchObject({
      props: {
        'aria-hidden': true,
        inert: true,
        style: { color: 'blue', visibility: 'hidden', pointerEvents: 'none' },
      },
    });
  });
});

describe('useExitPresenceIsolation', () => {
  it('preserves the original child while it is present', () => {
    presenceState.isPresent = true;
    const child = <button style={{ pointerEvents: 'auto' }}>Action</button>;

    const { result } = renderHook(() => useExitPresenceIsolation(child, true));

    expect(result.current.isPresent).toBe(true);
    expect(result.current.renderedChildren).toBe(child);
  });

  it('forces an exiting asChild host to be inaccessible and non-interactive', () => {
    presenceState.isPresent = false;
    const child = (
      <button aria-hidden={false} inert={false} style={{ color: 'red', pointerEvents: 'auto' }}>
        Action
      </button>
    );

    const { result } = renderHook(() => useExitPresenceIsolation(child, true));
    const renderedChild = result.current.renderedChildren;

    expect(renderedChild).not.toBe(child);
    expect(renderedChild).toMatchObject({
      props: {
        'aria-hidden': true,
        inert: true,
        style: { color: 'red', pointerEvents: 'none' },
      },
    });
  });

  it('leaves non-delegated and non-element children unchanged while exiting', () => {
    presenceState.isPresent = false;
    const child = <button>Action</button>;

    const delegated = renderHook(() => useExitPresenceIsolation('Action', true));
    const wrapped = renderHook(() => useExitPresenceIsolation(child, false));

    expect(delegated.result.current.renderedChildren).toBe('Action');
    expect(wrapped.result.current.renderedChildren).toBe(child);
  });
});

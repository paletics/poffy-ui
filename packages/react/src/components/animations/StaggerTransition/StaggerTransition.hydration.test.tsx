import { act } from '@testing-library/react';
import { domMax } from 'motion/react';
import { StrictMode } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AnimationProvider } from '@/providers/AnimationProvider';
import { MotionProvider } from '@/providers/MotionProvider';
import { StaggerTransition } from './StaggerTransition';

const HydrationTree = () => (
  <StrictMode>
    <AnimationProvider global={false}>
      <MotionProvider features={domMax}>
        <StaggerTransition>
          <StaggerTransition.Item asChild>
            <input aria-label="Draft" defaultValue="server" />
          </StaggerTransition.Item>
        </StaggerTransition>
      </MotionProvider>
    </AnimationProvider>
  </StrictMode>
);

/**
 * ### Test Strategy: StaggerTransition hydration
 * - **Focus**: StrictMode hydration preserves node identity, focus, and uncontrolled input state.
 * - **DON'T**: Assert animation frames in jsdom; browser tests cover Motion interpolation.
 */
describe('StaggerTransition hydration', () => {
  it('preserves a focused uncontrolled input without remounting it', async () => {
    const host = document.createElement('div');
    host.innerHTML = renderToString(<HydrationTree />);
    document.body.append(host);
    const beforeHydration = host.querySelector('input');
    expect(beforeHydration).not.toBeNull();
    if (!beforeHydration) return;

    beforeHydration.value = 'edited before hydration';
    beforeHydration.focus();
    const recoverableErrors: unknown[] = [];
    let root: Root | undefined;

    try {
      await act(async () => {
        root = hydrateRoot(host, <HydrationTree />, {
          onRecoverableError: (error) => recoverableErrors.push(error),
        });
      });

      const afterHydration = host.querySelector('input');
      expect(afterHydration).toBe(beforeHydration);
      expect(afterHydration).toHaveValue('edited before hydration');
      expect(document.activeElement).toBe(beforeHydration);
      expect(recoverableErrors).toEqual([]);
    } finally {
      await act(async () => root?.unmount());
      host.remove();
    }
  });
});

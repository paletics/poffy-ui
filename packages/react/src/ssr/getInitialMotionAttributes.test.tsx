import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AnimationProvider } from '@/providers/AnimationProvider';
import { getInitialMotionAttributes } from './getInitialMotionAttributes';

/**
 * ### Test Strategy: getInitialMotionAttributes
 * - **Focus**: Server-safe initial attributes, fallback validation, and parity
 *   with AnimationProvider's SSR state.
 * - **DON'T**: Test client persisted preferences or media-query updates here.
 */
describe('getInitialMotionAttributes', () => {
  it('returns AnimationProvider defaults without reading browser state', () => {
    expect(getInitialMotionAttributes()).toEqual({
      'data-animation': 'enabled',
      'data-motion-style': 'standard',
    });
  });

  it.each([
    [{ defaultAnimationEnabled: false }, 'disabled', 'none'],
    [{ defaultMotionStyle: 'none' }, 'disabled', 'none'],
    [{ defaultMotionStyle: 'subtle' }, 'enabled', 'subtle'],
    [{ defaultMotionStyle: 'pop' }, 'enabled', 'pop'],
  ] as const)('resolves %o', (options, animation, motionStyle) => {
    expect(getInitialMotionAttributes(options)).toEqual({
      'data-animation': animation,
      'data-motion-style': motionStyle,
    });
  });

  it('uses the same invalid-profile fallback as AnimationProvider', () => {
    expect(getInitialMotionAttributes({ defaultMotionStyle: 'unexpected' as never })).toEqual({
      'data-animation': 'enabled',
      'data-motion-style': 'standard',
    });
  });

  it('matches the scoped AnimationProvider attributes during SSR', () => {
    const options = { defaultAnimationEnabled: false, defaultMotionStyle: 'pop' as const };
    const markup = renderToStaticMarkup(
      <AnimationProvider global={false} scope {...options}>
        <span>content</span>
      </AnimationProvider>,
    );

    const attributes = getInitialMotionAttributes(options);
    expect(markup).toContain(`data-animation="${attributes['data-animation']}"`);
    expect(markup).toContain(`data-motion-style="${attributes['data-motion-style']}"`);
  });
});

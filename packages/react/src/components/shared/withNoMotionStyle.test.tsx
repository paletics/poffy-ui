import { describe, expect, it } from 'vitest';
import { withNoMotionStyle } from './withNoMotionStyle';

describe('withNoMotionStyle', () => {
  it('preserves identity when the policy does not apply or the child is not an element', () => {
    const child = <div>Content</div>;

    expect(withNoMotionStyle(child, false)).toBe(child);
    expect(withNoMotionStyle('Content', true)).toBe('Content');
  });

  it('preserves static child styles and owns all no-motion properties', () => {
    const child = (
      <div
        style={{
          color: 'red',
          animation: 'pulse 1s infinite',
          transition: 'opacity 1s',
          scrollBehavior: 'smooth',
        }}
      />
    );

    expect(withNoMotionStyle(child, true)).toMatchObject({
      props: {
        style: {
          color: 'red',
          animation: 'none',
          transition: 'none',
          scrollBehavior: 'auto',
        },
      },
    });
  });

  it('sanitizes a non-object runtime style before applying no-motion properties', () => {
    const child = <div {...({ style: 'unsafe' } as never)} />;

    expect(withNoMotionStyle(child, true)).toMatchObject({
      props: {
        style: { animation: 'none', transition: 'none', scrollBehavior: 'auto' },
      },
    });
  });
});

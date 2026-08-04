import { describe, expect, it } from 'vitest';
import { resolveAccessibleLabel } from './resolveAccessibleLabel';

describe('resolveAccessibleLabel', () => {
  it('prioritizes and trims an explicit labelledby value', () => {
    expect(
      resolveAccessibleLabel({
        ariaLabel: 'Explicit label',
        ariaLabelledBy: '  title-id  ',
        autoLabelledBy: 'generated-title',
        fallbackLabel: 'Fallback',
      }),
    ).toEqual({ ariaLabel: undefined, ariaLabelledBy: 'title-id' });
  });

  it('uses and trims an explicit label before an automatic label reference', () => {
    expect(
      resolveAccessibleLabel({
        ariaLabel: '  Explicit label  ',
        autoLabelledBy: 'generated-title',
      }),
    ).toEqual({ ariaLabel: 'Explicit label', ariaLabelledBy: undefined });
  });

  it('uses an automatic label reference before the fallback', () => {
    expect(
      resolveAccessibleLabel({ autoLabelledBy: 'generated-title', fallbackLabel: 'Fallback' }),
    ).toEqual({ ariaLabel: undefined, ariaLabelledBy: 'generated-title' });
  });

  it('treats whitespace-only explicit values as absent', () => {
    expect(
      resolveAccessibleLabel({
        ariaLabel: ' ',
        ariaLabelledBy: '\n',
        fallbackLabel: 'Fallback',
      }),
    ).toEqual({ ariaLabel: 'Fallback', ariaLabelledBy: undefined });
  });
});

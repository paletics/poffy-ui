import { describe, expect, it } from 'vitest';
import { hasAriaInvalid, resolveFormControlAria } from './formControlAria';

/**
 * ### Test Strategy: resolveFormControlAria
 * - **Focus**: explicit ARIA override precedence and conditional FormControl IDREF resolution.
 * - **DON'T**: Do not test DOM rendering or FormControl registration lifecycle.
 */
describe('resolveFormControlAria', () => {
  it.each([true, 'true', 'grammar', 'spelling'] as const)(
    'recognizes %s as an explicit invalid state',
    (ariaInvalid) => {
      expect(hasAriaInvalid(ariaInvalid)).toBe(true);
    },
  );

  it.each([undefined, false, 'false'] as const)(
    'does not recognize %s as an explicit invalid state',
    (ariaInvalid) => {
      expect(hasAriaInvalid(ariaInvalid)).toBe(false);
    },
  );

  it('uses helper and invalid error IDs when consumer attributes are absent', () => {
    expect(
      resolveFormControlAria({
        helperTextIds: ['email-help'],
        errorMessageIds: ['email-error'],
        isInvalid: true,
      }),
    ).toEqual({ describedBy: 'email-help email-error', errorMessage: 'email-error' });
  });

  it('does not include error IDs for a valid field', () => {
    expect(
      resolveFormControlAria({
        helperTextIds: ['email-help'],
        errorMessageIds: ['email-error'],
        isInvalid: false,
      }),
    ).toEqual({ describedBy: 'email-help', errorMessage: undefined });
  });

  it('preserves explicit ARIA attributes without merging registered IDs', () => {
    expect(
      resolveFormControlAria({
        ariaDescribedBy: '',
        ariaErrorMessage: '',
        helperTextIds: ['email-help'],
        errorMessageIds: ['email-error'],
        isInvalid: true,
      }),
    ).toEqual({ describedBy: '', errorMessage: '' });
  });
});

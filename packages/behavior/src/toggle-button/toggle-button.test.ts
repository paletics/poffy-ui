import { describe, expect, it } from 'vitest';
import { getNextToggleButtonPressed } from './toggle-button';

describe('toggle-button behavior helpers', () => {
  it('toggles the pressed state', () => {
    expect(getNextToggleButtonPressed(true)).toBe(false);
    expect(getNextToggleButtonPressed(false)).toBe(true);
  });
});

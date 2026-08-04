import { describe, expect, it } from 'vitest';
import { actionEntranceLabel, actionSettledLabel } from './ActionMotion/ActionMotion';
import { listContainerVariants, listItemVariants } from './ListTransition/ListTransition.presets';
import {
  staggerContainerVariants,
  staggerItemVariants,
} from './StaggerTransition/StaggerTransition.presets';

const privateKeys = (families: Record<string, Record<string, unknown>>) =>
  new Set(
    Object.values(families).flatMap((variants) =>
      Object.keys(variants).filter((key) => key.startsWith('__poffy')),
    ),
  );

describe('private animation variant isolation', () => {
  it('uses disjoint labels for List, Stagger, and Action families', () => {
    const listKeys = new Set([
      ...privateKeys(listContainerVariants),
      ...privateKeys(listItemVariants),
    ]);
    const staggerKeys = new Set([
      ...privateKeys(staggerContainerVariants),
      ...privateKeys(staggerItemVariants),
    ]);
    const actionKeys = new Set([actionEntranceLabel, actionSettledLabel]);
    const families = [listKeys, staggerKeys, actionKeys];

    families.forEach((keys) => expect(keys.size).toBe(2));
    families.forEach((keys, familyIndex) => {
      families.slice(familyIndex + 1).forEach((otherKeys) => {
        expect([...keys].filter((key) => otherKeys.has(key))).toHaveLength(0);
      });
    });
  });
});

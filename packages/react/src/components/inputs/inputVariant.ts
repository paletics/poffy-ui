import type { InputAppearance } from '@poffy-ui/types';
import type { ConditionalValue } from '@/styled-system/types';

export type InputAppearanceValue = InputAppearance | 'flushed';
export type NeoInputAppearanceValue = InputAppearanceValue | 'neo';
export type InputAppearanceProp = ConditionalValue<InputAppearanceValue>;
export type NeoInputAppearanceProp = ConditionalValue<NeoInputAppearanceValue>;

export type InputRecipeVariant = 'outline' | 'filled' | 'flushed';
type NeoInputRecipeVariant = InputRecipeVariant | 'neo';

const inputAppearanceMap: Record<InputAppearanceValue, InputRecipeVariant> = {
  outline: 'outline',
  soft: 'filled',
  flushed: 'flushed',
};

const neoInputAppearanceMap: Record<NeoInputAppearanceValue, NeoInputRecipeVariant> = {
  ...inputAppearanceMap,
  neo: 'neo',
};

const neoPopupAppearanceMap: Record<NeoInputAppearanceValue, InputRecipeVariant> = {
  ...inputAppearanceMap,
  neo: 'outline',
};

const mapConditionalAppearance = <TSource extends string, TTarget extends string>(
  value: ConditionalValue<TSource>,
  mapping: Record<TSource, TTarget>,
): ConditionalValue<TTarget> => {
  if (Array.isArray(value)) {
    return value.map((entry) =>
      entry === null ? null : mapConditionalAppearance(entry, mapping),
    ) as ConditionalValue<TTarget>;
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([condition, entry]) => [
        condition,
        entry === undefined
          ? undefined
          : mapConditionalAppearance(entry as ConditionalValue<TSource>, mapping),
      ]),
    ) as ConditionalValue<TTarget>;
  }
  return mapping[value] ?? mapping['outline' as TSource]!;
};

/** Maps public input appearances to generated recipe variants at every conditional leaf. */
export const resolveInputVariant = (
  appearance: InputAppearanceProp = 'outline',
): ConditionalValue<InputRecipeVariant> => mapConditionalAppearance(appearance, inputAppearanceMap);

/** Maps public neo-capable appearances to generated recipe variants at every conditional leaf. */
export const resolveNeoInputVariant = (
  appearance: NeoInputAppearanceProp = 'outline',
): ConditionalValue<NeoInputRecipeVariant> =>
  mapConditionalAppearance(appearance, neoInputAppearanceMap);

/** Maps a neo-capable field appearance to the popup's non-neo recipe treatment. */
export const resolveNeoPopupVariant = (
  appearance: NeoInputAppearanceProp = 'outline',
): ConditionalValue<InputRecipeVariant> =>
  mapConditionalAppearance(appearance, neoPopupAppearanceMap);

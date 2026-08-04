import { describe, expect, it } from 'vitest';
import { recipes, slotRecipes } from './recipes';
import { staticCss } from './staticCss';

const axisNames = (recipe: Record<string, unknown>[] | undefined) =>
  recipe?.flatMap((entry) => Object.keys(entry)) ?? [];

const recipeDefinitions = { ...recipes, ...slotRecipes };
const internalOnlyAxes: Partial<Record<keyof typeof recipeDefinitions, readonly string[]>> = {
  timeClock: ['variant'],
  wheelPicker: ['variant'],
};

describe('staticCss recipe coverage', () => {
  it.each([
    ['text', [{ variant: ['*'] }, { weight: ['*'] }, { align: ['*'] }, { transform: ['*'] }]],
    ['heading', [{ level: ['*'] }, { weight: ['*'] }]],
    ['link', [{ variant: ['*'] }, { colorScheme: ['*'] }]],
    ['kbd', [{ size: ['*'] }, { overflow: ['*'] }]],
    ['blockquote', [{ tone: ['*'] }]],
    [
      'badge',
      [
        { intent: ['*'], appearance: ['*'] },
        { size: ['*'] },
        { placement: ['*'] },
        { shape: ['*'] },
      ],
    ],
    ['icon', [{ size: ['*'] }, { variant: ['*'] }, { disabled: ['*'] }]],
    [
      'circleProgress',
      [
        { variant: ['primary', 'secondary', 'info', 'success', 'warning', 'danger'] },
        { appearance: ['*'] },
        { animation: ['*'] },
      ],
    ],
    ['breadcrumbs', [{ size: ['*'] }, { variant: ['*'] }]],
    ['list', [{ variant: ['*'] }]],
    [
      'stepper',
      [{ appearance: ['*'] }, { intent: ['*'] }, { orientation: ['*'] }, { size: ['*'] }],
    ],
    ['listboxSelect', [{ variant: ['*'] }, { size: ['*'] }, { error: ['*'] }]],
    ['radio', [{ size: ['*'] }, { intent: ['*'] }, { error: ['*'] }]],
    ['wheelPicker', [{ size: ['*'] }, { error: ['*'] }]],
    ['tabs', [{ size: ['*'] }, { variant: ['*'] }, { orientation: ['*'] }]],
    ['scrollArea', [{ size: ['*'] }]],
    [
      'table',
      [
        { variant: ['*'] },
        { layout: ['*'] },
        { stickyHeader: ['*'] },
        { headerTone: ['*'] },
        { size: ['*'] },
      ],
    ],
    ['avatarGroup', [{ size: ['*'] }, { spacing: ['*'] }]],
    ['image', [{ sizing: ['*'] }, { fit: ['*'] }, { aspectRatio: ['*'] }, { radius: ['*'] }]],
    ['picture', [{ sizing: ['*'] }, { fit: ['*'] }]],
    ['emptyState', [{ size: ['*'] }, { appearance: ['*'] }, { intent: ['*'] }]],
    ['reference', [{ appearance: ['*'] }, { size: ['*'] }, { overflow: ['*'] }]],
    ['diffViewer', [{ mode: ['*'] }, { size: ['*'] }]],
    ['code', [{ variant: ['*'] }, { colorScheme: ['*'] }]],
    ['numberInput', [{ variant: ['*'] }, { size: ['*'] }, { error: ['*'] }]],
    ['inputGroup', [{ size: ['*'] }]],
    ['timeClock', [{ size: ['*'] }]],
    [
      'navbar',
      [{ appearance: ['*'] }, { sticky: ['*'] }, { narrowLayout: ['*'] }, { justify: ['*'] }],
    ],
    ['tooltip', [{ theme: ['*'] }]],
  ] as const)('registers the audited %s recipe matrix', (recipeName, expectedEntries) => {
    const recipe = staticCss.recipes[recipeName];
    const definition = recipeDefinitions[recipeName];
    const expectedAxes = axisNames(expectedEntries as unknown as Record<string, unknown>[]);
    const expectedDefinitionAxes = [
      ...expectedAxes,
      ...(internalOnlyAxes[recipeName] ?? []),
    ].sort();

    expect(recipe).toEqual(expectedEntries);
    expect(Object.keys(definition.variants ?? {}).sort()).toEqual(expectedDefinitionAxes);
  });

  it('restricts CircleProgress static variants to the public semantic intents', () => {
    const definitionValues = Object.keys(
      recipeDefinitions.circleProgress.variants?.variant ?? {},
    ).sort();

    expect(definitionValues).toEqual(
      [
        'primary',
        'secondary',
        'info',
        'success',
        'warning',
        'danger',
        'light',
        'dark',
        'ghost',
        'outline',
      ].sort(),
    );
    expect(staticCss.recipes.circleProgress[0]).toEqual({
      variant: ['primary', 'secondary', 'info', 'success', 'warning', 'danger'],
    });
  });
});

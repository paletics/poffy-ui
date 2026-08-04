import { describe, expect, it } from 'vitest';
import { filterFloatingFocusGuardAxeResults } from './filterFloatingFocusGuardAxeResults';

describe('filterFloatingFocusGuardAxeResults', () => {
  it('removes only Floating UI sentinel nodes from aria-command-name violations', () => {
    const results = filterFloatingFocusGuardAxeResults({
      violations: [
        {
          id: 'aria-command-name',
          nodes: [
            {
              html: '<span role="button" data-type="inside" data-floating-ui-focus-guard=""></span>',
            },
            { html: '<button></button>' },
            {
              html: '<button><span data-floating-ui-focus-guard=""></span></button>',
            },
            {
              html: '<span role="button" aria-label="data-floating-ui-focus-guard"></span>',
            },
          ],
        },
        {
          id: 'button-name',
          nodes: [{ html: '<button data-floating-ui-focus-guard=""></button>' }],
        },
      ],
    });

    expect(results.violations).toEqual([
      {
        id: 'aria-command-name',
        nodes: [
          { html: '<button></button>' },
          {
            html: '<button><span data-floating-ui-focus-guard=""></span></button>',
          },
          {
            html: '<span role="button" aria-label="data-floating-ui-focus-guard"></span>',
          },
        ],
      },
      {
        id: 'button-name',
        nodes: [{ html: '<button data-floating-ui-focus-guard=""></button>' }],
      },
    ]);
  });

  it('removes an empty aria-command-name violation after all sentinel nodes are filtered', () => {
    const results = filterFloatingFocusGuardAxeResults({
      violations: [
        {
          id: 'aria-command-name',
          nodes: [
            {
              html: '<span data-type="inside" data-floating-ui-focus-guard="" role="button"></span>',
            },
          ],
        },
      ],
    });

    expect(results.violations).toEqual([]);
  });
});

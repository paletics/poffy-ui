import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getSemanticColorVariable, SemanticColorSwatch } from './Theme.stories';

describe('Theme semantic color story', () => {
  it('uses the emitted semantic token CSS variable instead of a dynamic Panda prop', () => {
    expect(getSemanticColorVariable('colors.brand.main')).toBe('var(--poffy-colors-brand-main)');
    expect(getSemanticColorVariable('colors.variants.warning.surface')).toBe(
      'var(--poffy-colors-variants-warning-surface)',
    );
  });

  it('wires the semantic variable directly to the rendered swatch', () => {
    const { container } = render(<SemanticColorSwatch tokenPath="colors.brand.main" />);

    expect(container.querySelector('[data-semantic-token="colors.brand.main"]')).toHaveStyle(
      'background-color: var(--poffy-colors-brand-main)',
    );
  });
});

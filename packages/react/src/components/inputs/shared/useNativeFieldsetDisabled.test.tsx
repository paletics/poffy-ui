import { act, render, screen, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { useNativeFieldsetDisabled } from './useNativeFieldsetDisabled';

const FieldsetDisabledHarness = () => {
  const controlRef = useRef<HTMLButtonElement>(null);
  const isFieldsetDisabled = useNativeFieldsetDisabled(controlRef);

  return (
    <fieldset disabled data-testid="fieldset">
      <legend data-testid="legend">
        Legend
        <button ref={controlRef}>Control</button>
      </legend>
      <output data-testid="disabled-state">{String(isFieldsetDisabled)}</output>
    </fieldset>
  );
};

const MovableControlHarness = () => {
  const controlRef = useRef<HTMLButtonElement>(null);
  const isFieldsetDisabled = useNativeFieldsetDisabled(controlRef);

  return (
    <div data-testid="control-container">
      <button ref={controlRef}>Movable control</button>
      <output data-testid="movable-disabled-state">{String(isFieldsetDisabled)}</output>
    </div>
  );
};

/**
 * ### Test Strategy: useNativeFieldsetDisabled
 * - **Focus**: Native disabled-fieldset participation after control moves and first-legend
 *   topology changes.
 * - **DON'T**: Do not duplicate component-specific interaction or form serialization tests.
 */
describe('useNativeFieldsetDisabled', () => {
  it('tracks a fieldset added around the control and movement between fieldsets', async () => {
    render(<MovableControlHarness />);
    const container = screen.getByTestId('control-container');
    const control = screen.getByRole('button', { name: 'Movable control' });
    const disabledFieldset = document.createElement('fieldset');
    disabledFieldset.disabled = true;
    const enabledFieldset = document.createElement('fieldset');

    act(() => {
      container.prepend(disabledFieldset, enabledFieldset);
      disabledFieldset.append(control);
    });
    await waitFor(() =>
      expect(screen.getByTestId('movable-disabled-state')).toHaveTextContent('true'),
    );

    act(() => enabledFieldset.append(control));
    await waitFor(() =>
      expect(screen.getByTestId('movable-disabled-state')).toHaveTextContent('false'),
    );
  });

  it('tracks control movement into and out of the first legend', async () => {
    render(<FieldsetDisabledHarness />);
    const fieldset = screen.getByTestId('fieldset');
    const legend = screen.getByTestId('legend');
    const control = screen.getByRole('button', { name: 'Control' });

    expect(screen.getByTestId('disabled-state')).toHaveTextContent('false');

    act(() => fieldset.append(control));
    await waitFor(() => expect(screen.getByTestId('disabled-state')).toHaveTextContent('true'));

    act(() => legend.append(control));
    await waitFor(() => expect(screen.getByTestId('disabled-state')).toHaveTextContent('false'));
  });

  it('tracks first-legend insertion and reordering', async () => {
    render(<FieldsetDisabledHarness />);
    const fieldset = screen.getByTestId('fieldset');
    const originalLegend = screen.getByTestId('legend');
    const replacementLegend = document.createElement('legend');
    replacementLegend.textContent = 'Replacement legend';

    act(() => fieldset.prepend(replacementLegend));
    await waitFor(() => expect(screen.getByTestId('disabled-state')).toHaveTextContent('true'));

    act(() => fieldset.prepend(originalLegend));
    await waitFor(() => expect(screen.getByTestId('disabled-state')).toHaveTextContent('false'));
  });
});

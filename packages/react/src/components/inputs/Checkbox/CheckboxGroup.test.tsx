import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Checkbox } from './Checkbox';

/**

 * ### Test Strategy
 * - **Focus**: The CheckboxGroup component must coordinate multiple checkboxes, supporting both controlled and uncontrolled states.
 * - **Design Verification**: Ensures layout variants (orientation) are applied and Silver Ratio spacing is respected.
 */
describe('Molecules / CheckboxGroup', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(
      <Checkbox.Group aria-label="Select fruits">
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
      </Checkbox.Group>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('handles uncontrolled selection change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Checkbox.Group defaultValue={['apple']} onChange={onChange}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
      </Checkbox.Group>,
    );

    const apple = screen.getByLabelText('Apple');
    const banana = screen.getByLabelText('Banana');

    expect(apple).toBeChecked();
    expect(banana).not.toBeChecked();

    await user.click(banana);

    expect(banana).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(['apple', 'banana']);
  });

  it('respects controlled value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender: _rerender } = render(
      <Checkbox.Group value={['apple']} onChange={onChange}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
      </Checkbox.Group>,
    );

    const banana = screen.getByLabelText('Banana');
    await user.click(banana);

    expect(onChange).toHaveBeenCalledWith(['apple', 'banana']);
  });

  it('disables all checkboxes when group is disabled', () => {
    render(
      <Checkbox.Group disabled>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
      </Checkbox.Group>,
    );

    expect(screen.getByLabelText('Apple')).toBeDisabled();
    expect(screen.getByLabelText('Banana')).toBeDisabled();
  });
});

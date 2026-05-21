import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ListboxPopover } from './ListboxPopover';
import { ListboxPopoverAnchor } from './ListboxPopoverAnchor';
import { ListboxPopoverContent } from './ListboxPopoverContent';

/**
 * ### Test Strategy: ListboxPopover
 * - **Focus**: Manual popover behavior for listbox/select surfaces, anchor rendering,
 *   listbox role delegation, and accessibility via axe.
 * - **DON'T**: Do not test Floating UI placement math or visual positioning in jsdom.
 */
describe('ListboxPopover', () => {
  it('renders controlled listbox content without trigger interaction bindings', () => {
    const onOpenChange = vi.fn();

    render(
      <ListboxPopover open onOpenChange={onOpenChange}>
        <ListboxPopoverAnchor>
          <button type="button">Choose value</button>
        </ListboxPopoverAnchor>
        <ListboxPopoverContent aria-label="Choices">
          <div role="option" aria-selected="true">
            First
          </div>
        </ListboxPopoverContent>
      </ListboxPopover>,
    );

    expect(screen.getByRole('listbox', { name: 'Choices' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('supports asChild anchor rendering', () => {
    render(
      <ListboxPopover open>
        <ListboxPopoverAnchor asChild>
          <button type="button">Trigger</button>
        </ListboxPopoverAnchor>
        <ListboxPopoverContent aria-label="Options" />
      </ListboxPopover>,
    );

    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute('data-state', 'open');
  });

  it('has no accessibility violations when open', async () => {
    render(
      <ListboxPopover open>
        <ListboxPopoverAnchor>
          <button type="button">Choose value</button>
        </ListboxPopoverAnchor>
        <ListboxPopoverContent aria-label="Choices">
          <div role="option" aria-selected="true">
            First
          </div>
        </ListboxPopoverContent>
      </ListboxPopover>,
    );

    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});

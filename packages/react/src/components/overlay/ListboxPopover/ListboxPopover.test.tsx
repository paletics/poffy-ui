import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
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
    expect(screen.getByRole('listbox', { name: 'Choices' })).toHaveAttribute(
      'data-surface',
      'none',
    );
    expect(screen.getByRole('option', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('supports asChild anchor rendering', () => {
    const anchorRef = createRef<HTMLElement>();
    const contentRef = createRef<HTMLElement>();
    render(
      <ListboxPopover open onOpenChange={() => undefined}>
        <ListboxPopoverAnchor asChild ref={anchorRef}>
          <button type="button">Trigger</button>
        </ListboxPopoverAnchor>
        <ListboxPopoverContent asChild ref={contentRef} aria-label="Options">
          <section />
        </ListboxPopoverContent>
      </ListboxPopover>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    const listbox = screen.getByRole('listbox', { name: 'Options' });
    expect(trigger).toHaveAttribute('data-state', 'open');
    expect(anchorRef.current).toBe(trigger);
    expect(contentRef.current).toBe(listbox);
    expect(listbox.tagName).toBe('SECTION');
  });

  it('uses a void asChild anchor as the positioning reference', () => {
    const anchorRef = createRef<HTMLElement>();
    render(
      <ListboxPopover open onOpenChange={() => undefined}>
        <ListboxPopoverAnchor asChild ref={anchorRef}>
          <input aria-label="Search choices" />
        </ListboxPopoverAnchor>
        <ListboxPopoverContent aria-label="Options" />
      </ListboxPopover>,
    );

    const anchor = screen.getByRole('textbox', { name: 'Search choices' });
    expect(anchorRef.current).toBe(anchor);
    expect(anchor).toHaveAttribute('data-state', 'open');
  });

  it('falls back to a div anchor for an invalid asChild host', () => {
    render(
      <ListboxPopover open onOpenChange={() => undefined}>
        <ListboxPopoverAnchor asChild data-testid="anchor">
          <>
            <button type="button">Trigger</button>
          </>
        </ListboxPopoverAnchor>
        <ListboxPopoverContent aria-label="Options" />
      </ListboxPopover>,
    );

    expect(screen.getByTestId('anchor').tagName).toBe('DIV');
    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
  });

  it('preserves its listbox preset against runtime prop conflicts', () => {
    render(
      <ListboxPopover
        {...({ floatingRole: 'dialog', showArrow: true } as never)}
        open
        onOpenChange={() => undefined}
      >
        <ListboxPopoverAnchor>
          <button type="button">Choose value</button>
        </ListboxPopoverAnchor>
        <ListboxPopoverContent
          aria-label="Choices"
          {...({
            focusGuards: true,
            focusManagement: true,
            returnFocus: true,
            role: 'dialog',
          } as never)}
        >
          <div role="option" aria-selected="false">
            First
          </div>
        </ListboxPopoverContent>
      </ListboxPopover>,
    );

    expect(screen.getByRole('listbox', { name: 'Choices' })).toBeInTheDocument();
    expect(document.querySelector('[data-floating-ui-focus-guard]')).not.toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: 'Choose value' });
    trigger.focus();
    expect(trigger).toHaveFocus();
  });

  it('has no accessibility violations when open', async () => {
    render(
      <ListboxPopover open onOpenChange={() => undefined}>
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

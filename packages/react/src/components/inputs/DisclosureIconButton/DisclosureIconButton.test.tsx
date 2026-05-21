import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DisclosureIconButton } from './DisclosureIconButton';

describe('DisclosureIconButton', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<DisclosureIconButton open={false} aria-label="Toggle" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('applies aria-expanded based on open state', () => {
    const { rerender } = render(<DisclosureIconButton open={false} aria-label="Toggle" />);
    expect(screen.getByRole('button', { name: 'Toggle' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    rerender(<DisclosureIconButton open aria-label="Toggle" />);
    expect(screen.getByRole('button', { name: 'Toggle' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onOpenChange with toggled state on click', () => {
    const onOpenChange = vi.fn();
    render(<DisclosureIconButton open={false} onOpenChange={onOpenChange} aria-label="Toggle" />);

    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', () => {
    const onOpenChange = vi.fn();
    render(
      <DisclosureIconButton
        open={false}
        onOpenChange={onOpenChange}
        aria-label="Toggle"
        disabled
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('blocks asChild default actions when disabled', () => {
    const onClick = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <DisclosureIconButton
        asChild
        open={false}
        onClick={onClick}
        onOpenChange={onOpenChange}
        aria-label="Toggle"
        disabled
      >
        <a href="/filters">Toggle</a>
      </DisclosureIconButton>,
    );

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    screen.getByRole('link', { name: 'Toggle' }).dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

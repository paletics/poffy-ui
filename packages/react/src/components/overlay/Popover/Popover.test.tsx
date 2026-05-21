import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from './index';

/**
 * ### Test Strategy: Popover
 * - **Focus**: Conditional rendering, positioning, interactions (click to open, Escape to close), and WAI-ARIA compliance.
 * - **DON'T**: Do not test CSS animation or visual styles directly in unit tests.
 */
describe('Popover', () => {
  it('opens on click', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('data-brand', 'blue');
    expect(screen.getByRole('dialog')).toHaveAttribute('data-theme', 'light');
  });

  it('closes on Escape key press', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('closes when PopoverClose is clicked', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
          <PopoverClose aria-label="Close" />
        </PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover open={false} onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Open'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('does not auto-toggle when triggerMode is manual', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover open={false} onOpenChange={onOpenChange} triggerMode="manual">
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('links dialog to title and description via aria attributes', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Title Text</PopoverTitle>
          <PopoverDescription>Description Text</PopoverDescription>
        </PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));
    const dialog = screen.getByRole('dialog');
    const titleId = screen.getByText('Title Text').getAttribute('id');
    const descriptionId = screen.getByText('Description Text').getAttribute('id');
    expect(dialog).toHaveAttribute('aria-labelledby', titleId);
    expect(dialog).toHaveAttribute('aria-describedby', descriptionId);
  });

  it('has no accessibility violations when open', async () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Details</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});

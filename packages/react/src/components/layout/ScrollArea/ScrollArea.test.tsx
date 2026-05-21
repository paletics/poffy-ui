import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('renders children inside the viewport', () => {
    render(
      <ScrollArea style={{ height: '100px' }}>
        <p>Scrollable content</p>
      </ScrollArea>,
    );
    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });

  it('renders a vertical scrollbar by default', () => {
    render(
      <ScrollArea style={{ height: '100px' }}>
        <p>content</p>
      </ScrollArea>,
    );
    const scrollbars = screen.getAllByRole('scrollbar');
    expect(scrollbars).toHaveLength(1);
    expect(scrollbars[0]).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders a horizontal scrollbar when orientation is horizontal', () => {
    render(
      <ScrollArea orientation="horizontal" style={{ height: '100px' }}>
        <p>content</p>
      </ScrollArea>,
    );
    const scrollbars = screen.getAllByRole('scrollbar');
    expect(scrollbars).toHaveLength(1);
    expect(scrollbars[0]).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders both scrollbars when orientation is both', () => {
    render(
      <ScrollArea orientation="both" style={{ height: '100px' }}>
        <p>content</p>
      </ScrollArea>,
    );
    const scrollbars = screen.getAllByRole('scrollbar');
    expect(scrollbars).toHaveLength(2);
    const orientations = scrollbars.map((el) => el.getAttribute('aria-orientation'));
    expect(orientations).toContain('vertical');
    expect(orientations).toContain('horizontal');
  });

  it('forwards className to the root element', () => {
    const { container } = render(
      <ScrollArea className="custom-class" style={{ height: '100px' }}>
        <p>content</p>
      </ScrollArea>,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('passes accessibility checks', async () => {
    const { container } = render(
      <ScrollArea style={{ height: '200px' }} aria-label="Scrollable region">
        <p>Accessible scrollable content</p>
      </ScrollArea>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

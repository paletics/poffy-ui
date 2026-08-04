import { render, screen } from '@testing-library/react';
import { createRef, type CSSProperties } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { SimpleGrid } from './SimpleGrid';

describe('SimpleGrid Component', () => {
  it('renders children correctly', () => {
    render(<SimpleGrid>Content</SimpleGrid>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders as a div by default', () => {
    const { container } = render(<SimpleGrid>Content</SimpleGrid>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('applies simple-grid class', () => {
    const { container } = render(<SimpleGrid>Content</SimpleGrid>);
    expect(container.firstChild).toHaveClass('poffy-simple-grid');
  });

  it('handles minChildWidth via style', () => {
    const { container } = render(<SimpleGrid minChildWidth={200}>Content</SimpleGrid>);
    const style = container.firstChild as HTMLElement;
    expect(style.style.getPropertyValue('--min-child-width')).toBe('200px');
  });

  it.each([
    [0.5, '0.5px'],
    [' 12rem ', '12rem'],
    ['calc(100% / 3)', 'calc(100% / 3)'],
  ] as const)('normalizes minChildWidth %p to %p', (minChildWidth, expected) => {
    const { container } = render(<SimpleGrid minChildWidth={minChildWidth}>Content</SimpleGrid>);

    expect((container.firstChild as HTMLElement).style.getPropertyValue('--min-child-width')).toBe(
      expected,
    );
  });

  it.each([
    0,
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    '',
    '   ',
    'red',
    'auto',
    '1fr',
    '0',
    '-1px',
  ] as const)('falls back to columns when minChildWidth %p is invalid', (minChildWidth) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container } = render(
      <SimpleGrid columns={3} minChildWidth={minChildWidth}>
        Content
      </SimpleGrid>,
    );
    const grid = container.firstChild as HTMLElement;

    expect(grid.style.getPropertyValue('--min-child-width')).toBe('');
    expect(grid.style.getPropertyValue('--grid-columns')).toBe('repeat(3, minmax(0, 1fr))');
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it('keeps layout CSS variables controlled by its props', () => {
    const { container } = render(
      <SimpleGrid columns={2} style={{ '--grid-columns': 'repeat(4, 1fr)' } as CSSProperties}>
        Content
      </SimpleGrid>,
    );

    expect((container.firstChild as HTMLElement).style.getPropertyValue('--grid-columns')).toBe(
      'repeat(2, minmax(0, 1fr))',
    );
  });

  it('supports fixed column counts beyond recipe variants through the grid CSS variable', () => {
    const { container } = render(<SimpleGrid columns={13}>Content</SimpleGrid>);
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--grid-columns')).toBe(
      'repeat(13, minmax(0, 1fr))',
    );
  });

  it('ignores non-integer column counts', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container } = render(<SimpleGrid columns={2.5}>Content</SimpleGrid>);

    expect((container.firstChild as HTMLElement).style.getPropertyValue('--grid-columns')).toBe('');
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it('gives minChildWidth precedence over fixed columns', () => {
    const { container } = render(
      <SimpleGrid columns={4} minChildWidth="200px">
        Content
      </SimpleGrid>,
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid.style.getPropertyValue('--min-child-width')).toBe('200px');
    expect(grid.style.getPropertyValue('--grid-columns')).toBe('');
  });

  it('falls back to a div when asChild receives text', () => {
    const { container } = render(<SimpleGrid asChild>Text content</SimpleGrid>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('preserves a semantic list as an asChild grid host', () => {
    const ref = createRef<HTMLElement>();
    render(
      <SimpleGrid asChild ref={ref}>
        <ul>
          <li>First</li>
        </ul>
      </SimpleGrid>,
    );

    const list = screen.getByRole('list');
    expect(ref.current).toBe(list);
    expect(list).toHaveClass('poffy-simple-grid');
  });

  it('falls back to a div instead of applying grid container props to a void asChild host', () => {
    const { container } = render(
      <SimpleGrid asChild aria-label="Image grid">
        <img alt="Grid artwork" />
      </SimpleGrid>,
    );

    const root = screen.getByRole('generic', { name: 'Image grid' });
    expect(root).toBe(container.firstChild);
    expect(root.tagName).toBe('DIV');
    expect(root.querySelector('img')).toBe(screen.getByRole('img', { name: 'Grid artwork' }));
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<SimpleGrid>Content</SimpleGrid>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

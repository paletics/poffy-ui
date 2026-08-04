import { render, screen } from '@testing-library/react';
import { createRef, type CSSProperties } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Grid } from './Grid';
import { gridRecipe } from './Grid.recipe';

describe('Grid Component', () => {
  it('renders children correctly', () => {
    render(<Grid>Content</Grid>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders as a default "div" element', () => {
    const { container } = render(<Grid>Content</Grid>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('renders as a specified element ("section") via "as" prop', () => {
    const { container } = render(
      <Grid asChild>
        <section>Content</section>
      </Grid>,
    );
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });

  it('applies grid class from recipe', () => {
    const { container } = render(<Grid>Content</Grid>);
    expect(container.firstChild).toHaveClass(/grid/);
  });

  it('applies columns style', () => {
    const { container } = render(<Grid columns={3}>Content</Grid>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue('--grid-columns')).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('ignores invalid and unreasonably large column counts', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container, rerender } = render(<Grid columns={0}>Content</Grid>);
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--grid-columns')).toBe('');

    rerender(<Grid columns={1001}>Content</Grid>);
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--grid-columns')).toBe('');
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });

  it('normalizes numeric minChildWidth to CSS pixels', () => {
    const { container } = render(<Grid minChildWidth={200}>Content</Grid>);
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--grid-columns')).toBe(
      'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
    );
  });

  it('preserves CSS length-percentage min child widths', () => {
    const { container } = render(<Grid minChildWidth=" 12rem ">Content</Grid>);
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--grid-columns')).toBe(
      'repeat(auto-fit, minmax(min(100%, 12rem), 1fr))',
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
      <Grid columns={3} minChildWidth={minChildWidth}>
        Content
      </Grid>,
    );

    expect((container.firstChild as HTMLElement).style.getPropertyValue('--grid-columns')).toBe(
      'repeat(3, minmax(0, 1fr))',
    );
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it('keeps ratio precedence without validating an ignored minChildWidth', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container } = render(
      <Grid ratio="silver-start" columns={3} minChildWidth={Number.NaN}>
        Content
      </Grid>,
    );

    expect(container.firstChild).toHaveClass(/ratio_silver-start/);
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--grid-columns')).toBe('');
    expect(warn).toHaveBeenCalledOnce();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('takes precedence'));
    warn.mockRestore();
  });

  it('falls back to a div when asChild receives a fragment', () => {
    const { container } = render(
      <Grid asChild>
        <>
          <span>First</span>
          <span>Second</span>
        </>
      </Grid>,
    );
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('preserves a void asChild host inside the fallback grid container', () => {
    const { container } = render(
      <Grid asChild aria-label="Image grid">
        <img alt="Grid artwork" />
      </Grid>,
    );

    const root = screen.getByRole('generic', { name: 'Image grid' });
    expect(root).toBe(container.firstChild);
    expect(root.tagName).toBe('DIV');
    expect(root.querySelector('img')).toBe(screen.getByRole('img', { name: 'Grid artwork' }));
  });

  it('resets the column custom property so an unconfigured nested grid cannot inherit it', () => {
    render(
      <div style={{ '--grid-columns': 'repeat(3, 1fr)' } as CSSProperties}>
        <Grid aria-label="Nested grid">Content</Grid>
      </div>,
    );

    expect(
      screen.getByRole('generic', { name: 'Nested grid' }).style.getPropertyValue('--grid-columns'),
    ).toBe('');
    expect(gridRecipe.base).toMatchObject({ '--grid-columns': 'initial' });
  });

  it('applies gap variant class', () => {
    const { container } = render(<Grid gap="md">Content</Grid>);
    expect(container.firstChild).toHaveClass(/gap_md/);
  });

  it('applies ratio variant class', () => {
    const { container } = render(<Grid ratio="silver-left">Content</Grid>);
    expect(container.firstChild).toHaveClass(/ratio_silver-left/);
  });

  it.each(['silver-start', 'silver-end', 'golden-start', 'golden-end'] as const)(
    'applies logical ratio variant %s',
    (ratio) => {
      const { container } = render(<Grid ratio={ratio}>Content</Grid>);
      expect(container.firstChild).toHaveClass(new RegExp(`ratio_${ratio}`));
    },
  );

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Grid ref={ref}>Content</Grid>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<Grid>Content</Grid>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

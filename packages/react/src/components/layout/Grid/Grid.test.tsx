import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Grid } from './Grid';

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
    expect(el.style.getPropertyValue('--grid-columns')).toBe('repeat(3, 1fr)');
  });

  it('applies gap variant class', () => {
    const { container } = render(<Grid gap="md">Content</Grid>);
    expect(container.firstChild).toHaveClass(/gap_md/);
  });

  it('applies ratio variant class', () => {
    const { container } = render(<Grid ratio="silver-left">Content</Grid>);
    expect(container.firstChild).toHaveClass(/ratio_silver-left/);
  });

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

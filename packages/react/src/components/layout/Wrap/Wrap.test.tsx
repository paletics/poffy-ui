import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Wrap } from './Wrap';

describe('Wrap Component', () => {
  it('renders children correctly', () => {
    render(<Wrap>Content</Wrap>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('passes Flex class', () => {
    const { container } = render(<Wrap>Content</Wrap>);
    expect(container.firstChild).toHaveClass(/flex/);
  });

  it('keeps wrapping enabled when conflicting runtime props are provided', () => {
    const { container } = render(<Wrap {...({ wrap: 'nowrap' } as never)}>Content</Wrap>);

    expect(container.firstChild).toHaveClass('poffy-flex--wrap_wrap');
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<Wrap>Content</Wrap>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

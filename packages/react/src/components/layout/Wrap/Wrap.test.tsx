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

  it('passes accessibility checks', async () => {
    const { container } = render(<Wrap>Content</Wrap>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

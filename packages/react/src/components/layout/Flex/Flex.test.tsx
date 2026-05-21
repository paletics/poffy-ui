import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Flex } from './Flex';

describe('Flex Component', () => {
  it('renders children correctly', () => {
    render(<Flex>Content</Flex>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders as a div by default', () => {
    const { container } = render(<Flex>Content</Flex>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('renders as a custom element when "as" prop is provided', () => {
    const { container } = render(
      <Flex asChild>
        <section>Content</section>
      </Flex>,
    );
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });

  it('applies flex class', () => {
    const { container } = render(<Flex>Content</Flex>);
    expect(container.firstChild).toHaveClass(/flex/);
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<Flex>Content</Flex>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

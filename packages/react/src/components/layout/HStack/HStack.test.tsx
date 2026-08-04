import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { createRef } from 'react';
import { HStack } from './HStack';

describe('HStack Component', () => {
  it('renders children correctly', () => {
    render(<HStack>Content</HStack>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<HStack>Content</HStack>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes Stack class', () => {
    const { container } = render(<HStack>Content</HStack>);
    expect(container.firstChild).toHaveClass('poffy-stack');
  });

  it('forwards an asChild ref to the delegated host', () => {
    const ref = createRef<HTMLElement>();
    render(
      <HStack asChild ref={ref}>
        <nav>Navigation</nav>
      </HStack>,
    );
    expect(ref.current?.tagName).toBe('NAV');
  });

  it('keeps the horizontal direction when a conflicting direction is supplied', () => {
    const legacyProps = { direction: 'column' } as unknown as Parameters<typeof HStack>[0];
    const { container } = render(<HStack {...legacyProps}>Content</HStack>);
    expect(container.firstChild).toHaveClass('poffy-stack--direction_row');
  });
});

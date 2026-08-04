import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { createRef } from 'react';
import { VStack } from './VStack';

describe('VStack Component', () => {
  it('renders children correctly', () => {
    render(<VStack>Content</VStack>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<VStack>Content</VStack>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes Stack class', () => {
    const { container } = render(<VStack>Content</VStack>);
    expect(container.firstChild).toHaveClass('poffy-stack');
  });

  it('forwards an asChild ref to the delegated host', () => {
    const ref = createRef<HTMLElement>();
    render(
      <VStack asChild ref={ref}>
        <main>Content</main>
      </VStack>,
    );
    expect(ref.current?.tagName).toBe('MAIN');
  });

  it('keeps the vertical direction when a conflicting direction is supplied', () => {
    const legacyProps = { direction: 'row' } as unknown as Parameters<typeof VStack>[0];
    const { container } = render(<VStack {...legacyProps}>Content</VStack>);
    expect(container.firstChild).toHaveClass('poffy-stack--direction_column');
  });
});

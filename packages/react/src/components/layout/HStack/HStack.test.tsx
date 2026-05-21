import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
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
});

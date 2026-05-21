import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
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
});

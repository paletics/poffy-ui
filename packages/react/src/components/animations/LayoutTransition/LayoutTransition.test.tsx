import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { LayoutTransition } from './LayoutTransition';

describe('LayoutTransition', () => {
  it('renders children correctly', () => {
    render(<LayoutTransition>Layout Content</LayoutTransition>);
    expect(screen.getByText('Layout Content')).toBeInTheDocument();
  });

  it('renders as a custom element', () => {
    render(
      <LayoutTransition asChild>
        <section>Section Content</section>
      </LayoutTransition>,
    );
    const element = screen.getByText('Section Content');
    expect(element.tagName).toBe('SECTION');
  });

  it('applies custom className', () => {
    render(<LayoutTransition className="custom-layout">Content</LayoutTransition>);
    const element = screen.getByText('Content');
    expect(element).toHaveClass('custom-layout');
  });

  it('handles animationType and customData without type errors', () => {
    render(
      <LayoutTransition animationType="elastic" customData={{ stiffness: 500 }}>
        Elastic Content
      </LayoutTransition>,
    );
    expect(screen.getByText('Elastic Content')).toBeInTheDocument();
  });

  it('passes layout props correctly', () => {
    render(
      <LayoutTransition layout="position" layoutId="test-id" data-testid="layout-box">
        Test
      </LayoutTransition>,
    );
    const element = screen.getByTestId('layout-box');
    expect(element).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<LayoutTransition>Accessible Layout</LayoutTransition>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

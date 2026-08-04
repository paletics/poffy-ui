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

  it('falls back to a div for invalid asChild children', () => {
    const { container } = render(
      <LayoutTransition asChild>
        <>Fragment content</>
      </LayoutTransition>,
    );

    expect(container.firstElementChild).toBeInstanceOf(HTMLDivElement);
    expect(container).toHaveTextContent('Fragment content');
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

  it('falls back to the default preset for unknown runtime values', () => {
    render(
      <LayoutTransition animationType={'unknown' as never}>Fallback Content</LayoutTransition>,
    );
    expect(screen.getByText('Fallback Content')).toBeInTheDocument();
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

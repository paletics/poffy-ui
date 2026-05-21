/**

 * ### Test Strategy
 * - **Focus**: Comprehensive verification for Icon functionality and accessibility.
 */

import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Icon } from './Icon';

describe('Icon Component', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(
      <Icon aria-hidden={false} role="img" aria-label="Info">
        <path d="M12 16v-4M12 8h.01" />
      </Icon>,
    );
    expect(screen.getByRole('img', { name: 'Info' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('injects aria-hidden and focusable by default', () => {
    const { container } = render(
      <Icon>
        <path d="M0 0h24v24H0z" />
      </Icon>,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('does not inject aria-hidden when using asChild', () => {
    render(
      <Icon asChild>
        <span data-testid="child">Custom</span>
      </Icon>,
    );
    const child = screen.getByTestId('child');
    expect(child).not.toHaveAttribute('aria-hidden');
    expect(child).not.toHaveAttribute('focusable');
  });

  it('renders svg by default', () => {
    const { container } = render(
      <Icon>
        <path d="M0 0h24v24H0z" />
      </Icon>,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <Icon data-testid="icon">
        <circle cx="12" cy="12" r="10" data-testid="child" />
      </Icon>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies size variant class', () => {
    const { container } = render(
      <Icon size="lg">
        <path d="M0 0h24v24H0z" />
      </Icon>,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('poffy-icon--size_lg');
  });

  it('applies disabled variant class', () => {
    const { container } = render(
      <Icon disabled>
        <path d="M0 0h24v24H0z" />
      </Icon>,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('poffy-icon--disabled_true');
  });

  it('forwards ref to the svg element', () => {
    const ref = createRef<SVGSVGElement>();
    render(
      <Icon ref={ref}>
        <path d="" />
      </Icon>,
    );
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it('supports asChild pattern', () => {
    render(
      <Icon asChild>
        <span data-testid="custom-child">Custom</span>
      </Icon>,
    );
    const child = screen.getByTestId('custom-child');
    expect(child).toBeInTheDocument();
    expect(child.tagName).toBe('SPAN');
    expect(child).toHaveClass('poffy-icon');
  });

  it('applies filled variant class', () => {
    const { container } = render(
      <Icon variant="filled">
        <path d="M18.06.259 7.218 11.102z" />
      </Icon>,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('poffy-icon--variant_filled');
  });

  it('passes extra props to the root element', () => {
    render(
      <Icon data-testid="icon-wrapper" aria-label="Minimize">
        <path d="" />
      </Icon>,
    );
    const wrapper = screen.getByTestId('icon-wrapper');
    expect(wrapper).toHaveAttribute('aria-label', 'Minimize');
  });
});

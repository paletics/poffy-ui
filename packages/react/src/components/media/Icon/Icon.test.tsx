/**

 * ### Test Strategy
 * - **Focus**: Comprehensive verification for Icon functionality and accessibility.
 */

import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Icon } from './Icon';
import { StarIcon } from './icons';

describe('Icon Component', () => {
  it('exposes a labelled default SVG as an image', async () => {
    const { container } = render(
      <Icon aria-label="Info">
        <path d="M12 16v-4M12 8h.01" />
      </Icon>,
    );
    const icon = screen.getByRole('img', { name: 'Info' });
    expect(icon).toHaveAttribute('role', 'img');
    expect(icon).not.toHaveAttribute('aria-hidden');
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

  it('treats empty accessible names as decorative', () => {
    const { container } = render(
      <Icon aria-label=" ">
        <path d="M0 0h24v24H0z" />
      </Icon>,
    );

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('rejects native non-SVG asChild hosts', () => {
    expect(() =>
      render(
        <Icon asChild>
          <span>Custom</span>
        </Icon>,
      ),
    ).toThrow(
      '[Icon] `asChild` requires a native SVG or a custom component that renders an SVG host.',
    );
  });

  it('rejects native anchor elements whose tag name also exists in SVG', () => {
    expect(() =>
      render(
        <Icon asChild>
          <a href="/destination">Destination</a>
        </Icon>,
      ),
    ).toThrow(
      '[Icon] `asChild` requires a native SVG or a custom component that renders an SVG host.',
    );
  });

  it('keeps named icons semantic when they have an accessible label', async () => {
    const { container } = render(<StarIcon role="img" aria-label="Favorite" />);

    const icon = screen.getByRole('img', { name: 'Favorite' });
    expect(icon).not.toHaveAttribute('aria-hidden');
    expect(await axe(container)).toHaveNoViolations();
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

  it('keeps native SVG definition elements inside the default SVG host', () => {
    const { container } = render(
      <Icon asChild>
        <defs data-testid="definitions" />
      </Icon>,
    );

    expect(container.querySelector('svg > defs')).toBe(screen.getByTestId('definitions'));
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

  it('keeps a named icon as an SVG when it is slotted into Icon', () => {
    render(
      <Icon asChild size="lg">
        <StarIcon role="img" aria-label="Favorite" />
      </Icon>,
    );

    const icon = screen.getByRole('img', { name: 'Favorite' });
    expect(icon.tagName).toBe('svg');
    expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
    expect(icon).toHaveClass('poffy-icon--size_lg');
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

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { ActionMotion } from './ActionMotion';

vi.mock('../utils', async () => {
  const React = await import('react');
  return {
    getMotionComponent: (Component: React.ElementType) => {
      const MotionComponent = React.forwardRef<HTMLElement, Record<string, unknown>>(
        (
          {
            children,
            initial,
            animate,
            whileHover,
            whileFocus,
            whileTap,
            transition,
            custom,
            ...props
          },
          ref,
        ) =>
          React.createElement(
            Component,
            {
              ...props,
              ref,
              'data-has-initial': initial === undefined ? undefined : 'true',
              'data-has-animate': animate === undefined ? undefined : 'true',
              'data-has-while-hover': whileHover === undefined ? undefined : 'true',
              'data-has-while-focus': whileFocus === undefined ? undefined : 'true',
              'data-has-while-tap': whileTap === undefined ? undefined : 'true',
              'data-has-transition': transition === undefined ? undefined : 'true',
              'data-has-custom': custom === undefined ? undefined : 'true',
            },
            children,
          ),
      );
      MotionComponent.displayName = 'MockMotionComponent';
      return MotionComponent;
    },
  };
});

describe('ActionMotion', () => {
  it('renders children correctly', () => {
    render(<ActionMotion>Test Content</ActionMotion>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders as a custom element', () => {
    render(
      <ActionMotion asChild>
        <button>Button</button>
      </ActionMotion>,
    );
    const element = screen.getByText('Button');
    expect(element.tagName).toBe('BUTTON');
  });

  it('applies className correctly', () => {
    render(<ActionMotion className="test-class">Content</ActionMotion>);
    const element = screen.getByText('Content');
    expect(element).toHaveClass('test-class');
  });

  it('passes extra props to the element', () => {
    render(<ActionMotion data-testid="test-element">Content</ActionMotion>);
    expect(screen.getByTestId('test-element')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(
      <ActionMotion disabled data-testid="disabled-element">
        Disabled
      </ActionMotion>,
    );
    const element = screen.getByTestId('disabled-element');
    expect(element).toBeInTheDocument();
  });

  it('suppresses motion preset props when disabled', () => {
    render(
      <ActionMotion disabled data-testid="disabled-element">
        Disabled
      </ActionMotion>,
    );
    const element = screen.getByTestId('disabled-element');
    expect(element).not.toHaveAttribute('data-has-while-hover');
    expect(element).not.toHaveAttribute('data-has-while-focus');
    expect(element).not.toHaveAttribute('data-has-while-tap');
    expect(element).not.toHaveAttribute('data-has-transition');
  });

  it('does not forward disabled to an asChild anchor', () => {
    render(
      <ActionMotion asChild disabled>
        <a href="/test">Disabled Link</a>
      </ActionMotion>,
    );
    expect(screen.getByRole('link', { name: 'Disabled Link' })).not.toHaveAttribute('disabled');
  });

  it('suppresses motion preset props when animationType is none or false', () => {
    const { rerender } = render(
      <ActionMotion animationType="none" data-testid="none-motion">
        No Motion
      </ActionMotion>,
    );
    expect(screen.getByTestId('none-motion')).not.toHaveAttribute('data-has-while-hover');

    rerender(
      <ActionMotion animationType={false} data-testid="none-motion">
        No Motion
      </ActionMotion>,
    );
    expect(screen.getByTestId('none-motion')).not.toHaveAttribute('data-has-while-hover');
  });

  it('applies the default press preset when enabled', () => {
    render(<ActionMotion data-testid="motion-element">Motion</ActionMotion>);
    expect(screen.getByTestId('motion-element')).toHaveAttribute('data-has-while-hover', 'true');
    expect(screen.getByTestId('motion-element')).toHaveAttribute('data-has-while-tap', 'true');
  });

  it('renders correctly with "physical" animation type', () => {
    render(<ActionMotion animationType="physical">Physical</ActionMotion>);
    expect(screen.getByText('Physical')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<ActionMotion>Accessible Action</ActionMotion>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

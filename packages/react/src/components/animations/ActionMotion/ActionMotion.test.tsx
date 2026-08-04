import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRef, type ComponentProps } from 'react';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { ActionMotion } from './ActionMotion';

const animationState = vi.hoisted(() => ({
  isAnimating: true,
  resolvedMotionStyle: 'standard' as 'standard' | 'subtle',
}));

vi.mock('@/providers/AnimationProvider', () => ({
  useOptionalAnimation: () => animationState,
}));

vi.mock('../utils', async () => {
  const React = await import('react');
  return {
    resolvePresetKey: <T extends Record<string, unknown>, K extends keyof T & string>(
      presets: T,
      value: unknown,
      fallback: K,
    ): K => (typeof value === 'string' && Object.hasOwn(presets, value) ? (value as K) : fallback),
    getCustomValue: (custom: Record<string, unknown> | undefined, key: string, fallback: unknown) =>
      custom?.[key] ?? fallback,
    getMotionComponent: (Component: React.ElementType) => {
      const MotionComponent = React.forwardRef<HTMLElement, Record<string, unknown>>(
        (
          {
            children,
            initial,
            animate,
            onAnimationComplete,
            whileHover,
            whileFocus,
            whileTap,
            transition,
            custom,
            variants,
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
              'data-has-variants': variants === undefined ? undefined : 'true',
              'data-animate-value': typeof animate === 'string' ? animate : undefined,
              'data-transition-type': transition === undefined ? undefined : typeof transition,
              'data-variant-keys':
                typeof variants === 'object' && variants !== null
                  ? Object.keys(variants).join(',')
                  : undefined,
              onDoubleClick: () => {
                if (typeof onAnimationComplete === 'function') onAnimationComplete(animate);
              },
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
  beforeEach(() => {
    animationState.isAnimating = true;
    animationState.resolvedMotionStyle = 'standard';
  });

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

  it('forwards an asChild ref to the delegated button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ActionMotion asChild ref={ref}>
        <button type="button">Ref button</button>
      </ActionMotion>,
    );

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Ref button' }));
  });

  it('falls back to a div for invalid asChild children', () => {
    const { container } = render(
      <ActionMotion asChild>
        <>Fragment content</>
      </ActionMotion>,
    );

    expect(container.firstElementChild).toBeInstanceOf(HTMLDivElement);
    expect(container).toHaveTextContent('Fragment content');
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

  it('strips untyped caller motion drivers before forwarding props', () => {
    const unsafeProps = {
      animate: { opacity: 1 },
      transition: { duration: 1 },
      whileHover: { scale: 1.2 },
      layout: true,
    } as unknown as ComponentProps<typeof ActionMotion>;

    render(
      <ActionMotion disabled data-testid="unsafe-motion" {...unsafeProps}>
        Static
      </ActionMotion>,
    );

    const element = screen.getByTestId('unsafe-motion');
    expect(element).not.toHaveAttribute('data-has-animate');
    expect(element).not.toHaveAttribute('data-has-transition');
    expect(element).not.toHaveAttribute('data-has-while-hover');
  });

  it('stops the decorative pulse preset in the subtle profile', () => {
    animationState.resolvedMotionStyle = 'subtle';
    render(
      <ActionMotion animationType="pulse" data-testid="pulse-motion">
        Pulse
      </ActionMotion>,
    );

    expect(screen.getByTestId('pulse-motion')).toHaveAttribute(
      'data-animate-value',
      '__poffyActionSettled',
    );
    expect(screen.getByTestId('pulse-motion')).not.toHaveAttribute('data-has-transition');
  });

  it('applies the default press preset when enabled', () => {
    render(<ActionMotion data-testid="motion-element">Motion</ActionMotion>);
    const element = screen.getByTestId('motion-element');
    expect(element).toHaveAttribute('data-has-while-hover', 'true');
    expect(element).toHaveAttribute('data-has-while-tap', 'true');
    expect(element).toHaveAttribute('data-transition-type', 'object');
    expect(element).not.toHaveAttribute('data-variant-keys', 'enter,visible');
  });

  it('exposes an entrance label for stagger orchestration', async () => {
    render(
      <ActionMotion
        animationType="stagger"
        customData={{ staggerChildren: 0.05 }}
        data-testid="stagger-motion"
      >
        Stagger
      </ActionMotion>,
    );

    const element = screen.getByTestId('stagger-motion');
    expect(element).toHaveAttribute('data-has-variants', 'true');
    expect(element).toHaveAttribute('data-variant-keys', '__poffyActionEnter,__poffyActionSettled');
    await waitFor(() =>
      expect(element).toHaveAttribute('data-animate-value', '__poffyActionEnter'),
    );
  });

  it('keeps dispatching the settled entrance label after orchestration is removed', async () => {
    const { rerender } = render(
      <ActionMotion animationType="stagger" data-testid="dynamic-stagger">
        Stagger
      </ActionMotion>,
    );

    const element = screen.getByTestId('dynamic-stagger');
    await waitFor(() =>
      expect(element).toHaveAttribute('data-animate-value', '__poffyActionEnter'),
    );

    rerender(
      <ActionMotion animationType={false} data-testid="dynamic-stagger">
        Stagger
      </ActionMotion>,
    );
    expect(element).toHaveAttribute('data-has-variants', 'true');
    expect(element).toHaveAttribute('data-animate-value', '__poffyActionSettled');
  });

  it('preserves consumer completion callbacks without exposing internal settlement', async () => {
    const onAnimationComplete = vi.fn();
    render(
      <ActionMotion
        animationType="stagger"
        data-testid="completion-motion"
        onAnimationComplete={onAnimationComplete}
      >
        Stagger
      </ActionMotion>,
    );

    const element = screen.getByTestId('completion-motion');
    await waitFor(() =>
      expect(element).toHaveAttribute('data-animate-value', '__poffyActionEnter'),
    );
    fireEvent.doubleClick(element);
    expect(onAnimationComplete).toHaveBeenCalledOnce();
    expect(onAnimationComplete).toHaveBeenLastCalledWith('__poffyActionEnter');

    await waitFor(() =>
      expect(element).toHaveAttribute('data-animate-value', '__poffyActionSettled'),
    );
    fireEvent.doubleClick(element);
    expect(onAnimationComplete).toHaveBeenCalledOnce();
  });

  it('falls back to press for an invalid runtime animation type', () => {
    render(
      <ActionMotion animationType={'unknown' as never} data-testid="fallback-motion">
        Motion
      </ActionMotion>,
    );

    expect(screen.getByTestId('fallback-motion')).toHaveAttribute('data-has-while-hover', 'true');
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

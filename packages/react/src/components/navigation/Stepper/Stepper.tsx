'use client';

import { css, cx } from '@/styled-system/css';
import { stepper } from '@/styled-system/recipes';
import { flattenFragmentChildren } from '@/components/shared/flattenFragmentChildren';
import { forwardRef, isValidElement, type ReactElement, useEffect, useMemo } from 'react';
import type { StepperRootProps } from './Stepper.types';
import { Step } from './Step';
import { StepContext, StepperContext } from './StepperContext';
import { StepperSeparator } from './StepperSeparator';
import { StepperAuxiliary } from './StepperAuxiliary';

const stepperContainerClass = css({
  containerType: 'inline-size',
  containerName: 'stepper',
  inlineSize: 'full',
  minInlineSize: '[0]',
  maxInlineSize: 'full',
  containIntrinsicInlineSize: 'min({sizes.xl}, 100vw)',
});

const stepperLayoutClass = css({
  minInlineSize: '[max-content]',
  '@container stepper (max-width: 30rem)': {
    inlineSize: 'full',
    minInlineSize: '[0]',
  },
});

/**
 * Presents progress through a sequential workflow. It provides each Step with index and state; use
 * Tabs for peer views instead of sequential workflow progress.
 *
 * Direct children may be Step, StepperSeparator, or StepperAuxiliary; other elements are ignored.
 * `activeStep` is normalized to the available zero-based step range.
 */
export const Stepper = forwardRef<HTMLDivElement, StepperRootProps>((props, ref) => {
  const {
    children,
    activeStep = 0,
    completed = false,
    onStepChange,
    appearance,
    intent,
    orientation = 'horizontal',
    size,
    linear,
    separatorMode = 'auto',
    className,
    ...rest
  } = props;

  const normalizedOrientation: 'horizontal' | 'vertical' =
    orientation === 'vertical' ? 'vertical' : 'horizontal';
  const componentChildren = flattenFragmentChildren(children).filter(
    (child): child is ReactElement => isValidElement(child),
  );
  const isStepChild = (child: ReactElement) => child.type === Step;
  const steps = componentChildren.filter(isStepChild);
  const unsupportedChildCount = componentChildren.filter(
    (child) =>
      child.type !== Step && child.type !== StepperSeparator && child.type !== StepperAuxiliary,
  ).length;
  const hasExplicitSeparators = componentChildren.some((child) => child.type === StepperSeparator);
  const suppressAutomaticSeparators = [separatorMode === 'manual', hasExplicitSeparators].some(
    Boolean,
  );
  const resolvedActiveStep =
    steps.length === 0
      ? 0
      : Math.min(
          Math.max(0, Number.isNaN(activeStep) ? 0 : Math.trunc(activeStep)),
          steps.length - 1,
        );
  const classes = useMemo(
    () => stepper({ appearance, intent, orientation: normalizedOrientation, size }),
    [appearance, intent, normalizedOrientation, size],
  );

  useEffect(() => {
    if (unsupportedChildCount === 0) return;
    const nodeEnv = (
      globalThis as typeof globalThis & { process?: { env?: { NODE_ENV?: string } } }
    ).process?.env?.NODE_ENV;
    if (nodeEnv === 'production') return;
    console.warn(
      '[Stepper] Unsupported children were ignored. Use Step, StepperSeparator, or StepperAuxiliary directly.',
    );
  }, [unsupportedChildCount]);

  const contextValue = useMemo(
    () => ({
      activeStep: resolvedActiveStep,
      isComplete: completed,
      classes,
      orientation: normalizedOrientation,
      linear,
      suppressAutomaticSeparators,
      onStepChange,
    }),
    [
      resolvedActiveStep,
      completed,
      classes,
      normalizedOrientation,
      linear,
      suppressAutomaticSeparators,
      onStepChange,
    ],
  );
  return (
    <StepperContext.Provider value={contextValue}>
      <div
        ref={ref}
        {...rest}
        role="group"
        className={cx(stepperContainerClass, classes.root, className)}
        data-orientation={normalizedOrientation}
        data-state={completed ? 'completed' : undefined}
        data-completed={completed ? '' : undefined}
      >
        <div className={cx(classes.root, stepperLayoutClass)} data-stepper-layout>
          {componentChildren.map((child, componentIndex) => {
            if (child.type === StepperSeparator) {
              const previousChild = componentChildren[componentIndex - 1];
              const isVerticalManualConnector =
                normalizedOrientation === 'vertical' &&
                suppressAutomaticSeparators &&
                previousChild !== undefined &&
                isStepChild(previousChild);
              return isVerticalManualConnector ? null : child;
            }
            if (child.type === StepperAuxiliary) return child;
            if (!isStepChild(child)) return null;

            const index = componentChildren.slice(0, componentIndex).filter(isStepChild).length;
            const isLast = index === steps.length - 1;
            const nextChild = componentChildren[componentIndex + 1];
            const manualSeparator =
              !isLast &&
              normalizedOrientation === 'vertical' &&
              suppressAutomaticSeparators &&
              nextChild?.type === StepperSeparator
                ? nextChild
                : undefined;
            return (
              <StepContext.Provider
                key={child.key ?? componentIndex}
                value={{ index, isLast, manualSeparator }}
              >
                {child}
              </StepContext.Provider>
            );
          })}
        </div>
      </div>
    </StepperContext.Provider>
  );
});

Stepper.displayName = 'Stepper.Root';

'use client';

import { ActionMotion } from '@/components/animations/ActionMotion';
import { CollapseTransition, IconSwapTransition } from '@/components/animations';
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';
import { PressablePrimitive } from '@/components/inputs/PressablePrimitive';
import { getCommonMessages } from '@/components/shared/common.locales';
import { cx } from '@/styled-system/css';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { cloneElement, forwardRef, type ReactElement, useCallback } from 'react';
import { CheckOutlineIcon } from '@/components/media/Icon/icons';
import type { StepItemProps } from './Stepper.types';
import { useStep, useStepper } from './StepperContext';

/**
 * Renders one sequential Stepper item. Use only within Stepper so it receives index and current-step
 * state; include a concise visible title, and reserve children for vertical-step details.
 */
export const Step = forwardRef<HTMLDivElement, StepItemProps>((props, ref) => {
  const { children, className, title, description, completed: propCompleted, ...rest } = props;
  const {
    activeStep,
    isComplete,
    classes,
    orientation,
    onStepChange,
    linear,
    suppressAutomaticSeparators,
  } = useStepper();
  const { index, isLast, manualSeparator } = useStep();

  const isCompleted = [
    isComplete,
    propCompleted === true,
    propCompleted === undefined && index < activeStep,
  ].some(Boolean);
  const isActive = !isComplete && index === activeStep;
  const isClickable =
    Boolean(onStepChange) &&
    !isComplete &&
    !isActive &&
    [!linear, isCompleted, index === activeStep + 1].some(Boolean);
  const messages = getCommonMessages(useOptionalLocale()?.locale);
  const hasTitle = Boolean(title?.trim());
  const accessibleTitle = hasTitle ? title : messages.step(index + 1);
  const resolvedAriaLabel = !hasTitle
    ? isCompleted
      ? `${accessibleTitle}, ${messages.completed}`
      : accessibleTitle
    : undefined;

  const handleClick = useCallback(() => {
    if (onStepChange && isClickable) {
      onStepChange(index);
    }
  }, [onStepChange, isClickable, index]);

  return (
    <div
      ref={ref}
      className={cx(classes.item, className)}
      {...rest}
      data-state={isActive ? 'active' : isCompleted ? 'completed' : 'inactive'}
      data-completed={isCompleted ? '' : undefined}
    >
      <ActionMotion
        asChild
        animationType="subtle"
        customData={{ hoverScale: 1.005, focusScale: 1, tapScale: 0.985 }}
        disabled={!isClickable}
      >
        <PressablePrimitive
          className={classes.trigger}
          onClick={handleClick}
          disabled={!isClickable}
          aria-current={isActive ? 'step' : undefined}
          aria-label={resolvedAriaLabel}
        >
          <div
            className={classes.indicator}
            data-state={isCompleted ? 'completed' : isActive ? 'active' : 'inactive'}
          >
            <IconSwapTransition
              className={classes.indicatorContent}
              transitionKey={isCompleted ? 'completed' : `step-${index}`}
              animationType="fade"
            >
              {isCompleted ? <CheckOutlineIcon /> : index + 1}
            </IconSwapTransition>
          </div>
          {isCompleted && <VisuallyHidden>{messages.completed}</VisuallyHidden>}
          <div className={classes.body}>
            <div className={classes.title}>{accessibleTitle}</div>
            {description && <div className={classes.description}>{description}</div>}
          </div>
        </PressablePrimitive>
      </ActionMotion>
      {!isLast && !suppressAutomaticSeparators && (
        <div
          className={classes.separator}
          data-state={isCompleted ? 'completed' : 'inactive'}
          aria-hidden="true"
        />
      )}
      {manualSeparator &&
        cloneElement(manualSeparator as ReactElement<Record<string, unknown>>, {
          'data-stepper-separator-placement': 'in-step',
        })}

      {orientation === 'vertical' && children && (
        <CollapseTransition isOpen={isActive} className={classes.content}>
          <div>{children}</div>
        </CollapseTransition>
      )}
    </div>
  );
});

Step.displayName = 'Stepper.Step';

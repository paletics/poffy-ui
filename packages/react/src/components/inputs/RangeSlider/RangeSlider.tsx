'use client';

import {
  getClosestRangeSliderThumb,
  getRangeSliderKeyboardAction,
  getRangeSliderPercent,
  getRangeSliderThumbBounds,
} from '@poffy-ui/behavior';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { useRangeSliderState } from '@poffy-ui/behavior/range-slider/react';
import type { RangeSliderThumb } from '@poffy-ui/behavior';
import { forwardRef, useEffect, useId, useMemo, useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { useOptionalDirection } from '@/providers/DirectionProvider';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { cx } from '@/styled-system/css';
import { rangeSlider } from '@/styled-system/recipes';
import { useFormControl } from '../FormControl/useFormControl';
import { hasAriaInvalid, resolveFormControlAria } from '../FormControl/formControlAria';
import { RangeSliderHiddenInputs } from './RangeSliderHiddenInputs';
import { RangeSliderTrack } from './RangeSliderTrack';
import type { RangeSliderProps } from './RangeSlider.types';
import { getRangeSliderPointerValue } from './RangeSlider.utils';
import { getRangeSliderLabels } from './RangeSlider.locales';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';
import {
  useFormControlBridge,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';

/**
 * Two-thumb slider for selecting a bounded numeric interval.
 *
 * The lower and upper values are normalized against bounds, step, and their minimum separation.
 * `onValueChange` reports accepted movement; `onValueCommit` fires when pointer/keyboard
 * interaction finishes or a thumb loses focus. Each thumb is an independently labelled ARIA
 * slider, and optional names emit hidden lower/upper form inputs. Disabled and read-only states
 * block pointer and keyboard movement; controlled callers must reflect `onValueChange`.
 */
export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      id,
      size,
      intent,
      error,
      className,
      children,
      value,
      defaultValue,
      onValueChange,
      onValueCommit,
      min = 0,
      max = 100,
      step = 1,
      pageStep,
      minStepsBetweenThumbs = 0,
      name,
      form,
      lowerName,
      upperName,
      locale: localeProp,
      labels,
      lowerAriaLabel,
      upperAriaLabel,
      getAriaValueText,
      disabled,
      readOnly,
      dir: dirProp,
      'aria-describedby': ariaDescribedBy,
      'aria-errormessage': ariaErrorMessage,
      'aria-invalid': ariaInvalid,
      'aria-labelledby': ariaLabelledBy,
      role: _role,
      'aria-disabled': _ariaDisabled,
      'aria-readonly': _ariaReadOnly,
      ...props
    },
    ref,
  ) => {
    const resolvedOnValueChange = typeof onValueChange === 'function' ? onValueChange : undefined;
    useWarnInvalidControllableState({
      componentName: 'RangeSlider',
      value,
      defaultValue,
      handler: onValueChange,
    });
    const formControl = useFormControl();
    const directionContext = useOptionalDirection();
    const localeContext = useOptionalLocale();
    const direction = dirProp === 'ltr' || dirProp === 'rtl' ? dirProp : directionContext?.dir;
    const isRtl = direction === 'rtl';
    const localizedLabels = getRangeSliderLabels(localeProp ?? localeContext?.locale, labels);
    const resolvedLowerAriaLabel = lowerAriaLabel ?? localizedLabels.lower;
    const resolvedUpperAriaLabel = upperAriaLabel ?? localizedLabels.upper;
    const generatedId = useId();
    const rootId = id ?? formControl.id ?? generatedId;
    const isDisabled = Boolean(disabled ?? formControl.isDisabled);
    const formBridge = useFormControlBridge({ disabled: isDisabled, form });
    const rootRef = useRef<HTMLDivElement | null>(null);
    const mergedRef = useMergeRefs(rootRef, ref);
    const labelId = children ? `${rootId}-label` : undefined;
    const trackRef = useRef<HTMLDivElement | null>(null);
    const lowerThumbRef = useRef<HTMLButtonElement | null>(null);
    const upperThumbRef = useRef<HTMLButtonElement | null>(null);
    const safeMin = Number.isFinite(min) ? min : 0;
    const safeMax = Number.isFinite(max) ? max : 100;
    const resolvedMin = Math.min(safeMin, safeMax);
    const resolvedMax = Math.max(safeMin, safeMax);
    const options = useMemo(
      () => ({ min: resolvedMin, max: resolvedMax, step, pageStep, minStepsBetweenThumbs }),
      [minStepsBetweenThumbs, pageStep, resolvedMax, resolvedMin, step],
    );
    const isInteractionDisabled = formBridge.effectivelyDisabled;
    const isReadOnly = Boolean(readOnly ?? formControl.isReadOnly);
    const {
      applyKeyboardAction,
      cancelInteraction,
      commitInteraction,
      moveThumb,
      reset,
      value: currentValue,
    } = useRangeSliderState({
      value,
      defaultValue,
      ...options,
      interactionBlocked: [isInteractionDisabled, isReadOnly].some(Boolean),
      isInteractionBlockedNow: () =>
        [formBridge.isEffectivelyDisabledNow(), isReadOnly].some(Boolean),
      onValueChange: resolvedOnValueChange,
      onValueCommit,
    });
    const isInvalid = error ?? formControl.isInvalid;
    const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
    const shouldAssociateErrorMessage = [isInvalid, hasExplicitInvalid].some(Boolean);
    const { describedBy, errorMessage } = resolveFormControlAria({
      ariaDescribedBy,
      ariaErrorMessage,
      errorMessageIds: formControl.errorMessageIds,
      helperTextIds: formControl.helperTextIds,
      isInvalid: shouldAssociateErrorMessage,
    });
    const groupLabelledBy = ariaLabelledBy ?? formControl.labelId ?? labelId;
    const lowerLabelId = `${rootId}-lower-label`;
    const upperLabelId = `${rootId}-upper-label`;
    const classes = rangeSlider({ size, intent, error: isInvalid });
    const lowerPercent = getRangeSliderPercent(currentValue[0], options);
    const upperPercent = getRangeSliderPercent(currentValue[1], options);
    const lowerAriaBounds = getRangeSliderThumbBounds('lower', currentValue, options);
    const upperAriaBounds = getRangeSliderThumbBounds('upper', currentValue, options);
    const hiddenLowerName = lowerName ?? (name ? `${name}Min` : undefined);
    const hiddenUpperName = upperName ?? (name ? `${name}Max` : undefined);
    const accessibleLabel =
      typeof children === 'string' ? children : (props['aria-label'] ?? undefined);
    const lowerThumbLabel = accessibleLabel
      ? `${accessibleLabel} ${resolvedLowerAriaLabel}`
      : resolvedLowerAriaLabel;
    const upperThumbLabel = accessibleLabel
      ? `${accessibleLabel} ${resolvedUpperAriaLabel}`
      : resolvedUpperAriaLabel;
    const lowerThumbDescriptor = accessibleLabel ? resolvedLowerAriaLabel : resolvedLowerAriaLabel;
    const upperThumbDescriptor = accessibleLabel ? resolvedUpperAriaLabel : resolvedUpperAriaLabel;
    const lowerThumbLabelledBy = groupLabelledBy ? `${groupLabelledBy} ${lowerLabelId}` : undefined;
    const upperThumbLabelledBy = groupLabelledBy ? `${groupLabelledBy} ${upperLabelId}` : undefined;
    const interactionIsDisabled = formBridge.isEffectivelyDisabledNow;

    const activePointerRef = useRef<{ id: number; thumb: RangeSliderThumb } | null>(null);

    const formResetRef = useFormReset<HTMLFieldSetElement>(reset);
    const formAnchorRef = useMergeRefs(formBridge.anchorRef, formResetRef);

    useEffect(() => {
      if (!isInteractionDisabled && !isReadOnly) return;

      const activePointer = activePointerRef.current;
      if (activePointer) {
        const track = trackRef.current;
        if (track?.hasPointerCapture(activePointer.id)) {
          track.releasePointerCapture(activePointer.id);
        }
      }
      activePointerRef.current = null;
      cancelInteraction();
    }, [cancelInteraction, isInteractionDisabled, isReadOnly]);

    const handleTrackPointerDown = (event: PointerEvent<HTMLDivElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        !event.isPrimary ||
        interactionIsDisabled() ||
        isReadOnly ||
        activePointerRef.current
      ) {
        return;
      }

      const targetThumb = (event.target as HTMLElement).getAttribute(
        'data-thumb',
      ) as RangeSliderThumb | null;
      const pointerValue = getRangeSliderPointerValue(event, resolvedMin, resolvedMax, isRtl);
      const thumb = targetThumb ?? getClosestRangeSliderThumb(pointerValue, currentValue);

      event.preventDefault();
      trackRef.current?.setPointerCapture(event.pointerId);
      activePointerRef.current = { id: event.pointerId, thumb };
      (thumb === 'lower' ? lowerThumbRef : upperThumbRef).current?.focus();
      moveThumb(thumb, pointerValue);
    };

    const handleTrackPointerMove = (event: PointerEvent<HTMLDivElement>) => {
      const activePointer = activePointerRef.current;
      if (
        event.defaultPrevented ||
        activePointer?.id !== event.pointerId ||
        interactionIsDisabled() ||
        isReadOnly
      )
        return;

      moveThumb(
        activePointer.thumb,
        getRangeSliderPointerValue(event, resolvedMin, resolvedMax, isRtl),
      );
    };

    const handleTrackPointerUp = (event: PointerEvent<HTMLDivElement>) => {
      const activePointer = activePointerRef.current;
      if (activePointer?.id !== event.pointerId) return;

      activePointerRef.current = null;
      if (trackRef.current?.hasPointerCapture(event.pointerId)) {
        trackRef.current.releasePointerCapture(event.pointerId);
      }
      if (event.defaultPrevented || interactionIsDisabled() || isReadOnly) {
        cancelInteraction();
        return;
      }
      commitInteraction(activePointer.thumb);
    };

    const handleTrackPointerCancel = (event: PointerEvent<HTMLDivElement>) => {
      const activePointer = activePointerRef.current;
      if (activePointer?.id !== event.pointerId) return;

      activePointerRef.current = null;
      if (trackRef.current?.hasPointerCapture(event.pointerId)) {
        trackRef.current.releasePointerCapture(event.pointerId);
      }
      cancelInteraction();
    };

    const handleThumbKeyDown =
      (thumb: RangeSliderThumb) => (event: KeyboardEvent<HTMLButtonElement>) => {
        const action = getRangeSliderKeyboardAction(event.key, isRtl);
        if (event.defaultPrevented || !action || interactionIsDisabled() || isReadOnly) return;

        event.preventDefault();
        applyKeyboardAction(thumb, action);
      };

    const handleThumbKeyUp =
      (thumb: RangeSliderThumb) => (event: KeyboardEvent<HTMLButtonElement>) => {
        if (!getRangeSliderKeyboardAction(event.key, isRtl)) return;
        if (event.defaultPrevented || interactionIsDisabled() || isReadOnly) {
          cancelInteraction();
          return;
        }
        commitInteraction(thumb);
      };

    return (
      <div
        ref={mergedRef}
        id={rootId}
        className={cx(classes.root, className)}
        data-disabled={isInteractionDisabled ? '' : undefined}
        data-readonly={isReadOnly ? '' : undefined}
        {...props}
        dir={direction}
        role="group"
        aria-labelledby={groupLabelledBy}
        aria-describedby={describedBy}
        aria-disabled={isInteractionDisabled ? true : undefined}
      >
        <fieldset {...formBridge.anchorProps} ref={formAnchorRef} />
        {children && (
          <span id={labelId} className={classes.label}>
            {children}
          </span>
        )}
        {groupLabelledBy && (
          <>
            <span id={lowerLabelId} hidden>
              {lowerThumbDescriptor}
            </span>
            <span id={upperLabelId} hidden>
              {upperThumbDescriptor}
            </span>
          </>
        )}
        <RangeSliderTrack
          trackRef={trackRef}
          lowerThumbRef={lowerThumbRef}
          upperThumbRef={upperThumbRef}
          classes={classes}
          value={currentValue}
          lowerPercent={lowerPercent}
          upperPercent={upperPercent}
          lowerAriaBounds={lowerAriaBounds}
          upperAriaBounds={upperAriaBounds}
          disabled={isDisabled}
          readOnly={isReadOnly}
          lowerAriaLabel={lowerThumbLabel}
          upperAriaLabel={upperThumbLabel}
          lowerAriaLabelledBy={lowerThumbLabelledBy}
          upperAriaLabelledBy={upperThumbLabelledBy}
          getAriaValueText={getAriaValueText}
          describedBy={describedBy}
          errorMessage={errorMessage}
          invalid={shouldAssociateErrorMessage}
          direction={direction}
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={handleTrackPointerUp}
          onPointerCancel={handleTrackPointerCancel}
          onLostPointerCapture={handleTrackPointerUp}
          onThumbKeyDown={handleThumbKeyDown}
          onThumbKeyUp={handleThumbKeyUp}
          onThumbBlur={(thumb) => () => commitInteraction(thumb)}
        />
        <RangeSliderHiddenInputs
          className={classes.hiddenInput}
          form={form}
          lowerName={hiddenLowerName}
          upperName={hiddenUpperName}
          lowerValue={currentValue[0]}
          upperValue={currentValue[1]}
          disabled={isInteractionDisabled}
        />
      </div>
    );
  },
);

RangeSlider.displayName = 'RangeSlider';

'use client';

import { cx } from '@/styled-system/css';
import { inputGroup } from '@/styled-system/recipes';
import {
  getFallbackChildrenForNativeContainer,
  isContainerAsChildHost,
} from '@/components/shared/asChild';
import { flattenFragmentChildren } from '@/components/shared/flattenFragmentChildren';
import { cloneElement, forwardRef, isValidElement, useMemo } from 'react';
import type { ElementType, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { InputGroupContext } from './InputGroupContext';
import { INPUT_GROUP_SLOT, type InputGroupSlotComponent } from './InputGroupSlot';
import type { InputGroupComponent, InputGroupProps } from './InputGroup.types';

const getSlot = (child: unknown) =>
  isValidElement(child) ? (child.type as InputGroupSlotComponent)[INPUT_GROUP_SLOT] : undefined;

const partitionChildren = (children: ReactNode[]) => {
  const slots: {
    startAddon?: ReactNode;
    endAddon?: ReactNode;
    startElement?: ReactNode;
    endElement?: ReactNode;
    fieldChildren: ReactNode[];
  } = { fieldChildren: [] };

  children.forEach((child) => {
    const slot = getSlot(child);

    if (slot === 'startAddon') {
      slots.startAddon = child;
      return;
    }

    if (slot === 'endAddon') {
      slots.endAddon = child;
      return;
    }

    if (slot === 'startElement') {
      slots.startElement = child;
      return;
    }

    if (slot === 'endElement') {
      slots.endElement = child;
      return;
    }

    slots.fieldChildren.push(child);
  });

  return slots;
};


const InputGroupRootImpl = forwardRef<Element, InputGroupProps>(
  ({ size = 'md', className, children, asChild, ...props }, ref) => {
    const asChildElement = asChild && isContainerAsChildHost(children) ? children : null;
    const rootChildren =
      asChild && !asChildElement
        ? getFallbackChildrenForNativeContainer(children)
        : (asChildElement?.props.children ?? children);
    const childArray = flattenFragmentChildren(rootChildren);

    const hasStartAddon = childArray.some((c) => getSlot(c) === 'startAddon');
    const hasEndAddon = childArray.some((c) => getSlot(c) === 'endAddon');
    const hasStartElement = childArray.some((c) => getSlot(c) === 'startElement');
    const hasEndElement = childArray.some((c) => getSlot(c) === 'endElement');
    const { startAddon, endAddon, startElement, endElement, fieldChildren } =
      partitionChildren(childArray);

    const classes = useMemo(() => inputGroup({ size }), [size]);
    const contextValue = useMemo(
      () => ({ size, classes, hasStartAddon, hasEndAddon, hasStartElement, hasEndElement }),
      [size, classes, hasStartAddon, hasEndAddon, hasStartElement, hasEndElement],
    );

    const content = (
      <>
        {startAddon}
        <div className={classes.field}>
          {startElement}
          {fieldChildren}
          {endElement}
        </div>
        {endAddon}
      </>
    );
    const rootProps = {
      ref,
      className: cx(classes.root, className),
      'data-has-start-addon': hasStartAddon ? '' : undefined,
      'data-has-end-addon': hasEndAddon ? '' : undefined,
      'data-has-start-element': hasStartElement ? '' : undefined,
      'data-has-end-element': hasEndElement ? '' : undefined,
      ...props,
    };

    const Component = (asChildElement ? Slot : 'div') as ElementType;
    const renderedContent = asChildElement
      ? cloneElement(asChildElement, undefined, content)
      : content;

    return (
      <InputGroupContext.Provider value={contextValue}>
        <Component {...rootProps}>{renderedContent}</Component>
      </InputGroupContext.Provider>
    );
  },
);

InputGroupRootImpl.displayName = 'InputGroup';

/**
 * Root layout for a single field and its InputGroup slots.
 *
 * Slot children are partitioned by type, with at most the last supplied slot occupying each
 * position. `asChild` accepts an `article`, `div`, `section`, or a custom component that forwards
 * its ref and DOM props, and replaces that host's children with the arranged group content;
 * unsupported hosts render inside the default `<div>`.
 */

export const InputGroupRoot = InputGroupRootImpl as InputGroupComponent;

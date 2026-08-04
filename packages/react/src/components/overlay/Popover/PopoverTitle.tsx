'use client';

import { createOverlayTitle } from '../shared/factories';
import { PopoverTitleProps } from './Popover.types';
import { usePopoverContext } from './PopoverContext';
import { forwardRef } from 'react';
import type { OverlayPartComponent, OverlayTextAsChildElement } from '../shared/factories/types';


const PopoverTitlePrimitive = createOverlayTitle(usePopoverContext, 'PopoverTitlePrimitive', 'h3');

const PopoverTitleImpl = forwardRef<HTMLHeadingElement, PopoverTitleProps>((props, ref) => (
  <PopoverTitlePrimitive {...props} ref={ref} data-popover-title="" />
));

PopoverTitleImpl.displayName = 'PopoverTitle';

/** Provides the accessible title within Popover content. */

export const PopoverTitle = PopoverTitleImpl as unknown as OverlayPartComponent<
  'h3',
  HTMLHeadingElement,
  object,
  HTMLElement,
  OverlayTextAsChildElement
>;

/**
 * Props for PopoverTitle, the accessible heading of a Popover.
 */
export type { PopoverTitleProps };

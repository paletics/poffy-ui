'use client';

import { createOverlayClose } from '../shared/factories';
import type { PopoverCloseProps } from './Popover.types';
import { usePopoverContext } from './PopoverContext';
import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import type { OverlayCloseComponent } from '../shared/factories/types';


const PopoverClosePrimitive = createOverlayClose(usePopoverContext, 'PopoverClosePrimitive', 16);
const InternalPopoverClose = PopoverClosePrimitive as unknown as ForwardRefExoticComponent<
  PopoverCloseProps & RefAttributes<HTMLElement>
>;

const PopoverCloseImpl = forwardRef<HTMLElement, PopoverCloseProps>((props, ref) => (
  <InternalPopoverClose {...props} ref={ref} data-popover-close="" />
));

PopoverCloseImpl.displayName = 'PopoverClose';

/** Closes the nearest Popover when activated. */

export const PopoverClose = PopoverCloseImpl as unknown as OverlayCloseComponent;

/**
 * Props for PopoverClose, the button that dismisses a Popover.
 */
export type { PopoverCloseProps };

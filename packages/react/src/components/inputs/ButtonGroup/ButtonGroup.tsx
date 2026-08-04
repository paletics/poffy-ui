'use client';

import { ButtonGroupRoot } from './ButtonGroupRoot';

/**
 * Groups related actions in a labelled `role="group"` region.
 *
 * This is the namespace entry point for `ButtonGroup.Root`. Give an otherwise unnamed group an
 * `aria-label` or `aria-labelledby`; `connected` disables spacing and wrapping, while `wrap`
 * applies only to unconnected horizontal groups.
 */
export const ButtonGroup = Object.assign(ButtonGroupRoot, {
  Root: ButtonGroupRoot,
});

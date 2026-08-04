/**
 * Produces event props that suppress activation for an otherwise non-native disabled host.
 *
 * The resulting props cover capture and bubble mouse, pointer, and keyboard channels.
 */
export { createDisabledActivationHandlers } from './createDisabledActivationHandlers';
export type {
  ActivationHandlers,
  DisabledActivationHandlers,
} from './createDisabledActivationHandlers';
/** Replaces a valid `asChild` element's activation handlers while it is guarded. */
export { guardActivationHandlers } from './guardActivation';

/** Applies the complete disabled activation guard to a valid `asChild` element. */
export { guardDisabledActivationHandlers } from './guardActivation';
export type { ActivationGuardHandlers } from './guardActivation';
/** Adds APG-style Enter and Space activation to a non-native interactive React host. */
export { useButtonKeyboardActivation } from './useButtonKeyboardActivation';
export type {
  ButtonKeyboardActivationHandlers,
  UseButtonKeyboardActivationOptions,
} from './useButtonKeyboardActivation';

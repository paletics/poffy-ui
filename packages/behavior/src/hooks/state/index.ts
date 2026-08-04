/**
 * Manages a state cell whose `undefined` value means uncontrolled ownership.
 *
 * The hook preserves the latest committed controlled value when ownership is released.
 */
export { useControllableState } from './useControllableState';

/** Controlled/uncontrolled state-cell input and return contracts. */
export type {
  UseControllableStateOptions,
  UseControllableStateReturn,
} from './useControllableState';

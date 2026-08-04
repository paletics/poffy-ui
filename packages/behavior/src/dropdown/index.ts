/**
 * Provides renderer-neutral Floating UI menu state, positioning, dismissal, and list navigation.
 *
 * Pair the returned prop getters and item snapshot with the matching trigger, menu, and item DOM.
 */
export { useDropdown } from './useDropdown';

/** Public configuration, collection, and return contracts for {@link useDropdown}. */
export type {
  DropdownCollectionItem,
  UseDropdownOptions,
  UseDropdownReturn,
} from './useDropdown.types';

import * as pagination from './pagination';
import type { UseDropdownOptions, UseDropdownReturn } from './dropdown';

// @ts-expect-error Compatibility-only logic barrel was removed in 0.2.
type RemovedLogicBarrel = typeof import('./logic');
// @ts-expect-error Removed pagination builder alias must stay unavailable.
const removedBuilder = pagination.buildPaginationRange;
// @ts-expect-error Removed pagination options alias must stay unavailable.
type RemovedOptions = import('./pagination').BuildPaginationRangeOptions;
// @ts-expect-error Removed pagination ellipsis alias must stay unavailable.
type RemovedDot = import('./pagination').PaginationDot;
// @ts-expect-error Removed pagination item alias must stay unavailable.
type RemovedRangeItem = import('./pagination').PaginationRangeItem;

declare const dropdown: UseDropdownReturn;
declare const removedOptions: RemovedOptions;
declare const removedDot: RemovedDot;
declare const removedRangeItem: RemovedRangeItem;
declare const removedLogicBarrel: RemovedLogicBarrel;

// @ts-expect-error Disabled item metadata is updated atomically with reconcileItems.
dropdown.setDisabledIndex(0, true);
// @ts-expect-error Controlled dropdown behavior requires an update callback.
const unpairedControlledDropdown = { open: true } satisfies UseDropdownOptions;

void removedBuilder;
void removedOptions;
void removedDot;
void removedRangeItem;
void removedLogicBarrel;
void unpairedControlledDropdown;

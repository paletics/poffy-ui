/** Assigns a node/value to one callback or object ref and returns any callback cleanup. */
export { assignRef } from './useMergeRefs';

/**
 * Creates a callback ref that fans one node out to multiple refs.
 *
 * On React 19 cleanup, callback cleanups run in input order while refs without a cleanup receive
 * `null`.
 */
export { mergeRefs } from './useMergeRefs';

/** Memoizes `mergeRefs` for React components, returning `null` for entirely nullish inputs. */
export { useMergeRefs } from './useMergeRefs';

/** Accepted callback, object, and nullable ref utility shape. */
export type { ReactRef } from './useMergeRefs.types';

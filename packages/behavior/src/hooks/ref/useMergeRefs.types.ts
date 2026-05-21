import type { RefObject } from 'react';

/**
 * Public ref shape used by the shared ref-merging utilities.
 */
export type ReactRef<T> = React.Ref<T> | RefObject<T>;

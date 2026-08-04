/** Options for the shared media-query subscription hook. */
export interface UseMediaQueryOptions {
  /**
   * Snapshot used during SSR and when `matchMedia` is unavailable.
   *
   * @defaultValue `false`
   */
  defaultMatches?: boolean;
  /** Window whose media features are observed. `null` disables native observation. */
  targetWindow?: Window | null;
}

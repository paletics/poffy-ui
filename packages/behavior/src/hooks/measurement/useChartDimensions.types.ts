/**
 * Outer chart margin offsets in CSS pixels.
 */
export interface ChartMargin {
  /** Top margin in CSS pixels. */
  top: number;
  /** Right margin in CSS pixels. */
  right: number;
  /** Bottom margin in CSS pixels. */
  bottom: number;
  /** Left margin in CSS pixels. */
  left: number;
}

/**
 * Chart dimensions derived from a measured container and margins.
 */
export interface ChartDimensions {
  /** Outer chart width in CSS pixels. */
  width: number;
  /** Outer chart height in CSS pixels. */
  height: number;
  /** Width available inside horizontal margins. */
  innerWidth: number;
  /** Height available inside vertical margins. */
  innerHeight: number;
}

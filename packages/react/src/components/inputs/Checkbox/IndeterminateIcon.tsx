import { PathDrawTransition } from '@/components/animations';

/**
 * Animated dash icon for indeterminate Checkbox state.
 */
export const IndeterminateIcon = () => (
  <PathDrawTransition
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    animationType="dash"
    aria-hidden="true"
  >
    <PathDrawTransition.Line x1="4" y1="12" x2="20" y2="12" />
  </PathDrawTransition>
);

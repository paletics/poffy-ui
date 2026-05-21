import { PathDrawTransition } from '@/components/animations';

/**
 * Animated checkmark icon for checked Checkbox state.
 */
export const CheckIcon = () => (
  <PathDrawTransition
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <PathDrawTransition.Polyline points="20 6 9 17 4 12" />
  </PathDrawTransition>
);

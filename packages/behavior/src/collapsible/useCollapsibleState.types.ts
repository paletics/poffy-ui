interface UseCollapsibleStateBaseProps {
  /** Ignores all `setOpen` and `toggle` requests without calling `onOpenChange`. */
  disabled?: boolean;
}

/** Caller-owned disclosure state; `onOpenChange` receives requested changes. */
export interface ControlledUseCollapsibleStateProps extends UseCollapsibleStateBaseProps {
  open: boolean;
  defaultOpen?: never;
  onOpenChange: (open: boolean) => void;
}

/** Hook-owned disclosure state initialized from `defaultOpen`. */
export interface UncontrolledUseCollapsibleStateProps extends UseCollapsibleStateBaseProps {
  open?: never;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Controlled or uncontrolled disclosure ownership, distinguished by the presence of `open`. */
export type UseCollapsibleStateProps =
  | ControlledUseCollapsibleStateProps
  | UncontrolledUseCollapsibleStateProps;

/** Current disclosure state and operations that honor the disabled and ownership policy. */
export interface UseCollapsibleStateReturn {
  /** Current controlled or hook-owned visibility. */
  open: boolean;
  /** Whether a valid `open`/`onOpenChange` pair currently owns visibility. */
  isControlled: boolean;
  /** Requests a different visibility unless disabled or already at that state. */
  setOpen: (open: boolean) => void;
  /** Requests the opposite current visibility unless disabled. */
  toggle: () => void;
}

import type { DOMAttributes, ReactElement, RefAttributes } from 'react';

/** Default-host branch for an `asChild` component. */
export type DefaultHostProps<Props> = Omit<Props, 'asChild'> & {
  asChild?: false;
};

/**
 * Delegated-host branch for an `asChild` component.
 *
 * The default primitive's DOM event types are not valid after Slot delegates to
 * another host, so the delegated branch always retargets them. Use a narrower
 * `HostElement` and `Child` when runtime host validation can prove them.
 */
export type AsChildHostProps<
  Props,
  HostElement extends Element = Element,
  Child extends ReactElement = ReactElement,
> = Omit<Props, 'asChild' | 'children' | keyof DOMAttributes<Element>> &
  Omit<DOMAttributes<HostElement>, 'children' | 'dangerouslySetInnerHTML'> & {
    asChild: true;
    children: Child;
  };

/**
 * Delegated-host props whose React DOM event targets follow the runtime host.
 *
 * `PrimitiveProps` describes events for the default host. Slot delegation changes
 * `event.currentTarget`, so behavior primitives use this helper to retarget every
 * DOM event without widening their default branch.
 */
export type RetargetedAsChildHostProps<
  Props,
  HostElement extends Element,
  Child extends ReactElement = ReactElement,
> = Omit<Props, 'asChild' | 'children' | keyof DOMAttributes<Element>> &
  Omit<DOMAttributes<HostElement>, 'children' | 'dangerouslySetInnerHTML'> & {
    asChild: true;
    children: Child;
  };

/**
 * Callable component contract that preserves both branches through
 * `ComponentProps<typeof Component>`.
 */
export interface PolymorphicAsChildComponent<
  DefaultProps,
  AsChildProps,
  DefaultElement extends Element,
  AsChildElement extends Element = Element,
> {
  displayName?: string;
  (props: DefaultProps & RefAttributes<DefaultElement>): ReactElement | null;
  (props: AsChildProps & RefAttributes<AsChildElement>): ReactElement | null;
  (
    props:
      | (DefaultProps & RefAttributes<DefaultElement>)
      | (AsChildProps & RefAttributes<AsChildElement>),
  ): ReactElement | null;
}

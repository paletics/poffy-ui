import type { OverlayAnimationType } from '@/components/animations/OverlayTransition/OverlayTransition.types';
import { PoffyBrand, PoffyResolvedColorMode } from '@/providers';
import { PrimitiveProps } from '@poffy-ui/types';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';
import type { DelegatedButtonHostProps } from '@/components/shared/buttonDelegation';
import type {
  ExtendedRefs,
  FloatingContext,
  FloatingFocusManager,
  ReferenceType,
} from '@floating-ui/react';
import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementType,
  HTMLProps,
  ReactElement,
  RefAttributes,
} from 'react';

/**
 * Standardized refs for overlay components.
 * Alias for Floating UI's ExtendedRefs — domReference and setDomReference are inherited.
 */
export type OverlayRefs<T extends ReferenceType> = ExtendedRefs<T>;

/**
 * Common context interface shared by overlay factories.
 *
 * Overlay roots provide this value; generated subcomponents consume it. Required
 * accessible structure is enforced by registered title and description IDs
 * rather than prop drilling. Close buttons call `onOpenChange(false)`.
 *
 * Do: create component-specific contexts that extend this type. Don't: expose
 * this context directly as the preferred public API for application code.
 *
 * Generic `T` represents the reference element type and defaults to Floating
 * UI's `ReferenceType`.
 */
export interface OverlayContext<T extends ReferenceType> {
  activeReferenceOwnerId?: string;
  activeContentOwnerId?: string;
  registerReferenceOwner: (id: string) => () => void;
  registerContentOwner: (id: string) => () => void;
  /**
   * Map of class names generated from the component's Panda CSS recipe.
   */
  classes: Record<string, string>;

  /** First mounted title ID registered by an overlay title factory. */
  registeredTitleId?: string;

  /** First mounted description ID registered by an overlay description factory. */
  registeredDescriptionId?: string;

  /** Registers a title's unique DOM ID and returns its cleanup function. */
  registerTitle: (id: string) => () => void;

  /** Registers a description's unique DOM ID and returns its cleanup function. */
  registerDescription: (id: string) => () => void;

  /**
   * Whether the overlay is currently open.
   */
  open: boolean;

  /**
   * Preferred initial focus target for modal focus management.
   */
  initialFocus?: ComponentProps<typeof FloatingFocusManager>['initialFocus'];

  /**
   * Dialog role applied to the floating content.
   * @defaultValue 'dialog'
   */
  role?: 'dialog' | 'alertdialog';

  /**
   * The optional brand variant.
   */
  brand?: PoffyBrand;

  /**
   * The optional color mode/theme.
   */
  theme?: PoffyResolvedColorMode;

  /**
   * Floating UI context provided by useFloating/useOverlay.
   */
  context: FloatingContext<T>;

  /**
   * Floating UI refs provided by useFloating/useOverlay.
   */
  refs: OverlayRefs<T>;

  /**
   * Hook to get props for the floating element.
   */
  getFloatingProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;

  /**
   * Callback to change the open state.
   * Required by all overlay types — consumed by createOverlayClose to dismiss the overlay.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Animation preset for the overlay content.
   * Consumed by createOverlayContent to drive OverlayTransition.
   * @defaultValue 'modal'
   */
  animationType?: OverlayAnimationType;
}

/**
 * Shared polymorphic props for overlay sub-components generated via factories.
 *
 * Factories support Radix `asChild`; the caller is responsible for preserving
 * equivalent semantics when replacing the default element.
 */
export type OverlaySubComponentProps<T extends ElementType, P = object> = PrimitiveProps<T, P>;

/** Props for a generated overlay part rendered with its default host element. */
export type OverlayPartDefaultProps<T extends ElementType, P = object> = DefaultHostProps<
  PrimitiveProps<T, P>
>;

/** Props for a generated overlay part delegated to a type-restricted `asChild` host. */
export type OverlayPartAsChildProps<
  T extends ElementType,
  P = object,
  HostElement extends Element = HTMLElement,
  Child extends ReactElement = ReactElement,
> = RetargetedAsChildHostProps<PrimitiveProps<T, P>, HostElement, Child>;

/** Union of the default-host and permitted delegated-host props for an overlay part. */
export type OverlayPartProps<
  T extends ElementType,
  P = object,
  HostElement extends Element = HTMLElement,
  Child extends ReactElement = ReactElement,
> = OverlayPartDefaultProps<T, P> | OverlayPartAsChildProps<T, P, HostElement, Child>;

/** Polymorphic call signatures preserved by generated overlay parts. */
export interface OverlayPartComponent<
  T extends ElementType,
  DefaultElement extends Element,
  P = object,
  HostElement extends Element = HTMLElement,
  Child extends ReactElement = ReactElement,
> {
  (props: OverlayPartDefaultProps<T, P> & RefAttributes<DefaultElement>): ReactElement | null;
  (
    props: OverlayPartAsChildProps<T, P, HostElement, Child> & RefAttributes<HostElement>,
  ): ReactElement | null;
  (
    props:
      | (OverlayPartDefaultProps<T, P> & RefAttributes<DefaultElement>)
      | (OverlayPartAsChildProps<T, P, HostElement, Child> & RefAttributes<HostElement>),
  ): ReactElement | null;
}

/** Textual native hosts that title and description factories may safely slot. */
export type OverlayTextAsChildElement =
  | ReactElement<ComponentPropsWithoutRef<'div'>, 'div'>
  | ReactElement<ComponentPropsWithoutRef<'h1'>, 'h1'>
  | ReactElement<ComponentPropsWithoutRef<'h2'>, 'h2'>
  | ReactElement<ComponentPropsWithoutRef<'h3'>, 'h3'>
  | ReactElement<ComponentPropsWithoutRef<'h4'>, 'h4'>
  | ReactElement<ComponentPropsWithoutRef<'h5'>, 'h5'>
  | ReactElement<ComponentPropsWithoutRef<'h6'>, 'h6'>
  | ReactElement<ComponentPropsWithoutRef<'p'>, 'p'>
  | ReactElement<ComponentPropsWithoutRef<'span'>, 'span'>;

/** Structural native hosts that header, body, and footer factories may safely slot. */
export type OverlaySectionAsChildElement =
  | ReactElement<ComponentPropsWithoutRef<'article'>, 'article'>
  | ReactElement<ComponentPropsWithoutRef<'aside'>, 'aside'>
  | ReactElement<ComponentPropsWithoutRef<'div'>, 'div'>
  | ReactElement<ComponentPropsWithoutRef<'footer'>, 'footer'>
  | ReactElement<ComponentPropsWithoutRef<'header'>, 'header'>
  | ReactElement<ComponentPropsWithoutRef<'main'>, 'main'>
  | ReactElement<ComponentPropsWithoutRef<'section'>, 'section'>;

/** Structural native hosts that the focus-managed modal content factory may safely slot. */
export type OverlayContentAsChildElement =
  | ReactElement<ComponentPropsWithoutRef<'article'>, 'article'>
  | ReactElement<ComponentPropsWithoutRef<'aside'>, 'aside'>
  | ReactElement<ComponentPropsWithoutRef<'div'>, 'div'>
  | ReactElement<ComponentPropsWithoutRef<'section'>, 'section'>;

type OverlayTriggerNativeProps = Omit<
  PrimitiveProps<'button'>,
  | 'aria-controls'
  | 'aria-disabled'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'role'
  | 'tabIndex'
  | 'type'
>;
/** Props for an overlay trigger rendered as its owned button. The component owns state ARIA. */
export type OverlayTriggerDefaultProps = DefaultHostProps<OverlayTriggerNativeProps>;
/** Props for an overlay trigger delegated to a host that forwards button behavior and ref. */
export type OverlayTriggerAsChildProps = RetargetedAsChildHostProps<
  DelegatedButtonHostProps<OverlayTriggerNativeProps>,
  HTMLElement,
  ReactElement
>;
/** Public trigger props, selecting the owned-button or delegated-host branch. */
export type OverlayTriggerProps = OverlayTriggerDefaultProps | OverlayTriggerAsChildProps;
/** Polymorphic trigger call signatures with the default button ref and delegated-host ref. */
export type OverlayTriggerComponent = PolymorphicAsChildComponent<
  OverlayTriggerDefaultProps,
  OverlayTriggerAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;

type OverlayCloseNativeProps = Omit<PrimitiveProps<'button'>, 'type'>;
/** Props for an overlay close control rendered as its owned button. */
export type OverlayCloseDefaultProps = DefaultHostProps<OverlayCloseNativeProps>;
/** Props for an overlay close control delegated to a host that forwards button behavior and ref. */
export type OverlayCloseAsChildProps = RetargetedAsChildHostProps<
  DelegatedButtonHostProps<OverlayCloseNativeProps>,
  HTMLElement,
  ReactElement
>;
/** Public close-control props, selecting the owned-button or delegated-host branch. */
export type OverlayCloseProps = OverlayCloseDefaultProps | OverlayCloseAsChildProps;
/** Polymorphic close-control call signatures with the default button ref and delegated-host ref. */
export type OverlayCloseComponent = PolymorphicAsChildComponent<
  OverlayCloseDefaultProps,
  OverlayCloseAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;

type OverlayContentNativeProps = Omit<
  PrimitiveProps<'div', import('@/providers/PortalProvider.types').PortalTargetProps>,
  'role'
>;
/** Props for a focus-managed overlay content surface rendered with its owned `div` host. */
export type OverlayContentDefaultProps = DefaultHostProps<OverlayContentNativeProps>;
/** Props for content delegated to a safe structural host; interactive hosts are not accepted. */
export type OverlayContentAsChildProps = RetargetedAsChildHostProps<
  OverlayContentNativeProps,
  HTMLElement,
  OverlayContentAsChildElement
>;
/** Public content props, selecting the owned surface or safe delegated-host branch. */
export type OverlayContentProps = OverlayContentDefaultProps | OverlayContentAsChildProps;
/** Polymorphic content call signatures with the default surface ref and delegated-host ref. */
export type OverlayContentComponent = PolymorphicAsChildComponent<
  OverlayContentDefaultProps,
  OverlayContentAsChildProps,
  HTMLDivElement,
  HTMLElement
>;

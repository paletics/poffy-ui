import { PrimitiveProps } from '@poffy-ui/types';
import type { InputProps } from '@/components/inputs/Input';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Shared size applied to the grouped field and slots. */
export type InputGroupSize = 'sm' | 'md' | 'lg';

/** Props for the structural InputGroup root. */
export interface InputGroupOwnProps {
  /**
   * Shared size for grouped input parts.
   *
   * @defaultValue `'md'`
   */
  size?: InputGroupSize;
}

/** Props for InputGroup root. */
type InputGroupNativeProps = PrimitiveProps<'div', InputGroupOwnProps>;
/** Props for InputGroup's owned div host. */
export type InputGroupDefaultProps = DefaultHostProps<InputGroupNativeProps>;
/**
 * Props for a delegated InputGroup host.
 *
 * Runtime accepts `article`, `div`, `section`, or a custom component that
 * forwards the ref and DOM props; other native hosts fall back to a div.
 */
export type InputGroupAsChildProps = RetargetedAsChildHostProps<InputGroupNativeProps, Element>;
/** Props accepted by InputGroup's owned or delegated root. */
export type InputGroupProps = InputGroupDefaultProps | InputGroupAsChildProps;
/** Ref-forwarding public component signature for InputGroupRoot. */
export type InputGroupComponent = PolymorphicAsChildComponent<
  InputGroupDefaultProps,
  InputGroupAsChildProps,
  HTMLDivElement,
  Element
>;

/** Props for the input slot. Size is owned by the surrounding InputGroup. */
export type InputGroupInputProps = Omit<InputProps, 'size'>;

/** Props for InputGroup addon slots. */
type InputAddonNativeProps = PrimitiveProps<'div'>;
/** Props for an addon rendered in its own div host. */
export type InputAddonDefaultProps = DefaultHostProps<InputAddonNativeProps>;
/** Props for an addon delegated to one non-void child host. */
export type InputAddonAsChildProps = RetargetedAsChildHostProps<InputAddonNativeProps, Element>;
/** Props accepted by InputGroup.StartAddon and InputGroup.EndAddon. */
export type InputAddonProps = InputAddonDefaultProps | InputAddonAsChildProps;
/** Ref-forwarding public component signature for an InputGroup addon. */
export type InputAddonComponent = PolymorphicAsChildComponent<
  InputAddonDefaultProps,
  InputAddonAsChildProps,
  HTMLDivElement,
  Element
>;

/** Props for compact InputGroup element slots. */
interface InputElementOwnProps {
  /** Enables pointer interaction; interactive content must supply its own accessible name. */
  interactive?: boolean;
}
type InputElementNativeProps = PrimitiveProps<'div', InputElementOwnProps>;
/** Props for an element rendered in its own div host. */
export type InputElementDefaultProps = DefaultHostProps<InputElementNativeProps>;
/** Props for an element delegated to one non-void child host. */
export type InputElementAsChildProps = RetargetedAsChildHostProps<InputElementNativeProps, Element>;
/** Props accepted by InputGroup.StartElement and InputGroup.EndElement. */
export type InputElementProps = InputElementDefaultProps | InputElementAsChildProps;
/** Ref-forwarding public component signature for an InputGroup element. */
export type InputElementComponent = PolymorphicAsChildComponent<
  InputElementDefaultProps,
  InputElementAsChildProps,
  HTMLDivElement,
  Element
>;

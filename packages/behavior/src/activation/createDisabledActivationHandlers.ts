import type { KeyboardEventHandler, MouseEventHandler, PointerEventHandler } from 'react';

/**
 * Mouse, pointer, and keyboard activation handlers accepted by a polymorphic interactive host.
 * These are the channels replaced or preserved by `createDisabledActivationHandlers`.
 */
export interface ActivationHandlers {
  onAuxClick?: MouseEventHandler<HTMLElement>;
  onAuxClickCapture?: MouseEventHandler<HTMLElement>;
  onClick?: MouseEventHandler<HTMLElement>;
  onClickCapture?: MouseEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  onKeyDownCapture?: KeyboardEventHandler<HTMLElement>;
  onKeyUp?: KeyboardEventHandler<HTMLElement>;
  onKeyUpCapture?: KeyboardEventHandler<HTMLElement>;
  onPointerDown?: PointerEventHandler<HTMLElement>;
  onPointerDownCapture?: PointerEventHandler<HTMLElement>;
  onPointerUp?: PointerEventHandler<HTMLElement>;
  onPointerUpCapture?: PointerEventHandler<HTMLElement>;
}

/**
 * Complete activation-handler set returned by the disabled guard.
 * Missing source handlers become no-ops when not guarded; guarded activation channels always block.
 */
export type DisabledActivationHandlers = Required<ActivationHandlers>;

const block = (event: { preventDefault: () => void; stopPropagation: () => void }) => {
  event.preventDefault();
  event.stopPropagation();
};

const isActivationKey = (event: { key: string; code: string }) =>
  ['Enter', ' '].includes(event.key) ? true : event.code === 'Space';

const noopMouse: MouseEventHandler<HTMLElement> = () => undefined;
const noopKeyboard: KeyboardEventHandler<HTMLElement> = () => undefined;
const noopPointer: PointerEventHandler<HTMLElement> = () => undefined;
const blockMouse: MouseEventHandler<HTMLElement> = block;
const blockPointer: PointerEventHandler<HTMLElement> = block;
const blockKeyboardActivation: KeyboardEventHandler<HTMLElement> = (event) => {
  if (isActivationKey(event)) block(event);
};

const guardKeyboardActivation = (
  handler?: KeyboardEventHandler<HTMLElement>,
): KeyboardEventHandler<HTMLElement> =>
  handler
    ? (event) => {
        if (isActivationKey(event)) block(event);
        else handler(event);
      }
    : blockKeyboardActivation;

/**
 * Produces handlers for a disabled interactive host without removing its event props.
 *
 * When guarding, mouse, auxiliary-click, and pointer events are prevented in both phases;
 * Enter and Space are likewise blocked, while other keyboard events still reach the supplied
 * handlers. When not guarding, supplied handlers are returned unchanged and missing handlers
 * become no-ops, so the result can always be spread onto an element.
 */
export const createDisabledActivationHandlers = (
  shouldGuard: boolean,
  handlers: ActivationHandlers = {},
): DisabledActivationHandlers => {
  if (!shouldGuard) {
    return {
      onAuxClick: handlers.onAuxClick ?? noopMouse,
      onAuxClickCapture: handlers.onAuxClickCapture ?? noopMouse,
      onClick: handlers.onClick ?? noopMouse,
      onClickCapture: handlers.onClickCapture ?? noopMouse,
      onKeyDown: handlers.onKeyDown ?? noopKeyboard,
      onKeyDownCapture: handlers.onKeyDownCapture ?? noopKeyboard,
      onKeyUp: handlers.onKeyUp ?? noopKeyboard,
      onKeyUpCapture: handlers.onKeyUpCapture ?? noopKeyboard,
      onPointerDown: handlers.onPointerDown ?? noopPointer,
      onPointerDownCapture: handlers.onPointerDownCapture ?? noopPointer,
      onPointerUp: handlers.onPointerUp ?? noopPointer,
      onPointerUpCapture: handlers.onPointerUpCapture ?? noopPointer,
    };
  }

  return {
    onAuxClick: blockMouse,
    onAuxClickCapture: blockMouse,
    onClick: blockMouse,
    onClickCapture: blockMouse,
    onKeyDown: guardKeyboardActivation(handlers.onKeyDown),
    onKeyDownCapture: guardKeyboardActivation(handlers.onKeyDownCapture),
    onKeyUp: guardKeyboardActivation(handlers.onKeyUp),
    onKeyUpCapture: guardKeyboardActivation(handlers.onKeyUpCapture),
    onPointerDown: blockPointer,
    onPointerDownCapture: blockPointer,
    onPointerUp: blockPointer,
    onPointerUpCapture: blockPointer,
  };
};

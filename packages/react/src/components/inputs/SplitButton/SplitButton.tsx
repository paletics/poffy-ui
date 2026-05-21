'use client';

import { useSplitButton } from '@poffy-ui/behavior/split-button';
import { cx } from '@/styled-system/css';
import { splitButton } from '@/styled-system/recipes';
import { forwardRef, type MutableRefObject } from 'react';
import { ButtonPrimitive } from '@/components/inputs/ButtonPrimitive';
import { DisclosureIconButton } from '@/components/inputs/DisclosureIconButton';
import type { SplitButtonProps } from './SplitButton.types';

/**
 * A compound button that pairs a primary action with a dropdown menu of secondary options.
 * Manages internal `isOpen` state and implements manual keyboard navigation
 * (Arrow Up/Down, Enter, Escape) for WAI-ARIA `menu` pattern compliance.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`splitButton` SlotRecipe: `root` + `mainButton` + `dropdownButton` + `menu` + `menuItem`)
 * - **Props**: `SplitButtonProps`
 *
 * ### Design Tokens
 * - **spacing/sizing**: button height, menu item padding → Silver Ratio tokens per `size`
 * - **color**: `intent` x `appearance` follows the same semantic action vocabulary as `Button`
 *
 * ### Variant Logic
 * - **appearance="solid"**: Default. High-emphasis primary + dropdown.
 * - **appearance="soft"**: Framed but lower-contrast split action.
 * - **appearance="outline"**: Secondary-emphasis. Use when the split-button is not the primary CTA.
 * - **size**: sm / md / lg scales both buttons and menu items uniformly.
 *
 * ### Accessibility
 * - **Role**: Root `<div>` is a toolbar container; dropdown `<button>` has `aria-haspopup="menu"` + `aria-expanded`.
 * - **Menu role**: `<ul role="menu">` / `<li role="none">` / `<button role="menuitem">`.
 * - **Keyboard**: Arrow Down/Up: navigate items | Enter / Space: activate | Escape: close
 *
 * @example
 * ```tsx
 * <SplitButton
 *   onClick={() => save()}
 *   items={[
 *     { id: 'draft', label: 'Save as Draft', onClick: () => saveAsDraft() },
 *     { id: 'template', label: 'Save as Template', onClick: () => saveAsTemplate() },
 *   ]}
 * >
 *   Publish
 * </SplitButton>
 * ```
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      children,
      items,
      onClick,
      icon,
      size = 'md',
      intent = 'primary',
      appearance = 'solid',
      shape = 'rounded',
      className,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const {
      focusedIndex,
      isOpen,
      onMenuItemClick,
      onMenuKeyDown,
      rootRef,
      setFocusedIndex,
      toggleMenu,
    } = useSplitButton({
      disabled,
      items,
    });

    const classes = splitButton({ size, intent, variant: appearance, shape, isOpen });

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cx(classes.root, className)}
        {...props}
      >
        <ButtonPrimitive className={classes.mainButton} onClick={onClick} disabled={disabled}>
          {icon && <span className={classes.icon}>{icon}</span>}
          {children}
        </ButtonPrimitive>

        <DisclosureIconButton
          className={classes.dropdownButton}
          size={size}
          intent={intent}
          appearance={appearance === 'soft' ? 'soft' : appearance}
          shape="square"
          open={isOpen}
          onClick={toggleMenu}
          disabled={disabled}
          aria-haspopup="menu"
          aria-label="More options"
        />

        {isOpen && (
          <ul className={classes.menu} role="menu" onKeyDown={onMenuKeyDown}>
            {items.map((item, index) => (
              <li key={item.id} role="none">
                <ButtonPrimitive
                  className={classes.menuItem}
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => onMenuItemClick(index)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  data-highlighted={index === focusedIndex ? '' : undefined}
                >
                  {item.icon && <span className={classes.icon}>{item.icon}</span>}
                  {item.label}
                </ButtonPrimitive>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);

SplitButton.displayName = 'SplitButton';

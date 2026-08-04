'use client';

import { Slot } from '@radix-ui/react-slot';

import { cx } from '@/styled-system/css';
import { avatarGroup } from '@/styled-system/recipes';
import { isAsChildHost, isNonVoidAsChildHost } from '@/components/shared/asChild';
import { flattenFragmentChildren } from '@/components/shared/flattenFragmentChildren';
import {
  cloneElement,
  ElementType,
  forwardRef,
  isValidElement,
  type ReactElement,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type ReactNode,
  useMemo,
} from 'react';
import { Avatar } from '../Avatar/Avatar';
import type { AvatarGroupComponent, AvatarGroupRootProps } from './AvatarGroup.types';
import { AvatarGroupContext } from './AvatarGroupContext';
import { AvatarGroupExcess } from './AvatarGroupExcess';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getAvatarGroupLabels } from './AvatarGroup.locales';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { useOverflowFocusability } from '@/components/shared/useOverflowFocusability';
import { handleHorizontalOverflowKeyDown } from '@/components/shared/handleHorizontalOverflowKeyDown';

interface AvatarGroupChildProps {
  className?: string;
  size?: AvatarGroupRootProps['size'];
  children?: ReactNode;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const normalizeCount = (value: number | undefined) => {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  return Math.max(0, Math.floor(value));
};

const isAvatarElement = (child: ReactElement) =>
  [child.type === Avatar, child.type === Avatar.Root].some(Boolean);

const clickableExcessHostNames = new Set([
  'article',
  'aside',
  'div',
  'footer',
  'header',
  'main',
  'nav',
  'section',
  'span',
]);

const canDelegateClickableExcess = (child: ReactElement) =>
  typeof child.type === 'string' && clickableExcessHostNames.has(child.type);

const AvatarGroupRootImpl = forwardRef<HTMLElement, AvatarGroupRootProps>((props, ref) => {
  const {
    asChild,
    children,
    className,
    size = 'md',
    max,
    spacing = '-sm',
    total,
    onExcessClick,
    role,
    tabIndex,
    onKeyDown,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props;

  const styles = avatarGroup({ size, spacing });
  const locale = useOptionalLocale()?.locale;
  const labels = getAvatarGroupLabels(locale);
  const fallbackCandidate = asChild && isNonVoidAsChildHost(children) ? children : null;
  const asChildCandidate =
    fallbackCandidate &&
    typeof fallbackCandidate.type === 'string' &&
    clickableExcessHostNames.has(fallbackCandidate.type)
      ? fallbackCandidate
      : null;
  const asChildProps = asChildCandidate?.props as AvatarGroupChildProps | undefined;
  const userOnKeyDown = onKeyDown as KeyboardEventHandler<HTMLElement> | undefined;
  const effectiveRole = asChildProps?.role ?? role;
  const effectiveTabIndex = asChildProps?.tabIndex ?? tabIndex;
  const effectiveAriaLabel = asChildProps?.['aria-label'] ?? ariaLabel;
  const effectiveAriaLabelledBy = asChildProps?.['aria-labelledby'] ?? ariaLabelledBy;
  const isPresentationalRole = effectiveRole === 'none' ? true : effectiveRole === 'presentation';
  const [overflowRef, overflowTabIndex] = useOverflowFocusability<HTMLElement>({
    axis: 'horizontal',
    explicitTabIndex: effectiveTabIndex,
    focusMode: isPresentationalRole ? 'never' : 'auto',
  });
  const mergedRef = useMergeRefs(ref, overflowRef);

  const contextValue = useMemo(
    () => ({ size, spacing, showMoreLabel: labels.showMore }),
    [labels.showMore, size, spacing],
  );

  const fallbackProps = fallbackCandidate?.props as AvatarGroupChildProps | undefined;
  const childNodes = fallbackCandidate ? fallbackProps?.children : children;
  const validChildren = flattenFragmentChildren(childNodes).filter(
    (child): child is ReactElement<AvatarGroupChildProps> => isValidElement(child),
  );

  const normalizedMax = normalizeCount(max);
  const hasMax = normalizedMax !== undefined;
  const childrenToShow = hasMax ? validChildren.slice(0, normalizedMax) : validChildren;

  const normalizedTotal = normalizeCount(total);
  const effectiveTotal = Math.max(validChildren.length, normalizedTotal ?? 0);
  const excessCount = Math.max(0, effectiveTotal - childrenToShow.length);
  const hasClickableExcess = excessCount > 0 && onExcessClick !== undefined;
  const asChildElement =
    asChildCandidate &&
    isAsChildHost(asChildCandidate, clickableExcessHostNames) &&
    (!hasClickableExcess || canDelegateClickableExcess(asChildCandidate))
      ? asChildCandidate
      : null;
  const Component = (asChildElement ? Slot : 'div') as ElementType;

  const processedChildren = [
    ...childrenToShow.map((child, index) => {
      const childElement = child as React.ReactElement<AvatarGroupChildProps>;
      const userKey = `avatar-group:user:${String(childElement.key ?? index)}`;
      if (!isAvatarElement(childElement)) return cloneElement(childElement, { key: userKey });
      return cloneElement(childElement, {
        key: userKey,
        className: cx('avatar', childElement.props.className),
        size: childElement.props.size ?? size,
      });
    }),
    excessCount > 0 && (
      <AvatarGroupExcess
        key="avatar-group:internal:excess"
        count={excessCount}
        index={childrenToShow.length}
        onClick={onExcessClick}
      />
    ),
  ].filter(Boolean);

  return (
    <AvatarGroupContext.Provider value={contextValue}>
      <Component
        ref={mergedRef}
        className={cx(styles, className)}
        role={role ?? 'group'}
        aria-label={
          effectiveAriaLabelledBy
            ? undefined
            : (ariaLabel ?? (effectiveAriaLabel || isPresentationalRole ? undefined : labels.group))
        }
        aria-labelledby={ariaLabelledBy}
        tabIndex={overflowTabIndex}
        onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
          userOnKeyDown?.(event);
          handleHorizontalOverflowKeyDown(event);
        }}
        {...rest}
      >
        {asChildElement
          ? cloneElement(asChildElement, {
              children: processedChildren,
            })
          : processedChildren}
      </Component>
    </AvatarGroupContext.Provider>
  );
});

AvatarGroupRootImpl.displayName = 'AvatarGroup.Root';

/**
 * Provides the group layout, shared avatar size, and excess calculation.
 *
 * Non-element children are ignored for counting. Fractional and negative
 * `max` or `total` values are floored and clamped to zero. Horizontal
 * overflow becomes keyboard-focusable when appropriate, and arrow-key
 * handling is attached to the root. `asChild` accepts supported structural hosts.
 */
export const AvatarGroupRoot = AvatarGroupRootImpl as AvatarGroupComponent;

'use client';

import { ActionMotion } from '@/components/animations/ActionMotion';
import { cx } from '@/styled-system/css';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { ElementType, forwardRef } from 'react';
import type { SidebarItemProps } from './Sidebar.types';
import { useSidebar } from './SidebarContext';

/**
 * An individual interactive link or element within a SidebarGroup.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: ActionMotion, Radix Slot, Recipe: sidebar
 * ### Design Tokens
 * - colors: text.secondary -> brand.main (active)
 * ### Variant Logic
 * - Default: Sidebar link. Active: Highlighted with brand.surface background.
 * ### Accessibility
 * - Sets `aria-current="page"` for the active destination.
 * - Icons are rendered decorative; keep visible text in the item label.
 * ### AI Usage
 * - **DO**: Place inside `SidebarGroup` or the main sidebar content.
 * - **DO**: Use `asChild` for Next.js, Remix, or React Router links.
 * - **DON'T**: Use as a disclosure trigger for nested navigation; use a
 *   dedicated collapsible pattern for expandable groups.
 *
 * @example Sidebar destination
 * ```tsx
 * import { Sidebar, SidebarGroup, SidebarItem } from '@poffy-ui/react/navigation';
 *
 * <Sidebar aria-label="Workspace">
 *   <SidebarGroup>
 *     <SidebarItem href="/projects" isActive>Projects</SidebarItem>
 *   </SidebarGroup>
 * </Sidebar>
 * ```
 *
 * @example Router link
 * ```tsx
 * import { SidebarItem } from '@poffy-ui/react/navigation';
 *
 * <SidebarItem asChild icon={<ProjectIcon />} isActive>
 *   <NextLink href="/projects">Projects</NextLink>
 * </SidebarItem>
 * ```
 */
export const SidebarItem = forwardRef<HTMLElement, SidebarItemProps>((props, ref) => {
  const { children, className, isActive, icon, asChild, ...rest } = props;
  const { classes } = useSidebar();

  const Component = (asChild ? Slot : 'a') as ElementType;

  return (
    <ActionMotion asChild animationType="press" disabled={isActive}>
      <Component
        ref={ref}
        aria-current={isActive ? 'page' : undefined}
        data-active={isActive ? '' : undefined}
        className={cx(classes.item, className)}
        {...rest}
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        {asChild ? (
          <Slottable>{children}</Slottable>
        ) : (
          <span className={classes.itemLabel}>{children}</span>
        )}
      </Component>
    </ActionMotion>
  );
});

SidebarItem.displayName = 'SidebarItem';

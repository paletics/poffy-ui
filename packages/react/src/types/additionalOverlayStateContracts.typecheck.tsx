import {
  AlertDialog,
  AlertDialogTrigger,
  type ControlledAlertDialogProps,
  type UncontrolledAlertDialogProps,
} from '@/components/overlay/AlertDialog';
import {
  HoverCard,
  type ControlledHoverCardProps,
  type UncontrolledHoverCardProps,
} from '@/components/overlay/HoverCard';
import { DrawerTrigger } from '@/components/overlay/Drawer';
import { ModalTrigger } from '@/components/overlay/Modal';
import {
  CommandMenu,
  type ControlledCommandMenuOpenProps,
  type ControlledCommandMenuQueryProps,
  type UncontrolledCommandMenuOpenProps,
  type UncontrolledCommandMenuQueryProps,
} from '@/components/navigation/CommandMenu';
import type { ComponentProps } from 'react';

const controlledAlertDialog = {
  open: true,
  onOpenChange: (_open: boolean) => undefined,
} satisfies ControlledAlertDialogProps;
const uncontrolledAlertDialog = { defaultOpen: true } satisfies UncontrolledAlertDialogProps;
<AlertDialog {...controlledAlertDialog} />;
<AlertDialog {...uncontrolledAlertDialog} />;
// @ts-expect-error Controlled AlertDialog requires an update callback.
<AlertDialog open />;
// @ts-expect-error Controlled AlertDialog cannot also receive defaultOpen.
<AlertDialog open onOpenChange={() => undefined} defaultOpen />;

const controlledHoverCard = {
  open: true,
  onOpenChange: (_open: boolean) => undefined,
} satisfies ControlledHoverCardProps;
const uncontrolledHoverCard = { defaultOpen: true } satisfies UncontrolledHoverCardProps;
<HoverCard {...controlledHoverCard} />;
<HoverCard {...uncontrolledHoverCard} />;
// @ts-expect-error Controlled HoverCard requires an update callback.
<HoverCard open />;
// @ts-expect-error Controlled HoverCard cannot also receive defaultOpen.
<HoverCard open onOpenChange={() => undefined} defaultOpen />;

const controlledCommandOpen = {
  open: true,
  onOpenChange: (_open: boolean) => undefined,
} satisfies ControlledCommandMenuOpenProps;
const uncontrolledCommandOpen = {
  defaultOpen: true,
} satisfies UncontrolledCommandMenuOpenProps;
const controlledCommandQuery = {
  query: 'settings',
  onQueryChange: (_query: string) => undefined,
} satisfies ControlledCommandMenuQueryProps;
const uncontrolledCommandQuery = {
  defaultQuery: 'settings',
} satisfies UncontrolledCommandMenuQueryProps;

<CommandMenu items={[]} {...uncontrolledCommandOpen} {...uncontrolledCommandQuery} />;
<CommandMenu items={[]} {...controlledCommandOpen} {...uncontrolledCommandQuery} />;
<CommandMenu items={[]} {...uncontrolledCommandOpen} {...controlledCommandQuery} />;
<CommandMenu items={[]} {...controlledCommandOpen} {...controlledCommandQuery} />;
// @ts-expect-error Controlled CommandMenu open state requires onOpenChange.
<CommandMenu items={[]} open />;
// @ts-expect-error Controlled CommandMenu open state cannot also receive defaultOpen.
<CommandMenu items={[]} open onOpenChange={() => undefined} defaultOpen />;
// @ts-expect-error Controlled CommandMenu query state requires onQueryChange.
<CommandMenu items={[]} query="settings" />;
// @ts-expect-error Controlled CommandMenu query state cannot also receive defaultQuery.
<CommandMenu items={[]} query="settings" onQueryChange={() => undefined} defaultQuery="open" />;

// @ts-expect-error Dialog triggers own their native button type.
<ModalTrigger type="submit">Open</ModalTrigger>;
// @ts-expect-error Dialog triggers own their native button type.
<DrawerTrigger type="submit">Open</DrawerTrigger>;
// @ts-expect-error AlertDialogTrigger owns its native button type.
<AlertDialogTrigger type="submit">Open</AlertDialogTrigger>;

const alertDialogTriggerExpanded = {
  // @ts-expect-error AlertDialogTrigger derives expanded state from its root.
  'aria-expanded': true,
} satisfies ComponentProps<typeof AlertDialogTrigger>;
const modalTriggerControls = {
  // @ts-expect-error ModalTrigger owns the dialog relationship.
  'aria-controls': 'dialog',
} satisfies ComponentProps<typeof ModalTrigger>;
const drawerTriggerDisabled = {
  // @ts-expect-error DrawerTrigger derives disabled semantics from disabled.
  'aria-disabled': true,
} satisfies ComponentProps<typeof DrawerTrigger>;

void alertDialogTriggerExpanded;
void modalTriggerControls;
void drawerTriggerDisabled;

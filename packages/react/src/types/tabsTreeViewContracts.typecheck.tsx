import { createRef, type ComponentProps } from 'react';
import {
  TabContent,
  TabList,
  TabTrigger,
  Tabs,
  type ControlledTabsProps,
  type UncontrolledTabsProps,
} from '@/components/navigation/Tabs';
import {
  TreeView,
  type ControlledTreeViewExpandedProps,
  type ControlledTreeViewSelectedProps,
  type UncontrolledTreeViewExpandedProps,
  type UncontrolledTreeViewSelectedProps,
} from '@/components/tree-view';

const controlledTabs = {
  value: 'overview',
  onValueChange: (_value: string) => undefined,
} satisfies ControlledTabsProps;
const uncontrolledTabs = { defaultValue: 'overview' } satisfies UncontrolledTabsProps;
<Tabs {...controlledTabs} />;
<Tabs {...uncontrolledTabs} />;
// @ts-expect-error Controlled Tabs require an onValueChange callback.
<Tabs value="overview" />;
// @ts-expect-error Controlled Tabs cannot also receive defaultValue.
<Tabs value="overview" onValueChange={() => undefined} defaultValue="fallback" />;
// @ts-expect-error Tabs owns its fixed root host.
<Tabs asChild />;
// @ts-expect-error TabList owns its fixed tablist host.
<TabList asChild />;
// @ts-expect-error TabContent owns its fixed panel host.
<TabContent asChild value="overview" />;

const defaultTriggerRef = createRef<HTMLButtonElement>();
const delegatedTriggerRef = createRef<HTMLElement>();
<TabTrigger ref={defaultTriggerRef} value="overview">
  Overview
</TabTrigger>;
<TabTrigger ref={delegatedTriggerRef} value="overview" asChild>
  <span>Overview</span>
</TabTrigger>;
<TabTrigger
  ref={defaultTriggerRef}
  value="native-events"
  onClick={(event) => {
    const form: HTMLFormElement | null = event.currentTarget.form;
    void form;
  }}
>
  Native events
</TabTrigger>;
<TabTrigger
  ref={delegatedTriggerRef}
  value="delegated-events"
  asChild
  onClick={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
    // @ts-expect-error Delegated tab events are not typed as native button events.
    void event.currentTarget.form;
  }}
>
  <span>Delegated events</span>
</TabTrigger>;
const triggerProps: ComponentProps<typeof TabTrigger> = {
  asChild: true,
  children: <span>Overview</span>,
  value: 'overview',
};
// @ts-expect-error asChild requires one React element.
const invalidTriggerProps: ComponentProps<typeof TabTrigger> = {
  asChild: true,
  children: 'Overview',
  value: 'overview',
};
const invalidTriggerSelected = {
  value: 'overview',
  // @ts-expect-error TabTrigger owns selected state.
  'aria-selected': true,
} satisfies ComponentProps<typeof TabTrigger>;

const controlledExpanded = {
  expandedIds: [],
  onExpandedChange: (_ids: string[]) => undefined,
} satisfies ControlledTreeViewExpandedProps;
const uncontrolledExpanded = {
  defaultExpandedIds: [],
} satisfies UncontrolledTreeViewExpandedProps;
const controlledSelected = {
  selectedIds: [],
  onSelectedChange: (_ids: string[]) => undefined,
} satisfies ControlledTreeViewSelectedProps;
const uncontrolledSelected = {
  defaultSelectedIds: [],
} satisfies UncontrolledTreeViewSelectedProps;

<TreeView.Root {...controlledExpanded} {...controlledSelected} />;
<TreeView.Root {...controlledExpanded} {...uncontrolledSelected} />;
<TreeView.Root {...uncontrolledExpanded} {...controlledSelected} />;
<TreeView.Root {...uncontrolledExpanded} {...uncontrolledSelected} />;
<TreeView data={[]} {...controlledExpanded} {...controlledSelected} />;
<TreeView data={[]} {...controlledExpanded} {...uncontrolledSelected} />;
<TreeView data={[]} {...uncontrolledExpanded} {...controlledSelected} />;
<TreeView data={[]} {...uncontrolledExpanded} {...uncontrolledSelected} />;
// @ts-expect-error Controlled expansion requires onExpandedChange.
<TreeView.Root expandedIds={[]} />;
// @ts-expect-error Controlled selection requires onSelectedChange.
<TreeView.Root selectedIds={[]} />;
// @ts-expect-error Controlled expansion cannot also receive a default.
<TreeView.Root expandedIds={[]} onExpandedChange={() => undefined} defaultExpandedIds={[]} />;
// @ts-expect-error TreeView root owns tree semantics.
<TreeView.Root role="list" />;
const invalidTreeItemSelected = {
  id: 'item',
  // @ts-expect-error TreeView items own selected state.
  'aria-selected': true,
} satisfies ComponentProps<typeof TreeView.Item>;
// @ts-expect-error TreeView content owns group semantics.
<TreeView.Content role="list" />;

void triggerProps;
void invalidTriggerProps;
void invalidTriggerSelected;
void invalidTreeItemSelected;

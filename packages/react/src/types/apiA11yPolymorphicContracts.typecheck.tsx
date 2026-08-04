import { createRef, type ComponentPropsWithoutRef, type ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ButtonGroup } from '@/components/inputs/ButtonGroup';
import { Calendar } from '@/components/inputs/Calendar';
import { Checkbox } from '@/components/inputs/Checkbox';
import { FormLabel } from '@/components/inputs/FormControl';
import { SidebarItem } from '@/components/navigation/Sidebar';
import { Backdrop } from '@/components/overlay/Backdrop';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalTitle,
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/overlay';
import {
  TreeViewItem,
  TreeViewLabel,
  TreeViewRoot,
  type TreeViewLabelAsChildProps,
} from '@/components/tree-view';
import type { ModalTitleProps } from '@/components/overlay/Modal';

const anchorRef = createRef<HTMLAnchorElement>();
const divRef = createRef<HTMLDivElement>();
const elementRef = createRef<Element>();
const htmlElementRef = createRef<HTMLElement>();
const spanRef = createRef<HTMLSpanElement>();
declare const buttonElement: ReactElement<ComponentPropsWithoutRef<'button'>, 'button'>;

<SidebarItem href="/docs" ref={anchorRef} onClick={(event) => void event.currentTarget.href}>
  Docs
</SidebarItem>;
<SidebarItem ref={spanRef} onClick={(event) => void event.currentTarget.dataset}>
  Static
</SidebarItem>;
<SidebarItem asChild ref={htmlElementRef}>
  <a href="/router">Router</a>
</SidebarItem>;
// @ts-expect-error FormLabel owns a fixed native label host.
<FormLabel asChild>
  <label>Label</label>
</FormLabel>;
// @ts-expect-error Calendar owns its group role.
<Calendar role="application" />;
// @ts-expect-error Calendar owns a fixed div root.
<Calendar asChild>
  <section />
</Calendar>;
// @ts-expect-error Checkbox.Control owns a fixed span host.
<Checkbox.Control asChild>
  <span />
</Checkbox.Control>;
// @ts-expect-error Checkbox.Label owns a fixed span host.
<Checkbox.Label asChild>
  <span />
</Checkbox.Label>;

<TreeViewRoot>
  <TreeViewItem id="docs">
    <TreeViewLabel ref={spanRef}>Docs</TreeViewLabel>
    <TreeViewLabel asChild ref={htmlElementRef}>
      <strong>Important</strong>
    </TreeViewLabel>
  </TreeViewItem>
</TreeViewRoot>;
// @ts-expect-error Tree labels delegate only to passive native text hosts.
const invalidTreeLabelHost: TreeViewLabelAsChildProps['children'] = buttonElement;

<ButtonGroup ref={divRef} />;
<ButtonGroup asChild ref={htmlElementRef}>
  <section />
</ButtonGroup>;
<EmptyState ref={divRef}>Empty</EmptyState>;
<EmptyState asChild ref={htmlElementRef}>
  <main />
</EmptyState>;
<Backdrop ref={divRef} />;
<Backdrop asChild lockScroll={false} ref={htmlElementRef}>
  <aside />
</Backdrop>;
// @ts-expect-error A delegated Backdrop cannot own document scroll locking.
<Backdrop asChild lockScroll>
  <section />
</Backdrop>;

<Popover triggerMode="manual" open onOpenChange={() => undefined}>
  <PopoverAnchor asChild ref={elementRef}>
    <svg />
  </PopoverAnchor>
  <PopoverContent aria-label="Details">Details</PopoverContent>
</Popover>;

<Modal defaultOpen>
  <ModalContent>
    <ModalTitle asChild ref={htmlElementRef}>
      <h3>Title</h3>
    </ModalTitle>
    <ModalDescription asChild ref={htmlElementRef}>
      <div>Description</div>
    </ModalDescription>
    <ModalBody asChild ref={htmlElementRef}>
      <section>Body</section>
    </ModalBody>
  </ModalContent>
</Modal>;
type ModalTitleAsChildProps = Extract<ModalTitleProps, { asChild: true }>;
// @ts-expect-error Overlay titles reject interactive delegated hosts.
const invalidModalTitleHost: ModalTitleAsChildProps['children'] = buttonElement;

void [
  anchorRef,
  divRef,
  elementRef,
  htmlElementRef,
  invalidModalTitleHost,
  invalidTreeLabelHost,
  spanRef,
];

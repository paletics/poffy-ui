import { createRef, type ComponentProps } from 'react';
import {
  Avatar,
  type AvatarAsChildProps,
  type AvatarComponent,
  type AvatarDefaultProps,
} from '@/components/data-display';
import {
  ProgressBar,
  type ProgressBarAsChildProps,
  type ProgressBarComponent,
  type ProgressBarDefaultProps,
  Skeleton,
  type SkeletonAsChildProps,
  type SkeletonComponent,
  type SkeletonDefaultProps,
} from '@/components/feedback';
import {
  Button,
  ButtonPrimitive,
  CloseButton,
  CopyButton,
  DirectionalButton,
  FormControl,
  PressablePrimitive,
  ToggleButton,
  type ButtonAsChildProps,
  type ButtonComponent,
  type ButtonDefaultProps,
  type ButtonPrimitiveAsChildProps,
  type ButtonPrimitiveComponent,
  type ButtonPrimitiveDefaultProps,
  type CloseButtonAsChildProps,
  type CloseButtonComponent,
  type CloseButtonDefaultProps,
  type CopyButtonAsChildProps,
  type CopyButtonComponent,
  type CopyButtonDefaultProps,
  type DirectionalButtonAsChildProps,
  type DirectionalButtonComponent,
  type DirectionalButtonDefaultProps,
  type FormControlAsChildProps,
  type FormControlComponent,
  type FormControlDefaultProps,
  type PressablePrimitiveAsChildProps,
  type PressablePrimitiveComponent,
  type PressablePrimitiveDefaultProps,
  type ToggleButtonAsChildProps,
  type ToggleButtonComponent,
  type ToggleButtonDefaultProps,
} from '@/components/inputs';
import {
  DropdownItem,
  NavbarBrand,
  NavbarLink,
  SidebarItem,
  TabTrigger,
  type DropdownItemAsChildProps,
  type DropdownItemComponent,
  type DropdownItemDefaultProps,
  type NavbarBrandAnchorProps,
  type NavbarBrandAsChildProps,
  type NavbarBrandComponent,
  type NavbarBrandSpanProps,
  type NavbarLinkAnchorProps,
  type NavbarLinkAsChildProps,
  type NavbarLinkComponent,
  type NavbarLinkSpanProps,
  type TabTriggerAsChildProps,
  type TabTriggerComponent,
  type TabTriggerDefaultProps,
} from '@/components/navigation';
import {
  Link,
  type LinkAnchorProps,
  type LinkAsChildProps,
  type LinkComponent,
  type LinkSpanProps,
} from '@/components/typography';

const anchorRef = createRef<HTMLAnchorElement>();
const buttonRef = createRef<HTMLButtonElement>();
const divRef = createRef<HTMLDivElement>();
const elementRef = createRef<HTMLElement>();
const spanRef = createRef<HTMLSpanElement>();
const svgRef = createRef<SVGSVGElement>();

const componentPropsContracts = [
  { children: 'Field' } satisfies ComponentProps<typeof FormControl>,
  { asChild: true, children: <section /> } satisfies ComponentProps<typeof FormControl>,
  {} satisfies ComponentProps<typeof Avatar>,
  { asChild: true, children: <a href="/" /> } satisfies ComponentProps<typeof Avatar>,
  {} satisfies ComponentProps<typeof Skeleton>,
  { asChild: true, children: <output /> } satisfies ComponentProps<typeof Skeleton>,
  { label: '64%' } satisfies ComponentProps<typeof ProgressBar>,
  {
    asChild: true,
    children: <section />,
    label: '64%',
  } satisfies ComponentProps<typeof ProgressBar>,
  { children: 'Action' } satisfies ComponentProps<typeof Button>,
  { asChild: true, children: <a href="/" /> } satisfies ComponentProps<typeof Button>,
  {} satisfies ComponentProps<typeof CloseButton>,
  { asChild: true, children: <span /> } satisfies ComponentProps<typeof CloseButton>,
  { value: 'copy' } satisfies ComponentProps<typeof CopyButton>,
  {
    asChild: true,
    children: <span />,
    value: 'copy',
  } satisfies ComponentProps<typeof CopyButton>,
  {} satisfies ComponentProps<typeof DirectionalButton>,
  {
    asChild: true,
    children: <a href="/" />,
  } satisfies ComponentProps<typeof DirectionalButton>,
  { children: 'Toggle' } satisfies ComponentProps<typeof ToggleButton>,
  {
    asChild: true,
    children: <span>Toggle</span>,
  } satisfies ComponentProps<typeof ToggleButton>,
  { children: 'Action' } satisfies ComponentProps<typeof ButtonPrimitive>,
  { asChild: true, children: <a href="/" /> } satisfies ComponentProps<typeof ButtonPrimitive>,
  { children: 'Action' } satisfies ComponentProps<typeof PressablePrimitive>,
  { asChild: true, children: <a href="/" /> } satisfies ComponentProps<typeof PressablePrimitive>,
  { children: 'Item' } satisfies ComponentProps<typeof DropdownItem>,
  { asChild: true, children: <li>Item</li> } satisfies ComponentProps<typeof DropdownItem>,
  { value: 'first', children: 'First' } satisfies ComponentProps<typeof TabTrigger>,
  {
    asChild: true,
    value: 'first',
    children: <span>First</span>,
  } satisfies ComponentProps<typeof TabTrigger>,
  { href: '/', children: 'Link' } satisfies ComponentProps<typeof Link>,
  { children: 'Text' } satisfies ComponentProps<typeof Link>,
  { asChild: true, children: <a href="/" /> } satisfies ComponentProps<typeof Link>,
];

const publicBranchContracts = [
  { children: 'Field' } satisfies FormControlDefaultProps,
  { asChild: true, children: <section /> } satisfies FormControlAsChildProps,
  {} satisfies AvatarDefaultProps,
  { asChild: true, children: <a href="/" /> } satisfies AvatarAsChildProps,
  {} satisfies SkeletonDefaultProps,
  { asChild: true, children: <output /> } satisfies SkeletonAsChildProps,
  { label: '64%' } satisfies ProgressBarDefaultProps,
  {
    asChild: true,
    children: <section />,
    label: '64%',
  } satisfies ProgressBarAsChildProps,
  { children: 'Button' } satisfies ButtonDefaultProps,
  { asChild: true, children: <a href="/" /> } satisfies ButtonAsChildProps,
  {} satisfies CloseButtonDefaultProps,
  { asChild: true, children: <span /> } satisfies CloseButtonAsChildProps,
  { value: 'copy' } satisfies CopyButtonDefaultProps,
  {
    asChild: true,
    children: <span />,
    value: 'copy',
  } satisfies CopyButtonAsChildProps,
  {} satisfies DirectionalButtonDefaultProps,
  {
    asChild: true,
    children: <a href="/" />,
  } satisfies DirectionalButtonAsChildProps,
  { children: 'Toggle' } satisfies ToggleButtonDefaultProps,
  {
    asChild: true,
    children: <span>Toggle</span>,
  } satisfies ToggleButtonAsChildProps,
  { children: 'Button' } satisfies ButtonPrimitiveDefaultProps,
  { asChild: true, children: <a href="/" /> } satisfies ButtonPrimitiveAsChildProps,
  { children: 'Button' } satisfies PressablePrimitiveDefaultProps,
  { asChild: true, children: <a href="/" /> } satisfies PressablePrimitiveAsChildProps,
  { children: 'Item' } satisfies DropdownItemDefaultProps,
  { asChild: true, children: <li>Item</li> } satisfies DropdownItemAsChildProps,
  { value: 'first', children: 'First' } satisfies TabTriggerDefaultProps,
  {
    asChild: true,
    value: 'first',
    children: <span>First</span>,
  } satisfies TabTriggerAsChildProps,
  { href: '/', children: 'Link' } satisfies LinkAnchorProps,
  { children: 'Text' } satisfies LinkSpanProps,
  { asChild: true, children: <a href="/" /> } satisfies LinkAsChildProps,
  { href: '/', children: 'Brand' } satisfies NavbarBrandAnchorProps,
  { children: 'Brand' } satisfies NavbarBrandSpanProps,
  { asChild: true, children: <a href="/" /> } satisfies NavbarBrandAsChildProps,
  { href: '/', children: 'Link' } satisfies NavbarLinkAnchorProps,
  { children: 'Text' } satisfies NavbarLinkSpanProps,
  { asChild: true, children: <a href="/" /> } satisfies NavbarLinkAsChildProps,
];

const publicComponentContracts: [
  FormControlComponent,
  AvatarComponent,
  SkeletonComponent,
  ProgressBarComponent,
  ButtonComponent,
  CloseButtonComponent,
  CopyButtonComponent,
  DirectionalButtonComponent,
  ToggleButtonComponent,
  ButtonPrimitiveComponent,
  PressablePrimitiveComponent,
  DropdownItemComponent,
  TabTriggerComponent,
  LinkComponent,
  NavbarBrandComponent,
  NavbarLinkComponent,
] = [
  FormControl,
  Avatar,
  Skeleton,
  ProgressBar,
  Button,
  CloseButton,
  CopyButton,
  DirectionalButton,
  ToggleButton,
  ButtonPrimitive,
  PressablePrimitive,
  DropdownItem,
  TabTrigger,
  Link,
  NavbarBrand,
  NavbarLink,
];

<FormControl ref={divRef}>Field</FormControl>;
<FormControl asChild ref={elementRef}>
  <section />
</FormControl>;
<Avatar ref={spanRef} />;
<Avatar asChild ref={elementRef}>
  <a href="/">Avatar</a>
</Avatar>;
<Avatar.Root asChild ref={elementRef}>
  <div />
</Avatar.Root>;
<Avatar.Fallback asChild ref={elementRef}>
  <span>Avatar</span>
</Avatar.Fallback>;
<Skeleton ref={spanRef} />;
<Skeleton asChild ref={elementRef}>
  <output />
</Skeleton>;
<ProgressBar ref={spanRef} label="64%" />;
<ProgressBar asChild ref={elementRef} label="64%">
  <section />
</ProgressBar>;
// @ts-expect-error Default-host children were removed; use the explicit label prop.
<ProgressBar>64%</ProgressBar>;
// @ts-expect-error Delegation requires exactly one host child.
<ProgressBar asChild label="64%" />;
<Button ref={buttonRef}>Button</Button>;
<CloseButton
  ref={buttonRef}
  onClick={(event) => {
    const form: HTMLFormElement | null = event.currentTarget.form;
    void form;
  }}
/>;
<CloseButton
  asChild
  ref={elementRef}
  onClick={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
    // @ts-expect-error Delegated close events are not native button events.
    void event.currentTarget.form;
  }}
>
  <span>Close</span>
</CloseButton>;
<CopyButton
  ref={buttonRef}
  value="copy"
  onClick={(event) => {
    const form: HTMLFormElement | null = event.currentTarget.form;
    void form;
  }}
/>;
<CopyButton
  asChild
  ref={elementRef}
  value="copy"
  onClick={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
    // @ts-expect-error Delegated copy events are not native button events.
    void event.currentTarget.form;
  }}
>
  <span>Copy</span>
</CopyButton>;
<DirectionalButton
  ref={buttonRef}
  onClick={(event) => {
    const form: HTMLFormElement | null = event.currentTarget.form;
    void form;
  }}
/>;
<DirectionalButton
  asChild
  ref={elementRef}
  onClick={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
    // @ts-expect-error Delegated directional events are not native button events.
    void event.currentTarget.form;
  }}
>
  <a href="/">Next</a>
</DirectionalButton>;
<ToggleButton
  ref={buttonRef}
  onClick={(event) => {
    const form: HTMLFormElement | null = event.currentTarget.form;
    void form;
  }}
>
  Toggle
</ToggleButton>;
<ToggleButton
  asChild
  ref={elementRef}
  onClick={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
    // @ts-expect-error Delegated toggle events are not native button events.
    void event.currentTarget.form;
  }}
>
  <span>Toggle</span>
</ToggleButton>;
<ButtonPrimitive ref={buttonRef}>Button</ButtonPrimitive>;
<PressablePrimitive ref={buttonRef}>Button</PressablePrimitive>;
<ButtonPrimitive
  asChild
  ref={elementRef}
  onClick={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
    // @ts-expect-error Delegated events are not typed as native button events.
    void event.currentTarget.form;
  }}
>
  <a href="/">Primitive link</a>
</ButtonPrimitive>;
<PressablePrimitive
  asChild
  ref={elementRef}
  onPress={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
    // @ts-expect-error Delegated press events are not typed as native button events.
    void event.currentTarget.form;
  }}
>
  <a href="/">Pressable link</a>
</PressablePrimitive>;
<DropdownItem
  ref={buttonRef}
  onClick={(event) => {
    const form: HTMLFormElement | null = event.currentTarget.form;
    void form;
  }}
>
  Native item
</DropdownItem>;
<TabTrigger
  value="first"
  ref={buttonRef}
  onClick={(event) => {
    const form: HTMLFormElement | null = event.currentTarget.form;
    void form;
  }}
>
  First
</TabTrigger>;
<TabTrigger
  value="first"
  asChild
  ref={elementRef}
  onClick={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
    // @ts-expect-error Delegated tab events are not native button events.
    void event.currentTarget.form;
  }}
>
  <span>First</span>
</TabTrigger>;
<DropdownItem
  asChild
  ref={elementRef}
  onClick={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
    // @ts-expect-error Delegated item events are not native button events.
    void event.currentTarget.form;
  }}
>
  <li>Delegated item</li>
</DropdownItem>;
<PressablePrimitive
  ref={buttonRef}
  onPress={(event) => {
    const form: HTMLFormElement | null = event.currentTarget.form;
    void form;
  }}
>
  Native pressable
</PressablePrimitive>;
<Link href="/" ref={anchorRef}>
  Link
</Link>;
<Link ref={spanRef}>Text</Link>;
<NavbarBrand href="/" ref={anchorRef}>
  Brand
</NavbarBrand>;
<NavbarBrand ref={spanRef}>Brand</NavbarBrand>;
<NavbarLink href="/" ref={anchorRef}>
  Link
</NavbarLink>;
<NavbarLink ref={spanRef}>Text</NavbarLink>;

<Button
  asChild
  ref={elementRef}
  onClick={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
    // @ts-expect-error Delegated events are retargeted to HTMLElement, not HTMLButtonElement.
    void event.currentTarget.form;
  }}
>
  <a href="/">Link button</a>
</Button>;

<Button
  ref={buttonRef}
  onClick={(event) => {
    const form: HTMLFormElement | null = event.currentTarget.form;
    void form;
  }}
>
  Native button
</Button>;

// @ts-expect-error Shorthand labels cannot be combined with delegated FormControl roots.
<FormControl asChild label="Field">
  <section />
</FormControl>;
// @ts-expect-error FormControl owns the group role.
<FormControl role="presentation">Field</FormControl>;
// @ts-expect-error The default Avatar host forwards a span ref.
<Avatar ref={svgRef} />;
// @ts-expect-error Avatar owns root visibility through decorative state.
<Avatar aria-hidden />;
// @ts-expect-error Avatar owns its aggregate image status.
<Avatar.Root data-status="loaded" />;
// Decorative delegated hosts remain accepted; runtime falls back when the host may be interactive.
<Avatar decorative asChild>
  <button type="button">Decorative avatar</button>
</Avatar>;
// @ts-expect-error Avatar.Image owns its pending resource marker.
<Avatar.Image src="/avatar.jpg" alt="Avatar" data-loading="stale" />;
// @ts-expect-error Decorative Avatar images cannot expose an aria-label.
<Avatar.Image decorative src="/avatar.jpg" aria-label="Avatar" />;
// @ts-expect-error Decorative Avatar images cannot expose an aria-labelledby relationship.
<Avatar.Image decorative src="/avatar.jpg" aria-labelledby="avatar-label" />;
// @ts-expect-error Native button-only form ownership props are not delegated.
<Button asChild form="settings">
  <a href="/">Save</a>
</Button>;
// @ts-expect-error Native button type belongs to the delegated child.
<Button asChild type="submit">
  <button>Save</button>
</Button>;
// @ts-expect-error Native button-only form ownership props are not delegated.
<ButtonPrimitive asChild formAction="/save">
  <a href="/">Save</a>
</ButtonPrimitive>;
// @ts-expect-error Native button type belongs to the delegated child.
<ButtonPrimitive asChild type="submit">
  <button>Save</button>
</ButtonPrimitive>;
// @ts-expect-error Native button-only form ownership props are not delegated.
<DirectionalButton asChild value="next">
  <a href="/next">Next</a>
</DirectionalButton>;
// @ts-expect-error DirectionalButton owns its non-submitting button type.
<DirectionalButton asChild type="submit">
  <button>Next</button>
</DirectionalButton>;
// @ts-expect-error Native button-only form ownership props are not delegated.
<PressablePrimitive asChild name="save">
  <a href="/">Save</a>
</PressablePrimitive>;
// @ts-expect-error Native button type belongs to the delegated child.
<PressablePrimitive asChild type="submit">
  <button>Save</button>
</PressablePrimitive>;
// @ts-expect-error Native button-only form ownership props are not delegated.
<DropdownItem asChild form="menu-form">
  <li>Item</li>
</DropdownItem>;
// @ts-expect-error Native button-only form ownership props are not delegated.
<TabTrigger value="first" asChild form="tabs-form">
  <span>First</span>
</TabTrigger>;
// @ts-expect-error Native button type belongs to the delegated child.
<TabTrigger value="first" asChild type="submit">
  <button>First</button>
</TabTrigger>;
<Link asChild href="/download" download="guide.pdf">
  <span>Download</span>
</Link>;
<NavbarBrand asChild href="/" download="brand.svg">
  <span>Brand</span>
</NavbarBrand>;
<NavbarLink asChild href="/download" download="guide.pdf">
  <span>Download</span>
</NavbarLink>;
<SidebarItem asChild href="/download" download="guide.pdf">
  <span>Download</span>
</SidebarItem>;
// @ts-expect-error Child-derived destinations keep native anchor-only props on the child.
<Link asChild download="guide.pdf">
  <a href="/download">Download</a>
</Link>;
// @ts-expect-error Child-derived destinations keep native anchor-only props on the child.
<NavbarBrand asChild hrefLang="en">
  <a href="/">Brand</a>
</NavbarBrand>;
// @ts-expect-error Child-derived destinations keep native anchor-only props on the child.
<NavbarLink asChild referrerPolicy="origin">
  <a href="/download">Download</a>
</NavbarLink>;
// @ts-expect-error Child-derived destinations keep native anchor-only props on the child.
<SidebarItem asChild download="guide.pdf">
  <a href="/download">Download</a>
</SidebarItem>;
// @ts-expect-error Anchor-only props are rejected by the non-navigational span branch.
<Link target="_blank">Text</Link>;
// @ts-expect-error Anchor-only props are rejected by the non-navigational span branch.
<NavbarLink download>Text</NavbarLink>;
// @ts-expect-error Anchor-only props are rejected by the non-navigational span branch.
<NavbarBrand target="_blank">Brand</NavbarBrand>;

void [
  componentPropsContracts,
  publicBranchContracts,
  publicComponentContracts,
  anchorRef,
  buttonRef,
  divRef,
  elementRef,
  spanRef,
  svgRef,
];

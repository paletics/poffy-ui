import { createRef, type ReactElement } from 'react';
import { Reference, ReferenceList } from '@/components/data-display/Reference';
import type {
  ReferenceLinkAsChildProps,
  ReferenceTextDefaultProps,
} from '@/components/data-display/Reference';
import { Alert } from '@/components/feedback/Alert';
import { ProgressBar } from '@/components/feedback/ProgressBar';
import { Skeleton } from '@/components/feedback/Skeleton';
import { Box } from '@/components/layout/Box';
import { ScrollArea } from '@/components/layout/ScrollArea';
import { Stack } from '@/components/layout/Stack';
import { Tooltip } from '@/components/overlay/Tooltip';
import { Text } from '@/components/typography/Text';
import type { SkeletonAsChildProps } from '@/components/feedback/Skeleton';

const elementRef = createRef<Element>();
const anchorRef = createRef<HTMLAnchorElement>();
const spanRef = createRef<HTMLSpanElement>();
const navRef = createRef<HTMLElement>();
declare const buttonElement: ReactElement<Record<string, unknown>, 'button'>;
declare const customElement: ReactElement<Record<string, unknown>, () => ReactElement>;
declare const spanElement: ReactElement<Record<string, unknown>, 'span'>;

<Box
  asChild
  ref={elementRef}
  bg="blue.400"
  _hover={{ opacity: 0.8 }}
  css={{ containerType: 'inline-size' }}
  onClick={(event) => {
    const host: Element = event.currentTarget;
    void host;
    // @ts-expect-error Delegated layout events are not fixed to a div host.
    void event.currentTarget.align;
  }}
>
  <svg />
</Box>;

<Stack asChild ref={elementRef} onMouseEnter={(event) => void event.currentTarget.ownerDocument}>
  <section />
</Stack>;
<Text asChild ref={elementRef} onMouseEnter={(event) => void event.currentTarget.ownerDocument}>
  <span>Text</span>
</Text>;
<Alert asChild ref={navRef} onMouseEnter={(event) => void event.currentTarget.ownerDocument}>
  <section>Alert</section>
</Alert>;
<Tooltip
  asChild
  ref={elementRef}
  content="Details"
  onMouseEnter={(event) => void event.currentTarget.ownerDocument}
>
  <svg />
</Tooltip>;

<Reference href="/docs" ref={anchorRef} onClick={(event) => void event.currentTarget.href} />;
<Reference ref={spanRef} onClick={(event) => void event.currentTarget.dataset} />;
<Reference asChild href="/docs" ref={anchorRef}>
  <a />
</Reference>;
<Reference asChild ref={spanRef}>
  <span />
</Reference>;
<ReferenceList asChild ref={navRef}>
  <nav />
</ReferenceList>;
// @ts-expect-error Link references delegate only to anchor hosts.
const invalidReferenceLinkHost: ReferenceLinkAsChildProps['children'] = spanElement;
// @ts-expect-error Passive references do not accept link-only target attributes.
const invalidReferenceTextProps: ReferenceTextDefaultProps = { target: '_blank' };

const validSkeletonHost: SkeletonAsChildProps['children'] = <span />;
// @ts-expect-error Skeleton delegates only to div, output, or span hosts.
const invalidSkeletonButton: SkeletonAsChildProps['children'] = buttonElement;
// @ts-expect-error Skeleton rejects opaque custom delegated hosts.
const invalidSkeletonCustom: SkeletonAsChildProps['children'] = customElement;
// @ts-expect-error Static Skeleton slots do not forward Motion drag callbacks.
<Skeleton asChild onDrag={() => undefined}>
  <span />
</Skeleton>;
// @ts-expect-error Skeleton owns its hidden semantics.
<Skeleton aria-hidden={false} />;
// @ts-expect-error Skeleton owns its inert semantics.
<Skeleton inert={false} />;

// @ts-expect-error ProgressBar owns its progressbar role.
<ProgressBar role="progressbar" />;
// @ts-expect-error ProgressBar derives aria-valuenow from progressPercent.
<ProgressBar aria-valuenow={50} />;

// @ts-expect-error ScrollArea owns its viewport role.
<ScrollArea role="region">Content</ScrollArea>;
// @ts-expect-error Use viewportTabIndex for ScrollArea focus ownership.
<ScrollArea tabIndex={0}>Content</ScrollArea>;
<ScrollArea
  viewportTabIndex={0}
  onScroll={(event) => {
    const viewport: HTMLDivElement = event.currentTarget;
    void viewport;
  }}
>
  Content
</ScrollArea>;

void [
  anchorRef,
  elementRef,
  invalidSkeletonButton,
  invalidSkeletonCustom,
  invalidReferenceLinkHost,
  invalidReferenceTextProps,
  navRef,
  spanRef,
  validSkeletonHost,
];

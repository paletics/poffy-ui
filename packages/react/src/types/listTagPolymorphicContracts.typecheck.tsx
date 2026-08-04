import { createRef, type ReactElement } from 'react';
import { List } from '@/components/data-display/List';
import type {
  ListOrderedAsChildProps,
  ListUnorderedAsChildProps,
} from '@/components/data-display/List/List.types';
import { Tag } from '@/components/data-display/Tag';
import type { TagCloseButtonAsChildProps } from '@/components/data-display/Tag/Tag.types';

const buttonRef = createRef<HTMLButtonElement>();
const elementRef = createRef<HTMLElement>();
const orderedListRef = createRef<HTMLOListElement>();
const spanRef = createRef<HTMLSpanElement>();
const unorderedListRef = createRef<HTMLUListElement>();
const _OpaqueCloseHost = () => <span />;

declare const customListHost: ReactElement<Record<string, unknown>, () => ReactElement>;
declare const orderedListHost: ReactElement<Record<string, unknown>, 'ol'>;
declare const unorderedListHost: ReactElement<Record<string, unknown>, 'ul'>;
declare const opaqueCloseHost: ReactElement<Record<string, unknown>, typeof _OpaqueCloseHost>;

<List ref={unorderedListRef} />;
<List variant="ordered" ref={orderedListRef} />;
<List asChild ref={unorderedListRef}>
  <ul />
</List>;
<List asChild variant="ordered" ref={orderedListRef}>
  <ol />
</List>;

<Tag ref={spanRef}>Tag</Tag>;
<Tag
  onClick={(event) => {
    const host: HTMLSpanElement = event.currentTarget;
    void host;
  }}
>
  Tag
</Tag>;
<Tag
  asChild
  ref={elementRef}
  onClick={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
    // @ts-expect-error Delegated Tag events are not fixed to span hosts.
    void event.currentTarget.align;
  }}
>
  <div />
</Tag>;
<Tag.Label asChild ref={elementRef}>
  <em>Label</em>
</Tag.Label>;
<Tag.CloseButton ref={buttonRef} />;
<Tag.CloseButton
  asChild
  ref={elementRef}
  onClick={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
    // @ts-expect-error Delegated close events are not fixed to button hosts.
    void event.currentTarget.form;
  }}
>
  <a href="/remove">Remove</a>
</Tag.CloseButton>;

// @ts-expect-error Unordered List delegates only to a native ul.
const invalidUnorderedHost: ListUnorderedAsChildProps['children'] = orderedListHost;
// @ts-expect-error Ordered List delegates only to a native ol.
const invalidOrderedHost: ListOrderedAsChildProps['children'] = unorderedListHost;
// @ts-expect-error List roots reject opaque custom delegated hosts.
const invalidCustomListHost: ListUnorderedAsChildProps['children'] = customListHost;
// @ts-expect-error Tag.CloseButton rejects opaque custom delegated hosts.
const invalidCloseHost: TagCloseButtonAsChildProps['children'] = opaqueCloseHost;
void [invalidUnorderedHost, invalidOrderedHost, invalidCustomListHost, invalidCloseHost];

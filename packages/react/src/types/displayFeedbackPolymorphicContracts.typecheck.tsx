import { createRef, type ReactElement } from 'react';
import { AvatarGroup } from '@/components/data-display/AvatarGroup';
import type { AvatarGroupAsChildProps } from '@/components/data-display/AvatarGroup/AvatarGroup.types';
import { Badge } from '@/components/data-display/Badge';
import { Stat } from '@/components/data-display/Stat';
import type { StatAsChildProps } from '@/components/data-display/Stat/Stat.types';
import { CircleProgress } from '@/components/feedback/CircleProgress';
import type { CircleProgressAsChildProps } from '@/components/feedback/CircleProgress/CircleProgress.types';
import { Spinner } from '@/components/feedback/Spinner';
import type { SpinnerAsChildProps } from '@/components/feedback/Spinner/Spinner.types';
import { Divider } from '@/components/layout/Divider';

const divRef = createRef<HTMLDivElement>();
const elementRef = createRef<HTMLElement>();
const spanRef = createRef<HTMLSpanElement>();
const OpaqueHost = () => <section />;
declare const buttonHost: ReactElement<Record<string, unknown>, 'button'>;
declare const spanHost: ReactElement<Record<string, unknown>, 'span'>;
declare const opaqueHost: ReactElement<Record<string, unknown>, typeof OpaqueHost>;

<Badge ref={divRef} content="New" />;
<Badge asChild ref={elementRef} content="New">
  <button type="button">Inbox</button>
</Badge>;
<Badge.Root asChild ref={elementRef}>
  <button type="button">Inbox</button>
  <Badge.Indicator>New</Badge.Indicator>
</Badge.Root>;
<Badge.Indicator asChild ref={elementRef}>
  <strong>New</strong>
</Badge.Indicator>;

<Stat ref={divRef} />;
<Stat asChild ref={elementRef}>
  <section />
</Stat>;
<Stat.Label asChild ref={elementRef}>
  <span>Revenue</span>
</Stat.Label>;
<Stat.Number asChild ref={elementRef}>
  <p>42</p>
</Stat.Number>;

<AvatarGroup ref={divRef}>
  <span />
</AvatarGroup>;
<AvatarGroup asChild ref={elementRef}>
  <section>
    <span />
  </section>
</AvatarGroup>;

<CircleProgress ref={spanRef} value={50} />;
<CircleProgress asChild ref={elementRef} value={50}>
  <output />
</CircleProgress>;
<Spinner ref={spanRef} />;
<Spinner asChild ref={elementRef}>
  <div />
</Spinner>;

<Badge
  asChild
  content="New"
  onClick={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
    // @ts-expect-error Delegated Badge events are not fixed to div hosts.
    void event.currentTarget.align;
  }}
>
  <button type="button">Inbox</button>
</Badge>;

<CircleProgress
  asChild
  value={50}
  onClick={(event) => {
    const host: HTMLElement = event.currentTarget;
    void host;
  }}
>
  <div />
</CircleProgress>;

// @ts-expect-error CircleProgress delegates only to native div, output, or span hosts.
const invalidCircleHost: CircleProgressAsChildProps['children'] = buttonHost;
// @ts-expect-error Spinner delegates only to native div, output, or span hosts.
const invalidSpinnerHost: SpinnerAsChildProps['children'] = buttonHost;
// @ts-expect-error Stat roots delegate only to native article, div, or section hosts.
const invalidStatHost: StatAsChildProps['children'] = spanHost;
// @ts-expect-error AvatarGroup rejects opaque custom delegated hosts.
const invalidAvatarGroupHost: AvatarGroupAsChildProps['children'] = opaqueHost;
// @ts-expect-error Divider owns its semantic hr host.
<Divider asChild>
  <div />
</Divider>;

void [invalidCircleHost, invalidSpinnerHost, invalidStatHost, invalidAvatarGroupHost];

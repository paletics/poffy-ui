import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from '@/components/overlay/AlertDialog';
import { Alert, type AlertAsChildProps } from '@/components/feedback/Alert';
import { FileUploader } from '@/components/inputs/FileUploader';
import { Spacer } from '@/components/layout/Spacer';
import { HoverCard, HoverCardTrigger } from '@/components/overlay/HoverCard';
import { PopoverTrigger } from '@/components/overlay/Popover';
import { createRef, type ComponentPropsWithoutRef, type ReactElement } from 'react';

const buttonRef = createRef<HTMLButtonElement>();
const elementRef = createRef<HTMLElement>();
declare const buttonElement: ReactElement<ComponentPropsWithoutRef<'button'>, 'button'>;
declare const sectionElement: ReactElement<ComponentPropsWithoutRef<'section'>, 'section'>;
declare const svgElement: ReactElement<ComponentPropsWithoutRef<'svg'>, 'svg'>;
declare const customElement: ReactElement<Record<string, unknown>, () => ReactElement>;

<AlertDialog defaultOpen>
  <AlertDialogContent>
    <AlertDialogAction
      ref={buttonRef}
      form="settings"
      onClick={(event) => void event.currentTarget.form}
    >
      Save
    </AlertDialogAction>
    <AlertDialogCancel
      asChild
      ref={elementRef}
      onClick={(event) => {
        void event.currentTarget.ownerDocument;
        // @ts-expect-error Delegated events are not fixed to a button host.
        void event.currentTarget.form;
      }}
    >
      <span>Cancel</span>
    </AlertDialogCancel>
  </AlertDialogContent>
</AlertDialog>;

// @ts-expect-error Native button form ownership props are not delegated.
<AlertDialogAction asChild formAction="/save">
  <span>Save</span>
</AlertDialogAction>;
// @ts-expect-error Native button values are owned by a delegated button child.
<AlertDialogCancel asChild value="cancel">
  <span>Cancel</span>
</AlertDialogCancel>;
// @ts-expect-error Trigger wrappers do not delegate native button form attributes.
<PopoverTrigger asChild form="settings">
  <span>Open</span>
</PopoverTrigger>;
<PopoverTrigger form="settings">Open</PopoverTrigger>;

<Spacer ref={createRef<HTMLDivElement>()} />;
// @ts-expect-error Spacer has a fixed div host.
<Spacer asChild children={<span />} />;
// @ts-expect-error Spacer is decorative and cannot contain content.
<Spacer>Content</Spacer>;
// @ts-expect-error Spacer owns its accessibility-tree visibility.
<Spacer aria-hidden={false} />;
// @ts-expect-error Spacer cannot be focusable.
<Spacer tabIndex={0} />;

<FileUploader helperText="Drop PDF here" />;
<FileUploader.Root>
  <FileUploader.Zone helperText="Drop PDF here" />
</FileUploader.Root>;
// @ts-expect-error helperText belongs to the shorthand or Zone, not Root.
<FileUploader.Root helperText="Drop PDF here" />;
// @ts-expect-error The shorthand owns its compound children.
<FileUploader children={<FileUploader.Zone />} />;

<HoverCard disabled>
  <HoverCardTrigger>Profile</HoverCardTrigger>
</HoverCard>;
// @ts-expect-error HoverCard disabled state is owned by the root.
<HoverCardTrigger disabled>Profile</HoverCardTrigger>;

const validAlertHost: AlertAsChildProps['children'] = sectionElement;
// @ts-expect-error Alert delegates only to passive container hosts.
const invalidAlertButton: AlertAsChildProps['children'] = buttonElement;
// @ts-expect-error Alert rejects SVG delegated hosts.
const invalidAlertSvg: AlertAsChildProps['children'] = svgElement;
// @ts-expect-error Alert rejects opaque custom delegated hosts.
const invalidAlertCustom: AlertAsChildProps['children'] = customElement;

<Alert asChild ref={elementRef}>
  <article>Notice</article>
</Alert>;

void [
  buttonRef,
  customElement,
  elementRef,
  invalidAlertButton,
  invalidAlertCustom,
  invalidAlertSvg,
  validAlertHost,
];

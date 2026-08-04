import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  createRef,
  forwardRef,
  useState,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type MouseEvent,
} from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { filterFloatingFocusGuardAxeResults } from '@/testing/filterFloatingFocusGuardAxeResults';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './index';

const TestAlertDialog = ({ defaultOpen = true }: { defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>Delete project</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Delete project?</AlertDialogTitle>
        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        <AlertDialogBody>All project data will be permanently removed.</AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

/**
 * ### Test Strategy: AlertDialog
 * - **Focus**: alertdialog semantics, trigger wiring, controlled/uncontrolled
 *   state, protected dismissal behavior, and accessibility compliance.
 * - **DON'T**: Do not assert visual styling or animation timing.
 */
describe('AlertDialog', () => {
  it('renders alertdialog semantics when open', async () => {
    render(<TestAlertDialog />);

    const dialog = await screen.findByRole('alertdialog', { name: 'Delete project?' });
    const description = screen.getByText('This action cannot be undone.');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-describedby', description.id);
    expect(dialog).toHaveAttribute('data-brand', 'blue');
    expect(dialog).toHaveAttribute('data-theme', 'light');
  });

  it('keeps the cancel action in the footer action flow', async () => {
    render(<TestAlertDialog />);

    const cancel = await screen.findByRole('button', { name: 'Cancel' });
    expect(cancel.className).not.toContain('alert-dialog__close');
  });

  it('preserves explicit title and description ids and registers the same IDREFs', async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle id="custom-title">Delete project?</AlertDialogTitle>
          <AlertDialogDescription id="custom-description">
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const dialog = await screen.findByRole('alertdialog', { name: 'Delete project?' });
    const title = screen.getByText('Delete project?');
    const description = screen.getByText('This action cannot be undone.');
    expect(title).toHaveAttribute('id', 'custom-title');
    expect(description).toHaveAttribute('id', 'custom-description');
    expect(dialog).toHaveAttribute('aria-labelledby', 'custom-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'custom-description');
  });

  it('uses unique IDs for repeated titles and descriptions', async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Primary title</AlertDialogTitle>
          <AlertDialogTitle>Secondary title</AlertDialogTitle>
          <AlertDialogDescription>Primary description</AlertDialogDescription>
          <AlertDialogDescription>Secondary description</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const dialog = await screen.findByRole('alertdialog', { name: 'Primary title' });
    const titles = screen.getAllByRole('heading');
    const descriptions = [
      screen.getByText('Primary description'),
      screen.getByText('Secondary description'),
    ];

    expect(new Set(titles.map((title) => title.id)).size).toBe(2);
    expect(new Set(descriptions.map((description) => description.id)).size).toBe(2);
    expect(dialog).toHaveAttribute('aria-labelledby', titles[0]?.id);
    expect(dialog).toHaveAttribute('aria-describedby', descriptions[0]?.id);
  });

  it('does not render when closed', () => {
    render(<TestAlertDialog defaultOpen={false} />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(document.querySelector('[data-floating-ui-focus-guard]')).not.toBeInTheDocument();
  });

  it('falls back to an accessible name when no title or label is supplied', async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>Delete this project?</AlertDialogContent>
      </AlertDialog>,
    );

    expect(await screen.findByRole('alertdialog', { name: 'Alert dialog' })).toBeInTheDocument();
  });

  it('opens from the trigger in uncontrolled mode', async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete project</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete project' }));

    expect(await screen.findByRole('alertdialog', { name: 'Delete project?' })).toBeInTheDocument();
  });

  it('strips wrapper-owned button attributes from delegated trigger and action hosts', async () => {
    const delegatedButtonProps = {
      form: 'settings',
      formAction: '/save',
      formEncType: 'multipart/form-data',
      formMethod: 'post',
      formNoValidate: true,
      formTarget: '_blank',
      name: 'intent',
      type: 'submit',
      value: 'save',
    } as unknown as ComponentProps<typeof AlertDialogTrigger>;
    const delegatedActionProps = delegatedButtonProps as unknown as ComponentProps<
      typeof AlertDialogAction
    >;

    render(
      <AlertDialog defaultOpen>
        <AlertDialogTrigger asChild {...delegatedButtonProps}>
          <span>Delegated trigger</span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm</AlertDialogTitle>
          <AlertDialogAction asChild {...delegatedActionProps}>
            <span>Delegated action</span>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const trigger = screen.getByText('Delegated trigger');
    const action = screen.getByText('Delegated action');
    for (const host of [trigger, action]) {
      expect(host).not.toHaveAttribute('form');
      expect(host).not.toHaveAttribute('formaction');
      expect(host).not.toHaveAttribute('formenctype');
      expect(host).not.toHaveAttribute('formmethod');
      expect(host).not.toHaveAttribute('formnovalidate');
      expect(host).not.toHaveAttribute('formtarget');
      expect(host).not.toHaveAttribute('name');
      expect(host).not.toHaveAttribute('value');
    }

    fireEvent.click(action);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('preserves native form ownership attributes on the default action button', () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm</AlertDialogTitle>
          <AlertDialogAction
            form="settings"
            formAction="/save"
            formMethod="post"
            name="intent"
            value="save"
          >
            Save
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const action = screen.getByRole('button', { name: 'Save' });
    expect(action).toHaveAttribute('form', 'settings');
    expect(action).toHaveAttribute('formaction', '/save');
    expect(action).toHaveAttribute('formmethod', 'post');
    expect(action).toHaveAttribute('name', 'intent');
    expect(action).toHaveAttribute('value', 'save');
    expect(action).toHaveAttribute('type', 'button');
  });

  it('forwards an asChild ref to a non-button trigger host', () => {
    const ref = createRef<HTMLElement>();
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild ref={ref}>
          <a href="#delete">Delete project</a>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Delete project' }));
  });

  it.each([
    ['href', { href: '#delete' }],
    ['to', { to: '/delete' }],
    ['link role', { role: 'link' }],
  ])('falls back from a link-like custom trigger with %s', (_name, linkProps) => {
    const CustomLink = forwardRef<
      HTMLAnchorElement,
      Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { href?: string; to?: string }
    >(({ to, ...props }, ref) => <a ref={ref} href={props.href ?? to} {...props} />);
    CustomLink.displayName = 'CustomLink';
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <CustomLink {...linkProps}>Delete project</CustomLink>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const trigger = screen.getByRole('button', { name: 'Delete project' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(screen.queryByRole('link', { name: 'Delete project' })).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByRole('alertdialog', { name: 'Delete project?' })).toBeInTheDocument();
  });

  it('preserves an icon-only custom link name when falling back', () => {
    const CustomLink = forwardRef<
      HTMLAnchorElement,
      Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { to?: string }
    >(({ to, ...props }, ref) => <a ref={ref} href={to} {...props} />);
    CustomLink.displayName = 'CustomLink';
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <CustomLink to="/delete" aria-label="Delete named project" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete named project?</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const trigger = screen.getByRole('button', { name: 'Delete named project' });
    expect(trigger).toBeEmptyDOMElement();
    fireEvent.click(trigger);
    expect(screen.getByRole('alertdialog', { name: 'Delete named project?' })).toBeInTheDocument();
  });

  it('forwards dismiss control refs and focuses a slotted cancel host', async () => {
    const cancelRef = createRef<HTMLElement>();
    const actionRef = createRef<HTMLElement>();
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogCancel asChild ref={cancelRef}>
            <a href="#cancel">Cancel</a>
          </AlertDialogCancel>
          <AlertDialogAction asChild ref={actionRef}>
            <a href="#delete">Delete</a>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const cancel = screen.getByRole('link', { name: 'Cancel' });
    expect(cancelRef.current).toBe(cancel);
    expect(actionRef.current).toBe(screen.getByRole('link', { name: 'Delete' }));
    await waitFor(() => expect(document.activeElement).toBe(cancel));
  });

  it('falls back to native buttons when asChild does not receive one host element', async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>Delete project</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogCancel asChild>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    expect(await screen.findByRole('alertdialog', { name: 'Delete project?' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('preserves enabled consumer capture handlers', async () => {
    const onTriggerClickCapture = vi.fn();
    const onCancelClickCapture = vi.fn();
    const onActionClickCapture = vi.fn();
    render(
      <AlertDialog>
        <AlertDialogTrigger onClickCapture={onTriggerClickCapture}>
          Delete project
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogCancel onClickCapture={onCancelClickCapture}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClickCapture={onActionClickCapture}>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    expect(onTriggerClickCapture).toHaveBeenCalledTimes(1);
    await screen.findByRole('alertdialog', { name: 'Delete project?' });

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancelClickCapture).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    await screen.findByRole('alertdialog', { name: 'Delete project?' });
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onActionClickCapture).toHaveBeenCalledTimes(1);
  });

  it('does not call asChild capture handlers when disabled', () => {
    const onClickCapture = vi.fn();
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild disabled>
          <a href="#blocked" onClickCapture={onClickCapture}>
            Delete project
          </a>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    expect(onClickCapture).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('blocks every disabled asChild action activation channel while preserving Tab', () => {
    const childHandlers = {
      onAuxClick: vi.fn(),
      onClick: vi.fn(),
      onKeyDown: vi.fn(),
      onKeyUp: vi.fn(),
      onPointerDown: vi.fn(),
      onPointerUp: vi.fn(),
    };
    const wrapperHandlers = {
      onAuxClickCapture: vi.fn(),
      onClickCapture: vi.fn(),
      onKeyDownCapture: vi.fn(),
      onKeyUpCapture: vi.fn(),
      onPointerDownCapture: vi.fn(),
      onPointerUpCapture: vi.fn(),
    };
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogAction asChild disabled {...wrapperHandlers}>
            <a href="#delete" aria-disabled={false} {...childHandlers}>
              Delete
            </a>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const action = screen.getByRole('link', { name: 'Delete' });
    fireEvent.keyDown(action, { key: 'Tab', code: 'Tab' });
    fireEvent.click(action);
    fireEvent.pointerDown(action);
    fireEvent.pointerUp(action);
    fireEvent.keyDown(action, { key: 'Enter', code: 'Enter' });
    fireEvent.keyUp(action, { key: 'Unidentified', code: 'Space' });
    expect(
      action.dispatchEvent(
        new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
      ),
    ).toBe(false);

    expect(action).toHaveAttribute('aria-disabled', 'true');
    expect(childHandlers.onKeyDown).toHaveBeenCalledOnce();
    expect(childHandlers.onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Tab' }));
    expect(wrapperHandlers.onKeyDownCapture).toHaveBeenCalledOnce();
    expect(wrapperHandlers.onKeyDownCapture).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'Tab' }),
    );
    expect(childHandlers.onAuxClick).not.toHaveBeenCalled();
    expect(childHandlers.onClick).not.toHaveBeenCalled();
    expect(childHandlers.onKeyUp).not.toHaveBeenCalled();
    expect(childHandlers.onPointerDown).not.toHaveBeenCalled();
    expect(childHandlers.onPointerUp).not.toHaveBeenCalled();
    expect(wrapperHandlers.onAuxClickCapture).not.toHaveBeenCalled();
    expect(wrapperHandlers.onClickCapture).not.toHaveBeenCalled();
    expect(wrapperHandlers.onKeyUpCapture).not.toHaveBeenCalled();
    expect(wrapperHandlers.onPointerDownCapture).not.toHaveBeenCalled();
    expect(wrapperHandlers.onPointerUpCapture).not.toHaveBeenCalled();
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('guards a disabled asChild cancel without closing the dialog', () => {
    const onClick = vi.fn();
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogCancel asChild disabled>
            <a href="#cancel" onClick={onClick}>
              Cancel
            </a>
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Cancel' }));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('does not use a disabled native asChild cancel as the initial focus target', async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogCancel asChild>
            <button disabled>Cancel</button>
          </AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const dialog = screen.getByRole('alertdialog', { name: 'Delete project?' });
    await waitFor(() => expect(document.activeElement).not.toBe(cancel));
    await waitFor(() => expect(dialog).toHaveFocus());
  });

  it('does not use a disabled custom-button cancel as the initial focus target', async () => {
    const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
      (props, ref) => <button ref={ref} {...props} />,
    );
    CustomButton.displayName = 'CustomButton';
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogCancel asChild>
            <CustomButton disabled>Cancel</CustomButton>
          </AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const dialog = screen.getByRole('alertdialog', { name: 'Delete project?' });
    expect(cancel).toBeDisabled();
    expect(cancel).toHaveAttribute('type', 'button');
    await waitFor(() => expect(document.activeElement).not.toBe(cancel));
    await waitFor(() => expect(dialog).toHaveFocus());
  });

  it('preserves a native child button disabled state while retaining button type ownership', () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogAction asChild>
            <button type="submit" disabled>
              Delete
            </button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const action = screen.getByRole('button', { name: 'Delete' });
    expect(action).toBeDisabled();
    expect(action).toHaveAttribute('type', 'button');
    fireEvent.click(action);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('owns custom-button dismiss type and disabled state', () => {
    const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
      (props, ref) => <button ref={ref} {...props} />,
    );
    CustomButton.displayName = 'CustomButton';
    const onSubmit = vi.fn();
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            <AlertDialogAction asChild>
              <CustomButton type="submit">Delete</CustomButton>
            </AlertDialogAction>
            <AlertDialogCancel asChild disabled>
              <CustomButton>Cancel</CustomButton>
            </AlertDialogCancel>
          </form>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const action = screen.getByRole('button', { name: 'Delete' });
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    expect(action).toHaveAttribute('type', 'button');
    expect(cancel).toHaveAttribute('type', 'button');
    expect(cancel).toBeDisabled();

    fireEvent.click(cancel);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    fireEvent.click(action);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('preserves child-owned aria-disabled state for an enabled delegated dismiss control', () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogCancel asChild>
            <a href="#cancel" aria-disabled="true">
              Cancel
            </a>
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>,
    );

    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('updates uncontrolled state and notifies onOpenChange', async () => {
    const onOpenChange = vi.fn();
    render(
      <AlertDialog onOpenChange={onOpenChange}>
        <AlertDialogTrigger>Delete project</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete project' }));

    expect(await screen.findByRole('alertdialog', { name: 'Delete project?' })).toBeInTheDocument();
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
  });

  it('keeps the last controlled state when control is released', async () => {
    const { rerender } = render(
      <AlertDialog open onOpenChange={() => undefined}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );

    expect(await screen.findByRole('alertdialog', { name: 'Delete project?' })).toBeInTheDocument();

    rerender(
      <AlertDialog defaultOpen={false}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );

    expect(screen.getByRole('alertdialog', { name: 'Delete project?' })).toBeInTheDocument();
  });

  it('falls back safely for untyped open with a non-function callback', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <AlertDialog
        {...({ open: true, defaultOpen: false, onOpenChange: 'not-a-function' } as never)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Legacy confirmation</AlertDialogTitle>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>,
    );

    expect(screen.getByRole('alertdialog', { name: 'Legacy confirmation' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('falls back to uncontrolled'));
    warning.mockRestore();
  });

  it('does not emit dangling ARIA references without a title or description', async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent aria-label="Delete confirmation">
          Delete this project?
        </AlertDialogContent>
      </AlertDialog>,
    );

    const dialog = await screen.findByRole('alertdialog', { name: 'Delete confirmation' });
    expect(dialog).not.toHaveAttribute('aria-labelledby');
    expect(dialog).not.toHaveAttribute('aria-describedby');
  });

  it('closes from cancel and action buttons', async () => {
    const handleAction = vi.fn();
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());

    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAction}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(handleAction).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('keeps open when the action click is prevented', () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          <AlertDialogAction onClick={(event) => event.preventDefault()}>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('keeps open when an enabled asChild action prevents its click', () => {
    const childClick = vi.fn((event: MouseEvent) => event.preventDefault());
    const actionClick = vi.fn();
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogAction asChild onClick={actionClick}>
            <a href="#delete" onClick={childClick}>
              Delete
            </a>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Delete' }));

    expect(childClick).toHaveBeenCalledOnce();
    expect(actionClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('falls back to native dismiss buttons for void asChild hosts', () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogCancel asChild aria-label="Cancel deletion">
            <img alt="Cancel icon" />
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const cancel = screen.getByRole('button', { name: 'Cancel deletion' });
    expect(cancel.querySelector('img')).toHaveAttribute('alt', 'Cancel icon');
    fireEvent.click(cancel);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('falls back from an incompatible dismiss host and supports keyboard dismissal', () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogCancel asChild aria-label="Cancel deletion">
            <select aria-label="Unsafe cancel host">
              <option>Cancel</option>
            </select>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <div>Delete with keyboard</div>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const cancel = screen.getByRole('button', { name: 'Cancel deletion' });
    expect(cancel.querySelector('select')).not.toBeInTheDocument();
    const action = screen.getByRole('button', { name: 'Delete with keyboard' });
    expect(action).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(action, { key: 'Enter' });
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('closes on Escape but not on outside pointer press', () => {
    const onOpenChange = vi.fn();
    render(
      <AlertDialog open onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.mouseDown(document.body);
    expect(onOpenChange).not.toHaveBeenCalled();

    fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape', code: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(KeyboardEvent), 'escape-key');
  });

  it('keeps the alert dialog open when its key handler cancels Escape', () => {
    const onOpenChange = vi.fn();
    render(
      <AlertDialog open onOpenChange={onOpenChange}>
        <AlertDialogContent onKeyDown={(event) => event.preventDefault()}>
          <AlertDialogTitle>Cancelable alert</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('focuses the cancel action first even when action is rendered earlier', async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction>Delete</AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus());
  });

  it('focuses the dialog surface when its cancel action is disabled', async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogCancel disabled>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const dialog = await screen.findByRole('alertdialog', { name: 'Delete project?' });
    await waitFor(() => expect(dialog).toHaveFocus());
  });

  it('restores focus to the trigger after cancel', async () => {
    render(<TestAlertDialog defaultOpen={false} />);

    const trigger = screen.getByRole('button', { name: 'Delete project' });
    fireEvent.click(trigger);
    await screen.findByRole('alertdialog', { name: 'Delete project?' });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('has no accessibility violations when open', async () => {
    render(<TestAlertDialog />);
    await screen.findByRole('alertdialog', { name: 'Delete project?' });

    expect(filterFloatingFocusGuardAxeResults(await axe(document.body))).toHaveNoViolations();
  });
});

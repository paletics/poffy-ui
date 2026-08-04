import { createRef, forwardRef, StrictMode } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { renderToString } from 'react-dom/server';
import { act, render, screen, fireEvent, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Tabs, TabList, TabTrigger, TabContent } from './index';
import { LocaleProvider } from '@/providers/LocaleProvider';
import { inspectTabStructure } from './Tabs';

describe('Tabs', () => {
  it('renders tab and panel IDREF relationships on the server', () => {
    const markup = renderToString(
      <Tabs defaultValue="first">
        <TabList>
          <TabTrigger value="first">First</TabTrigger>
        </TabList>
        <TabContent value="first">First panel</TabContent>
      </Tabs>,
    );
    const host = document.createElement('div');
    host.innerHTML = markup;
    const trigger = host.querySelector<HTMLElement>('[role="tab"]');
    const panel = host.querySelector<HTMLElement>('[role="tabpanel"]');

    expect(trigger?.getAttribute('aria-controls')).toBe(panel?.id);
    expect(panel?.getAttribute('aria-labelledby')).toBe(trigger?.id);
  });

  it('materializes one-shot child iterables before inspecting and rendering them', () => {
    function* tabChildren() {
      yield (
        <TabList key="list">
          <TabTrigger value="first">First</TabTrigger>
        </TabList>
      );
      yield (
        <TabContent key="content" value="first">
          First panel
        </TabContent>
      );
    }

    const markup = renderToString(<Tabs>{tabChildren()}</Tabs>);
    const host = document.createElement('div');
    host.innerHTML = markup;
    const trigger = host.querySelector<HTMLElement>('[role="tab"]');
    const panel = host.querySelector<HTMLElement>('[role="tabpanel"]');

    expect(trigger).toHaveTextContent('First');
    expect(trigger).toHaveAttribute('aria-selected', 'true');
    expect(panel).toHaveTextContent('First panel');
    expect(panel).not.toHaveAttribute('hidden');
  });

  it('materializes one-shot iterables nested inside TabList', () => {
    function* triggers() {
      yield (
        <TabTrigger key="first" value="first">
          Nested first
        </TabTrigger>
      );
    }

    const markup = renderToString(
      <Tabs defaultValue="first">
        <TabList>{triggers()}</TabList>
        <TabContent value="first">Nested panel</TabContent>
      </Tabs>,
    );
    const host = document.createElement('div');
    host.innerHTML = markup;

    expect(host.querySelector('[role="tab"]')).toHaveTextContent('Nested first');
    expect(host.querySelector('[role="tabpanel"]')).toHaveTextContent('Nested panel');
  });

  it('fails duplicate trigger and panel values closed on the server', () => {
    const markup = renderToString(
      <Tabs defaultValue="duplicate">
        <TabList>
          <TabTrigger value="duplicate">First</TabTrigger>
          <TabTrigger value="duplicate">Second</TabTrigger>
        </TabList>
        <TabContent value="duplicate">First panel</TabContent>
        <TabContent value="duplicate">Second panel</TabContent>
      </Tabs>,
    );
    const host = document.createElement('div');
    host.innerHTML = markup;
    const triggers = Array.from(host.querySelectorAll<HTMLElement>('[role="tab"]'));
    const panels = Array.from(host.querySelectorAll<HTMLElement>('[role="tabpanel"]'));

    expect(new Set(triggers.map((trigger) => trigger.id)).size).toBe(2);
    expect(new Set(panels.map((panel) => panel.id)).size).toBe(2);
    expect(
      triggers.filter((trigger) => trigger.getAttribute('aria-selected') === 'true'),
    ).toHaveLength(0);
    expect(triggers.filter((trigger) => trigger.tabIndex === 0)).toHaveLength(0);
    triggers.forEach((trigger) => {
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
      expect(trigger).not.toHaveAttribute('aria-controls');
    });
    panels.forEach((panel) => {
      expect(panel).toHaveAttribute('hidden');
      expect(panel).not.toHaveAttribute('aria-labelledby');
    });
  });

  it('fails opaque slot wrappers closed during SSR', () => {
    const WrappedTrigger = () => <TabTrigger value="wrapped">Wrapped</TabTrigger>;
    const WrappedContent = () => <TabContent value="wrapped">Wrapped panel</TabContent>;
    const markup = renderToString(
      <Tabs defaultValue="wrapped">
        <TabList>
          <WrappedTrigger />
        </TabList>
        <WrappedContent />
      </Tabs>,
    );
    const host = document.createElement('div');
    host.innerHTML = markup;
    const trigger = host.querySelector<HTMLElement>('[role="tab"]');
    const panel = host.querySelector<HTMLElement>('[role="tabpanel"]');

    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(trigger).toHaveAttribute('aria-selected', 'false');
    expect(trigger).toHaveAttribute('tabindex', '-1');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(panel).toHaveAttribute('hidden');
    expect(panel).not.toHaveAttribute('aria-labelledby');
  });

  it('selects the first enabled tab in SSR markup when no default is supplied', () => {
    const markup = renderToString(
      <Tabs>
        <TabList>
          <TabTrigger value="disabled" disabled>
            Disabled
          </TabTrigger>
          <TabTrigger value="first">First</TabTrigger>
        </TabList>
        <TabContent value="disabled">Disabled panel</TabContent>
        <TabContent value="first">First panel</TabContent>
      </Tabs>,
    );
    const host = document.createElement('div');
    host.innerHTML = markup;
    const triggers = Array.from(host.querySelectorAll<HTMLElement>('[role="tab"]'));
    const panels = Array.from(host.querySelectorAll<HTMLElement>('[role="tabpanel"]'));

    expect(triggers[0]).toHaveAttribute('aria-selected', 'false');
    expect(triggers[0]).toHaveAttribute('tabindex', '-1');
    expect(triggers[1]).toHaveAttribute('aria-selected', 'true');
    expect(triggers[1]).toHaveAttribute('tabindex', '0');
    expect(panels[0]).toHaveAttribute('hidden');
    expect(panels[1]).not.toHaveAttribute('hidden');
  });

  it.each(['uncontrolled', 'controlled'] as const)(
    'falls back from a disabled %s SSR value',
    (mode) => {
      const stateProps =
        mode === 'controlled'
          ? { value: 'disabled', onValueChange: () => undefined }
          : { defaultValue: 'disabled' };
      const markup = renderToString(
        <Tabs {...stateProps}>
          <TabList>
            <TabTrigger value="disabled" disabled>
              Disabled
            </TabTrigger>
            <TabTrigger value="enabled">Enabled</TabTrigger>
          </TabList>
          <TabContent value="disabled">Disabled panel</TabContent>
          <TabContent value="enabled">Enabled panel</TabContent>
        </Tabs>,
      );
      const host = document.createElement('div');
      host.innerHTML = markup;

      expect(host.querySelector('[role="tab"][aria-disabled="true"]')).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(host.querySelector('[role="tab"]:not([aria-disabled])')).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(host.querySelector('[role="tabpanel"]:not([hidden])')).toHaveTextContent(
        'Enabled panel',
      );
    },
  );

  it('fails all-disabled SSR state closed', () => {
    const markup = renderToString(
      <Tabs defaultValue="first">
        <TabList>
          <TabTrigger value="first" disabled>
            First
          </TabTrigger>
          <TabTrigger value="second" disabled>
            Second
          </TabTrigger>
        </TabList>
        <TabContent value="first">First panel</TabContent>
        <TabContent value="second">Second panel</TabContent>
      </Tabs>,
    );
    const host = document.createElement('div');
    host.innerHTML = markup;

    expect(host.querySelectorAll('[role="tab"][aria-selected="true"]')).toHaveLength(0);
    expect(host.querySelectorAll('[role="tab"][tabindex="0"]')).toHaveLength(0);
    expect(host.querySelectorAll('[role="tabpanel"]:not([hidden])')).toHaveLength(0);
  });

  it.each([
    {
      name: 'a missing TabList',
      children: (
        <>
          <TabTrigger value="value">Trigger</TabTrigger>
          <TabContent value="value">Panel</TabContent>
        </>
      ),
    },
    {
      name: 'multiple TabLists',
      children: (
        <>
          <TabList>
            <TabTrigger value="first">First</TabTrigger>
          </TabList>
          <TabList>
            <TabTrigger value="second">Second</TabTrigger>
          </TabList>
          <TabContent value="first">First panel</TabContent>
          <TabContent value="second">Second panel</TabContent>
        </>
      ),
    },
    {
      name: 'a nested TabList',
      children: (
        <>
          <TabList>
            <TabList>
              <TabTrigger value="value">Trigger</TabTrigger>
            </TabList>
          </TabList>
          <TabContent value="value">Panel</TabContent>
        </>
      ),
    },
    {
      name: 'a trigger outside TabList',
      children: (
        <>
          <TabList />
          <TabTrigger value="value">Trigger</TabTrigger>
          <TabContent value="value">Panel</TabContent>
        </>
      ),
    },
    {
      name: 'content inside TabList',
      children: (
        <TabList>
          <TabTrigger value="value">Trigger</TabTrigger>
          <TabContent value="value">Panel</TabContent>
        </TabList>
      ),
    },
  ])('fails invalid static placement closed during SSR: $name', ({ children }) => {
    const host = document.createElement('div');
    host.innerHTML = renderToString(<Tabs defaultValue="value">{children}</Tabs>);

    host.querySelectorAll('[role="tab"]').forEach((trigger) => {
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
      expect(trigger).toHaveAttribute('aria-selected', 'false');
    });
    host.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
      expect(panel).toHaveAttribute('hidden');
    });
  });

  it('treats React portals as opaque static topology', () => {
    const portalHost = document.createElement('div');
    const structure = inspectTabStructure(
      createPortal(<TabTrigger value="portalled">Portalled</TabTrigger>, portalHost),
    );

    expect(structure.hasOpaqueSlots).toBe(true);
  });

  it('keeps valid relationship IDs stable through hydration', async () => {
    const tree = (
      <Tabs>
        <TabList>
          <TabTrigger value="first">First</TabTrigger>
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First panel</TabContent>
        <TabContent value="second">Second panel</TabContent>
      </Tabs>
    );
    const host = document.createElement('div');
    document.body.append(host);
    host.innerHTML = renderToString(tree);
    const serverIds = Array.from(host.querySelectorAll<HTMLElement>('[id]')).map((node) => node.id);
    const hydrationErrors = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const root = hydrateRoot(host, tree);
    await act(async () => undefined);

    expect(Array.from(host.querySelectorAll<HTMLElement>('[id]')).map((node) => node.id)).toEqual(
      serverIds,
    );
    expect(hydrationErrors).not.toHaveBeenCalled();

    await act(async () => root.unmount());
    hydrationErrors.mockRestore();
    host.remove();
  });

  it('hydrates a disabled controlled value with one fallback notification', async () => {
    const renderTree = (onValueChange: (value: string) => void) => (
      <Tabs value="disabled" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="disabled" disabled>
            Disabled
          </TabTrigger>
          <TabTrigger value="enabled">Enabled</TabTrigger>
        </TabList>
        <TabContent value="disabled">Disabled panel</TabContent>
        <TabContent value="enabled">Enabled panel</TabContent>
      </Tabs>
    );
    const host = document.createElement('div');
    document.body.append(host);
    host.innerHTML = renderToString(renderTree(() => undefined));
    const onValueChange = vi.fn();

    const root = hydrateRoot(host, renderTree(onValueChange));
    await act(async () => undefined);

    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith('enabled');
    expect(host.querySelector('[role="tab"][aria-selected="true"]')).toHaveTextContent('Enabled');

    await act(async () => root.unmount());
    host.remove();
  });

  it('owns horizontal aria orientation by default', () => {
    render(
      <Tabs defaultValue="first">
        <TabList {...({ 'aria-orientation': 'vertical' } as never)}>
          <TabTrigger value="first">First</TabTrigger>
        </TabList>
        <TabContent value="first">First panel</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('does not forward unsupported asChild props from fixed tab hosts', () => {
    const { container } = render(
      <Tabs {...({ asChild: true } as never)} defaultValue="first">
        <TabList {...({ asChild: true } as never)}>
          <TabTrigger value="first">First</TabTrigger>
        </TabList>
        <TabContent {...({ asChild: true } as never)} value="first">
          First panel
        </TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tablist').tagName).toBe('DIV');
    expect(screen.getByRole('tabpanel').tagName).toBe('DIV');
    expect(container.querySelectorAll('[aschild]')).toHaveLength(0);
  });

  it('keeps an untyped value without a callback controlled and read-only', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Tabs {...({ value: 'first' } as never)}>
        <TabList>
          <TabTrigger value="first">First</TabTrigger>
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First panel</TabContent>
        <TabContent value="second">Second panel</TabContent>
      </Tabs>,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'false');
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('remains read-only'));
    warning.mockRestore();
  });

  it('keeps a controlled value read-only when an untyped handler is not callable', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Tabs {...({ value: 'first', onValueChange: 'invalid' } as never)}>
        <TabList>
          <TabTrigger value="first">First</TabTrigger>
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First panel</TabContent>
        <TabContent value="second">Second panel</TabContent>
      </Tabs>,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('callable `onValueChange`'));
    warning.mockRestore();
  });

  it('ignores an untyped trigger tabIndex override', () => {
    render(
      <Tabs defaultValue="first">
        <TabList>
          <TabTrigger {...({ tabIndex: -1 } as never)} value="first">
            First
          </TabTrigger>
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First panel</TabContent>
        <TabContent value="second">Second panel</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('tabindex', '-1');
  });

  it('notifies an invalid value when a malformed value-only instance becomes controlled', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const onValueChange = vi.fn();
    const children = (
      <>
        <TabList>
          <TabTrigger value="first">First</TabTrigger>
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First panel</TabContent>
        <TabContent value="second">Second panel</TabContent>
      </>
    );
    const { rerender } = render(<Tabs {...({ value: 'missing' } as never)}>{children}</Tabs>);

    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');

    rerender(
      <Tabs value="missing" onValueChange={onValueChange}>
        {children}
      </Tabs>,
    );

    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith('first');
    warning.mockRestore();
  });

  it('exposes vertical orientation on the root and tab list', () => {
    const { container } = render(
      <Tabs defaultValue="first" orientation="vertical">
        <TabList>
          <TabTrigger value="first">First</TabTrigger>
        </TabList>
        <TabContent value="first">First panel</TabContent>
      </Tabs>,
    );

    expect(container.querySelector('[data-orientation="vertical"]')).toHaveClass(
      'poffy-tabs__root--orientation_vertical',
    );
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('falls back safely for an incompatible asChild trigger', () => {
    render(
      <Tabs defaultValue="first">
        <TabList>
          <TabTrigger value="first" asChild aria-label="First tab">
            <input aria-label="Unsafe tab" />
          </TabTrigger>
        </TabList>
        <TabContent value="first">First panel</TabContent>
      </Tabs>,
    );

    const trigger = screen.getByRole('tab', { name: 'First tab' });
    expect(screen.queryByRole('textbox', { name: 'Unsafe tab' })).not.toBeInTheDocument();
    expect(trigger.querySelector('input')).not.toBeInTheDocument();
  });

  it('prevents a slotted native tab button from submitting an owning form', () => {
    const onSubmit = vi.fn();
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Tabs defaultValue="first">
          <TabList>
            <TabTrigger value="first" asChild>
              <button type="submit">First</button>
            </TabTrigger>
          </TabList>
          <TabContent value="first">First panel</TabContent>
        </Tabs>
      </form>,
    );

    const trigger = screen.getByRole('tab', { name: 'First' });
    expect(trigger).toHaveAttribute('type', 'button');
    fireEvent.click(trigger);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('sanitizes delegated button-only props while owning custom button semantics', () => {
    const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
      (props, ref) => <button ref={ref} {...props} />,
    );
    CustomButton.displayName = 'CustomButton';

    render(
      <Tabs defaultValue="first">
        <TabList>
          <TabTrigger
            value="first"
            asChild
            disabled
            {...({
              form: 'external-form',
              formAction: '/unsafe',
              name: 'unsafe-name',
            } as Record<string, string>)}
          >
            <CustomButton type="submit">First</CustomButton>
          </TabTrigger>
        </TabList>
        <TabContent value="first">First panel</TabContent>
      </Tabs>,
    );

    const trigger = screen.getByRole('tab', { name: 'First' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).not.toHaveAttribute('form');
    expect(trigger).not.toHaveAttribute('formaction');
    expect(trigger).not.toHaveAttribute('name');
  });

  it('does not inject native button attributes into a delegated non-button host', () => {
    render(
      <Tabs defaultValue="first">
        <TabList>
          <TabTrigger value="first" asChild disabled>
            <span>First</span>
          </TabTrigger>
        </TabList>
        <TabContent value="first">First panel</TabContent>
      </Tabs>,
    );

    const trigger = screen.getByRole('tab', { name: 'First' });
    expect(trigger.tagName).toBe('SPAN');
    expect(trigger).not.toHaveAttribute('disabled');
    expect(trigger).not.toHaveAttribute('type');
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
  });

  it('delivers callback currentTarget from the rendered trigger host', () => {
    let nativeTarget: EventTarget | null = null;
    let delegatedTarget: EventTarget | null = null;

    render(
      <Tabs defaultValue="native">
        <TabList>
          <TabTrigger
            value="native"
            onClick={(event) => {
              nativeTarget = event.currentTarget;
            }}
          >
            Native
          </TabTrigger>
          <TabTrigger
            value="delegated"
            asChild
            onClick={(event) => {
              delegatedTarget = event.currentTarget;
            }}
          >
            <span>Delegated</span>
          </TabTrigger>
        </TabList>
        <TabContent value="native">Native panel</TabContent>
        <TabContent value="delegated">Delegated panel</TabContent>
      </Tabs>,
    );

    const nativeTrigger = screen.getByRole('tab', { name: 'Native' });
    const delegatedTrigger = screen.getByRole('tab', { name: 'Delegated' });
    fireEvent.click(nativeTrigger);
    fireEvent.click(delegatedTrigger);

    expect(nativeTarget).toBe(nativeTrigger);
    expect(nativeTrigger.tagName).toBe('BUTTON');
    expect(delegatedTarget).toBe(delegatedTrigger);
    expect(delegatedTrigger.tagName).toBe('SPAN');
  });

  it('forces owned tab scalars onto a slotted child and clears stale disabled state', () => {
    render(
      <Tabs defaultValue="first">
        <TabList>
          <TabTrigger value="first" asChild>
            <button
              id="wrong"
              role="button"
              aria-selected={false}
              aria-controls="wrong-panel"
              aria-disabled="true"
              disabled
              tabIndex={4}
              type="submit"
            >
              First
            </button>
          </TabTrigger>
        </TabList>
        <TabContent value="first">First panel</TabContent>
      </Tabs>,
    );

    const trigger = screen.getByRole('tab', { name: 'First' });
    const panel = screen.getByRole('tabpanel');
    expect(trigger).not.toBeDisabled();
    expect(trigger).not.toHaveAttribute('aria-disabled');
    expect(trigger).toHaveAttribute('aria-selected', 'true');
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
    expect(trigger).toHaveAttribute('tabindex', '0');
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger.id).not.toBe('wrong');
  });

  it('forwards and clears trigger refs', () => {
    const ref = createRef<HTMLButtonElement>();
    const { unmount } = render(
      <Tabs>
        <TabList>
          <TabTrigger ref={ref} value="first">
            First
          </TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
      </Tabs>,
    );

    expect(ref.current).toBe(screen.getByRole('tab', { name: 'First' }));

    unmount();

    expect(ref.current).toBeNull();
  });

  it('keeps a trigger registered when asChild replaces its DOM node', () => {
    const renderTabs = (asChild: boolean, secondDisabled: boolean) => (
      <Tabs defaultValue="first">
        <TabList>
          <TabTrigger value="first" asChild={asChild}>
            {asChild ? <a href="#first">First</a> : 'First'}
          </TabTrigger>
          <TabTrigger value="second" disabled={secondDisabled}>
            Second
          </TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
        <TabContent value="second">Second content</TabContent>
      </Tabs>
    );
    const { rerender } = render(renderTabs(false, true));

    rerender(renderTabs(true, true));
    rerender(renderTabs(true, false));

    const firstTab = screen.getByRole('tab', { name: 'First' });
    expect(firstTab).toHaveAttribute('aria-selected', 'true');
    expect(firstTab).not.toHaveAttribute('href');
    const auxiliaryEvent = new MouseEvent('auxclick', {
      bubbles: true,
      button: 1,
      cancelable: true,
    });
    expect(firstTab.dispatchEvent(auxiliaryEvent)).toBe(false);
    expect(screen.getByText('First content')).toBeInTheDocument();
  });

  it('falls back from a link-like custom trigger to a native button', () => {
    const CustomLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>(
      (props, ref) => <a ref={ref} {...props} />,
    );
    CustomLink.displayName = 'CustomLink';
    render(
      <Tabs defaultValue="first">
        <TabList>
          <TabTrigger value="first">First</TabTrigger>
          <TabTrigger value="second" asChild>
            <CustomLink href="#second">Second</CustomLink>
          </TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
        <TabContent value="second">Second content</TabContent>
      </Tabs>,
    );

    const second = screen.getByRole('tab', { name: 'Second' });
    expect(second.tagName).toBe('BUTTON');
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    act(() => {
      expect(second.dispatchEvent(clickEvent)).toBe(true);
    });
    expect(clickEvent.defaultPrevented).toBe(false);
    expect(second).toHaveAttribute('aria-selected', 'true');
  });

  it('preserves a slotted child preventDefault before selecting', () => {
    const onValueChange = vi.fn();
    const onChildClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <Tabs defaultValue="first" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="first">First</TabTrigger>
          <TabTrigger value="second" asChild>
            <a href="#second" onClick={onChildClick}>
              Second
            </a>
          </TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
        <TabContent value="second">Second content</TabContent>
      </Tabs>,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

    expect(onChildClick).toHaveBeenCalledOnce();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
  });

  it('selects the first enabled trigger when no initial value is provided', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="disabled" disabled>
            Disabled
          </TabTrigger>
          <TabTrigger value="first">First</TabTrigger>
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
        <TabContent value="second">Second content</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('First content')).toBeVisible();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('falls back to an enabled trigger when the uncontrolled selected trigger is removed', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Tabs defaultValue="second" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="first">First</TabTrigger>
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
        <TabContent value="second">Second content</TabContent>
      </Tabs>,
    );

    rerender(
      <Tabs defaultValue="second" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="first">First</TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith('first');
  });

  it('notifies once when the uncontrolled selected trigger becomes disabled', () => {
    const onValueChange = vi.fn();
    const renderTabs = (firstDisabled: boolean) => (
      <Tabs defaultValue="first" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="first" disabled={firstDisabled}>
            First
          </TabTrigger>
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
        <TabContent value="second">Second content</TabContent>
      </Tabs>
    );
    const { rerender } = render(renderTabs(false));

    expect(onValueChange).not.toHaveBeenCalled();

    rerender(renderTabs(true));

    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith('second');
  });

  it('renders default value content', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).not.toBeVisible();
  });

  it('switches content on click', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="tab1" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith('tab2');
  });

  it('does not notify when clicking the selected tab', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="tab1" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Tab 1' }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not select a tab when its consumer click is prevented', () => {
    const onValueChange = vi.fn();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <Tabs defaultValue="tab1" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2" onClick={onClick}>
            Tab 2
          </TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content 1')).toBeVisible();
  });

  it('does not call disabled tab consumers', () => {
    const onClick = vi.fn();
    render(
      <Tabs defaultValue="tab1">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2" disabled onClick={onClick}>
            Tab 2
          </TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
  });

  it('notifies once without mutating controlled tabs', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs value="tab1" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith('tab2');
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
  });

  it('supports controlled mode', () => {
    const TestComponent = () => {
      return (
        <Tabs value="tab2" onValueChange={() => undefined}>
          <TabList>
            <TabTrigger value="tab1">Tab 1</TabTrigger>
            <TabTrigger value="tab2">Tab 2</TabTrigger>
          </TabList>
          <TabContent value="tab1">Content 1</TabContent>
          <TabContent value="tab2">Content 2</TabContent>
        </Tabs>
      );
    };
    render(<TestComponent />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('retains the latest controlled value when becoming uncontrolled', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Tabs value="tab1" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    rerender(
      <Tabs value="tab2" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );
    rerender(
      <Tabs defaultValue="tab1" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content 2')).toBeVisible();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each(['removed', 'disabled'] as const)(
    'notifies once when controlled handoff makes the selected trigger %s',
    (unavailableState) => {
      const onValueChange = vi.fn();
      const renderTabs = (controlled: boolean, makeUnavailable: boolean) => {
        const children = (
          <>
            <TabList>
              <TabTrigger value="first">First</TabTrigger>
              {!(makeUnavailable && unavailableState === 'removed') && (
                <TabTrigger
                  value="second"
                  disabled={makeUnavailable && unavailableState === 'disabled'}
                >
                  Second
                </TabTrigger>
              )}
            </TabList>
            <TabContent value="first">First content</TabContent>
            <TabContent value="second">Second content</TabContent>
          </>
        );

        return controlled ? (
          <Tabs value="second" onValueChange={onValueChange}>
            {children}
          </Tabs>
        ) : (
          <Tabs onValueChange={onValueChange}>{children}</Tabs>
        );
      };
      const { rerender } = render(renderTabs(true, false));

      expect(onValueChange).not.toHaveBeenCalled();

      rerender(renderTabs(false, true));

      expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
      expect(onValueChange).toHaveBeenCalledOnce();
      expect(onValueChange).toHaveBeenCalledWith('first');
    },
  );

  it('keeps initial uncontrolled automatic resolution silent after controlled tracking support', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="first">First</TabTrigger>
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
        <TabContent value="second">Second content</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('falls back from a disabled controlled value to the first enabled trigger', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Tabs value="archived" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="archived" disabled>
            Archived
          </TabTrigger>
          <TabTrigger value="active">Active</TabTrigger>
        </TabList>
        <TabContent value="archived">Archived content</TabContent>
        <TabContent value="active">Active content</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Archived' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: 'Active' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Active content')).toBeVisible();
    expect(onValueChange).toHaveBeenCalledWith('active');

    rerender(
      <Tabs onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="archived" disabled>
            Archived
          </TabTrigger>
          <TabTrigger value="active">Active</TabTrigger>
        </TabList>
        <TabContent value="archived">Archived content</TabContent>
        <TabContent value="active">Active content</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Active' })).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('notifies when an invalid controlled value resolves to a new fallback', () => {
    const onValueChange = vi.fn();
    const renderTabs = (firstDisabled: boolean) => (
      <Tabs value="missing" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="first" disabled={firstDisabled}>
            First
          </TabTrigger>
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
        <TabContent value="second">Second content</TabContent>
      </Tabs>
    );
    const { rerender } = render(renderTabs(false));

    expect(onValueChange).toHaveBeenLastCalledWith('first');
    rerender(renderTabs(true));

    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).toHaveBeenNthCalledWith(2, 'second');

    rerender(renderTabs(true));
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it('moves focus to the selected fallback when the focused tab becomes disabled', () => {
    const renderTabs = (firstDisabled: boolean) => (
      <Tabs defaultValue="first">
        <TabList>
          <TabTrigger value="first" disabled={firstDisabled}>
            First
          </TabTrigger>
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
        <TabContent value="second">Second content</TabContent>
      </Tabs>
    );
    const { rerender } = render(renderTabs(false));
    const firstTab = screen.getByRole('tab', { name: 'First' });
    firstTab.focus();

    rerender(renderTabs(true));

    expect(screen.getByRole('tab', { name: 'Second' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');
  });

  it('moves ShadowRoot focus when the selected tab becomes disabled', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    shadowRoot.append(container);
    document.body.append(host);
    const renderTabs = (firstDisabled: boolean) => (
      <Tabs defaultValue="first">
        <TabList>
          <TabTrigger value="first" disabled={firstDisabled}>
            First
          </TabTrigger>
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
        <TabContent value="second">Second content</TabContent>
      </Tabs>
    );
    const { rerender, unmount } = render(renderTabs(false), { container });
    const queries = within(container);
    queries.getByRole('tab', { name: 'First' }).focus();

    rerender(renderTabs(true));

    expect(shadowRoot.activeElement).toBe(queries.getByRole('tab', { name: 'Second' }));
    unmount();
    host.remove();
  });

  it.each(['disabled', 'removed'] as const)(
    'does not reclaim document focus when a ShadowRoot tab is %s',
    (change) => {
      const host = document.createElement('div');
      const shadowRoot = host.attachShadow({ mode: 'open' });
      const container = document.createElement('div');
      const outsideButton = document.createElement('button');
      outsideButton.textContent = 'Outside';
      shadowRoot.append(container);
      document.body.append(host, outsideButton);
      const renderTabs = (changed: boolean) => (
        <Tabs defaultValue="first">
          <TabList>
            {!(changed && change === 'removed') && (
              <TabTrigger value="first" disabled={changed && change === 'disabled'}>
                First
              </TabTrigger>
            )}
            <TabTrigger value="second">Second</TabTrigger>
          </TabList>
          <TabContent value="first">First content</TabContent>
          <TabContent value="second">Second content</TabContent>
        </Tabs>
      );
      const { rerender, unmount } = render(renderTabs(false), { container });
      within(container).getByRole('tab', { name: 'First' }).focus();
      outsideButton.focus();

      rerender(renderTabs(true));

      expect(outsideButton).toHaveFocus();
      unmount();
      host.remove();
      outsideButton.remove();
    },
  );

  it('moves focus to the controlled fallback when the focused tab becomes disabled', () => {
    const onValueChange = vi.fn();
    const renderTabs = (firstDisabled: boolean) => (
      <Tabs value="first" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="first" disabled={firstDisabled}>
            First
          </TabTrigger>
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
        <TabContent value="second">Second content</TabContent>
      </Tabs>
    );
    const { rerender } = render(renderTabs(false));
    screen.getByRole('tab', { name: 'First' }).focus();

    rerender(renderTabs(true));

    expect(screen.getByRole('tab', { name: 'Second' })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('second');
  });

  it('does not move focus when a previously focused tab becomes disabled after focus leaves tabs', () => {
    const renderTabs = (firstDisabled: boolean) => (
      <>
        <Tabs defaultValue="first">
          <TabList>
            <TabTrigger value="first" disabled={firstDisabled}>
              First
            </TabTrigger>
            <TabTrigger value="second">Second</TabTrigger>
          </TabList>
          <TabContent value="first">First content</TabContent>
          <TabContent value="second">Second content</TabContent>
        </Tabs>
        <button type="button">Outside</button>
      </>
    );
    const { rerender } = render(renderTabs(false));
    screen.getByRole('tab', { name: 'First' }).focus();
    screen.getByRole('button', { name: 'Outside' }).focus();

    rerender(renderTabs(true));

    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
  });

  it('respects an active panel tabIndex override', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
        </TabList>
        <TabContent value="tab1" tabIndex={-1}>
          <input aria-label="Draft" />
        </TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tabpanel')).toHaveAttribute('tabindex', '-1');
  });

  it('does not render unselected content when lazyMount is true', () => {
    render(
      <Tabs defaultValue="tab1" lazyMount>
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('only links lazy-mounted tabs to panels while those panels are mounted', () => {
    render(
      <Tabs defaultValue="tab1" lazyMount>
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    expect(document.getElementById(tab1.getAttribute('aria-controls')!)).toBeInTheDocument();
    expect(tab2).not.toHaveAttribute('aria-controls');

    fireEvent.click(tab2);
    expect(document.getElementById(tab2.getAttribute('aria-controls')!)).toBeInTheDocument();
    expect(tab1).not.toHaveAttribute('aria-controls');
  });

  it('keeps a lazy-mounted panel mounted after its first selection', () => {
    render(
      <Tabs defaultValue="tab1" lazyMount>
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">
          <input aria-label="Draft" defaultValue="Saved draft" />
        </TabContent>
      </Tabs>,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    const draft = screen.getByRole('textbox', { name: 'Draft' });
    fireEvent.change(draft, { target: { value: 'Updated draft' } });

    fireEvent.click(screen.getByRole('tab', { name: 'Tab 1' }));
    expect(screen.getByRole('textbox', { hidden: true, name: 'Draft' })).toHaveValue(
      'Updated draft',
    );
  });

  it('links tabpanel to its tab trigger via aria-labelledby', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
      </Tabs>,
    );
    const panel = screen.getByRole('tabpanel');
    const labelId = panel.getAttribute('aria-labelledby');
    expect(labelId).toBe(screen.getByRole('tab').id);
    expect(labelId).not.toContain('tab1');
    expect(document.getElementById(labelId!)).not.toBeNull();
  });

  it('associates wrapped triggers and panels without inspecting React child identity', () => {
    const WrappedTrigger = forwardRef<
      HTMLButtonElement,
      ComponentPropsWithoutRef<typeof TabTrigger>
    >((props, ref) => <TabTrigger {...props} ref={ref} />);
    const WrappedContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof TabContent>>(
      (props, ref) => <TabContent {...props} ref={ref} />,
    );

    render(
      <Tabs defaultValue="wrapped">
        <TabList>
          <WrappedTrigger value="wrapped">Wrapped tab</WrappedTrigger>
        </TabList>
        <section>
          <WrappedContent value="wrapped">Wrapped content</WrappedContent>
        </section>
      </Tabs>,
    );

    const tab = screen.getByRole('tab', { name: 'Wrapped tab' });
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  });

  it('keeps registered associations deterministic through StrictMode and dynamic order', () => {
    const renderTabs = (reversed: boolean) => {
      const values = reversed ? ['second', 'first'] : ['first', 'second'];
      return (
        <StrictMode>
          <Tabs defaultValue="first">
            <TabList>
              {values.map((value) => (
                <TabTrigger key={value} value={value}>
                  {value}
                </TabTrigger>
              ))}
            </TabList>
            {values.map((value) => (
              <TabContent key={value} value={value}>
                {value} content
              </TabContent>
            ))}
          </Tabs>
        </StrictMode>
      );
    };
    const { rerender } = render(renderTabs(false));

    rerender(renderTabs(true));

    for (const value of ['first', 'second']) {
      const tab = screen.getByRole('tab', { name: value });
      const panel = screen.getByText(`${value} content`).closest('[role="tabpanel"]');
      expect(panel).not.toBeNull();
      expect(tab).toHaveAttribute('aria-controls', panel!.id);
      expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    }
  });

  it('uses unique ARIA IDs for separate tab instances with the same values', () => {
    render(
      <>
        <Tabs defaultValue="overview">
          <TabList>
            <TabTrigger value="overview">First overview</TabTrigger>
          </TabList>
          <TabContent value="overview">First content</TabContent>
        </Tabs>
        <Tabs defaultValue="overview">
          <TabList>
            <TabTrigger value="overview">Second overview</TabTrigger>
          </TabList>
          <TabContent value="overview">Second content</TabContent>
        </Tabs>
      </>,
    );
    const tabs = screen.getAllByRole('tab');
    const panels = screen.getAllByRole('tabpanel');
    expect(tabs[0].id).not.toBe(tabs[1].id);
    expect(panels[0].id).not.toBe(panels[1].id);
    panels.forEach((panel) => {
      expect(document.getElementById(panel.getAttribute('aria-labelledby')!)).toBeInTheDocument();
    });
  });

  it('warns in development when trigger values are duplicated', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Tabs defaultValue="duplicate">
        <TabList>
          <TabTrigger value="duplicate">First</TabTrigger>
          <TabTrigger value="duplicate">Second</TabTrigger>
        </TabList>
        <TabContent value="duplicate">Content</TabContent>
      </Tabs>,
    );

    expect(warning).toHaveBeenCalledWith(
      '[Tabs] TabTrigger values must be unique within a Tabs instance. Duplicate values produce ambiguous tab and panel relationships.',
    );
    warning.mockRestore();
  });

  it('fails closed when trigger or panel values are duplicated', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Tabs defaultValue="duplicate">
        <TabList>
          <TabTrigger value="duplicate">First</TabTrigger>
          <TabTrigger value="duplicate">Second</TabTrigger>
        </TabList>
        <TabContent value="duplicate">First content</TabContent>
        <TabContent value="duplicate">Second content</TabContent>
      </Tabs>,
    );

    const tabs = screen.getAllByRole('tab');
    const panels = screen.getAllByRole('tabpanel', { hidden: true });
    expect(new Set(tabs.map((tab) => tab.id)).size).toBe(2);
    expect(new Set(panels.map((panel) => panel.id)).size).toBe(2);
    expect(tabs.filter((tab) => tab.getAttribute('aria-selected') === 'true')).toHaveLength(0);
    expect(panels.filter((panel) => !panel.hasAttribute('hidden'))).toHaveLength(0);
    tabs.forEach((tab) => {
      expect(tab).toHaveAttribute('aria-disabled', 'true');
      expect(tab).not.toHaveAttribute('aria-controls');
    });
    panels.forEach((panel) => {
      expect(panel).not.toHaveAttribute('aria-labelledby');
    });
    warning.mockRestore();
  });

  it('moves selection and focus away from a value that becomes duplicated', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const renderTabs = (duplicate: boolean) => (
      <Tabs defaultValue="first">
        <TabList>
          <TabTrigger value="first">First</TabTrigger>
          {duplicate ? <TabTrigger value="first">First duplicate</TabTrigger> : null}
          <TabTrigger value="second">Second</TabTrigger>
        </TabList>
        <TabContent value="first">First content</TabContent>
        <TabContent value="second">Second content</TabContent>
      </Tabs>
    );
    const { rerender } = render(renderTabs(false));
    const stableFirstId = screen.getByRole('tab', { name: 'First' }).id;
    screen.getByRole('tab', { name: 'First' }).focus();

    rerender(renderTabs(true));

    expect(new Set(screen.getAllByRole('tab').map((tab) => tab.id)).size).toBe(3);
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Second content')).toBeVisible();

    rerender(renderTabs(false));
    expect(screen.getByRole('tab', { name: 'First' }).id).toBe(stableFirstId);
    warning.mockRestore();
  });

  it('omits duplicate trigger and panel IDREFs when no counterpart exists', () => {
    render(
      <Tabs defaultValue="duplicate">
        <TabList>
          <TabTrigger value="duplicate">First</TabTrigger>
          <TabTrigger value="duplicate">Second</TabTrigger>
        </TabList>
        <TabContent value="duplicate">Content</TabContent>
      </Tabs>,
    );

    expect(screen.getAllByRole('tab')[1]).not.toHaveAttribute('aria-controls');
  });

  it('omits IDREFs for unmatched single triggers and panels', () => {
    const { rerender } = render(
      <Tabs>
        <TabList>
          <TabTrigger value="orphan-trigger">Orphan trigger</TabTrigger>
        </TabList>
      </Tabs>,
    );

    expect(screen.getByRole('tab')).not.toHaveAttribute('aria-controls');

    rerender(
      <Tabs value="orphan-panel" onValueChange={() => undefined}>
        <TabContent value="orphan-panel" aria-label="Custom orphan label">
          Orphan panel
        </TabContent>
      </Tabs>,
    );

    const panel = screen.getByRole('tabpanel');
    expect(panel).not.toHaveAttribute('aria-labelledby');
    expect(panel).toHaveAttribute('aria-label', 'Custom orphan label');
  });

  it('localizes the fallback name for an unmatched tab panel', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Tabs defaultValue="orphan-panel">
          <TabContent value="orphan-panel">Orphan panel</TabContent>
        </Tabs>
      </LocaleProvider>,
    );

    expect(screen.getByRole('tabpanel', { name: 'タブパネル: orphan-panel' })).toBeInTheDocument();
  });

  it('keeps managed tab state when conflicting ARIA props are supplied', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabList {...({ role: 'list' } as never)}>
          <TabTrigger
            {...({ 'aria-controls': 'wrong', 'aria-selected': false } as never)}
            value="tab1"
          >
            Tab 1
          </TabTrigger>
        </TabList>
        <TabContent {...({ 'aria-labelledby': 'wrong', hidden: true } as never)} value="tab1">
          Content 1
        </TabContent>
      </Tabs>,
    );
    const tab = screen.getByRole('tab', { name: 'Tab 1' });
    const panel = screen.getByRole('tabpanel');
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    expect(panel).not.toHaveAttribute('hidden');
  });

  it('maps public appearance to the internal visual recipe', () => {
    const { rerender } = render(
      <Tabs defaultValue="tab1" appearance="outline">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tablist')).toHaveClass('poffy-tabs__list--variant_enclosed');

    rerender(
      <Tabs defaultValue="tab1" appearance="soft">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tablist')).toHaveClass('poffy-tabs__list--variant_pill');
  });

  it('accepts pop indicator animation', () => {
    render(
      <Tabs defaultValue="tab1" indicatorAnimation="pop">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
  });

  it('only keeps the selected tab in the sequential tab order', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('tabindex', '-1');
  });

  describe('keyboard navigation', () => {
    function renderTabs() {
      render(
        <Tabs defaultValue="tab1">
          <TabList>
            <TabTrigger value="tab1">Tab 1</TabTrigger>
            <TabTrigger value="tab2">Tab 2</TabTrigger>
            <TabTrigger value="tab3">Tab 3</TabTrigger>
          </TabList>
          <TabContent value="tab1">Content 1</TabContent>
          <TabContent value="tab2">Content 2</TabContent>
          <TabContent value="tab3">Content 3</TabContent>
        </Tabs>,
      );
      return {
        tab1: screen.getByText('Tab 1'),
        tab2: screen.getByText('Tab 2'),
        tab3: screen.getByText('Tab 3'),
      };
    }

    it('moves focus right with ArrowRight', () => {
      const { tab1, tab2 } = renderTabs();
      tab1.focus();
      fireEvent.keyDown(tab1, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(tab2);
    });

    it('does not consume vertical arrows in horizontal orientation', () => {
      const { tab1, tab2 } = renderTabs();
      tab1.focus();

      expect(fireEvent.keyDown(tab1, { key: 'ArrowDown' })).toBe(true);
      expect(document.activeElement).toBe(tab1);
      expect(document.activeElement).not.toBe(tab2);
    });

    it('uses only vertical arrows in vertical orientation', () => {
      render(
        <Tabs defaultValue="tab1" orientation="vertical" dir="rtl">
          <TabList>
            <TabTrigger value="tab1">Tab 1</TabTrigger>
            <TabTrigger value="tab2">Tab 2</TabTrigger>
          </TabList>
          <TabContent value="tab1">Content 1</TabContent>
          <TabContent value="tab2">Content 2</TabContent>
        </Tabs>,
      );
      const first = screen.getByRole('tab', { name: 'Tab 1' });
      const second = screen.getByRole('tab', { name: 'Tab 2' });
      first.focus();

      expect(fireEvent.keyDown(first, { key: 'ArrowRight' })).toBe(true);
      expect(document.activeElement).toBe(first);
      expect(fireEvent.keyDown(first, { key: 'ArrowDown' })).toBe(false);
      expect(document.activeElement).toBe(second);
    });

    it('scrolls only the tab list when keyboard focus moves to a clipped tab', () => {
      const { tab1, tab2 } = renderTabs();
      const scrollIntoView = vi.fn();
      tab2.scrollIntoView = scrollIntoView;
      tab1.focus();

      fireEvent.keyDown(tab1, { key: 'ArrowRight' });

      expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
    });

    it('reverses horizontal arrow navigation from the rendered RTL direction', () => {
      render(
        <Tabs defaultValue="tab1" dir="rtl">
          <TabList>
            <TabTrigger value="tab1">Tab 1</TabTrigger>
            <TabTrigger value="tab2">Tab 2</TabTrigger>
          </TabList>
          <TabContent value="tab1">Content 1</TabContent>
          <TabContent value="tab2">Content 2</TabContent>
        </Tabs>,
      );
      const first = screen.getByRole('tab', { name: 'Tab 1' });
      const second = screen.getByRole('tab', { name: 'Tab 2' });
      first.focus();

      fireEvent.keyDown(first, { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(second);
    });

    it('preserves roving focus when a custom list key handler is provided', () => {
      const handleKeyDown = vi.fn();
      render(
        <Tabs defaultValue="tab1">
          <TabList onKeyDown={handleKeyDown}>
            <TabTrigger value="tab1">Tab 1</TabTrigger>
            <TabTrigger value="tab2">Tab 2</TabTrigger>
          </TabList>
          <TabContent value="tab1">Content 1</TabContent>
          <TabContent value="tab2">Content 2</TabContent>
        </Tabs>,
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      tab1.focus();

      fireEvent.keyDown(tab1, { key: 'ArrowRight' });

      expect(handleKeyDown).toHaveBeenCalled();
      expect(document.activeElement).toBe(tab2);
    });

    it('moves focus left with ArrowLeft', () => {
      const { tab2, tab1 } = renderTabs();
      tab2.focus();
      fireEvent.keyDown(tab2, { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(tab1);
    });

    it('wraps around to last tab on ArrowLeft from first', () => {
      const { tab1, tab3 } = renderTabs();
      tab1.focus();
      fireEvent.keyDown(tab1, { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(tab3);
    });

    it('wraps around to first tab on ArrowRight from last', () => {
      const { tab1, tab3 } = renderTabs();
      tab3.focus();
      fireEvent.keyDown(tab3, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(tab1);
    });

    it('moves focus to first tab with Home key', () => {
      const { tab1, tab3 } = renderTabs();
      tab3.focus();
      fireEvent.keyDown(tab3, { key: 'Home' });
      expect(document.activeElement).toBe(tab1);
    });

    it('moves focus to last tab with End key', () => {
      const { tab1, tab3 } = renderTabs();
      tab1.focus();
      fireEvent.keyDown(tab1, { key: 'End' });
      expect(document.activeElement).toBe(tab3);
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations in vertical orientation', async () => {
    const { container } = render(
      <Tabs defaultValue="tab1" orientation="vertical">
        <TabList aria-label="Account sections">
          <TabTrigger value="tab1">Profile</TabTrigger>
          <TabTrigger value="tab2">Security</TabTrigger>
        </TabList>
        <TabContent value="tab1">Profile content</TabContent>
        <TabContent value="tab2">Security content</TabContent>
      </Tabs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

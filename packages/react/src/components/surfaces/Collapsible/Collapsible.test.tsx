import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef, forwardRef, type ComponentPropsWithoutRef, type FormEvent } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '.';

const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  function CustomButton(props, ref) {
    return <button ref={ref} {...props} />;
  },
);

/**
 * ### Test Strategy: Collapsible
 * - **Focus**: Disclosure semantics, controlled/uncontrolled state, disabled
 *   behavior, keepMounted content, and accessibility compliance via `axe`.
 * - **DON'T**: Do not assert animation timing or generated style details.
 */
describe('Collapsible', () => {
  it('renders valid disclosure IDREFs during SSR', () => {
    const html = renderToString(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Server details</CollapsibleContent>
      </Collapsible>,
    );
    const triggerId = html.match(/<button[^>]*id="([^"]+)"/)?.[1];
    const panelTag = html.match(/<div[^>]*role="region"[^>]*>/)?.[0];
    const panelId = panelTag?.match(/id="([^"]+)"/)?.[1];

    expect(triggerId).toBeTruthy();
    expect(panelId).toBeTruthy();
    expect(html).toContain(`aria-controls="${panelId}"`);
    expect(html).toContain(`aria-labelledby="${triggerId}"`);
  });
  it('renders closed by default and opens from the trigger', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Hidden details</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Hidden details')).not.toBeInTheDocument();

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Hidden details')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-controls');
  });

  it('supports defaultOpen', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Visible details</CollapsibleContent>
      </Collapsible>,
    );

    expect(screen.getByRole('button', { name: 'Details' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('Visible details')).toBeInTheDocument();
  });

  it('supports controlled open state', () => {
    const handleOpenChange = vi.fn();
    render(
      <Collapsible open={false} onOpenChange={handleOpenChange}>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Controlled details</CollapsibleContent>
      </Collapsible>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Details' }));

    expect(handleOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText('Controlled details')).not.toBeInTheDocument();
  });

  it('treats untyped open without a callback as an uncontrolled initial state', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Collapsible {...({ open: true, defaultOpen: false } as never)}>
        <CollapsibleTrigger>Legacy details</CollapsibleTrigger>
        <CollapsibleContent>Legacy content</CollapsibleContent>
      </Collapsible>,
    );

    expect(screen.getByText('Legacy content')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Legacy details' }));
    expect(screen.queryByText('Legacy content')).not.toBeInTheDocument();
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('falls back to uncontrolled'));
    warning.mockRestore();
  });

  it('does not toggle when disabled', () => {
    const handleOpenChange = vi.fn();
    render(
      <Collapsible disabled onOpenChange={handleOpenChange}>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Disabled details</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger).toBeDisabled();
    fireEvent.click(trigger);

    expect(handleOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByText('Disabled details')).not.toBeInTheDocument();
  });

  it('blocks disabled asChild trigger activation handlers', () => {
    const onClick = vi.fn();
    const onClickCapture = vi.fn();
    const onChildKeyDown = vi.fn();
    const onTriggerKeyDown = vi.fn();
    const onPointerUpCapture = vi.fn();
    const onAuxClick = vi.fn();
    const onAuxClickCapture = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Collapsible disabled onOpenChange={onOpenChange}>
        <CollapsibleTrigger
          asChild
          onAuxClickCapture={onAuxClickCapture}
          onKeyDown={onTriggerKeyDown}
          onPointerUpCapture={onPointerUpCapture}
        >
          <a
            href="#details"
            onAuxClick={onAuxClick}
            onClick={onClick}
            onClickCapture={onClickCapture}
            onKeyDown={onChildKeyDown}
          >
            Details
          </a>
        </CollapsibleTrigger>
        <CollapsibleContent>Disabled details</CollapsibleContent>
      </Collapsible>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Details' }));

    expect(onClickCapture).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();

    const trigger = screen.getByRole('button', { name: 'Details' });
    fireEvent.keyDown(trigger, { key: 'Tab' });
    expect(onChildKeyDown).toHaveBeenCalledOnce();
    expect(onTriggerKeyDown).toHaveBeenCalledOnce();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.pointerUp(trigger);
    expect(
      trigger.dispatchEvent(
        new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
      ),
    ).toBe(false);
    expect(onChildKeyDown).toHaveBeenCalledOnce();
    expect(onTriggerKeyDown).toHaveBeenCalledOnce();
    expect(onPointerUpCapture).not.toHaveBeenCalled();
    expect(onAuxClick).not.toHaveBeenCalled();
    expect(onAuxClickCapture).not.toHaveBeenCalled();
  });

  it('keeps content mounted when requested', async () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent keepMounted>Persistent details</CollapsibleContent>
      </Collapsible>,
    );

    expect(screen.getByText('Persistent details')).toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: 'Details' });
    const region = screen.getByRole('region', { hidden: true });
    expect(region).toHaveAttribute('aria-hidden', 'true');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-controls', region.id));
  });

  it('preserves managed trigger disclosure attributes', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger
          id="custom-trigger"
          aria-controls="custom-content"
          aria-expanded={false}
          data-state="custom"
        >
          Details
        </CollapsibleTrigger>
        <CollapsibleContent>Managed details</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Details' });
    const region = screen.getByRole('region', { name: 'Details' });
    expect(trigger).not.toHaveAttribute('id', 'custom-trigger');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', region.id);
    expect(trigger).toHaveAttribute('data-state', 'open');
  });

  it('preserves managed root state attributes', () => {
    const { container } = render(
      <Collapsible defaultOpen data-state="custom" data-disabled="custom">
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Managed details</CollapsibleContent>
      </Collapsible>,
    );
    expect(container.firstElementChild).toHaveAttribute('data-state', 'open');
    expect(container.firstElementChild).not.toHaveAttribute('data-disabled');
  });

  it('supports asChild root and trigger composition', () => {
    const ref = createRef<Element>();
    render(
      <Collapsible asChild defaultOpen ref={ref}>
        <section aria-label="Disclosure">
          <CollapsibleTrigger asChild>
            <button type="button">Details</button>
          </CollapsibleTrigger>
          <CollapsibleContent>Composed details</CollapsibleContent>
        </section>
      </Collapsible>,
    );

    expect(ref.current).toBe(screen.getByLabelText('Disclosure'));
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(screen.getByRole('region', { name: 'Details' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Details' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('keeps a native asChild trigger out of form submission', () => {
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <button>Details</button>
          </CollapsibleTrigger>
          <CollapsibleContent>Hidden details</CollapsibleContent>
        </Collapsible>
      </form>,
    );

    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger).toHaveAttribute('type', 'button');

    fireEvent.click(trigger);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('natively disables a native asChild trigger', () => {
    render(
      <Collapsible disabled>
        <CollapsibleTrigger asChild>
          <button type="button">Details</button>
        </CollapsibleTrigger>
        <CollapsibleContent>Disabled details</CollapsibleContent>
      </Collapsible>,
    );

    expect(screen.getByRole('button', { name: 'Details' })).toBeDisabled();
  });

  it('delegates owned button props and ref to a custom button host', () => {
    const ref = createRef<HTMLElement>();
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
    const onOpenChange = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <Collapsible disabled onOpenChange={onOpenChange}>
          <CollapsibleTrigger asChild ref={ref}>
            <CustomButton type="submit">Details</CustomButton>
          </CollapsibleTrigger>
          <CollapsibleContent>Disabled details</CollapsibleContent>
        </Collapsible>
      </form>,
    );

    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toBeDisabled();
    fireEvent.click(trigger);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('falls back to a container when the asChild root cannot contain disclosure parts', () => {
    render(
      <Collapsible asChild>
        <button type="button" data-testid="invalid-collapsible-host">
          <CollapsibleTrigger>Details</CollapsibleTrigger>
          <CollapsibleContent>Hidden details</CollapsibleContent>
        </button>
      </Collapsible>,
    );

    expect(screen.queryByTestId('invalid-collapsible-host')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Details' })).toBeInTheDocument();
  });

  it('gives a non-button asChild trigger button keyboard semantics', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger asChild>
          <div>Details</div>
        </CollapsibleTrigger>
        <CollapsibleContent>Hidden details</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.keyUp(trigger, { key: 'Enter' });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('falls back safely when an asChild trigger cannot host button content', () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Collapsible onOpenChange={onOpenChange}>
        <CollapsibleTrigger asChild>
          <select aria-label="Ignored trigger">
            <option>Details</option>
          </select>
        </CollapsibleTrigger>
        <CollapsibleContent>Hidden details</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button');
    expect(screen.queryByRole('combobox', { name: 'Ignored trigger' })).not.toBeInTheDocument();
    expect(container.querySelector('button select')).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('delegates content semantics to its child when asChild is enabled', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent asChild>
          <section data-testid="details-content">Composed details</section>
        </CollapsibleContent>
      </Collapsible>,
    );

    const content = screen.getByTestId('details-content');
    expect(content.tagName).toBe('SECTION');
    expect(content).toHaveAttribute('role', 'region');
    expect(content).toHaveAttribute('aria-labelledby', screen.getByRole('button').id);
    expect(content.querySelector('[data-collapsible-content-inner]')).not.toBeInTheDocument();
  });

  it('falls back to a non-interactive region for unsupported asChild hosts', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent asChild>
          <button type="button">Nested action</button>
        </CollapsibleContent>
      </Collapsible>,
    );

    expect(screen.getByRole('region', { name: 'Details' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nested action' })).not.toHaveAttribute('role');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Accessible details</CollapsibleContent>
      </Collapsible>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('fails multiple triggers closed and gives every part a unique id', () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>First</CollapsibleTrigger>
        <CollapsibleTrigger>Second</CollapsibleTrigger>
        <CollapsibleContent>Details</CollapsibleContent>
      </Collapsible>,
    );

    screen.getAllByRole('button').forEach((trigger) => expect(trigger).toBeDisabled());
    const ids = [...container.querySelectorAll<HTMLElement>('[id]')].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});

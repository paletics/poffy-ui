import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '.';

describe('Accordion', () => {
  it('renders valid disclosure IDREFs during SSR', () => {
    const html = renderToString(
      <Accordion defaultValue="details">
        <AccordionItem value="details">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>Server details</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const triggerId = html.match(/<button[^>]*id="([^"]+)"/)?.[1];
    const panelTag = html.match(/<div[^>]*role="region"[^>]*>/)?.[0];
    const panelId = panelTag?.match(/id="([^"]+)"/)?.[1];

    expect(triggerId).toBeTruthy();
    expect(panelId).toBeTruthy();
    expect(html).toContain(`aria-controls="${panelId}"`);
    expect(html).toContain(`aria-labelledby="${triggerId}"`);
  });
  it('renders and expands content', () => {
    render(
      <Accordion>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Trigger 1'));
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('supports multiple', () => {
    render(
      <Accordion multiple>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    fireEvent.click(screen.getByText('Trigger 1'));
    fireEvent.click(screen.getByText('Trigger 2'));

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('collapses content when open trigger is clicked again', () => {
    render(
      <Accordion>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole('button', { name: /trigger 1/i });

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('sets aria-expanded correctly', () => {
    render(
      <Accordion>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole('button', { name: /trigger 1/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('groups each trigger in an accordion heading', () => {
    render(
      <Accordion>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole('heading', { name: /trigger 1/i })).toHaveAttribute('aria-level', '3');
  });

  it('configures one heading level for every trigger', () => {
    render(
      <Accordion headingLevel={2}>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getAllByRole('heading')).toHaveLength(2);
    screen.getAllByRole('heading').forEach((heading) => {
      expect(heading).toHaveAttribute('aria-level', '2');
    });
  });

  it('can omit heading semantics without changing the wrapper DOM', () => {
    const { container } = render(
      <Accordion headingLevel={null}>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole('button', { name: /trigger 1/i });
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(trigger.parentElement?.tagName).toBe('DIV');
    expect(container.querySelector('[aria-level]')).toBeNull();
  });

  it('falls back to a native container for unsafe asChild hosts', () => {
    render(
      <Accordion asChild>
        <button type="button">
          <AccordionItem value="1">
            <AccordionTrigger>Trigger 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </button>
      </Accordion>,
    );

    const trigger = screen.getByRole('button', { name: /trigger 1/i });
    expect(trigger.closest('button')?.parentElement?.tagName).toBe('DIV');
    expect(trigger.closest('button')?.parentElement?.querySelector('button button')).toBeNull();
  });

  it('forwards root and item refs to their delegated hosts', () => {
    const rootRef = createRef<Element>();
    const itemRef = createRef<Element>();
    render(
      <Accordion asChild ref={rootRef}>
        <section aria-label="FAQ">
          <AccordionItem asChild ref={itemRef} value="1">
            <article>
              <AccordionTrigger>Trigger 1</AccordionTrigger>
              <AccordionContent>Content 1</AccordionContent>
            </article>
          </AccordionItem>
        </section>
      </Accordion>,
    );

    expect(rootRef.current).toBe(screen.getByLabelText('FAQ'));
    expect(rootRef.current?.tagName).toBe('SECTION');
    expect(itemRef.current?.tagName).toBe('ARTICLE');
  });

  it('disables trigger when AccordionItem is disabled', () => {
    render(
      <Accordion>
        <AccordionItem value="1" disabled>
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole('button', { name: /trigger 1/i });
    expect(trigger).toBeDisabled();
  });

  it('opens item specified by defaultValue on first render', () => {
    render(
      <Accordion defaultValue="1">
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /trigger 1/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('opens only the first value when single mode receives an array', () => {
    render(
      <Accordion defaultValue={['1', '2']}>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('closes extra items when multiple mode is disabled at runtime', () => {
    const { rerender } = render(
      <Accordion multiple defaultValue={['1', '2']}>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText('Content 2')).toBeInTheDocument();

    rerender(
      <Accordion defaultValue={['1', '2']}>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('calls onChange with the opened value', () => {
    const handleChange = vi.fn();
    render(
      <Accordion onChange={handleChange}>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    fireEvent.click(screen.getByText('Trigger 1'));
    expect(handleChange).toHaveBeenCalledOnce();
    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('does not toggle when a trigger click is prevented', () => {
    const handleChange = vi.fn();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <Accordion onChange={handleChange}>
        <AccordionItem value="1">
          <AccordionTrigger onClick={onClick}>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger 1/i }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('does not call disabled trigger consumers', () => {
    const onClick = vi.fn();
    render(
      <Accordion>
        <AccordionItem value="1" disabled>
          <AccordionTrigger onClick={onClick}>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger 1/i }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('notifies once without mutating a controlled accordion', () => {
    const handleChange = vi.fn();
    render(
      <Accordion value="1" onChange={handleChange}>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger 2/i }));

    expect(handleChange).toHaveBeenCalledOnce();
    expect(handleChange).toHaveBeenCalledWith('2');
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('calls onChange with null when a single-mode item is closed', () => {
    const handleChange = vi.fn();
    render(
      <Accordion onChange={handleChange} defaultValue="1">
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    fireEvent.click(screen.getByText('Trigger 1'));
    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it('respects controlled value prop', () => {
    render(
      <Accordion value="1" onChange={() => undefined}>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Trigger 2'));
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('falls back safely for an untyped value with a non-function callback', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Accordion
        {...({
          value: '1',
          defaultValue: '2',
          onChange: 'not-a-function',
        } as never)}
      >
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /trigger 2/i }));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('falls back to uncontrolled'));
    warning.mockRestore();
  });

  it('owns trigger button, disclosure, and focus semantics', () => {
    const onSubmit = vi.fn();
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Accordion>
          <AccordionItem value="1">
            <AccordionTrigger
              {...({
                type: 'submit',
                role: 'link',
                id: 'consumer-id',
                tabIndex: -1,
                disabled: true,
                'aria-expanded': true,
                'aria-controls': 'consumer-panel',
                'aria-haspopup': 'menu',
                'aria-pressed': true,
                'aria-selected': true,
              } as never)}
            >
              Trigger 1
            </AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>,
    );

    const trigger = screen.getByRole('button', { name: /trigger 1/i });
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).not.toBeDisabled();
    expect(trigger).not.toHaveAttribute('role');
    expect(trigger).not.toHaveAttribute('tabindex');
    expect(trigger).not.toHaveAttribute('aria-haspopup');
    expect(trigger).not.toHaveAttribute('aria-pressed');
    expect(trigger).not.toHaveAttribute('aria-selected');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger.id).not.toBe('consumer-id');
    fireEvent.click(trigger);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('toggles open state with native Enter and Space keyboard activation', async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole('button', { name: /trigger 1/i });
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('removes nested native interactive trigger content while preserving its name', () => {
    render(
      <Accordion>
        <AccordionItem value="1">
          <AccordionTrigger>
            <a href="/details">Open details</a>
          </AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole('button', { name: 'Open details' });
    expect(screen.queryByRole('link', { name: 'Open details' })).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('applies public appearance classes', () => {
    const { container, rerender } = render(
      <Accordion appearance="soft">
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(container.firstChild).toHaveClass('poffy-accordion__root--appearance_soft');

    rerender(
      <Accordion appearance="ghost">
        <AccordionItem value="1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(container.firstChild).toHaveClass('poffy-accordion__root--appearance_ghost');
  });

  it('passes accessibility checks', async () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content for section 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content for section 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('fails duplicate item values and duplicate parts closed without duplicate IDs', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container } = render(
      <Accordion defaultValue="duplicate">
        <AccordionItem value="duplicate">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionTrigger>Second</AccordionTrigger>
          <AccordionContent>First content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="duplicate">
          <AccordionTrigger>Third</AccordionTrigger>
          <AccordionContent>Second content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    await waitFor(() =>
      screen.getAllByRole('button').forEach((trigger) => expect(trigger).toBeDisabled()),
    );
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    const ids = [...container.querySelectorAll<HTMLElement>('[id]')].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('duplicate'));
    warn.mockRestore();
  });
});

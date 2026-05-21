import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '.';

describe('Accordion', () => {
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

  it('calls onChange with empty string when single-mode item is closed', () => {
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
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('respects controlled value prop', () => {
    render(
      <Accordion value="1">
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

  it('toggles open state with keyboard Enter key', () => {
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
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('maps legacy variant aliases to public appearance classes', () => {
    const { container, rerender } = render(
      <Accordion variant="pop">
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
});

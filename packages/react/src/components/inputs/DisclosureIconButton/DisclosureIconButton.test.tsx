import { render, screen, fireEvent } from '@testing-library/react';
import { createRef, forwardRef, type ComponentPropsWithoutRef, type FormEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DisclosureIconButton } from './DisclosureIconButton';

const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  function CustomButton(props, ref) {
    return <button ref={ref} {...props} />;
  },
);

describe('DisclosureIconButton', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<DisclosureIconButton open={false} aria-label="Toggle" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('applies aria-expanded based on open state', () => {
    const { rerender } = render(<DisclosureIconButton open={false} aria-label="Toggle" />);
    expect(screen.getByRole('button', { name: 'Toggle' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    rerender(<DisclosureIconButton open aria-label="Toggle" />);
    expect(screen.getByRole('button', { name: 'Toggle' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onOpenChange with toggled state on click', () => {
    const onOpenChange = vi.fn();
    render(<DisclosureIconButton open={false} onOpenChange={onOpenChange} aria-label="Toggle" />);

    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when the consumer cancels the click', () => {
    const onOpenChange = vi.fn();
    render(
      <DisclosureIconButton
        open={false}
        onOpenChange={onOpenChange}
        onClick={(event) => event.preventDefault()}
        aria-label="Toggle"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('keeps open state attributes component-owned', () => {
    render(
      <DisclosureIconButton
        open
        aria-label="Toggle filters"
        aria-controls="filters-panel"
        {...({ 'data-state': 'closed' } as object)}
      />,
    );

    const button = screen.getByRole('button', { name: 'Toggle filters' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('data-state', 'open');
    expect(button).toHaveAttribute('aria-controls', 'filters-panel');
  });

  it('does not toggle when disabled', () => {
    const onOpenChange = vi.fn();
    render(
      <DisclosureIconButton
        open={false}
        onOpenChange={onOpenChange}
        aria-label="Toggle"
        disabled
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('delegates owned button props and ref to a custom button host', () => {
    const ref = createRef<HTMLElement>();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    const onOpenChange = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <DisclosureIconButton
          {...({
            form: 'external-form',
            formAction: '/unsafe',
            name: 'unsafe',
            value: 'unsafe',
          } as unknown as { form?: never })}
          asChild
          ref={ref}
          open={false}
          disabled
          aria-label="Toggle"
          onOpenChange={onOpenChange}
        >
          <CustomButton type="submit">Toggle</CustomButton>
        </DisclosureIconButton>
      </form>,
    );

    const button = screen.getByRole('button', { name: 'Toggle' });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute('form');
    expect(button).not.toHaveAttribute('formaction');
    expect(button).not.toHaveAttribute('name');
    expect(button).not.toHaveAttribute('value');
    fireEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('blocks asChild default actions when disabled', () => {
    const onClick = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <DisclosureIconButton
        asChild
        open={false}
        onClick={onClick}
        onOpenChange={onOpenChange}
        aria-label="Toggle"
        disabled
      >
        <a href="/filters">Toggle</a>
      </DisclosureIconButton>,
    );

    const button = screen.getByRole('button', { name: 'Toggle' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute('href');
    fireEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('provides button keyboard semantics and managed ARIA for a non-button asChild host', () => {
    const onOpenChange = vi.fn();
    render(
      <DisclosureIconButton
        asChild
        open
        aria-label="Toggle filters"
        aria-controls="filters-panel"
        onOpenChange={onOpenChange}
      >
        <div aria-expanded="false" aria-controls="conflicting-panel" aria-label="Conflicting label">
          Toggle
        </div>
      </DisclosureIconButton>,
    );

    const button = screen.getByRole('button', { name: 'Toggle filters' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-controls', 'filters-panel');
    expect(button).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    fireEvent.keyUp(button, { key: ' ', code: 'Space' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('makes an existing non-native button role tabbable when needed', () => {
    render(
      <DisclosureIconButton asChild open={false} aria-label="Toggle">
        <div role="button" data-testid="disclosure-host">
          Toggle
        </div>
      </DisclosureIconButton>,
    );

    const button = screen.getByRole('button', { name: 'Toggle' });
    expect(button).toBe(screen.getByTestId('disclosure-host'));
    expect(button.tagName).toBe('DIV');
    expect(button).toHaveAttribute('tabindex', '0');
  });

  it('does not toggle an asChild host when its child cancels the click', () => {
    const onOpenChange = vi.fn();
    render(
      <DisclosureIconButton asChild open aria-label="Toggle" onOpenChange={onOpenChange}>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- the component supplies button semantics */}
        <div onClick={(event) => event.preventDefault()}>Toggle</div>
      </DisclosureIconButton>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('falls back safely for void asChild hosts', () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <DisclosureIconButton asChild open={false} aria-label="Toggle" onOpenChange={onOpenChange}>
        <input aria-label="Ignored input" />
      </DisclosureIconButton>,
    );

    const button = screen.getByRole('button', { name: 'Toggle' });
    expect(screen.queryByRole('textbox', { name: 'Ignored input' })).not.toBeInTheDocument();
    expect(container.querySelector('button input')).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

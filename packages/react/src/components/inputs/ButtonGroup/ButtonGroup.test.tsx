import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Button } from '../Button';
import { ButtonGroup } from './ButtonGroup';

/**
 * ### Test Strategy: ButtonGroup
 * - **Focus**: Children rendering, `role="group"`, `aria-label` wiring, connected/fullWidth context,
 *   and full WAI-ARIA Group compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 * - **DON'T**: Do not test ActionMotion stagger timing — that is covered in animation unit tests.
 */
describe('ButtonGroup', () => {
  it('renders children inside a group element', () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group', { name: 'Actions' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Second' })).toBeInTheDocument();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(
      <ButtonGroup aria-label="Text formatting">
        <Button>Bold</Button>
        <Button>Italic</Button>
      </ButtonGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('exposes data-orientation attribute', () => {
    const { rerender } = render(
      <ButtonGroup aria-label="Group" orientation="horizontal">
        <Button>A</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group')).toHaveAttribute('data-orientation', 'horizontal');

    rerender(
      <ButtonGroup aria-label="Group" orientation="vertical">
        <Button>A</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group')).toHaveAttribute('data-orientation', 'vertical');
  });

  it('exposes wrapping as an explicit layout contract without leaking a native attribute', () => {
    render(
      <ButtonGroup aria-label="Wrapping group" wrap>
        <Button>Long primary action</Button>
        <Button>Long secondary action</Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole('group', { name: 'Wrapping group' });
    expect(group).toHaveAttribute('data-wrap', '');
    expect(group).not.toHaveAttribute('wrap');
  });

  it.each([
    ['connected', { connected: true } as const],
    ['vertical', { orientation: 'vertical' } as const],
  ])('treats wrap as a no-op for %s groups', (_name, props) => {
    render(
      <ButtonGroup aria-label="Unsupported wrapping group" wrap {...props}>
        <Button>Primary action</Button>
        <Button>Secondary action</Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole('group', { name: 'Unsupported wrapping group' });
    expect(group).not.toHaveAttribute('data-wrap');
    expect(group).not.toHaveAttribute('wrap');
  });

  it('forwards ref to the underlying div element', () => {
    const ref = { current: null };
    render(
      <ButtonGroup ref={ref} aria-label="Group">
        <Button>A</Button>
      </ButtonGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('preserves managed group semantics when callers provide conflicting attributes', () => {
    render(
      <ButtonGroup
        {...({ role: 'presentation' } as never)}
        aria-label="Group"
        data-orientation="vertical"
      >
        <Button>A</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group', { name: 'Group' })).toHaveAttribute(
      'data-orientation',
      'horizontal',
    );
  });

  it('uses a supplied non-interactive host for asChild', () => {
    render(
      <ButtonGroup asChild aria-label="Actions">
        <section data-testid="group-host">
          <Button>A</Button>
        </section>
      </ButtonGroup>,
    );
    expect(screen.getByTestId('group-host')).toHaveAttribute('role', 'group');
  });

  it('falls back to a div for asChild text content', () => {
    render(
      <ButtonGroup asChild aria-label="Actions">
        Actions
      </ButtonGroup>,
    );
    expect(screen.getByRole('group', { name: 'Actions' }).tagName).toBe('DIV');
  });

  it('rejects interactive asChild hosts to avoid nested buttons', async () => {
    const { container } = render(
      <ButtonGroup asChild aria-label="Actions">
        <button data-testid="unsafe-host">
          <Button>Save</Button>
        </button>
      </ButtonGroup>,
    );

    expect(screen.queryByTestId('unsafe-host')).not.toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Actions' }).tagName).toBe('DIV');
    expect(screen.getByRole('button', { name: 'Save' }).parentElement?.tagName).toBe('DIV');
    expect(await axe(container)).toHaveNoViolations();
  });
});

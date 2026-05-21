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

  it('forwards ref to the underlying div element', () => {
    const ref = { current: null };
    render(
      <ButtonGroup ref={ref} aria-label="Group">
        <Button>A</Button>
      </ButtonGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

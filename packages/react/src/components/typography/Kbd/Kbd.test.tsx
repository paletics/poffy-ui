import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Kbd } from './Kbd';

/**
 * ### Test Strategy: Kbd
 * - **Focus**: semantic keyboard markup, polymorphic slot behavior, and accessibility.
 * - **DON'T**: Do not test Panda token output or browser key rendering differences.
 */
describe('Kbd', () => {
  it('renders a semantic kbd element by default', () => {
    const { getByText } = render(<Kbd>Cmd+K</Kbd>);

    expect(getByText('Cmd+K').closest('kbd')).toBeInTheDocument();
  });

  it('merges class names and style props', () => {
    const { getByText } = render(
      <Kbd className="custom-key" color="text.secondary">
        Esc
      </Kbd>,
    );

    expect(getByText('Esc').closest('kbd')).toHaveClass('custom-key');
  });

  it('preserves element children during normal rendering', () => {
    const { getByText } = render(
      <Kbd>
        <span>Ctrl</span>
      </Kbd>,
    );

    expect(getByText('Ctrl').tagName).toBe('SPAN');
  });

  it('preserves keyboard-input semantics for non-kbd asChild hosts', () => {
    const { getByText } = render(
      <Kbd asChild>
        <span>Ctrl</span>
      </Kbd>,
    );

    expect(getByText('Ctrl').closest('kbd')).toBeInTheDocument();
    expect(getByText('Ctrl').closest('kbd')).toHaveClass('poffy-kbd');
  });

  it('preserves accessible names when a non-kbd asChild host falls back', () => {
    const { getByLabelText } = render(
      <Kbd asChild>
        <span aria-label="Command">⌘</span>
      </Kbd>,
    );

    expect(getByLabelText('Command').tagName).toBe('KBD');
  });

  it('normalizes invalid runtime sizes to md', () => {
    const { getByText } = render(<Kbd size={'xl' as never}>Enter</Kbd>);

    expect(getByText('Enter').closest('kbd')).toHaveClass('poffy-kbd--size_md');
  });

  it('supports explicit long-text overflow without adding a title', () => {
    const { getByText, rerender } = render(<Kbd overflow="wrap">CommandOrControl</Kbd>);

    expect(getByText('CommandOrControl').closest('kbd')).toHaveClass('poffy-kbd--overflow_wrap');
    expect(getByText('CommandOrControl')).not.toHaveAttribute('title');

    rerender(<Kbd overflow="truncate">CommandOrControl</Kbd>);

    expect(getByText('CommandOrControl').closest('kbd')).toHaveClass(
      'poffy-kbd--overflow_truncate',
    );
    expect(getByText('CommandOrControl')).not.toHaveAttribute('title');
  });

  it('wraps the visible label and adds chord-boundary break opportunities', () => {
    const { container } = render(<Kbd overflow="wrap">Ctrl+Shift+K</Kbd>);

    const label = container.querySelector('[data-kbd-label]');
    expect(label).toHaveTextContent('Ctrl+Shift+K');
    expect(label?.querySelectorAll('wbr')).toHaveLength(2);
  });

  it('preserves a native kbd asChild host while adding label overflow structure', () => {
    const { container } = render(
      <Kbd asChild overflow="wrap">
        <kbd data-testid="custom-kbd" title="Open command menu">
          Ctrl+K
        </kbd>
      </Kbd>,
    );

    const host = container.querySelector('[data-testid="custom-kbd"]');
    expect(host?.tagName).toBe('KBD');
    expect(host).toHaveAttribute('title', 'Open command menu');
    expect(host?.querySelector('[data-kbd-label]')).toHaveTextContent('Ctrl+K');
    expect(host?.querySelectorAll('wbr')).toHaveLength(1);
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Kbd>Enter</Kbd>);

    expect(await axe(container)).toHaveNoViolations();
  });
});

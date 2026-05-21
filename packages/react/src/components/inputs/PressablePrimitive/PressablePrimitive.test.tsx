import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { PressablePrimitive } from './PressablePrimitive';

describe('PressablePrimitive', () => {
  it('renders as a native button by default', () => {
    render(<PressablePrimitive>Press</PressablePrimitive>);
    const button = screen.getByRole('button', { name: 'Press' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PressablePrimitive>Press</PressablePrimitive>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('supports click handling via onPress', () => {
    const onPress = vi.fn();
    render(<PressablePrimitive onPress={onPress}>Press</PressablePrimitive>);
    fireEvent.click(screen.getByRole('button', { name: 'Press' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('blocks interaction when disabled', () => {
    const onClick = vi.fn();
    const onPress = vi.fn();
    render(
      <PressablePrimitive disabled onClick={onClick} onPress={onPress}>
        Press
      </PressablePrimitive>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Press' }));
    expect(onClick).not.toHaveBeenCalled();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('supports asChild and keyboard press fallback', () => {
    const onPress = vi.fn();
    render(
      <PressablePrimitive asChild onPress={onPress}>
        <div role="button" tabIndex={0}>
          Custom
        </div>
      </PressablePrimitive>,
    );

    fireEvent.keyDown(screen.getByRole('button', { name: 'Custom' }), { key: 'Enter' });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores repeated keyboard fallback presses for asChild controls', () => {
    const onPress = vi.fn();
    render(
      <PressablePrimitive asChild onPress={onPress}>
        <div role="button" tabIndex={0}>
          Custom
        </div>
      </PressablePrimitive>,
    );

    const button = screen.getByRole('button', { name: 'Custom' });
    fireEvent.keyDown(button, { key: ' ', repeat: false });
    fireEvent.keyDown(button, { key: ' ', repeat: true });

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not trigger keyboard fallback for native clickable children', () => {
    const onPress = vi.fn();
    render(
      <PressablePrimitive asChild onPress={onPress}>
        <a href="/test">Custom Link</a>
      </PressablePrimitive>,
    );

    fireEvent.keyDown(screen.getByRole('link', { name: 'Custom Link' }), { key: 'Enter' });
    expect(onPress).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('link', { name: 'Custom Link' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

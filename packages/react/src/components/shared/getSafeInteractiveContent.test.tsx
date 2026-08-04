import { createPortal } from 'react-dom';
import { isValidElement, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { getSafeInteractiveContent } from './getSafeInteractiveContent';

const getText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return getText(node.props.children);
  return '';
};

describe('getSafeInteractiveContent', () => {
  it('sanitizes interactive descendants in general iterables', () => {
    const onClick = vi.fn();
    const content = new Set<ReactNode>([
      <button key="button" onClick={onClick}>
        Action
      </button>,
    ]);

    const safeContent = getSafeInteractiveContent(content);

    expect(getText(safeContent)).toBe('Action');
    expect(
      Array.isArray(safeContent) && safeContent.some((node) => isValidElement(node)),
    ).toBe(false);
  });

  it('replays and sanitizes a nested one-shot iterable', () => {
    function* generatedChildren() {
      yield <button key="button">Generated action</button>;
    }
    const content = <span>{generatedChildren()}</span>;

    expect(getText(getSafeInteractiveContent(content))).toBe('Generated action');
    expect(getText(getSafeInteractiveContent(content))).toBe('Generated action');
  });

  it('drops portal and opaque object nodes that cannot be inspected safely', () => {
    const host = document.createElement('div');
    const portal = createPortal(<button type="button">Portaled action</button>, host);

    expect(getSafeInteractiveContent(portal)).toBeNull();
    expect(getSafeInteractiveContent(Promise.resolve('Deferred content') as never)).toBeNull();
  });

  it('reduces native activation handlers when the caller requires passive content', () => {
    const onClick = vi.fn();
    const safeContent = getSafeInteractiveContent(
      <span role="button" tabIndex={0} onClick={onClick} onKeyDown={() => undefined}>
        Passive content
      </span>,
      { disallowActivationHandlers: true },
    );

    expect(getText(safeContent)).toBe('Passive content');
    expect(isValidElement(safeContent)).toBe(false);
  });
});

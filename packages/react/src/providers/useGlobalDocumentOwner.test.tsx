import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createGlobalDocumentOwnerStack } from './globalDocumentOwnership';
import { useGlobalDocumentOwner } from './useGlobalDocumentOwner';

describe('useGlobalDocumentOwner', () => {
  it('creates a new owner when the stack identity changes', () => {
    const firstApply = vi.fn();
    const secondApply = vi.fn();
    const firstStack = createGlobalDocumentOwnerStack<string, null>({
      capture: () => null,
      apply: firstApply,
      restore: vi.fn(),
    });
    const secondStack = createGlobalDocumentOwnerStack<string, null>({
      capture: () => null,
      apply: secondApply,
      restore: vi.fn(),
    });
    const existingOwner = secondStack.createOwner();
    secondStack.register(document, existingOwner, 'existing');

    const { rerender, unmount } = renderHook(
      ({ stack, state }) => useGlobalDocumentOwner(stack, state, true),
      { initialProps: { stack: firstStack, state: 'first' } },
    );

    rerender({ stack: secondStack, state: 'replacement' });

    expect(secondApply).toHaveBeenLastCalledWith(document, 'replacement', null);

    unmount();
    secondStack.unregister(document, existingOwner);
  });
});

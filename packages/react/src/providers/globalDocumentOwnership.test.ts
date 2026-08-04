import { describe, expect, it, vi } from 'vitest';
import { createGlobalDocumentOwnerStack } from './globalDocumentOwnership';

describe('createGlobalDocumentOwnerStack', () => {
  it('restores an undefined initial snapshot after the final owner unregisters', () => {
    const apply = vi.fn();
    const restore = vi.fn();
    const stack = createGlobalDocumentOwnerStack<string, undefined>({
      capture: () => undefined,
      apply,
      restore,
    });
    const owner = stack.createOwner();

    stack.register(document, owner, 'active');
    stack.unregister(document, owner);

    expect(apply).toHaveBeenCalledWith(document, 'active', undefined);
    expect(restore).toHaveBeenCalledOnce();
    expect(restore).toHaveBeenCalledWith(document, undefined);
  });
});

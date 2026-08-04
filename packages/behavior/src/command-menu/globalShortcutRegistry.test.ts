import { afterEach, describe, expect, it, vi } from 'vitest';
import { registerCommandMenuShortcut } from './globalShortcutRegistry';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('registerCommandMenuShortcut', () => {
  it('selects the highest priority owner', () => {
    const target = document.createElement('div');
    const low = vi.fn();
    const high = vi.fn();
    const unregisterLow = registerCommandMenuShortcut(target, {}, () => ({
      enabled: true,
      priority: 1,
      requestOpen: low,
    }));
    const unregisterHigh = registerCommandMenuShortcut(target, {}, () => ({
      enabled: true,
      priority: 2,
      requestOpen: high,
    }));
    const event = new KeyboardEvent('keydown', { cancelable: true, ctrlKey: true, key: 'k' });

    target.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(high).toHaveBeenCalledOnce();
    expect(low).not.toHaveBeenCalled();
    unregisterLow();
    unregisterHigh();
  });

  it('keeps registration order stable when an owner updates', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const target = document.createElement('div');
    const firstToken = {};
    const first = vi.fn();
    const latest = vi.fn();
    const unregisterFirst = registerCommandMenuShortcut(target, firstToken, () => ({
      enabled: true,
      priority: 0,
      requestOpen: first,
    }));
    const unregisterLatest = registerCommandMenuShortcut(target, {}, () => ({
      enabled: true,
      priority: 0,
      requestOpen: latest,
    }));
    const unregisterFirstUpdate = registerCommandMenuShortcut(target, firstToken, () => ({
      enabled: true,
      priority: 0,
      requestOpen: first,
    }));

    target.dispatchEvent(new KeyboardEvent('keydown', { metaKey: true, key: 'k' }));

    expect(latest).toHaveBeenCalledOnce();
    expect(first).not.toHaveBeenCalled();
    expect(warning).toHaveBeenCalledOnce();
    unregisterFirstUpdate();
    unregisterFirst();
    unregisterLatest();
  });

  it('does not let an older cleanup remove a newer same-token registration', () => {
    const target = document.createElement('div');
    const token = {};
    const oldRequest = vi.fn();
    const newRequest = vi.fn();
    const unregisterOld = registerCommandMenuShortcut(target, token, () => ({
      enabled: true,
      priority: 0,
      requestOpen: oldRequest,
    }));
    const unregisterNew = registerCommandMenuShortcut(target, token, () => ({
      enabled: true,
      priority: 0,
      requestOpen: newRequest,
    }));

    unregisterOld();
    target.dispatchEvent(
      new KeyboardEvent('keydown', { cancelable: true, ctrlKey: true, key: 'k' }),
    );

    expect(newRequest).toHaveBeenCalledOnce();
    expect(oldRequest).not.toHaveBeenCalled();
    unregisterNew();
  });

  it('does not consume handled shortcuts or call disabled owners', () => {
    const target = document.createElement('div');
    const requestOpen = vi.fn();
    const unregister = registerCommandMenuShortcut(target, {}, () => ({
      enabled: false,
      priority: 0,
      requestOpen,
    }));
    const disabledEvent = new KeyboardEvent('keydown', {
      cancelable: true,
      ctrlKey: true,
      key: 'k',
    });
    target.dispatchEvent(disabledEvent);
    expect(disabledEvent.defaultPrevented).toBe(false);

    const handledEvent = new KeyboardEvent('keydown', {
      cancelable: true,
      ctrlKey: true,
      key: 'k',
    });
    handledEvent.preventDefault();
    target.dispatchEvent(handledEvent);
    expect(requestOpen).not.toHaveBeenCalled();
    unregister();
  });
});

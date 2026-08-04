import { describe, expect, it, vi } from 'vitest';
import {
  subscribeToFormAssociatedEvent,
  subscribeToFormReset,
} from './subscribeToFormAssociatedEvent';

describe('subscribeToFormAssociatedEvent', () => {
  it('resolves a late or replaced external form when the event fires', () => {
    const anchor = document.createElement('input');
    anchor.setAttribute('form', 'target-form');
    document.body.append(anchor);
    const listener = vi.fn();
    const unsubscribe = subscribeToFormAssociatedEvent(anchor, 'formdata', listener);

    const firstForm = document.createElement('form');
    firstForm.id = 'target-form';
    document.body.append(firstForm);
    firstForm.dispatchEvent(new Event('formdata'));

    firstForm.remove();
    const secondForm = document.createElement('form');
    secondForm.id = 'target-form';
    document.body.append(secondForm);
    firstForm.dispatchEvent(new Event('formdata'));
    secondForm.dispatchEvent(new Event('formdata'));

    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    anchor.remove();
    secondForm.remove();
  });

  it('uses the anchor tree root instead of the global document', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const form = document.createElement('form');
    const anchor = document.createElement('input');
    form.append(anchor);
    shadowRoot.append(form);
    document.body.append(host);
    const listener = vi.fn();
    const unsubscribe = subscribeToFormAssociatedEvent(anchor, 'formdata', listener);

    form.dispatchEvent(new Event('formdata'));

    expect(listener).toHaveBeenCalledOnce();
    unsubscribe();
    host.remove();
  });
});

describe('subscribeToFormReset', () => {
  it('waits for cancellation and invalidates queued callbacks on cleanup', async () => {
    const form = document.createElement('form');
    const anchor = document.createElement('input');
    form.append(anchor);
    document.body.append(form);
    const listener = vi.fn();
    const unsubscribe = subscribeToFormReset(anchor, listener);

    form.addEventListener('reset', (event) => event.preventDefault(), { once: true });
    form.dispatchEvent(new Event('reset', { cancelable: true }));
    await Promise.resolve();
    expect(listener).not.toHaveBeenCalled();

    form.dispatchEvent(new Event('reset', { cancelable: true }));
    unsubscribe();
    await Promise.resolve();
    expect(listener).not.toHaveBeenCalled();
    form.remove();
  });
});

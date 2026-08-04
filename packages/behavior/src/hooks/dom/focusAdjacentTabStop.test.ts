import { afterEach, describe, expect, it } from 'vitest';
import { getDeepActiveElement } from './domTree';
import { focusAdjacentTabStop } from './focusAdjacentTabStop';

const addButton = (label: string, parent: HTMLElement = document.body) => {
  const button = document.createElement('button');
  button.textContent = label;
  parent.append(button);
  return button;
};

describe('focusAdjacentTabStop', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('moves forward and backward in document tab order', () => {
    const before = addButton('Before');
    const origin = addButton('Origin');
    const after = addButton('After');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(document.activeElement).toBe(after);
    expect(focusAdjacentTabStop({ origin, reverse: true })).toBe(true);
    expect(document.activeElement).toBe(before);
  });

  it('orders positive tabindex before ordinary tab stops', () => {
    const first = addButton('First');
    first.tabIndex = 2;
    const origin = addButton('Origin');
    origin.tabIndex = 3;
    addButton('Ordinary');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(document.activeElement?.textContent).toBe('Ordinary');
    expect(focusAdjacentTabStop({ origin, reverse: true })).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('skips disabled and hidden candidates', () => {
    const origin = addButton('Origin');
    const disabled = addButton('Disabled');
    disabled.disabled = true;
    const hiddenParent = document.createElement('div');
    hiddenParent.hidden = true;
    document.body.append(hiddenParent);
    addButton('Hidden', hiddenParent);
    const inertParent = document.createElement('div');
    inertParent.setAttribute('inert', '');
    document.body.append(inertParent);
    addButton('Inert', inertParent);
    const ariaHiddenParent = document.createElement('div');
    ariaHiddenParent.setAttribute('aria-hidden', 'true');
    document.body.append(ariaHiddenParent);
    addButton('Aria hidden', ariaHiddenParent);
    const after = addButton('After');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(document.activeElement).toBe(after);
  });

  it('keeps aria-disabled elements in the native tab sequence', () => {
    const origin = addButton('Origin');
    const ariaDisabled = document.createElement('a');
    ariaDisabled.href = '#destination';
    ariaDisabled.setAttribute('aria-disabled', 'true');
    document.body.append(ariaDisabled);
    addButton('After');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(document.activeElement).toBe(ariaDisabled);
  });

  it('uses DOM position when the origin is temporarily removed from the tab sequence', () => {
    const before = addButton('Before');
    const origin = addButton('Origin');
    origin.tabIndex = -1;
    const after = addButton('After');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(document.activeElement).toBe(after);
    expect(focusAdjacentTabStop({ origin, reverse: true })).toBe(true);
    expect(document.activeElement).toBe(before);
  });

  it('excludes the current portalled surface', () => {
    const origin = addButton('Origin');
    const portal = document.createElement('div');
    document.body.append(portal);
    addButton('Portal item', portal);
    const after = addButton('After');

    expect(focusAdjacentTabStop({ origin, excludeRoot: portal })).toBe(true);
    expect(document.activeElement).toBe(after);
  });

  it('uses the checked radio as the group tab stop', () => {
    const origin = addButton('Origin');
    const first = document.createElement('input');
    first.type = 'radio';
    first.name = 'choice';
    const checked = first.cloneNode() as HTMLInputElement;
    checked.checked = true;
    document.body.append(first, checked);
    addButton('After');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(document.activeElement).toBe(checked);
  });

  it('returns false at a sequence boundary or for an origin outside the sequence', () => {
    const only = addButton('Only');
    expect(focusAdjacentTabStop({ origin: only })).toBe(false);

    const detached = document.createElement('button');
    expect(focusAdjacentTabStop({ origin: detached })).toBe(false);
  });

  it('uses the origin owner document', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument!;
    const origin = frameDocument.createElement('button');
    const after = frameDocument.createElement('button');
    frameDocument.body.append(origin, after);

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(frameDocument.activeElement).toBe(after);
  });

  it('moves within a shadow root and across its host boundary', () => {
    const before = addButton('Before');
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const first = document.createElement('button');
    const origin = document.createElement('button');
    first.textContent = 'First';
    origin.textContent = 'Origin';
    shadowRoot.append(first, origin);
    document.body.append(host);
    const after = addButton('After');

    expect(focusAdjacentTabStop({ origin, reverse: true })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(first);
    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(document.activeElement).toBe(after);
    expect(before.isConnected).toBe(true);
  });

  it('moves from the document into the first tabbable control of a following shadow root', () => {
    const origin = addButton('Origin');
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const shadowButton = document.createElement('button');
    shadowButton.textContent = 'Shadow button';
    shadowRoot.append(shadowButton);
    document.body.append(host);
    addButton('After');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(shadowButton);
  });

  it('does not enter a shadow scope whose host has an explicit negative tabindex', () => {
    const origin = addButton('Origin');
    const host = document.createElement('div');
    host.tabIndex = -1;
    const shadowRoot = host.attachShadow({ mode: 'open' });
    shadowRoot.append(document.createElement('button'));
    document.body.append(host);
    const after = addButton('After');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(after);
  });

  it.each(['', 'invalid'])(
    'enters a shadow scope when the host tabindex value is %j',
    (tabIndex) => {
      const origin = addButton('Origin');
      const host = document.createElement('div');
      host.setAttribute('tabindex', tabIndex);
      const shadowRoot = host.attachShadow({ mode: 'open' });
      const shadowButton = document.createElement('button');
      shadowRoot.append(shadowButton);
      document.body.append(host);
      const focusShadowButton = shadowButton.focus.bind(shadowButton);
      let focusAttempted = false;
      shadowButton.focus = () => {
        focusAttempted = true;
        // JSDOM incorrectly prevents programmatic focus through a host with an
        // invalid tabindex; Chromium keeps this scope in sequential navigation.
        host.removeAttribute('tabindex');
        focusShadowButton();
      };

      const didFocus = focusAdjacentTabStop({ origin });
      expect(focusAttempted).toBe(true);
      expect(didFocus).toBe(true);
      expect(getDeepActiveElement(document)).toBe(shadowButton);
    },
  );

  it('orders positive tabindex within each focus-navigation scope', () => {
    const outer = addButton('Outer');
    outer.tabIndex = 2;
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const shadowButton = document.createElement('button');
    shadowButton.tabIndex = 1;
    shadowRoot.append(shadowButton);
    document.body.append(host);
    addButton('Ordinary');

    expect(focusAdjacentTabStop({ origin: outer })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(shadowButton);
  });

  it('moves into slotted controls in composed-tree order', () => {
    const origin = addButton('Origin');
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    shadowRoot.append(document.createElement('slot'));
    const slottedButton = document.createElement('button');
    slottedButton.textContent = 'Slotted button';
    host.append(slottedButton);
    document.body.append(host);
    addButton('After');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(slottedButton);
  });

  it('does not enter a slot scope with an explicit negative tabindex', () => {
    const origin = addButton('Origin');
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const slot = document.createElement('slot');
    slot.tabIndex = -1;
    shadowRoot.append(slot);
    host.append(document.createElement('button'));
    document.body.append(host);
    const after = addButton('After');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(after);
  });

  it('ignores slot fallback controls when assigned content is rendered', () => {
    const origin = addButton('Origin');
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const slot = document.createElement('slot');
    const fallbackButton = document.createElement('button');
    fallbackButton.textContent = 'Fallback button';
    slot.append(fallbackButton);
    shadowRoot.append(slot);
    host.append(document.createElement('span'));
    document.body.append(host);
    const after = addButton('After');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(after);
  });

  it('ignores slot fallback controls when assigned text is rendered', () => {
    const origin = addButton('Origin');
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const slot = document.createElement('slot');
    slot.append(document.createElement('button'));
    shadowRoot.append(slot);
    host.append('assigned text');
    document.body.append(host);
    const after = addButton('After');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(after);
  });

  it('skips slotted controls hidden by their slot', () => {
    const origin = addButton('Origin');
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const slot = document.createElement('slot');
    slot.style.display = 'none';
    shadowRoot.append(slot);
    host.append(document.createElement('button'));
    document.body.append(host);
    const after = addButton('After');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(after);
  });

  it('keeps same-name radios in separate tree scopes', () => {
    const origin = addButton('Origin');
    const outerRadio = document.createElement('input');
    outerRadio.type = 'radio';
    outerRadio.name = 'choice';
    document.body.append(outerRadio);
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const shadowRadio = outerRadio.cloneNode() as HTMLInputElement;
    shadowRadio.checked = true;
    shadowRoot.append(shadowRadio);
    document.body.append(host);

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(outerRadio);
  });

  it('excludes controls in nested shadow trees of an excluded root', () => {
    const origin = addButton('Origin');
    const excludedHost = document.createElement('div');
    const shadowRoot = excludedHost.attachShadow({ mode: 'open' });
    shadowRoot.append(document.createElement('button'));
    document.body.append(excludedHost);
    const after = addButton('After');

    expect(focusAdjacentTabStop({ origin, excludeRoot: excludedHost })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(after);
  });

  it('accepts focus delegated from a shadow host to one of its descendants', () => {
    const origin = addButton('Origin');
    const host = document.createElement('div');
    host.tabIndex = 0;
    const shadowRoot = host.attachShadow({ mode: 'open', delegatesFocus: true });
    const shadowButton = document.createElement('button');
    shadowRoot.append(shadowButton);
    document.body.append(host);
    host.focus = () => shadowButton.focus();

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(shadowButton);
  });

  it('accepts delegated focus across nested shadow roots', () => {
    const origin = addButton('Origin');
    const host = document.createElement('div');
    host.tabIndex = 0;
    const shadowRoot = host.attachShadow({ mode: 'open', delegatesFocus: true });
    const nestedHost = document.createElement('div');
    const nestedShadowRoot = nestedHost.attachShadow({ mode: 'open' });
    const nestedButton = document.createElement('button');
    nestedShadowRoot.append(nestedButton);
    shadowRoot.append(nestedHost);
    document.body.append(host);
    host.focus = () => nestedButton.focus();

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(nestedButton);
  });

  it('skips candidates under an inert shadow host', () => {
    document.body.replaceChildren();
    const host = document.createElement('div');
    host.setAttribute('inert', '');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const origin = document.createElement('button');
    const hiddenCandidate = document.createElement('button');
    shadowRoot.append(origin, hiddenCandidate);
    document.body.append(host);

    expect(focusAdjacentTabStop({ origin })).toBe(false);
  });

  it('skips shadow controls in the body of closed details', () => {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'Summary';
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    shadowRoot.append(document.createElement('button'));
    details.append(summary, host);
    document.body.append(details);
    const after = addButton('After');

    expect(focusAdjacentTabStop({ origin: summary })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(after);
  });

  it('only treats the first summary of closed details as visible', () => {
    const origin = addButton('Origin');
    const details = document.createElement('details');
    const firstSummary = document.createElement('summary');
    firstSummary.textContent = 'First';
    const secondSummary = document.createElement('summary');
    secondSummary.textContent = 'Second';
    details.append(firstSummary, secondSummary);
    document.body.append(details);
    const after = addButton('After');

    expect(focusAdjacentTabStop({ origin })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(firstSummary);
    expect(focusAdjacentTabStop({ origin: firstSummary })).toBe(true);
    expect(getDeepActiveElement(document)).toBe(after);
  });
});

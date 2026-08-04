import { afterEach, describe, expect, it } from 'vitest';
import { getDeepActiveElement, getDOMTreeRoot, getTreeElementById } from './domTree';

describe('DOM tree helpers', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('finds IDs in the node tree scope without crossing shadow boundaries', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const shadowTarget = document.createElement('button');
    const documentTarget = document.createElement('button');
    shadowTarget.id = 'target';
    documentTarget.id = 'target';
    shadowRoot.append(shadowTarget);
    document.body.append(host, documentTarget);

    expect(getTreeElementById(shadowTarget, 'target')).toBe(shadowTarget);
    expect(getTreeElementById(documentTarget, 'target')).toBe(documentTarget);
  });

  it('resolves focus through nested open shadow roots', () => {
    const outerHost = document.createElement('div');
    const outerRoot = outerHost.attachShadow({ mode: 'open' });
    const innerHost = document.createElement('div');
    const innerRoot = innerHost.attachShadow({ mode: 'open' });
    const button = document.createElement('button');
    innerRoot.append(button);
    outerRoot.append(innerHost);
    document.body.append(outerHost);

    button.focus();

    expect(getDeepActiveElement(document)).toBe(button);
    expect(getDeepActiveElement(outerRoot)).toBe(button);
  });

  it('uses an iframe document as its own tree scope', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Expected an iframe document.');
    const button = frameDocument.createElement('button');
    button.id = 'frame-target';
    frameDocument.body.append(button);

    expect(getTreeElementById(button, 'frame-target')).toBe(button);
    frame.remove();
  });

  it('returns a closed ShadowRoot when called from one of its descendants', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'closed' });
    const button = document.createElement('button');
    shadowRoot.append(button);
    document.body.append(host);

    expect(getDOMTreeRoot(button)).toBe(shadowRoot);
  });
});

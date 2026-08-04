import { act, render } from '@testing-library/react';
import { createPortal } from 'react-dom';
import { describe, expect, it, vi } from 'vitest';
import { FilePreview } from './FilePreview';

interface TestRealm extends Window {
  URL: typeof URL;
  requestAnimationFrame: typeof requestAnimationFrame;
  cancelAnimationFrame: typeof cancelAnimationFrame;
}

const createIframeRealm = () => {
  const iframe = document.createElement('iframe');
  document.body.append(iframe);
  const target = iframe.contentDocument!.body;
  const ownerWindow = iframe.contentWindow as TestRealm;
  const callbacks = new Map<number, FrameRequestCallback>();
  let nextFrameId = 0;
  const createObjectURL = vi.fn<(file: File) => string>();
  const revokeObjectURL = vi.fn<(url: string) => void>();
  const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    const id = ++nextFrameId;
    callbacks.set(id, callback);
    return id;
  });
  const cancelAnimationFrame = vi.fn((id: number) => callbacks.delete(id));

  Object.defineProperties(ownerWindow, {
    URL: {
      configurable: true,
      value: { createObjectURL, revokeObjectURL },
    },
    requestAnimationFrame: { configurable: true, value: requestAnimationFrame },
    cancelAnimationFrame: { configurable: true, value: cancelAnimationFrame },
  });

  return {
    callbacks,
    cancelAnimationFrame,
    createObjectURL,
    destroy: () => iframe.remove(),
    ownerWindow,
    requestAnimationFrame,
    revokeObjectURL,
    target,
  };
};

const PortalPreview = ({ file, target }: { file: File; target: Element }) =>
  createPortal(<FilePreview file={file} className="preview" />, target);

describe('FilePreview', () => {
  it('uses the iframe portal realm for URL creation, scheduling, and cleanup', () => {
    const realm = createIframeRealm();
    const file = new File(['image'], 'photo.png', { type: 'image/png' });
    realm.createObjectURL.mockReturnValue('blob:iframe-preview');

    const { unmount } = render(<PortalPreview file={file} target={realm.target} />);

    const anchor = realm.target.querySelector('span');
    expect(anchor).toHaveAttribute('hidden');
    expect(anchor).toHaveAttribute('aria-hidden', 'true');
    expect(realm.createObjectURL).toHaveBeenCalledWith(file);
    expect(realm.requestAnimationFrame).toHaveBeenCalledOnce();

    act(() => realm.callbacks.get(1)?.(0));
    expect(realm.target.querySelector('img')).toHaveAttribute('src', 'blob:iframe-preview');

    unmount();
    expect(realm.cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(realm.revokeObjectURL).toHaveBeenCalledWith('blob:iframe-preview');
    realm.destroy();
  });

  it('prevents stale file callbacks from replacing a newer preview', () => {
    const realm = createIframeRealm();
    const firstFile = new File(['first'], 'first.png', { type: 'image/png' });
    const secondFile = new File(['second'], 'second.png', { type: 'image/png' });
    realm.createObjectURL
      .mockReturnValueOnce('blob:first-preview')
      .mockReturnValueOnce('blob:second-preview');

    const { rerender, unmount } = render(<PortalPreview file={firstFile} target={realm.target} />);
    const staleCallback = realm.callbacks.get(1)!;
    rerender(<PortalPreview file={secondFile} target={realm.target} />);

    act(() => staleCallback(0));
    expect(realm.target.querySelector('img')).toBeNull();

    act(() => realm.callbacks.get(2)?.(0));
    expect(realm.target.querySelector('img')).toHaveAttribute('src', 'blob:second-preview');
    expect(realm.revokeObjectURL).toHaveBeenCalledWith('blob:first-preview');
    unmount();
    realm.destroy();
  });

  it('does not reuse an object URL after its portal moves to another realm', () => {
    const firstRealm = createIframeRealm();
    const secondRealm = createIframeRealm();
    const file = new File(['image'], 'photo.png', { type: 'image/png' });
    firstRealm.createObjectURL.mockReturnValue('blob:first-realm');
    secondRealm.createObjectURL.mockReturnValue('blob:second-realm');

    const { rerender, unmount } = render(<PortalPreview file={file} target={firstRealm.target} />);
    const staleCallback = firstRealm.callbacks.get(1)!;
    rerender(<PortalPreview file={file} target={secondRealm.target} />);

    expect(firstRealm.revokeObjectURL).toHaveBeenCalledWith('blob:first-realm');
    act(() => staleCallback(0));
    expect(secondRealm.target.querySelector('img')).toBeNull();

    act(() => secondRealm.callbacks.get(1)?.(0));
    expect(secondRealm.target.querySelector('img')).toHaveAttribute('src', 'blob:second-realm');

    unmount();
    expect(secondRealm.revokeObjectURL).toHaveBeenCalledWith('blob:second-realm');
    firstRealm.destroy();
    secondRealm.destroy();
  });

  it('stays on the hidden anchor when realm APIs are unavailable', () => {
    const realm = createIframeRealm();
    Object.defineProperty(realm.ownerWindow, 'URL', {
      configurable: true,
      value: {},
    });

    let view: ReturnType<typeof render> | undefined;
    expect(() => {
      view = render(
        <PortalPreview
          file={new File(['image'], 'photo.png', { type: 'image/png' })}
          target={realm.target}
        />,
      );
    }).not.toThrow();
    expect(realm.target.querySelector('span')).toHaveAttribute('hidden');
    expect(realm.target.querySelector('img')).toBeNull();
    view?.unmount();
    realm.destroy();
  });

  it.each(['requestAnimationFrame', 'cancelAnimationFrame'] as const)(
    'stays on the hidden anchor when %s is unavailable',
    (missingApi) => {
      const realm = createIframeRealm();
      Object.defineProperty(realm.ownerWindow, missingApi, {
        configurable: true,
        value: undefined,
      });
      const { unmount } = render(
        <PortalPreview
          file={new File(['image'], 'photo.png', { type: 'image/png' })}
          target={realm.target}
        />,
      );

      expect(realm.target.querySelector('span')).toHaveAttribute('hidden');
      expect(realm.createObjectURL).not.toHaveBeenCalled();
      unmount();
      realm.destroy();
    },
  );

  it('revokes a created URL if scheduling throws', () => {
    const realm = createIframeRealm();
    realm.createObjectURL.mockReturnValue('blob:unscheduled-preview');
    realm.requestAnimationFrame.mockImplementation(() => {
      throw new Error('detached realm');
    });
    const { unmount } = render(
      <PortalPreview
        file={new File(['image'], 'photo.png', { type: 'image/png' })}
        target={realm.target}
      />,
    );

    expect(realm.target.querySelector('span')).toHaveAttribute('hidden');
    expect(realm.revokeObjectURL).toHaveBeenCalledWith('blob:unscheduled-preview');
    unmount();
    realm.destroy();
  });
});

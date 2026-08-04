import { act, render, screen } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { DropdownCollectionItem } from '@poffy-ui/behavior/dropdown';
import { DropdownCollectionProvider, useDropdownCollectionItem } from './DropdownCollection';

interface TestItem {
  disabled?: boolean;
  id: string;
  label: string;
  textValue?: string;
}

const CollectionItem = ({ disabled = false, id, label, textValue }: TestItem) => {
  const [node, setNode] = useState<HTMLButtonElement | null>(null);
  const index = useDropdownCollectionItem({
    id,
    node,
    disabled,
    textValue,
  });

  return (
    <button ref={setNode} type="button" aria-disabled={disabled} data-index={index}>
      {label}
    </button>
  );
};

const Collection = ({
  items,
  reconcileItems,
}: {
  items: TestItem[];
  reconcileItems: (items: DropdownCollectionItem[]) => void;
}) => (
  <DropdownCollectionProvider reconcileItems={reconcileItems}>
    {items.map((item) => (
      <CollectionItem key={item.id} {...item} />
    ))}
  </DropdownCollectionProvider>
);

const flushTrailingReconciliation = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

const latestSnapshot = (reconcileItems: ReturnType<typeof vi.fn>) => {
  const calls = reconcileItems.mock.calls as [DropdownCollectionItem[]][];
  const items = calls.at(-1)?.[0] ?? [];
  return items.map(({ disabled, label }) => ({ disabled, label }));
};

describe('DropdownCollectionProvider', () => {
  it('reconciles indexes in current DOM order after keyed items reorder', async () => {
    const reconcileItems = vi.fn();
    const { rerender } = render(
      <Collection
        items={[
          { id: 'first', label: 'First' },
          { id: 'second', label: 'Second' },
        ]}
        reconcileItems={reconcileItems}
      />,
    );
    await flushTrailingReconciliation();

    rerender(
      <Collection
        items={[
          { id: 'second', label: 'Second' },
          { id: 'first', label: 'First' },
        ]}
        reconcileItems={reconcileItems}
      />,
    );
    await flushTrailingReconciliation();

    expect(latestSnapshot(reconcileItems)).toEqual([
      { disabled: false, label: 'Second' },
      { disabled: false, label: 'First' },
    ]);
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('data-index', '0');
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('data-index', '1');
  });

  it('publishes final metadata when items update and disappear in the same task', async () => {
    const reconcileItems = vi.fn();
    const { rerender } = render(
      <Collection
        items={[
          { id: 'first', label: 'First' },
          { id: 'second', label: 'Second' },
        ]}
        reconcileItems={reconcileItems}
      />,
    );
    await flushTrailingReconciliation();
    reconcileItems.mockClear();

    rerender(
      <Collection
        items={[
          { disabled: true, id: 'first', label: 'Renamed', textValue: 'Latest typeahead' },
          { id: 'third', label: 'Third', textValue: 'Latest typeahead' },
        ]}
        reconcileItems={reconcileItems}
      />,
    );
    await flushTrailingReconciliation();

    expect(latestSnapshot(reconcileItems)).toEqual([
      { disabled: true, label: null },
      { disabled: false, label: 'Latest typeahead' },
    ]);
    expect(reconcileItems).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: 'Second' })).not.toBeInTheDocument();
  });

  it('does not reconcile an unchanged parent rerender', async () => {
    const reconcileItems = vi.fn();
    const items = [
      { id: 'first', label: 'First' },
      { id: 'second', label: 'Second' },
    ];
    const { rerender } = render(<Collection items={items} reconcileItems={reconcileItems} />);
    await flushTrailingReconciliation();
    reconcileItems.mockClear();

    rerender(<Collection items={[...items]} reconcileItems={reconcileItems} />);
    await flushTrailingReconciliation();

    expect(reconcileItems).not.toHaveBeenCalled();
  });

  it('coalesces direct text and DOM-order mutations into one final snapshot', async () => {
    const reconcileItems = vi.fn();
    const { container } = render(
      <Collection
        items={[
          { id: 'first', label: 'First' },
          { id: 'second', label: 'Second' },
        ]}
        reconcileItems={reconcileItems}
      />,
    );
    await flushTrailingReconciliation();
    reconcileItems.mockClear();

    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });
    act(() => {
      first.firstChild!.textContent = 'Renamed';
      container.insertBefore(second, first);
    });
    await flushTrailingReconciliation();

    expect(reconcileItems).toHaveBeenCalledOnce();
    expect(latestSnapshot(reconcileItems)).toEqual([
      { disabled: false, label: 'Second' },
      { disabled: false, label: 'Renamed' },
    ]);
    expect(second).toHaveAttribute('data-index', '0');
    expect(first).toHaveAttribute('data-index', '1');
  });

  it('keeps a newer same-id registration when the older item cleans up', async () => {
    const reconcileItems = vi.fn();
    const { rerender } = render(
      <DropdownCollectionProvider reconcileItems={reconcileItems}>
        <CollectionItem key="old" id="shared" label="Old" />
        <CollectionItem key="new" id="shared" label="New" />
      </DropdownCollectionProvider>,
    );
    await flushTrailingReconciliation();
    expect(latestSnapshot(reconcileItems)).toEqual([{ disabled: false, label: 'New' }]);

    rerender(
      <DropdownCollectionProvider reconcileItems={reconcileItems}>
        <CollectionItem key="new" id="shared" label="New" />
      </DropdownCollectionProvider>,
    );
    await flushTrailingReconciliation();

    expect(latestSnapshot(reconcileItems)).toEqual([{ disabled: false, label: 'New' }]);
  });

  it('cancels a queued trailing reconciliation when unmounted', async () => {
    const reconcileItems = vi.fn();
    const { unmount } = render(
      <Collection items={[{ id: 'first', label: 'First' }]} reconcileItems={reconcileItems} />,
    );
    const callsBeforeUnmount = reconcileItems.mock.calls.length;

    unmount();
    await flushTrailingReconciliation();

    expect(reconcileItems).toHaveBeenCalledTimes(callsBeforeUnmount);
  });

  it('creates one provider observer in the item owner window', async () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ownerWindow = iframe.contentWindow;
    const ownerDocument = iframe.contentDocument;
    if (!ownerWindow || !ownerDocument) throw new Error('Expected an iframe document');

    const construct = vi.fn();
    const observe = vi.fn();
    class MutationObserverMock {
      constructor(_: MutationCallback) {
        void _;
        construct();
      }
      disconnect = vi.fn();
      observe = observe;
      takeRecords = () => [];
    }
    Object.defineProperty(ownerWindow, 'MutationObserver', {
      configurable: true,
      value: MutationObserverMock,
    });
    const reconcileItems = vi.fn();
    const { unmount } = render(
      <Collection
        items={[
          { id: 'first', label: 'First' },
          { id: 'second', label: 'Second' },
        ]}
        reconcileItems={reconcileItems}
      />,
      { container: ownerDocument.body },
    );
    await flushTrailingReconciliation();

    expect(construct).toHaveBeenCalledOnce();
    expect(observe).toHaveBeenCalledOnce();
    expect(observe).toHaveBeenCalledWith(expect.objectContaining({ textContent: 'FirstSecond' }), {
      characterData: true,
      childList: true,
      subtree: true,
    });

    unmount();
    iframe.remove();
  });

  it('observes text mutations inside a shadow root', async () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const mountPoint = document.createElement('div');
    shadowRoot.append(mountPoint);
    document.body.append(host);
    const reconcileItems = vi.fn();

    const { unmount } = render(
      <Collection items={[{ id: 'first', label: 'First' }]} reconcileItems={reconcileItems} />,
      { baseElement: mountPoint, container: mountPoint },
    );
    await flushTrailingReconciliation();
    reconcileItems.mockClear();

    const item = mountPoint.querySelector('button')!;
    act(() => {
      item.firstChild!.textContent = 'Shadow label';
    });
    await flushTrailingReconciliation();

    expect(reconcileItems).toHaveBeenCalledOnce();
    expect(latestSnapshot(reconcileItems)).toEqual([{ disabled: false, label: 'Shadow label' }]);

    unmount();
    host.remove();
  });

  it('ignores stale StrictMode microtasks and keeps the remounted collection current', async () => {
    const reconcileItems = vi.fn();
    const { unmount } = render(
      <StrictMode>
        <Collection
          items={[
            { id: 'first', label: 'First' },
            { id: 'second', label: 'Second' },
          ]}
          reconcileItems={reconcileItems}
        />
      </StrictMode>,
    );
    await flushTrailingReconciliation();

    expect(latestSnapshot(reconcileItems)).toEqual([
      { disabled: false, label: 'First' },
      { disabled: false, label: 'Second' },
    ]);
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('data-index', '0');
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('data-index', '1');

    const callsBeforeUnmount = reconcileItems.mock.calls.length;
    unmount();
    await flushTrailingReconciliation();
    expect(reconcileItems).toHaveBeenCalledTimes(callsBeforeUnmount);
  });
});

import { act, cleanup, render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { memo, StrictMode, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { FolderIcon } from '@/components/media/Icon/icons';
import { TreeView, type TreeViewData } from './index';
import { useTreeViewContext } from './TreeViewContext';

const mockData = [
  {
    id: '1',
    name: 'Folder',
    children: [{ id: '1-1', name: 'File' }],
  },
  { id: '2', name: 'File 2' },
];

const getTreeCheckbox = (label: string) =>
  document.querySelector<HTMLInputElement>(`input[aria-label="${label}"]`);
const noopIdsChange = (_ids: string[]) => undefined;

/**
 * ### Test Strategy: TreeView
 * - **Focus**: Correct rendering of auto and manual trees, expand/collapse logic, keyboard navigation, and a11y via axe.
 * - **DON'T**: Do not test visual aesthetics here; defer to Storybook VRT.
 */
describe('TreeView', () => {
  it('inspects and renders the same nested one-shot iterable in StrictMode', () => {
    function* duplicateItems() {
      yield (
        <TreeView.Item key="first" id="duplicate">
          <TreeView.Trigger>Generated first</TreeView.Trigger>
        </TreeView.Item>
      );
      yield (
        <TreeView.Item key="second" id="duplicate">
          <TreeView.Trigger>Generated second</TreeView.Trigger>
        </TreeView.Item>
      );
    }
    function* nestedItems() {
      yield duplicateItems();
    }

    render(
      <StrictMode>
        <TreeView.Root>{nestedItems()}</TreeView.Root>
      </StrictMode>,
    );

    expect(screen.getByRole('treeitem', { name: 'Generated first' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('treeitem', { name: 'Generated second' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('fails closed for every instance of duplicate manual item ids', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <TreeView.Root defaultExpandedIds={['duplicate']} defaultSelectedIds={['duplicate']}>
        <TreeView.Item id="duplicate" hasChildren>
          <TreeView.Checkbox aria-label="Select first" />
          <TreeView.Trigger>First</TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="first-child" hasChildren={false}>
              First child
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
        <TreeView.Item id="duplicate" hasChildren>
          <TreeView.Checkbox aria-label="Select second" />
          <TreeView.Trigger>Second</TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="second-child" hasChildren={false}>
              Second child
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const duplicateItems = screen
      .getAllByRole('treeitem')
      .filter((item) => item.dataset.treeviewItemId === 'duplicate');
    expect(duplicateItems).toHaveLength(2);
    expect(duplicateItems.every((item) => item.getAttribute('aria-disabled') === 'true')).toBe(
      true,
    );
    expect(duplicateItems.every((item) => item.getAttribute('aria-expanded') === 'false')).toBe(
      true,
    );
    expect(duplicateItems.every((item) => item.getAttribute('aria-checked') === 'false')).toBe(
      true,
    );
    expect(duplicateItems.every((item) => item.tabIndex === -1)).toBe(true);
    expect(screen.getByRole('button', { name: 'First' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Second' })).toBeDisabled();
    expect(getTreeCheckbox('Select first')).toBeDisabled();
    expect(getTreeCheckbox('Select second')).toBeDisabled();
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('Duplicate id "duplicate"'));
    warning.mockRestore();
  });

  it('fails closed for known direct and nested duplicate items in server markup', () => {
    const markup = renderToStaticMarkup(
      <TreeView.Root
        defaultExpandedIds={['parent', 'duplicate']}
        defaultSelectedIds={['duplicate']}
      >
        <TreeView.Item id="duplicate" hasChildren>
          <TreeView.Trigger>Direct duplicate</TreeView.Trigger>
        </TreeView.Item>
        <TreeView.Item id="parent" hasChildren>
          <TreeView.Trigger>Parent</TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="duplicate" hasChildren>
              <TreeView.Trigger>Nested duplicate</TreeView.Trigger>
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const duplicateItems = markup.match(/<li(?=[^>]*data-treeview-item-id="duplicate")[^>]*>/g);
    expect(duplicateItems).toHaveLength(2);
    for (const item of duplicateItems ?? []) {
      expect(item).toContain('aria-disabled="true"');
      expect(item).toContain('aria-expanded="false"');
      expect(item).toContain('tabindex="-1"');
    }
  });

  it('restores focus to unique items when a focused item becomes ambiguous', async () => {
    const DynamicDuplicateTree = () => {
      const [showDuplicate, setShowDuplicate] = useState(false);
      return (
        <>
          <button onClick={() => setShowDuplicate(true)}>Add duplicate</button>
          <TreeView.Root>
            <TreeView.Item id="target">
              <TreeView.Trigger>Target</TreeView.Trigger>
            </TreeView.Item>
            {showDuplicate ? (
              <TreeView.Item id="target">
                <TreeView.Trigger>Duplicate target</TreeView.Trigger>
              </TreeView.Item>
            ) : null}
            <TreeView.Item id="next">
              <TreeView.Trigger>Next</TreeView.Trigger>
            </TreeView.Item>
            <TreeView.Item id="last">
              <TreeView.Trigger>Last</TreeView.Trigger>
            </TreeView.Item>
          </TreeView.Root>
        </>
      );
    };

    render(<DynamicDuplicateTree />);
    const target = screen.getByRole('treeitem', { name: 'Target' });
    target.focus();
    expect(target).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Add duplicate' }));
    const next = screen.getByRole('treeitem', { name: 'Next' });
    const last = screen.getByRole('treeitem', { name: 'Last' });
    await waitFor(() => expect(next).toHaveFocus());

    fireEvent.keyDown(next, { key: 'ArrowDown' });
    expect(last).toHaveFocus();
    fireEvent.keyDown(last, { key: 'Home' });
    expect(next).toHaveFocus();
    fireEvent.keyDown(next, { key: 'End' });
    expect(last).toHaveFocus();
  });

  it('restores focus when a focused duplicate instance is removed', async () => {
    const RemovableDuplicateTree = () => {
      const [showFirst, setShowFirst] = useState(true);
      return (
        <>
          <button onClick={() => setShowFirst(false)}>Remove focused duplicate</button>
          <TreeView.Root>
            {showFirst ? (
              <TreeView.Item id="duplicate">
                <TreeView.Trigger>First duplicate</TreeView.Trigger>
              </TreeView.Item>
            ) : null}
            <TreeView.Item id="duplicate">
              <TreeView.Trigger>Remaining duplicate</TreeView.Trigger>
            </TreeView.Item>
            <TreeView.Item id="next">
              <TreeView.Trigger>Next</TreeView.Trigger>
            </TreeView.Item>
          </TreeView.Root>
        </>
      );
    };

    render(<RemovableDuplicateTree />);
    const focusedDuplicate = screen.getByRole('treeitem', { name: 'First duplicate' });
    focusedDuplicate.focus();
    expect(focusedDuplicate).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Remove focused duplicate' }));
    await waitFor(() => expect(screen.getByRole('treeitem', { name: 'Next' })).toHaveFocus());
  });

  it('restores focus to the tree root when duplicate items leave no unique item', async () => {
    const RootFallbackTree = () => {
      const [showDuplicate, setShowDuplicate] = useState(false);
      return (
        <>
          <button onClick={() => setShowDuplicate(true)}>Add only duplicate</button>
          <TreeView.Root>
            <TreeView.Item id="only">
              <TreeView.Trigger>Only item</TreeView.Trigger>
            </TreeView.Item>
            {showDuplicate ? (
              <TreeView.Item id="only">
                <TreeView.Trigger>Only duplicate</TreeView.Trigger>
              </TreeView.Item>
            ) : null}
          </TreeView.Root>
        </>
      );
    };

    render(<RootFallbackTree />);
    const item = screen.getByRole('treeitem', { name: 'Only item' });
    const tree = screen.getByRole('tree');
    item.focus();

    fireEvent.click(screen.getByRole('button', { name: 'Add only duplicate' }));
    await waitFor(() => expect(tree).toHaveFocus());
  });

  it('restores the remaining item when a duplicate id becomes unique', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const onExpandedChange = vi.fn();
    const onSelectedChange = vi.fn();
    const DynamicDuplicateTree = () => {
      const [showDuplicate, setShowDuplicate] = useState(false);
      return (
        <>
          <button onClick={() => setShowDuplicate((current) => !current)}>Toggle duplicate</button>
          <TreeView.Root onExpandedChange={onExpandedChange} onSelectedChange={onSelectedChange}>
            <TreeView.Item id="duplicate" hasChildren>
              <TreeView.Checkbox aria-label="Select survivor" />
              <TreeView.Trigger>Survivor</TreeView.Trigger>
              <TreeView.Content>
                <TreeView.Item id="child" hasChildren={false}>
                  Child
                </TreeView.Item>
              </TreeView.Content>
            </TreeView.Item>
            {showDuplicate && (
              <TreeView.Item id="duplicate" hasChildren={false}>
                Duplicate
              </TreeView.Item>
            )}
          </TreeView.Root>
        </>
      );
    };

    render(<DynamicDuplicateTree />);
    const survivor = screen.getByRole('treeitem', { name: /Survivor/i });
    expect(survivor).not.toHaveAttribute('aria-disabled');
    expect(survivor).toHaveAttribute('tabindex', '0');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle duplicate' }));

    await waitFor(() => expect(survivor).toHaveAttribute('aria-disabled', 'true'));
    expect(survivor).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('button', { name: 'Survivor' })).toBeDisabled();
    expect(getTreeCheckbox('Select survivor')).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Toggle duplicate' }));

    await waitFor(() => expect(survivor).not.toHaveAttribute('aria-disabled'));
    expect(survivor).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'Survivor' })).not.toBeDisabled();
    expect(getTreeCheckbox('Select survivor')).not.toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Survivor' }));
    fireEvent.click(getTreeCheckbox('Select survivor')!);

    expect(onExpandedChange).toHaveBeenCalledWith(['duplicate']);
    expect(onSelectedChange).toHaveBeenCalledWith(['duplicate']);
    warning.mockRestore();
  });

  it('moves the roving tab stop to a visible item when the active item is removed', async () => {
    const renderTree = (showLastItem: boolean) => (
      <TreeView.Root>
        <TreeView.Item id="parent" hasChildren>
          <TreeView.Trigger>Parent</TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="hidden-child" hasChildren={false}>
              <TreeView.Trigger>Hidden child</TreeView.Trigger>
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
        {showLastItem ? (
          <TreeView.Item id="last-item" hasChildren={false}>
            <TreeView.Trigger>Last item</TreeView.Trigger>
          </TreeView.Item>
        ) : null}
      </TreeView.Root>
    );
    const { rerender } = render(renderTree(true));
    const parent = screen.getByRole('treeitem', { name: 'Parent' });
    const lastItem = screen.getByRole('treeitem', { name: 'Last item' });
    const hiddenChild = screen.getByText('Hidden child').closest<HTMLElement>('[role="treeitem"]');
    if (!hiddenChild) throw new Error('Expected the hidden child tree item');

    act(() => lastItem.focus());
    rerender(renderTree(false));

    await waitFor(() => expect(document.activeElement).toBe(parent));
    expect(parent.tabIndex).toBe(0);
    expect(hiddenChild.tabIndex).toBe(-1);
  });

  it('treats omitted hasChildren as a leaf', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="leaf">
          <TreeView.Trigger>Leaf</TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    expect(screen.getByRole('treeitem')).not.toHaveAttribute('aria-expanded');
    expect(screen.getByRole('button', { name: 'Leaf' })).not.toHaveAttribute('aria-expanded');
  });
  it('renders correctly', () => {
    render(<TreeView data={mockData} />);
    expect(screen.getByText('Folder')).toBeInTheDocument();
    expect(screen.getByText('File 2')).toBeInTheDocument();
  });

  it('omits cyclic branches from auto-generated data', () => {
    const node: TreeViewData = { id: 'cycle', name: 'Cycle' };
    node.children = [node];

    render(<TreeView data={[node]} />);

    expect(screen.getByRole('button', { name: 'Cycle' })).not.toHaveAttribute('aria-expanded');
  });

  it('omits every ambiguous auto node and warns in development', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <TreeView
        data={[
          { id: 'duplicate', name: 'First duplicate' },
          { id: 'unique', name: 'Unique node' },
          { id: 'duplicate', name: 'Second duplicate' },
        ]}
      />,
    );

    expect(screen.queryByText('First duplicate')).not.toBeInTheDocument();
    expect(screen.queryByText('Second duplicate')).not.toBeInTheDocument();
    expect(screen.getByRole('treeitem', { name: 'Unique node' })).toBeInTheDocument();
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('duplicate'));
    warning.mockRestore();
  });

  it('bounds auto-generated tree depth before recursive rendering', () => {
    const root: TreeViewData = { id: '0', name: 'Root' };
    let current = root;
    for (let index = 1; index <= 1_000; index += 1) {
      const child: TreeViewData = { id: String(index), name: `Node ${index}` };
      current.children = [child];
      current = child;
    }

    render(<TreeView data={[root]} />);

    expect(screen.getByRole('button', { name: 'Root' })).toBeInTheDocument();
    expect(screen.queryByText('Node 1000')).not.toBeInTheDocument();
  });

  it('allows callers to raise the auto-generated tree depth limit', () => {
    const root: TreeViewData = {
      id: '0',
      name: 'Root',
      children: [
        {
          id: '1',
          name: 'Node 1',
          children: [{ id: '2', name: 'Node 2' }],
        },
      ],
    };

    render(<TreeView data={[root]} maxAutoTreeDepth={3} />);

    expect(screen.getByRole('button', { name: 'Node 2', hidden: true })).toBeInTheDocument();
  });

  it('renders APG tree roles for root and items', () => {
    render(<TreeView data={mockData} defaultExpandedIds={['1']} />);

    expect(screen.getByRole('tree', { name: 'Tree view' })).toBeInTheDocument();
    expect(screen.getAllByRole('treeitem')).toHaveLength(3);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('uses a supplied tree label instead of the default accessible name', () => {
    render(
      <TreeView.Root aria-label="Project files">
        <TreeView.Item id="file" hasChildren={false}>
          File
        </TreeView.Item>
      </TreeView.Root>,
    );

    expect(screen.getByRole('tree', { name: 'Project files' })).toBeInTheDocument();
  });

  it('preserves an asChild root name and direction when the wrapper leaves them unspecified', () => {
    const { rerender } = render(
      <TreeView.Root asChild>
        <ul aria-label="Child tree" dir="rtl">
          <TreeView.Item id="file" hasChildren={false}>
            File
          </TreeView.Item>
        </ul>
      </TreeView.Root>,
    );

    const tree = screen.getByRole('tree', { name: 'Child tree' });
    expect(tree).toHaveAttribute('aria-label', 'Child tree');
    expect(tree).toHaveAttribute('dir', 'rtl');

    rerender(
      <TreeView.Root asChild>
        <ul aria-label="Fallback child tree" aria-labelledby="child-tree-name" dir="rtl">
          <TreeView.Item id="file" hasChildren={false}>
            <span id="child-tree-name">Child labelled tree</span>
          </TreeView.Item>
        </ul>
      </TreeView.Root>,
    );

    const labelledTree = screen.getByRole('tree', { name: 'Child labelled tree' });
    expect(labelledTree).toHaveAttribute('aria-labelledby', 'child-tree-name');
    expect(labelledTree).not.toHaveAttribute('aria-label');
    expect(labelledTree).toHaveAttribute('dir', 'rtl');
  });

  it('preserves owned tree roles when consumer props conflict', () => {
    render(
      <TreeView.Root role="list">
        <TreeView.Item id="folder" hasChildren>
          <TreeView.Trigger>Folder</TreeView.Trigger>
          <TreeView.Content role="list">
            <TreeView.Item id="file" hasChildren={false}>
              File
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.getByRole('group', { hidden: true })).toBeInTheDocument();
  });

  it('preserves tree-item semantics when consumer props conflict', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="file" hasChildren={false} role="listitem">
          File
        </TreeView.Item>
      </TreeView.Root>,
    );

    expect(screen.getByRole('treeitem')).toHaveAttribute('aria-selected', 'false');
  });

  it('preserves managed tree semantics on compatible asChild hosts', () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <TreeView.Root asChild>
          <ul role="list" aria-multiselectable={false}>
            <TreeView.Item asChild id="folder" hasChildren>
              <li
                role="listitem"
                aria-expanded={false}
                aria-selected
                aria-checked={false}
                aria-disabled
                tabIndex={7}
              >
                <TreeView.Checkbox aria-label="Select folder" />
                <TreeView.Trigger asChild>
                  <button type="submit" aria-expanded tabIndex={0}>
                    Folder
                  </button>
                </TreeView.Trigger>
                <TreeView.Content>
                  <TreeView.Item id="file" hasChildren={false}>
                    File
                  </TreeView.Item>
                </TreeView.Content>
              </li>
            </TreeView.Item>
          </ul>
        </TreeView.Root>
      </form>,
    );

    const tree = screen.getByRole('tree');
    const item = screen.getByRole('treeitem', { name: /Folder/i });
    const trigger = screen.getByRole('button', { name: /Folder/i });

    expect(tree).toHaveAttribute('aria-multiselectable', 'true');
    expect(item).toHaveAttribute('aria-expanded', 'false');
    expect(item).not.toHaveAttribute('aria-selected');
    expect(item).toHaveAttribute('aria-checked', 'false');
    expect(item).not.toHaveAttribute('aria-disabled');
    expect(item).toHaveAttribute('tabindex', '0');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('tabindex', '-1');
    expect(trigger).toHaveAttribute('type', 'button');

    fireEvent.click(trigger);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(item).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('can expand and collapse items', () => {
    render(<TreeView data={mockData} />);

    const trigger = screen.getByRole('button', { name: /Folder/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('File')).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('handles keyboard navigation (Enter/Space to toggle)', () => {
    render(<TreeView data={mockData} />);
    const trigger = screen.getByRole('button', { name: /Folder/i });

    act(() => trigger.focus());
    fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(trigger, { key: ' ', code: 'Space' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands with ArrowRight and collapses with ArrowLeft', () => {
    render(<TreeView data={mockData} />);
    const trigger = screen.getByRole('button', { name: /Folder/i });

    fireEvent.keyDown(trigger, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('File')).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: 'ArrowLeft', code: 'ArrowLeft' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses the rendered RTL direction for forward and backward arrows', () => {
    render(<TreeView data={mockData} dir="rtl" />);
    const trigger = screen.getByRole('button', { name: /Folder/i });

    fireEvent.keyDown(trigger, { key: 'ArrowLeft' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(trigger, { key: 'ArrowRight' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses the rendered tree owner window to resolve RTL direction', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ownerWindow = iframe.contentWindow;
    const ownerDocument = iframe.contentDocument;
    if (!ownerWindow || !ownerDocument) throw new Error('Expected an iframe document');

    const getComputedStyle = ownerWindow.getComputedStyle.bind(ownerWindow);
    vi.spyOn(ownerWindow, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
      const style = getComputedStyle(element, pseudoElement);
      Object.defineProperty(style, 'direction', { configurable: true, value: 'rtl' });
      return style;
    });

    try {
      const { unmount } = render(<TreeView data={mockData} />, { container: ownerDocument.body });
      const trigger = ownerDocument.querySelector<HTMLButtonElement>('button');
      if (!trigger) throw new Error('Expected a tree trigger');

      fireEvent.keyDown(trigger, { key: 'ArrowLeft' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      unmount();
    } finally {
      cleanup();
      vi.restoreAllMocks();
      iframe.remove();
    }
  });

  it('moves to a child with ArrowRight and returns to its parent with ArrowLeft', () => {
    render(
      <TreeView.Root defaultExpandedIds={['parent']}>
        <TreeView.Item id="parent" hasChildren>
          <TreeView.Trigger>Parent</TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="child" hasChildren={false}>
              <TreeView.Trigger>Child</TreeView.Trigger>
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const parent = screen.getByText('Parent').closest<HTMLElement>('[role="treeitem"]');
    const child = screen.getByRole('treeitem', { name: 'Child' });
    expect(parent).not.toBeNull();
    act(() => parent?.focus());
    fireEvent.keyDown(parent as HTMLElement, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(child);

    fireEvent.keyDown(child, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(parent);
  });

  it('retains controlled expansion and selection when becoming uncontrolled', () => {
    const renderTree = (expandedIds?: string[], selectedIds?: string[]) => {
      const expansionProps =
        expandedIds === undefined
          ? { defaultExpandedIds: [] }
          : { expandedIds, onExpandedChange: noopIdsChange };
      const selectionProps =
        selectedIds === undefined
          ? { defaultSelectedIds: [] }
          : { selectedIds, onSelectedChange: noopIdsChange };
      return (
        <TreeView.Root {...expansionProps} {...selectionProps}>
          <TreeView.Item id="parent" hasChildren>
            <TreeView.Trigger>Parent</TreeView.Trigger>
            <TreeView.Content>
              <TreeView.Item id="child" hasChildren={false}>
                <TreeView.Checkbox aria-label="Select child" />
                <TreeView.Trigger>Child</TreeView.Trigger>
              </TreeView.Item>
            </TreeView.Content>
          </TreeView.Item>
        </TreeView.Root>
      );
    };
    const { rerender } = render(renderTree([], []));

    rerender(renderTree(['parent'], ['child']));
    rerender(renderTree());

    expect(screen.getByRole('button', { name: 'Parent' })).toHaveAttribute('aria-expanded', 'true');
    expect(getTreeCheckbox('Select child')).toBeChecked();
  });

  it('falls back independently when untyped controlled arrays lack callbacks', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <TreeView.Root {...({ expandedIds: ['parent'], selectedIds: ['child'] } as never)}>
        <TreeView.Item id="parent" hasChildren>
          <TreeView.Trigger>Parent</TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="child" hasChildren={false}>
              <TreeView.Checkbox aria-label="Select child" />
              <TreeView.Trigger>Child</TreeView.Trigger>
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    expect(screen.getByRole('button', { name: 'Parent' })).toHaveAttribute('aria-expanded', 'true');
    expect(getTreeCheckbox('Select child')).toBeChecked();

    fireEvent.click(screen.getByRole('button', { name: 'Parent' }));
    fireEvent.click(getTreeCheckbox('Select child')!);

    expect(screen.getByRole('button', { name: 'Parent' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(getTreeCheckbox('Select child')).not.toBeChecked();
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('expandedIds'));
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('selectedIds'));
    warning.mockRestore();
  });

  it('clones arrays emitted from controlled state callbacks', () => {
    const expandedIds: string[] = [];
    const selectedIds: string[] = [];
    const onExpandedChange = vi.fn((nextIds: string[]) => nextIds.push('consumer-mutation'));
    const onSelectedChange = vi.fn((nextIds: string[]) => nextIds.push('consumer-mutation'));
    render(
      <TreeView.Root
        expandedIds={expandedIds}
        onExpandedChange={onExpandedChange}
        selectedIds={selectedIds}
        onSelectedChange={onSelectedChange}
      >
        <TreeView.Item id="parent" hasChildren>
          <TreeView.Checkbox aria-label="Select parent" />
          <TreeView.Trigger>Parent</TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Parent' }));
    fireEvent.click(getTreeCheckbox('Select parent')!);

    expect(expandedIds).toEqual([]);
    expect(selectedIds).toEqual([]);
    expect(onExpandedChange).toHaveBeenCalledWith(['parent', 'consumer-mutation']);
    expect(onSelectedChange).toHaveBeenCalledWith(['parent', 'consumer-mutation']);
  });

  it('derives a parent checkbox state from its child selections', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="parent" hasChildren childrenIds={['child-1', 'child-2']}>
          <TreeView.Checkbox aria-label="Select parent" />
          <TreeView.Trigger>Parent</TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="child-1" hasChildren={false}>
              <TreeView.Checkbox aria-label="Select first child" />
              <TreeView.Trigger>First child</TreeView.Trigger>
            </TreeView.Item>
            <TreeView.Item id="child-2" hasChildren={false}>
              <TreeView.Checkbox aria-label="Select second child" />
              <TreeView.Trigger>Second child</TreeView.Trigger>
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Parent' }));
    const parent = getTreeCheckbox('Select parent');
    const child = getTreeCheckbox('Select first child');
    expect(parent).not.toBeNull();
    expect(child).not.toBeNull();
    fireEvent.click(parent as HTMLInputElement);
    expect(parent).toBeChecked();
    fireEvent.click(child as HTMLInputElement);

    expect(parent).not.toBeChecked();
    expect(parent).toBePartiallyChecked();
  });

  it('allows a checkbox change handler to cancel cascading selection', async () => {
    const onSelectedChange = vi.fn();
    render(
      <TreeView.Root onSelectedChange={onSelectedChange}>
        <TreeView.Item id="parent" hasChildren childrenIds={['child-1', 'child-2']}>
          <TreeView.Checkbox
            aria-label="Select parent"
            onChange={(event) => event.preventDefault()}
          />
          <TreeView.Trigger>Parent</TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="child-1" hasChildren={false}>
              <TreeView.Checkbox aria-label="Select first child" />
              <TreeView.Trigger>First child</TreeView.Trigger>
            </TreeView.Item>
            <TreeView.Item id="child-2" hasChildren={false}>
              <TreeView.Checkbox aria-label="Select second child" />
              <TreeView.Trigger>Second child</TreeView.Trigger>
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    fireEvent.click(getTreeCheckbox('Select parent')!);

    await waitFor(() => expect(getTreeCheckbox('Select parent')).not.toBeChecked());
    expect(getTreeCheckbox('Select first child')).not.toBeChecked();
    expect(getTreeCheckbox('Select second child')).not.toBeChecked();
    expect(onSelectedChange).not.toHaveBeenCalled();
  });

  it('runs the checkbox handler before notifying controlled tree selection', () => {
    const calls: string[] = [];
    render(
      <TreeView.Root
        selectedIds={[]}
        onSelectedChange={() => {
          calls.push('tree');
        }}
      >
        <TreeView.Item id="file" hasChildren={false}>
          <TreeView.Checkbox
            aria-label="Select file"
            onChange={() => {
              calls.push('checkbox');
            }}
          />
          <TreeView.Trigger>File</TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    fireEvent.click(getTreeCheckbox('Select file')!);

    expect(calls).toEqual(['checkbox', 'tree']);
  });

  it('keeps checkbox selection on the treeitem keyboard model', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="file" hasChildren={false}>
          <TreeView.Checkbox aria-label="Select file" />
          <TreeView.Trigger>File</TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const item = screen.getByRole('treeitem', { name: 'File' });
    const checkbox = item.querySelector<HTMLInputElement>('input[type="checkbox"]');
    expect(item).toHaveAttribute('aria-checked', 'false');
    expect(item).not.toHaveAttribute('aria-selected');
    expect(checkbox).toHaveAttribute('tabindex', '-1');
    expect(checkbox).toHaveAttribute('aria-hidden', 'true');

    act(() => item.focus());
    fireEvent.keyDown(item, { key: ' ' });
    expect(item).toHaveAttribute('aria-checked', 'true');
    expect(checkbox).toBeChecked();
  });

  it('keeps pointer focus on the owning treeitem when a hidden checkbox is clicked', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="file" hasChildren={false}>
          <TreeView.Checkbox aria-label="Select file" />
          <TreeView.Trigger>File</TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const item = screen.getByRole('treeitem', { name: 'File' });
    const checkbox = item.querySelector<HTMLInputElement>('input[type="checkbox"]');
    expect(checkbox).not.toBeNull();

    fireEvent.mouseDown(checkbox as HTMLInputElement);
    fireEvent.click(checkbox as HTMLInputElement);

    expect(document.activeElement).toBe(item);
    expect(checkbox).toBeChecked();
  });

  it('uses one checkbox selection model for every item in a checkbox tree', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="selectable" hasChildren={false}>
          <TreeView.Checkbox aria-label="Select file" />
          <TreeView.Trigger>Selectable file</TreeView.Trigger>
        </TreeView.Item>
        <TreeView.Item id="plain" hasChildren={false}>
          <TreeView.Trigger>Plain file</TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    expect(screen.getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true');
    expect(screen.getByRole('treeitem', { name: 'Selectable file' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    expect(screen.getByRole('treeitem', { name: 'Plain file' })).not.toHaveAttribute(
      'aria-selected',
    );
  });

  it('does not toggle a disabled tree checkbox or repurpose Space as disclosure', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="file">
          <TreeView.Checkbox disabled aria-label="Select file" />
          <TreeView.Trigger>File</TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const item = screen.getByRole('treeitem', { name: 'File' });
    const checkbox = item.querySelector<HTMLInputElement>('input[type="checkbox"]');
    const trigger = screen.getByRole('button', { name: 'File' });
    expect(item).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).toBeDisabled();
    expect(trigger).not.toHaveAttribute('aria-expanded');

    act(() => item.focus());
    fireEvent.keyDown(item, { key: ' ' });
    expect(item).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).not.toBeChecked();
    expect(trigger).not.toHaveAttribute('aria-expanded');
  });

  it('isolates controlled handoff snapshots from consumer array mutation', () => {
    const expandedIds = ['parent'];
    const selectedIds = ['child'];
    const renderTree = (controlled: boolean) => {
      const controlledProps = controlled
        ? {
            expandedIds,
            onExpandedChange: noopIdsChange,
            selectedIds,
            onSelectedChange: noopIdsChange,
          }
        : {};
      return (
        <TreeView.Root {...controlledProps}>
          <TreeView.Item id="parent" hasChildren>
            <TreeView.Trigger>Parent</TreeView.Trigger>
            <TreeView.Content>
              <TreeView.Item id="child" hasChildren={false}>
                <TreeView.Checkbox aria-label="Select child" />
                <TreeView.Trigger>Child</TreeView.Trigger>
              </TreeView.Item>
            </TreeView.Content>
          </TreeView.Item>
        </TreeView.Root>
      );
    };
    const { rerender } = render(renderTree(true));

    expandedIds.splice(0);
    selectedIds.splice(0);
    rerender(renderTree(false));

    expect(screen.getByRole('button', { name: 'Parent' })).toHaveAttribute('aria-expanded', 'true');
    expect(getTreeCheckbox('Select child')).toBeChecked();
  });

  it('keeps context stable when controlled array props retain their identity', () => {
    const expandedIds = ['parent'];
    const selectedIds = ['child'];
    const onContextRender = vi.fn();
    const ContextProbe = memo(() => {
      useTreeViewContext();
      onContextRender();
      return null;
    });
    ContextProbe.displayName = 'ContextProbe';
    const renderTree = () => (
      <TreeView.Root
        expandedIds={expandedIds}
        onExpandedChange={noopIdsChange}
        selectedIds={selectedIds}
        onSelectedChange={noopIdsChange}
      >
        <ContextProbe />
      </TreeView.Root>
    );
    const { rerender } = render(renderTree());

    rerender(renderTree());

    expect(onContextRender).toHaveBeenCalledTimes(1);
  });

  it('supports controlled state through the auto-construction API', () => {
    const onExpandedChange = vi.fn();
    render(<TreeView data={mockData} expandedIds={[]} onExpandedChange={onExpandedChange} />);

    const trigger = screen.getByRole('button', { name: /Folder/i });
    fireEvent.click(trigger);

    expect(onExpandedChange).toHaveBeenCalledWith(['1']);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses one roving tab stop and moves it with Arrow keys', () => {
    render(<TreeView data={mockData} />);

    const folder = screen.getByRole('treeitem', { name: /Folder/i });
    const file = screen.getByRole('treeitem', { name: /File 2/i });
    expect(folder).toHaveAttribute('tabindex', '0');
    expect(file).toHaveAttribute('tabindex', '-1');
    const scrollIntoView = vi.fn();
    Object.assign(file, { scrollIntoView });

    act(() => folder.focus());
    fireEvent.keyDown(folder, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(file);
    expect(file).toHaveAttribute('tabindex', '0');
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });

    fireEvent.keyDown(file, { key: 'Home' });
    expect(document.activeElement).toBe(folder);
  });

  it('skips collapsed descendants during roving navigation', () => {
    render(<TreeView data={mockData} />);

    const folder = screen.getByRole('treeitem', { name: /Folder/i });
    const file2 = screen.getByRole('treeitem', { name: /File 2/i });

    act(() => folder.focus());
    fireEvent.keyDown(folder, { key: 'ArrowRight' });
    const file = screen.getByRole('treeitem', { name: /^File$/i });
    fireEvent.keyDown(folder, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(file);

    fireEvent.keyDown(file, { key: 'ArrowUp' });
    fireEvent.keyDown(folder, { key: 'ArrowLeft' });
    fireEvent.keyDown(folder, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(file2);
  });

  it('skips hidden and inert items during roving navigation', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="first" hasChildren={false}>
          <TreeView.Trigger>First</TreeView.Trigger>
        </TreeView.Item>
        <TreeView.Item hidden id="hidden" hasChildren={false}>
          <TreeView.Trigger>Hidden</TreeView.Trigger>
        </TreeView.Item>
        <TreeView.Item aria-hidden="true" id="aria-hidden" hasChildren={false}>
          <TreeView.Trigger>ARIA hidden</TreeView.Trigger>
        </TreeView.Item>
        <TreeView.Item inert id="inert" hasChildren={false}>
          <TreeView.Trigger>Inert</TreeView.Trigger>
        </TreeView.Item>
        <TreeView.Item id="last" hasChildren={false}>
          <TreeView.Trigger>Last</TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const first = screen.getByRole('treeitem', { name: 'First' });
    const last = screen.getByRole('treeitem', { name: 'Last' });
    act(() => first.focus());

    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(last);

    fireEvent.keyDown(last, { key: 'Home' });
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(first, { key: 'End' });
    expect(document.activeElement).toBe(last);
  });

  it('returns the roving tab stop to a collapsed parent when its child was active', async () => {
    const renderTree = (expandedIds: string[]) => (
      <TreeView.Root expandedIds={expandedIds} onExpandedChange={noopIdsChange}>
        <TreeView.Item id="parent" hasChildren>
          <TreeView.Trigger>Parent</TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="child" hasChildren={false}>
              <TreeView.Trigger>Child</TreeView.Trigger>
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>
    );
    const { rerender } = render(renderTree(['parent']));
    const child = screen.getByRole('treeitem', { name: 'Child' });
    act(() => child.focus());

    await act(async () => {
      rerender(renderTree([]));
      await Promise.resolve();
    });

    const parent = screen.getByText('Parent').closest<HTMLElement>('[role="treeitem"]');
    expect(parent).not.toBeNull();
    await waitFor(() => {
      expect(parent).toHaveAttribute('tabindex', '0');
      expect(document.activeElement).toBe(parent);
    });
    expect(screen.getByRole('treeitem', { name: 'Child', hidden: true })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('returns ShadowRoot focus to a collapsed parent', async () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    shadowRoot.append(container);
    document.body.append(host);
    const renderTree = (expandedIds: string[]) => (
      <TreeView.Root expandedIds={expandedIds} onExpandedChange={noopIdsChange}>
        <TreeView.Item id="parent" hasChildren>
          <TreeView.Trigger>Parent</TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="child" hasChildren={false}>
              <TreeView.Trigger>Child</TreeView.Trigger>
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>
    );
    const { rerender, unmount } = render(renderTree(['parent']), { container });
    const queries = within(container);
    queries.getByRole('treeitem', { name: 'Child' }).focus();

    await act(async () => {
      rerender(renderTree([]));
      await Promise.resolve();
    });

    const parent = queries.getByRole('treeitem', { name: 'Parent' });
    await waitFor(() => expect(shadowRoot.activeElement).toBe(parent));
    unmount();
    host.remove();
  });

  it('moves the roving tab stop when the active trigger is removed', () => {
    const renderItems = (showSecond: boolean) => (
      <TreeView.Root>
        <TreeView.Item id="first" hasChildren={false}>
          <TreeView.Trigger>First</TreeView.Trigger>
        </TreeView.Item>
        {showSecond && (
          <TreeView.Item id="second" hasChildren={false}>
            <TreeView.Trigger>Second</TreeView.Trigger>
          </TreeView.Item>
        )}
      </TreeView.Root>
    );
    const { rerender } = render(renderItems(true));
    const second = screen.getByRole('treeitem', { name: /Second/i });

    act(() => second.focus());
    act(() => rerender(renderItems(false)));

    expect(screen.getByRole('treeitem', { name: /First/i })).toHaveAttribute('tabindex', '0');
  });

  it('does not reclaim ShadowRoot focus moved outside while an active trigger is removed', async () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    const external = document.createElement('button');
    external.textContent = 'External action';
    shadowRoot.append(container, external);
    document.body.append(host);
    const renderItems = (showSecond: boolean) => (
      <TreeView.Root>
        <TreeView.Item id="first" hasChildren={false}>
          <TreeView.Trigger>First</TreeView.Trigger>
        </TreeView.Item>
        {showSecond && (
          <TreeView.Item id="second" hasChildren={false}>
            <TreeView.Trigger>Second</TreeView.Trigger>
          </TreeView.Item>
        )}
      </TreeView.Root>
    );
    const { rerender, unmount } = render(renderItems(true), { container });
    const queries = within(container);
    queries.getByRole('treeitem', { name: 'Second' }).focus();

    await act(async () => {
      rerender(renderItems(false));
      external.focus();
      await Promise.resolve();
    });

    expect(shadowRoot.activeElement).toBe(external);
    unmount();
    host.remove();
  });

  it('moves the roving tab stop away from a trigger that becomes disabled', () => {
    const renderItems = (firstDisabled: boolean) => (
      <TreeView.Root>
        <TreeView.Item id="first" hasChildren={false}>
          <TreeView.Trigger disabled={firstDisabled}>First</TreeView.Trigger>
        </TreeView.Item>
        <TreeView.Item id="second" hasChildren={false}>
          <TreeView.Trigger>Second</TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>
    );
    const { rerender } = render(renderItems(false));

    rerender(renderItems(true));

    expect(screen.getByRole('treeitem', { name: 'First' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('treeitem', { name: 'Second' })).toHaveAttribute('tabindex', '0');
  });

  it('applies public appearance classes', () => {
    const { container, rerender } = render(<TreeView data={mockData} appearance="outline" />);
    expect(container.querySelector('[role="tree"]')).toHaveClass(
      'poffy-treeview__root--appearance_outline',
    );

    rerender(<TreeView data={mockData} appearance="soft" />);
    expect(container.querySelector('[role="tree"]')).toHaveClass(
      'poffy-treeview__root--appearance_soft',
    );
  });

  it('supports asChild triggers with the disclosure indicator', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="folder" hasChildren>
          <TreeView.Trigger asChild>
            <button type="button">Folder</button>
          </TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="file" hasChildren={false}>
              File
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Folder/i });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('clears stale child disabled state when an asChild trigger is enabled', () => {
    const childClick = vi.fn();
    render(
      <TreeView.Root>
        <TreeView.Item id="folder" hasChildren>
          <TreeView.Trigger asChild disabled={false}>
            <button disabled aria-disabled="true" onClick={childClick}>
              Folder
            </button>
          </TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="file" hasChildren={false}>
              File
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Folder' });
    expect(trigger).not.toBeDisabled();
    expect(trigger).not.toHaveAttribute('aria-disabled');

    fireEvent.click(trigger);

    expect(childClick).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('owns disabled asChild trigger state and suppresses child activation handlers', () => {
    const childClick = vi.fn();
    const childPointerDown = vi.fn();
    render(
      <TreeView.Root>
        <TreeView.Item id="folder" hasChildren>
          <TreeView.Trigger asChild disabled>
            <button
              disabled={false}
              aria-disabled="false"
              onClick={childClick}
              onPointerDown={childPointerDown}
            >
              Folder
            </button>
          </TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="file" hasChildren={false}>
              File
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Folder' });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-disabled', 'true');

    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);

    expect(childPointerDown).not.toHaveBeenCalled();
    expect(childClick).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('falls back to a native button when an asChild trigger is not a button', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="folder" hasChildren>
          <TreeView.Trigger asChild>
            <a href="/folders">Folder</a>
          </TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Folder' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(screen.queryByRole('link', { name: 'Folder' })).not.toBeInTheDocument();
  });

  it('restores semantic hosts when asChild receives incompatible native elements', () => {
    const { container } = render(
      <TreeView.Root asChild>
        <button data-testid="invalid-root" type="button">
          <TreeView.Item asChild id="folder">
            <button data-testid="invalid-item" type="button">
              <TreeView.Trigger asChild>
                <input data-testid="invalid-trigger" />
              </TreeView.Trigger>
              <TreeView.Label asChild>
                <button data-testid="invalid-label" type="button">
                  Folder
                </button>
              </TreeView.Label>
            </button>
          </TreeView.Item>
        </button>
      </TreeView.Root>,
    );

    expect(screen.getByRole('tree').tagName).toBe('UL');
    expect(screen.getByRole('treeitem').tagName).toBe('LI');
    expect(screen.queryByTestId('invalid-root')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-item')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-trigger')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-label')).not.toBeInTheDocument();
    expect(container.querySelectorAll('button')).toHaveLength(1);
  });

  it('does not leak a legacy asChild prop from its managed content list', () => {
    const { container } = render(
      <TreeView.Root defaultExpandedIds={['folder']}>
        <TreeView.Item id="folder" hasChildren>
          <TreeView.Trigger>Folder</TreeView.Trigger>
          <TreeView.Content {...({ asChild: true } as never)}>
            <TreeView.Item id="file" hasChildren={false}>
              <TreeView.Trigger>File</TreeView.Trigger>
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    expect(screen.getByRole('group').tagName).toBe('UL');
    expect(container.querySelector('[aschild]')).toBeNull();
  });

  it('preserves trigger toggling when handlers are provided', () => {
    const handleClick = vi.fn();
    const handleKeyDown = vi.fn();

    render(
      <TreeView.Root>
        <TreeView.Item id="folder" hasChildren>
          <TreeView.Trigger onClick={handleClick} onKeyDown={handleKeyDown}>
            <TreeView.Label>Folder</TreeView.Label>
          </TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="file" hasChildren={false}>
              File
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Folder/i });
    fireEvent.click(trigger);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(trigger, { key: 'ArrowLeft', code: 'ArrowLeft' });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('exposes the full plain-text label when visual wrapping is constrained', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="folder" hasChildren={false}>
          <TreeView.Trigger>
            <TreeView.Label>Shared prefix with a distinguishing ending</TreeView.Label>
          </TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    expect(screen.getByText('Shared prefix with a distinguishing ending')).toHaveAttribute(
      'title',
      'Shared prefix with a distinguishing ending',
    );
  });

  it('preserves an explicit tree label title', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="folder" hasChildren={false}>
          <TreeView.Trigger>
            <TreeView.Label title="Consumer title">Folder</TreeView.Label>
          </TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    expect(screen.getByText('Folder')).toHaveAttribute('title', 'Consumer title');
  });

  it('allows trigger handlers to cancel toggling', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="folder" hasChildren>
          <TreeView.Trigger
            onClick={(event) => event.preventDefault()}
            onKeyDown={(event) => event.preventDefault()}
          >
            <TreeView.Label>Folder</TreeView.Label>
          </TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="file" hasChildren={false}>
              File
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Folder/i });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.keyDown(trigger, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('lets asChild child handlers cancel toggling', () => {
    const handleClick = vi.fn((event) => event.preventDefault());

    render(
      <TreeView.Root>
        <TreeView.Item id="folder" hasChildren>
          <TreeView.Trigger asChild>
            <button type="button" onClick={handleClick}>
              Folder
            </button>
          </TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="file" hasChildren={false}>
              File
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Folder/i });
    fireEvent.click(trigger);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not toggle expansion for leaf triggers', () => {
    const handleExpandedChange = vi.fn();
    const handleClick = vi.fn();
    const handleKeyDown = vi.fn();

    render(
      <TreeView.Root onExpandedChange={handleExpandedChange}>
        <TreeView.Item id="file" hasChildren={false}>
          <TreeView.Trigger onClick={handleClick} onKeyDown={handleKeyDown}>
            <TreeView.Label>File</TreeView.Label>
          </TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const trigger = screen.getByRole('button', { name: /File/i });
    expect(trigger).not.toHaveAttribute('aria-expanded');

    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' });
    fireEvent.keyDown(trigger, { key: ' ', code: 'Space' });
    fireEvent.keyDown(trigger, { key: 'ArrowRight', code: 'ArrowRight' });

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleKeyDown).toHaveBeenCalledTimes(3);
    expect(handleExpandedChange).not.toHaveBeenCalled();
    expect(trigger).not.toHaveAttribute('aria-expanded');
  });

  it('removes interactive trigger and label descendants', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="file" hasChildren={false}>
          <TreeView.Trigger>
            <a href="/files">File</a>
            <TreeView.Label>
              <input aria-label="Unsafe label" value="File" readOnly />
            </TreeView.Label>
          </TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('File');
  });

  it('removes interactive auto-rendered labels and icons', () => {
    render(
      <TreeView
        data={[{ id: 'file', name: 'File', icon: <button type="button">Icon</button> }]}
        renderLabel={() => <a href="/files">File</a>}
      />,
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Icon' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'IconFile' })).toBeInTheDocument();
  });

  it('preserves presentation components supplied for auto icons and labels', () => {
    const CustomLabel = () => <strong data-testid="custom-label">Folder</strong>;

    render(
      <TreeView
        data={[{ id: 'folder', name: 'Folder', icon: <FolderIcon data-testid="folder-icon" /> }]}
        renderLabel={() => <CustomLabel />}
      />,
    );

    expect(screen.getByTestId('folder-icon')).toBeInTheDocument();
    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Folder' })).toBeInTheDocument();
  });

  it('is accessible', async () => {
    const { container } = render(<TreeView data={mockData} defaultExpandedIds={['1']} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

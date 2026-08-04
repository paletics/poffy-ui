import { describe, expect, it } from 'vitest';
import { prepareTreeViewData, prepareTreeViewDataWithMetadata } from './prepareTreeViewData';

interface TestTreeNode {
  id: string;
  label: string;
  children?: TestTreeNode[];
  metadata?: { preserved: boolean };
}

describe('prepareTreeViewData', () => {
  it('omits every node with a duplicate id while preserving unique nodes', () => {
    const prepared = prepareTreeViewData([
      {
        id: 'root',
        label: 'Root',
        children: [
          { id: 'shared', label: 'First shared node' },
          { id: 'shared', label: 'Duplicate shared node' },
          { id: 'unique', label: 'Unique node' },
        ],
      },
      { id: 'root', label: 'Duplicate root' },
      { id: 'standalone', label: 'Standalone node' },
    ]);

    expect(prepared).toEqual([{ id: 'standalone', label: 'Standalone node' }]);
  });

  it('does not change duplicate ownership when input order changes', () => {
    const first = { id: 'shared', label: 'First' };
    const second = { id: 'shared', label: 'Second' };
    const unique = { id: 'unique', label: 'Unique' };

    expect(prepareTreeViewData([first, unique, second])).toEqual([unique]);
    expect(prepareTreeViewData([second, unique, first])).toEqual([unique]);
  });

  it('omits direct and indirect cyclic branches', () => {
    const direct: TestTreeNode = { id: 'direct', label: 'Direct' };
    direct.children = [direct];
    const first: TestTreeNode = { id: 'first', label: 'First' };
    const second: TestTreeNode = { id: 'second', label: 'Second', children: [first] };
    first.children = [second];

    expect(prepareTreeViewData([direct, first])).toEqual([
      { id: 'direct', label: 'Direct', children: [] },
      {
        id: 'first',
        label: 'First',
        children: [{ id: 'second', label: 'Second', children: [] }],
      },
    ]);
  });

  it('fails shared references closed through duplicate id detection', () => {
    const shared: TestTreeNode = { id: 'shared', label: 'Shared' };
    const result = prepareTreeViewDataWithMetadata([
      { id: 'left', label: 'Left', children: [shared] },
      { id: 'right', label: 'Right', children: [shared] },
    ]);

    expect(result.duplicateIds).toEqual(['shared']);
    expect(result.data).toEqual([
      { id: 'left', label: 'Left', children: [] },
      { id: 'right', label: 'Right', children: [] },
    ]);
  });

  it('limits depth without mutating input and preserves extra payload', () => {
    const input: TestTreeNode[] = [
      {
        id: 'root',
        label: 'Root',
        metadata: { preserved: true },
        children: [
          {
            id: 'child',
            label: 'Child',
            children: [{ id: 'grandchild', label: 'Grandchild' }],
          },
        ],
      },
    ];

    const prepared = prepareTreeViewData(input, 2);

    expect(prepared).toEqual([
      {
        id: 'root',
        label: 'Root',
        metadata: { preserved: true },
        children: [{ id: 'child', label: 'Child' }],
      },
    ]);
    expect(prepared).not.toBe(input);
    expect(prepared[0]).not.toBe(input[0]);
    expect(input[0].children?.[0].children).toEqual([{ id: 'grandchild', label: 'Grandchild' }]);
  });

  it('processes deeply nested opt-in data without copying ancestor sets', () => {
    const root: TestTreeNode = { id: '0', label: 'Root' };
    let current = root;
    for (let index = 1; index <= 5_000; index += 1) {
      const child: TestTreeNode = { id: String(index), label: `Node ${index}` };
      current.children = [child];
      current = child;
    }

    const prepared = prepareTreeViewData([root], Infinity);
    let depth = 1;
    let node = prepared[0];
    while (node.children?.[0]) {
      depth += 1;
      node = node.children[0];
    }

    expect(depth).toBe(5_001);
  });
});

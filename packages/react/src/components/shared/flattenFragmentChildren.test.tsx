import { fireEvent, render, screen } from '@testing-library/react';
import { Fragment, isValidElement, StrictMode, useEffect, useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { flattenFragmentChildren, materializeReactNodeTree } from './flattenFragmentChildren';

const FlattenedList = ({ children }: { children: ReactNode }) => (
  <>{flattenFragmentChildren(children)}</>
);

const StatefulLeaf = ({ label, onMount }: { label: string; onMount: (label: string) => void }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    onMount(label);
  }, [label, onMount]);

  return <button onClick={() => setCount((value) => value + 1)}>{`${label}:${count}`}</button>;
};

describe('flattenFragmentChildren', () => {
  it('materializes nested one-shot iterables without changing element keys', () => {
    function* nestedChildren() {
      yield <span key="nested">Nested</span>;
    }
    const root = (
      <section key="root">
        <div>{nestedChildren()}</div>
      </section>
    );

    const first = materializeReactNodeTree(root);
    const second = materializeReactNodeTree(root);

    expect(isValidElement(first) && first.key).toBe('root');
    expect(isValidElement(second) && second.key).toBe('root');
    render(<>{second}</>);
    expect(screen.getByText('Nested')).toBeInTheDocument();
  });

  it('observes mutations to reusable iterable children', () => {
    const children = new Set<ReactNode>([<span key="first">First</span>]);
    expect(materializeReactNodeTree(children)).toHaveLength(1);
    children.add(<span key="second">Second</span>);
    expect(materializeReactNodeTree(children)).toHaveLength(2);
  });

  it('replays root and nested single-use iterators from cached raw nodes', () => {
    function* nestedChildren() {
      yield <span key="nested">Nested</span>;
    }
    function* rootChildren() {
      yield <span key="root">Root</span>;
      yield nestedChildren();
    }
    const children = rootChildren();

    const first = flattenFragmentChildren(children);
    const second = flattenFragmentChildren(children);

    expect(first.map((child) => (isValidElement(child) ? child.props.children : child))).toEqual([
      'Root',
      'Nested',
    ]);
    expect(second.map((child) => (isValidElement(child) ? child.props.children : child))).toEqual([
      'Root',
      'Nested',
    ]);
    expect(second.map((child) => (isValidElement(child) ? child.key : null))).toEqual(
      first.map((child) => (isValidElement(child) ? child.key : null)),
    );
  });

  it('replays a single iterator exposed through a separate iterable wrapper', () => {
    function* source() {
      yield <span key="first">First</span>;
      yield <span key="second">Second</span>;
    }
    const iterator = source();
    const children: Iterable<ReactNode> = {
      [Symbol.iterator]: () => iterator,
    };

    expect(flattenFragmentChildren(children)).toHaveLength(2);
    expect(flattenFragmentChildren(children)).toHaveLength(2);
  });

  it('replays a single-use iterator during StrictMode render evaluation', () => {
    function* children() {
      yield <span key="first">First</span>;
      yield <span key="second">Second</span>;
    }

    render(
      <StrictMode>
        <FlattenedList>{children()}</FlattenedList>
      </StrictMode>,
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('reads reusable iterables again so later mutations remain visible', () => {
    const children = new Set<ReactNode>([<span key="first">First</span>]);

    expect(flattenFragmentChildren(children)).toHaveLength(1);
    children.add(<span key="second">Second</span>);

    expect(flattenFragmentChildren(children)).toHaveLength(2);
  });

  it('observes mutations when a reusable iterable resets and returns the same iterator', () => {
    const values: ReactNode[] = [<span key="first">First</span>];
    let index = 0;
    const iterator: Iterator<ReactNode> = {
      next: () =>
        index < values.length
          ? { done: false, value: values[index++] }
          : { done: true, value: undefined },
    };
    const children: Iterable<ReactNode> = {
      [Symbol.iterator]() {
        index = 0;
        return iterator;
      },
    };

    expect(flattenFragmentChildren(children)).toHaveLength(1);
    values.push(<span key="second">Second</span>);
    expect(flattenFragmentChildren(children)).toHaveLength(2);
  });

  it('observes mutations when a resettable iterable is its own iterator', () => {
    const children: IterableIterator<ReactNode> & {
      index: number;
      values: ReactNode[];
    } = {
      index: 0,
      values: [<span key="first">First</span>],
      [Symbol.iterator]() {
        this.index = 0;
        return this;
      },
      next() {
        return this.index < this.values.length
          ? { done: false, value: this.values[this.index++] }
          : { done: true, value: undefined };
      },
    };

    expect(flattenFragmentChildren(children)).toHaveLength(1);
    children.values.push(<span key="second">Second</span>);
    expect(flattenFragmentChildren(children)).toHaveLength(2);
  });

  it('does not cache partially materialized nodes when iteration throws', () => {
    let step = 0;
    let shouldThrow = true;
    const children: IterableIterator<ReactNode> = {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        step += 1;
        if (step === 1) return { done: false, value: <span>Partial</span> };
        if (shouldThrow) {
          shouldThrow = false;
          throw new Error('materialization failed');
        }
        if (step === 3) return { done: false, value: <span>Recovered</span> };
        return { done: true, value: undefined };
      },
    };

    expect(() => flattenFragmentChildren(children)).toThrow('materialization failed');
    const recovered = flattenFragmentChildren(children);
    const replayed = flattenFragmentChildren(children);

    expect(isValidElement(recovered[0]) && recovered[0].props.children).toBe('Recovered');
    expect(isValidElement(replayed[0]) && replayed[0].props.children).toBe('Recovered');
  });

  it('recursively flattens fragments in order while preserving renderable falsy values', () => {
    const flattened = flattenFragmentChildren(
      <>
        <span>A</span>
        {false}
        {null}
        <Fragment>
          {0}
          <>
            <span>B</span>
            {''}
          </>
        </Fragment>
      </>,
    );

    expect(
      flattened.map((child) =>
        isValidElement<{ children?: unknown }>(child) ? child.props.children : child,
      ),
    ).toEqual(['A', 0, 'B', '']);
  });

  it('assigns unique keys to duplicate leaf keys from sibling fragments', () => {
    const flattened = flattenFragmentChildren(
      <>
        <>
          <span key="item">A</span>
          <span>B</span>
        </>
        <>
          <span key="item">C</span>
          <span>D</span>
        </>
      </>,
    );
    const keys = flattened.map((child) => (isValidElement(child) ? child.key : null));

    expect(keys).not.toContain(null);
    expect(new Set(keys).size).toBe(4);
  });

  it('keeps a unique leaf key stable when only Fragment boundaries change', () => {
    const direct = flattenFragmentChildren([<span key="stable">Stable</span>]);
    const wrapped = flattenFragmentChildren(
      <Fragment>
        <span key="stable">Stable</span>
      </Fragment>,
    );

    expect(isValidElement(direct[0]) && direct[0].key).toBe('stable');
    expect(isValidElement(wrapped[0]) && wrapped[0].key).toBe('stable');
  });

  it('remounts a unique keyed leaf when its keyed Fragment boundary changes', () => {
    const mounted = vi.fn();
    const renderChildren = (fragmentKey: string) => (
      <Fragment key={fragmentKey}>
        <StatefulLeaf key="leaf" label="Leaf" onMount={mounted} />
      </Fragment>
    );
    const { rerender } = render(<FlattenedList>{renderChildren('first')}</FlattenedList>);

    fireEvent.click(screen.getByRole('button', { name: 'Leaf:0' }));
    rerender(<FlattenedList>{renderChildren('second')}</FlattenedList>);

    expect(screen.getByRole('button', { name: 'Leaf:0' })).toBeInTheDocument();
    expect(mounted).toHaveBeenCalledTimes(2);
  });

  it('preserves keyed leaf state when an unkeyed Fragment boundary changes', () => {
    const mounted = vi.fn();
    const { rerender } = render(
      <FlattenedList>
        <StatefulLeaf key="leaf" label="Leaf" onMount={mounted} />
      </FlattenedList>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Leaf:0' }));
    rerender(
      <FlattenedList>
        <Fragment>
          <StatefulLeaf key="leaf" label="Leaf" onMount={mounted} />
        </Fragment>
      </FlattenedList>,
    );

    expect(screen.getByRole('button', { name: 'Leaf:1' })).toBeInTheDocument();
    expect(mounted).toHaveBeenCalledOnce();
  });

  it('preserves direct keyed element identity and leaves non-element nodes unchanged', () => {
    const direct = <span key="stable">Stable</span>;
    const text = 'Text';
    const flattened = flattenFragmentChildren([direct, text]);

    expect(flattened[0]).toBe(direct);
    expect(flattened[1]).toBe(text);
  });

  it('preserves direct keyed identity when a nested duplicate appears first', () => {
    const direct = <span key="item">Direct</span>;
    const flattened = flattenFragmentChildren([
      <Fragment key="fragment">
        <span key="item">Nested</span>
      </Fragment>,
      direct,
    ]);

    expect(flattened[1]).toBe(direct);
    expect(isValidElement(flattened[0]) && flattened[0].key).not.toBe('item');
  });

  it('keeps duplicate local child state with its keyed Fragment when Fragments reorder', () => {
    const mounted = vi.fn();
    const children = (reversed: boolean) => {
      const fragments = [
        <Fragment key="a">
          <StatefulLeaf key="item" label="A" onMount={mounted} />
        </Fragment>,
        <Fragment key="b">
          <StatefulLeaf key="item" label="B" onMount={mounted} />
        </Fragment>,
      ];
      return reversed ? fragments.reverse() : fragments;
    };
    const { rerender } = render(<FlattenedList>{children(false)}</FlattenedList>);

    fireEvent.click(screen.getByRole('button', { name: 'A:0' }));
    rerender(<FlattenedList>{children(true)}</FlattenedList>);

    expect(screen.getByRole('button', { name: 'A:1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'B:0' })).toBeInTheDocument();
    expect(mounted).toHaveBeenCalledTimes(2);
  });

  it('keeps the first local duplicate stable when a later duplicate is added and removed', () => {
    const mounted = vi.fn();
    const children = (includeDuplicate: boolean) => (
      <Fragment key="scope">
        <StatefulLeaf key="item" label="First" onMount={mounted} />
        {includeDuplicate ? <StatefulLeaf key="item" label="Second" onMount={mounted} /> : null}
      </Fragment>
    );
    const { rerender } = render(<FlattenedList>{children(false)}</FlattenedList>);

    fireEvent.click(screen.getByRole('button', { name: 'First:0' }));
    rerender(<FlattenedList>{children(true)}</FlattenedList>);
    expect(screen.getByRole('button', { name: 'First:1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Second:0' })).toBeInTheDocument();

    rerender(<FlattenedList>{children(false)}</FlattenedList>);
    expect(screen.getByRole('button', { name: 'First:1' })).toBeInTheDocument();
    expect(mounted).toHaveBeenCalledTimes(2);
  });

  it('keeps direct and nested colliding-key state stable when their order changes', () => {
    const mounted = vi.fn();
    const children = (nestedFirst: boolean) => {
      const direct = <StatefulLeaf key="item" label="Direct" onMount={mounted} />;
      const nested = (
        <Fragment key="nested">
          <StatefulLeaf key="item" label="Nested" onMount={mounted} />
        </Fragment>
      );
      return nestedFirst ? [nested, direct] : [direct, nested];
    };
    const { rerender } = render(<FlattenedList>{children(true)}</FlattenedList>);

    fireEvent.click(screen.getByRole('button', { name: 'Nested:0' }));
    rerender(<FlattenedList>{children(false)}</FlattenedList>);

    expect(screen.getByRole('button', { name: 'Direct:0' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nested:1' })).toBeInTheDocument();
    expect(mounted).toHaveBeenCalledTimes(2);
  });

  it('avoids collisions between synthesized and explicit consumer keys', () => {
    const reserved = 'flattened:["key:item",[],1,0]';
    const flattened = flattenFragmentChildren([
      [<span key="item">Nested A</span>, <span key="item">Nested B</span>],
      <span key={reserved}>Reserved</span>,
    ]);
    const keys = flattened.map((child) => (isValidElement(child) ? child.key : null));

    expect(new Set(keys).size).toBe(3);
    expect(keys).toContain(reserved);
  });

  it('avoids collisions between ancestor-scoped synthesized and explicit consumer keys', () => {
    const reserved = 'flattened:["key:item",["fragment:group"],0,0]';
    const flattened = flattenFragmentChildren([
      <Fragment key="group">
        <span key="item">Scoped</span>
      </Fragment>,
      <span key="item">Direct</span>,
      <span key={reserved}>Reserved</span>,
    ]);
    const keys = flattened.map((child) => (isValidElement(child) ? child.key : null));

    expect(new Set(keys).size).toBe(3);
    expect(keys).toContain(reserved);
  });

  it('composes nested array and Fragment scopes without changing direct keyed identity', () => {
    const direct = <span key="item">Direct</span>;
    const flattened = flattenFragmentChildren([
      direct,
      [<span key="item">Array A</span>],
      [
        <Fragment key="fragment">
          <span key="item">Fragment B</span>
        </Fragment>,
      ],
    ]);
    const keys = flattened.map((child) => (isValidElement(child) ? child.key : null));

    expect(flattened[0]).toBe(direct);
    expect(new Set(keys).size).toBe(3);
  });
});

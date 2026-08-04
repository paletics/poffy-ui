import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { JsonViewer } from './JsonViewer';

/**
 * ### Test Strategy: JsonViewer
 * - **Focus**: Object formatting, raw JSON string formatting, invalid string passthrough,
 *   caption inheritance, and accessibility.
 * - **DON'T**: Do not assert generated Panda class names or Prism internals.
 */
describe('JsonViewer', () => {
  it('pretty-prints JSON-compatible values', () => {
    const { container } = render(<JsonViewer value={{ status: 'ok', count: 2 }} />);

    expect(container.querySelector('code')).toHaveTextContent('"status": "ok"');
    expect(container.querySelector('code')).toHaveTextContent('"count": 2');
  });

  it('pretty-prints raw JSON strings', () => {
    const { container } = render(<JsonViewer value={'{"status":"ok"}'} />);

    expect(container.querySelector('code')).toHaveTextContent('"status": "ok"');
  });

  it('passes through invalid raw JSON strings', () => {
    const { container } = render(<JsonViewer value="{not-json}" />);

    expect(container.querySelector('code')).toHaveTextContent('{not-json}');
  });

  it('renders string JSON values when stringMode is value', () => {
    const { container } = render(<JsonViewer stringMode="value" value="hello" />);

    expect(container.querySelector('code')).toHaveTextContent('"hello"');
  });

  it('does not parse raw JSON that exceeds the serialization limit', () => {
    const parse = vi.spyOn(JSON, 'parse');
    const { container } = render(
      <JsonViewer maxSerializedCharacters={10} value={'{"status":"this value is too large"}'} />,
    );

    expect(parse).not.toHaveBeenCalled();
    expect(container.querySelector('code')).toHaveTextContent(
      'JSON content exceeds the serialization limit.',
    );
  });

  it('stops serializing object values at the configured limit', () => {
    const { container } = render(
      <JsonViewer
        maxSerializedCharacters={10}
        oversizedValueText="Payload omitted."
        value={{ status: 'ok' }}
      />,
    );

    expect(container.querySelector('code')).toHaveTextContent('Payload omitted.');
    expect(container.querySelector('figure')).toHaveAttribute('data-content-kind', 'message');
  });

  it('keeps regular JSON in the code overflow mode', () => {
    const { container } = render(<JsonViewer value={{ status: 'ok' }} />);

    expect(container.querySelector('figure')).toHaveAttribute('data-content-kind', 'json');
  });

  it('bounds traversal of omitted enumerable properties at the serialization limit', () => {
    const getter = vi.fn(() => undefined);
    const value = Object.fromEntries(
      Array.from({ length: 20 }, (_, index) => [`omitted-${index}`, undefined]),
    );
    Object.defineProperty(value, 'omitted-0', { enumerable: true, get: getter });
    const { container } = render(
      <JsonViewer
        maxSerializedCharacters={10}
        oversizedValueText="Payload omitted."
        value={value as never}
      />,
    );

    expect(container.querySelector('code')).toHaveTextContent('Payload omitted.');
    expect(getter).toHaveBeenCalledTimes(1);
  });

  it('enforces the serialization limit after JSON escaping and formatting', () => {
    const { container } = render(
      <JsonViewer
        indent={0}
        maxSerializedCharacters={10}
        oversizedValueText="Payload omitted."
        value={{ key: '\n' }}
      />,
    );

    expect(container.querySelector('code')).toHaveTextContent('Payload omitted.');
  });

  it('uses a JSON-specific default name without a caption', () => {
    render(<JsonViewer value={{ status: 'ok' }} />);

    expect(screen.getByRole('region', { name: 'JSON data' })).toBeInTheDocument();
  });

  it('uses explicit source labels ahead of a caption and normalizes empty labels', () => {
    const { rerender } = render(
      <JsonViewer caption="Response" aria-label="Sanitized response" value={{ status: 'ok' }} />,
    );

    expect(screen.getByRole('region', { name: 'Sanitized response' })).toBeInTheDocument();

    rerender(<JsonViewer aria-label="" aria-labelledby=" " value={{ status: 'ok' }} />);

    expect(screen.getByRole('region', { name: 'JSON data' })).toBeInTheDocument();
  });

  it('uses its JSON-specific default name when the caption is empty', () => {
    render(<JsonViewer caption={<></>} value={{ status: 'ok' }} />);

    expect(screen.getByRole('region', { name: 'JSON data' })).toBeInTheDocument();
  });

  it('uses its JSON-specific default name when an opaque caption component renders nothing', () => {
    const EmptyCaption = () => null;
    render(<JsonViewer caption={<EmptyCaption />} value={{ status: 'ok' }} />);

    expect(screen.getByRole('region', { name: 'JSON data' })).toBeInTheDocument();
  });

  it('uses image alternative text as a caption name', () => {
    render(<JsonViewer caption={<img alt="Response payload" />} value={{ status: 'ok' }} />);

    expect(screen.getByRole('region', { name: 'Response payload' })).toBeInTheDocument();
  });

  it('normalizes an out-of-range indent value', () => {
    const { container } = render(<JsonViewer indent={100} value={{ status: 'ok' }} />);

    expect(container.querySelector('code')?.textContent).toContain('\n          "status"');
  });

  it('updates when a caller mutates and rerenders the same value reference', () => {
    const value = { status: 'old' };
    const { container, rerender } = render(<JsonViewer value={value} />);
    value.status = 'new';
    rerender(<JsonViewer value={value} />);

    expect(container.querySelector('code')).toHaveTextContent('"status": "new"');
  });

  it('distinguishes invalid runtime values from oversized JSON', () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    const { container, rerender } = render(
      <JsonViewer invalidValueText="Invalid JSON." value={cyclic as never} />,
    );
    expect(container.querySelector('code')).toHaveTextContent('Invalid JSON.');

    rerender(<JsonViewer invalidValueText="Invalid JSON." value={1n as never} />);
    expect(container.querySelector('code')).toHaveTextContent('Invalid JSON.');

    rerender(<JsonViewer invalidValueText="Invalid JSON." value={Object(1n) as never} />);
    expect(container.querySelector('code')).toHaveTextContent('Invalid JSON.');

    rerender(
      <JsonViewer maxSerializedCharacters={4} oversizedValueText="Too large." value={{ a: 1 }} />,
    );
    expect(container.querySelector('code')).toHaveTextContent('Too large.');
  });

  it('evaluates toJSON and getters once while serializing', () => {
    let toJsonCalls = 0;
    let getterCalls = 0;
    const value = {
      toJSON() {
        toJsonCalls += 1;
        return {
          get status() {
            getterCalls += 1;
            return 'ok';
          },
        };
      },
    };
    const { container } = render(<JsonViewer value={value as never} />);

    expect(container.querySelector('code')).toHaveTextContent('"status": "ok"');
    expect(toJsonCalls).toBe(1);
    expect(getterCalls).toBe(1);
  });

  it('uses the array length captured before element getters mutate the array', () => {
    const value: unknown[] = [];
    Object.defineProperty(value, '0', {
      enumerable: true,
      get() {
        value.push(null);
        return 0;
      },
    });
    value.length = 1;
    const { container } = render(<JsonViewer indent={0} value={value as never} />);

    expect(container.querySelector('code')).toHaveTextContent('[0]');
  });

  it('honors BigInt.prototype.toJSON when present', () => {
    const original = Object.getOwnPropertyDescriptor(BigInt.prototype, 'toJSON');
    Object.defineProperty(BigInt.prototype, 'toJSON', {
      configurable: true,
      value() {
        return 'bigint value';
      },
    });

    try {
      const { container } = render(<JsonViewer indent={0} value={1n as never} />);

      expect(container.querySelector('code')).toHaveTextContent('"bigint value"');
    } finally {
      if (original) Object.defineProperty(BigInt.prototype, 'toJSON', original);
      else Reflect.deleteProperty(BigInt.prototype, 'toJSON');
    }
  });

  it('stops large unescaped string values at the serialization limit', () => {
    const { container } = render(
      <JsonViewer
        indent={0}
        maxSerializedCharacters={16}
        oversizedValueText="Payload omitted."
        stringMode="value"
        value={'x'.repeat(10_000)}
      />,
    );

    expect(container.querySelector('code')).toHaveTextContent('Payload omitted.');
  });

  it('matches JSON.stringify rules for runtime values and character escaping', () => {
    const date = new Date('2024-01-02T03:04:05.000Z');
    const value = {
      date,
      omitted: undefined,
      nonFinite: Number.NaN,
      infinite: Infinity,
      loneSurrogate: '\ud800',
      list: [undefined, Number.NEGATIVE_INFINITY],
    };
    const { container } = render(<JsonViewer indent={0} value={value as never} />);

    expect(container.querySelector('code')?.textContent).toBe(JSON.stringify(value));
  });

  it('accepts a limit equal to the serialized output and rejects one less', () => {
    const value = { ok: true };
    const serialized = JSON.stringify(value);
    const { container, rerender } = render(
      <JsonViewer indent={0} maxSerializedCharacters={serialized.length} value={value} />,
    );
    expect(container.querySelector('code')).toHaveTextContent(serialized);

    rerender(
      <JsonViewer
        maxSerializedCharacters={serialized.length - 1}
        indent={0}
        oversizedValueText="Too large."
        value={value}
      />,
    );
    expect(container.querySelector('code')).toHaveTextContent('Too large.');
  });

  it('serializes shared references and stops before deep nesting overflows the output budget', () => {
    const shared = { status: 'ok' };
    const deep: { child?: unknown } = {};
    let cursor = deep;
    for (let index = 0; index < 5_000; index += 1) {
      cursor.child = {};
      cursor = cursor.child as { child?: unknown };
    }
    const { container, rerender } = render(
      <JsonViewer value={{ first: shared, second: shared }} />,
    );

    expect(container.querySelector('code')?.textContent).toMatch(/"first"[\s\S]*"second"/);

    rerender(
      <JsonViewer maxSerializedCharacters={32} oversizedValueText="Too deep." value={deep} />,
    );

    expect(container.querySelector('code')).toHaveTextContent('Too deep.');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<JsonViewer caption="Response" value={{ status: 'ok' }} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});

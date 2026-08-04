import { describe, expect, it } from 'vitest';
import { serializeJson } from './serializeJson';
import { isSerializationLimitExceeded } from './serializeJsonWriter';

describe('serializeJson', () => {
  it('serializes structured values with bounded indentation', () => {
    expect(serializeJson({ items: [true, null, 'ok'] }, 2, 100)).toBe(
      '{\n  "items": [\n    true,\n    null,\n    "ok"\n  ]\n}',
    );
  });

  it('preserves JSON omission semantics', () => {
    expect(serializeJson({ omitted: undefined, kept: 1 }, 0, 100)).toBe('{"kept":1}');
    expect(serializeJson([undefined, () => undefined], 0, 100)).toBe('[null,null]');
  });

  it('reports output and traversal limits through a stable predicate', () => {
    for (const value of [{ value: 'too long' }, new Array(10)]) {
      try {
        serializeJson(value, 0, 4);
        throw new Error('Expected serialization to exceed its limit.');
      } catch (error) {
        expect(isSerializationLimitExceeded(error)).toBe(true);
      }
    }
    expect(isSerializationLimitExceeded(new Error('different error'))).toBe(false);
  });

  it('recognizes a structurally branded limit error from another bundle instance', () => {
    let limitError: unknown;
    try {
      serializeJson({ value: 'too long' }, 0, 4);
    } catch (error) {
      limitError = error;
    }

    const code = Reflect.get(limitError as object, 'code');
    expect(isSerializationLimitExceeded({ code })).toBe(true);
    expect(
      isSerializationLimitExceeded(
        new Proxy(
          {},
          {
            get() {
              throw new Error('blocked inspection');
            },
          },
        ),
      ),
    ).toBe(false);
  });

  it('rejects circular values without classifying them as a size limit', () => {
    const value: { self?: unknown } = {};
    value.self = value;

    expect(() => serializeJson(value, 0, 100)).toThrow('Converting circular structure to JSON');
    try {
      serializeJson(value, 0, 100);
    } catch (error) {
      expect(isSerializationLimitExceeded(error)).toBe(false);
    }
  });
});

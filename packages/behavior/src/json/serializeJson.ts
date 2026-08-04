import {
  BoundedWriter,
  TraversalBudget,
  writeIndent,
  writeJsonString,
} from './serializeJsonWriter';

type PreparedValue =
  | { readonly kind: 'omitted' }
  | { readonly kind: 'value'; readonly value: unknown };

type Frame =
  | {
      readonly kind: 'value';
      readonly value: unknown;
      readonly depth: number;
      readonly inArray: boolean;
    }
  | {
      readonly kind: 'array';
      readonly value: unknown[];
      readonly length: number;
      readonly index: number;
      readonly depth: number;
    }
  | {
      readonly kind: 'object';
      readonly value: object;
      readonly keys: IterableIterator<string>;
      readonly depth: number;
      readonly wroteProperty: boolean;
    }
  | { readonly kind: 'close'; readonly value: object; readonly delimiter: ']' | '}' };

function prepareValue(value: unknown, key: string): PreparedValue {
  const isBigInt = typeof value === 'bigint';
  if ((typeof value === 'object' && value !== null) || typeof value === 'function' || isBigInt) {
    const receiver = isBigInt ? Object(value) : value;
    const toJson = Reflect.get(receiver, 'toJSON');
    if (typeof toJson === 'function') value = Reflect.apply(toJson, receiver, [key]);
  }

  if (value === undefined || typeof value === 'function' || typeof value === 'symbol') {
    return { kind: 'omitted' };
  }

  return { kind: 'value', value };
}

function* enumerateOwnEnumerableKeys(value: object): IterableIterator<string> {
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) yield key;
  }
}

function writePrimitive(writer: BoundedWriter, value: unknown): boolean {
  if (value === null) {
    writer.write('null');
    return true;
  }
  if (typeof value === 'string') {
    writeJsonString(writer, value);
    return true;
  }
  if (typeof value === 'boolean') {
    writer.write(value ? 'true' : 'false');
    return true;
  }
  if (typeof value === 'number') {
    writer.write(Number.isFinite(value) ? String(value) : 'null');
    return true;
  }
  if (typeof value === 'bigint') throw new TypeError('Do not know how to serialize a BigInt');

  if (value instanceof BigInt) {
    throw new TypeError('Do not know how to serialize a BigInt');
  }

  if (value instanceof Number || value instanceof String || value instanceof Boolean) {
    return writePrimitive(writer, value.valueOf());
  }

  return false;
}

/**
 * Serializes a value with JSON-compatible omission, escaping, and `toJSON` behavior.
 *
 * A positive `indent` inserts that many spaces per nesting level; zero or a negative value
 * produces compact JSON. `maxCharacters` limits both the completed string and the number of
 * inspected object properties or array slots. If either limit is exceeded, this function throws
 * an error recognized by `isSerializationLimitExceeded`. Circular values and unsupported values
 * retain the ordinary JSON serialization failure behavior. At the root only, values that JSON
 * would omit (`undefined`, functions, and symbols) are returned as `String(value)` instead.
 *
 * @param value Value to serialize using JSON-compatible object, array, primitive, and `toJSON`
 * semantics.
 * @param indent Spaces per nesting level; non-positive values produce compact JSON.
 * @param maxCharacters Inclusive budget for output characters and traversed enumerable properties
 * or array slots.
 * @throws An inspectable serialization-limit error when output or traversal exceeds
 * `maxCharacters`.
 */
export function serializeJson(value: unknown, indent: number, maxCharacters: number): string {
  const writer = new BoundedWriter(maxCharacters);
  const traversalBudget = new TraversalBudget(maxCharacters);
  const root = prepareValue(value, '');
  if (root.kind === 'omitted') {
    const fallback = String(value);
    writer.write(fallback);
    return writer.toString();
  }

  const ancestors = new Set<object>();
  const frames: Frame[] = [{ kind: 'value', value: root.value, depth: 0, inArray: false }];

  while (frames.length > 0) {
    const frame = frames.pop();
    if (!frame) continue;

    if (frame.kind === 'close') {
      ancestors.delete(frame.value);
      writer.write(frame.delimiter);
      continue;
    }

    if (frame.kind === 'array') {
      if (frame.index === frame.length) {
        if (frame.length > 0 && indent > 0) {
          writer.write('\n');
          writeIndent(writer, frame.depth, indent);
        }
        frames.push({ kind: 'close', value: frame.value, delimiter: ']' });
        continue;
      }

      if (frame.index > 0) writer.write(',');
      if (indent > 0) {
        writer.write('\n');
        writeIndent(writer, frame.depth + 1, indent);
      }
      traversalBudget.consume();
      const prepared = prepareValue(
        Reflect.get(frame.value, String(frame.index)),
        String(frame.index),
      );
      frames.push({ ...frame, index: frame.index + 1 });
      frames.push({
        kind: 'value',
        value: prepared.kind === 'omitted' ? undefined : prepared.value,
        depth: frame.depth + 1,
        inArray: true,
      });
      continue;
    }

    if (frame.kind === 'object') {
      let prepared: PreparedValue | undefined;
      let key: string | undefined;
      let nextKey = frame.keys.next();
      while (!nextKey.done && !prepared) {
        traversalBudget.consume();
        key = nextKey.value;
        const candidate = prepareValue(Reflect.get(frame.value, key), key);
        if (candidate.kind === 'value') prepared = candidate;
        else nextKey = frame.keys.next();
      }
      if (prepared?.kind !== 'value' || key === undefined) {
        if (frame.wroteProperty && indent > 0) {
          writer.write('\n');
          writeIndent(writer, frame.depth, indent);
        }
        frames.push({ kind: 'close', value: frame.value, delimiter: '}' });
        continue;
      }

      if (frame.wroteProperty) writer.write(',');
      if (indent > 0) {
        writer.write('\n');
        writeIndent(writer, frame.depth + 1, indent);
      }
      writeJsonString(writer, key);
      writer.write(indent > 0 ? ': ' : ':');
      frames.push({ ...frame, wroteProperty: true });
      frames.push({ kind: 'value', value: prepared.value, depth: frame.depth + 1, inArray: false });
      continue;
    }

    if (writePrimitive(writer, frame.value)) continue;
    if (typeof frame.value !== 'object') {
      if (frame.inArray) writer.write('null');
      else throw new TypeError('Unsupported JSON value');
      continue;
    }

    const objectValue = frame.value as object;
    if (ancestors.has(objectValue)) throw new TypeError('Converting circular structure to JSON');
    ancestors.add(objectValue);
    if (Array.isArray(objectValue)) {
      writer.write('[');
      frames.push({
        kind: 'array',
        value: objectValue,
        length: objectValue.length,
        index: 0,
        depth: frame.depth,
      });
    } else {
      writer.write('{');
      frames.push({
        kind: 'object',
        value: objectValue,
        keys: enumerateOwnEnumerableKeys(objectValue),
        depth: frame.depth,
        wroteProperty: false,
      });
    }
  }

  return writer.toString();
}

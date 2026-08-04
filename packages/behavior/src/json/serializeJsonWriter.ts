const serializationLimitErrorCode = 'POFFY_UI_JSON_SERIALIZATION_LIMIT_EXCEEDED';
const serializationLimitExceeded = Object.assign(new Error('JSON serialization limit exceeded.'), {
  code: serializationLimitErrorCode,
} as const);

/**
 * Incrementally builds JSON text while enforcing a maximum output length.
 *
 * @internal Used by the bounded serializer; callers should use `serializeJson` instead.
 */
export class BoundedWriter {
  private readonly chunks: string[] = [];
  private length = 0;

  constructor(private readonly maximumLength: number) {}

  write(value: string): void {
    this.ensureCanWrite(value.length);
    this.length += value.length;
    this.chunks.push(value);
  }

  writeSlice(value: string, start: number, end: number): void {
    this.ensureCanWrite(end - start);
    this.length += end - start;
    this.chunks.push(value.slice(start, end));
  }

  writeRepeat(value: string, count: number): void {
    const length = value.length * count;
    this.ensureCanWrite(length);
    this.length += length;
    this.chunks.push(value.repeat(count));
  }

  ensureCanWrite(length: number): void {
    if (this.length + length > this.maximumLength) throw serializationLimitExceeded;
  }

  toString(): string {
    return this.chunks.join('');
  }
}

/** Bounds property and array-slot inspection alongside the serialized output size. */
export class TraversalBudget {
  private remaining: number;

  constructor(maximumEntries: number) {
    this.remaining = maximumEntries;
  }

  consume(): void {
    if (this.remaining <= 0) throw serializationLimitExceeded;
    this.remaining -= 1;
  }
}

/**
 * Writes one JSON string literal, escaping controls and lone UTF-16 surrogates without allocating
 * an intermediate escaped string.
 *
 * @internal Used by the bounded serializer.
 */
export function writeJsonString(writer: BoundedWriter, value: string): void {
  writer.write('"');
  let start = 0;

  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    let escaped: string | undefined;

    if (code === 0x22) escaped = '\\"';
    else if (code === 0x5c) escaped = '\\\\';
    else if (code === 0x08) escaped = '\\b';
    else if (code === 0x0c) escaped = '\\f';
    else if (code === 0x0a) escaped = '\\n';
    else if (code === 0x0d) escaped = '\\r';
    else if (code === 0x09) escaped = '\\t';
    else if (code < 0x20) escaped = `\\u00${code.toString(16).padStart(2, '0')}`;
    else if (
      (code >= 0xd800 &&
        code <= 0xdbff &&
        (index + 1 === value.length ||
          value.charCodeAt(index + 1) < 0xdc00 ||
          value.charCodeAt(index + 1) > 0xdfff)) ||
      (code >= 0xdc00 &&
        code <= 0xdfff &&
        (index === 0 ||
          value.charCodeAt(index - 1) < 0xd800 ||
          value.charCodeAt(index - 1) > 0xdbff))
    ) {
      escaped = `\\u${code.toString(16).padStart(4, '0')}`;
    }

    if (escaped) {
      writer.writeSlice(value, start, index);
      writer.write(escaped);
      start = index + 1;
    } else {
      // The unflushed segment and closing quote are unavoidable output. Checking this while
      // scanning prevents a large unescaped string from bypassing the serialization budget.
      writer.ensureCanWrite(index - start + 2);
    }
  }

  writer.writeSlice(value, start, value.length);
  writer.write('"');
}

/**
 * Writes indentation for a positive nesting depth and positive spaces-per-level value.
 *
 * @internal Used by the bounded serializer's pretty-print path.
 */
export function writeIndent(writer: BoundedWriter, depth: number, indent: number): void {
  if (indent > 0) writer.writeRepeat(' ', depth * indent);
}

/**
 * Returns whether an unknown thrown value is this package's bounded-serialization limit error.
 *
 * The check uses a stable error code rather than object identity, so it also recognizes an error
 * created by another installed copy of this package.
 */
export function isSerializationLimitExceeded(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  try {
    return Reflect.get(error, 'code') === serializationLimitErrorCode;
  } catch {
    return false;
  }
}

/**
 * Serializes a JSON-compatible value under a shared output and traversal budget.
 *
 * Use {@link isSerializationLimitExceeded} to distinguish an exhausted budget from ordinary JSON
 * serialization errors.
 */
export { serializeJson } from './serializeJson';

/** Returns whether a thrown value represents `serializeJson`'s stable size-limit failure. */
export { isSerializationLimitExceeded } from './serializeJsonWriter';

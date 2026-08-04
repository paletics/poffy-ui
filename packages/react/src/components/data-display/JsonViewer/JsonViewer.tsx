'use client';

import { forwardRef } from 'react';
import { isSerializationLimitExceeded, serializeJson } from '@poffy-ui/behavior/json';
import { CodeViewer } from '../CodeViewer';
import { hasAccessibleCaptionContent } from '../CodeViewer/CodeViewer.utils';
import type { JsonViewerProps } from './JsonViewer.types';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';

function normalizeIndent(indent: number): number {
  return Number.isFinite(indent) ? Math.min(10, Math.max(0, Math.trunc(indent))) : 2;
}

function normalizeSerializationLimit(limit: number): number {
  if (limit === Infinity) return limit;

  return Number.isFinite(limit) ? Math.max(0, Math.trunc(limit)) : 100_000;
}

function formatJson(
  value: unknown,
  indent: number,
  invalidValueText: string,
  maxSerializedCharacters: number,
  oversizedValueText: string,
  stringMode: 'raw' | 'value',
): { content: string; isMessage: boolean } {
  if (typeof value === 'string' && stringMode === 'raw') {
    if (value.length > maxSerializedCharacters) {
      return { content: oversizedValueText, isMessage: true };
    }

    try {
      return {
        content: serializeJson(JSON.parse(value), indent, maxSerializedCharacters),
        isMessage: false,
      };
    } catch (error) {
      if (isSerializationLimitExceeded(error)) {
        return { content: oversizedValueText, isMessage: true };
      }

      return { content: value, isMessage: false };
    }
  }

  try {
    return {
      content: serializeJson(value, indent, maxSerializedCharacters),
      isMessage: false,
    };
  } catch (error) {
    if (isSerializationLimitExceeded(error)) {
      return { content: oversizedValueText, isMessage: true };
    }

    return { content: invalidValueText, isMessage: true };
  }
}

/**
 * Serializes and displays JSON through `CodeViewer`.
 *
 * In `raw` mode, a string is first parsed as JSON and falls back to the
 * original string when parsing fails; `value` mode serializes the string as a
 * JSON value. Serialization is bounded by `maxSerializedCharacters`. Invalid
 * or oversized input produces localized (or supplied) message text without
 * JSON highlighting or line numbers.
 */
export const JsonViewer = forwardRef<HTMLElement, JsonViewerProps>(
  (
    {
      value,
      indent = 2,
      invalidValueText,
      maxSerializedCharacters = 100_000,
      oversizedValueText,
      stringMode = 'raw',
      caption,
      wrap,
      showLineNumbers,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    },
    ref,
  ) => {
    const messages = getCommonMessages(useOptionalLocale()?.locale);
    const normalizedAriaLabel = ariaLabel?.trim() ? ariaLabel : undefined;
    const normalizedAriaLabelledBy = ariaLabelledBy?.trim() ? ariaLabelledBy : undefined;
    const defaultAriaLabel =
      normalizedAriaLabelledBy || hasAccessibleCaptionContent(caption)
        ? undefined
        : messages.jsonData;
    const formattedValue = formatJson(
      value,
      normalizeIndent(indent),
      invalidValueText ?? messages.invalidJson,
      normalizeSerializationLimit(maxSerializedCharacters),
      oversizedValueText ?? messages.oversizedJson,
      stringMode,
    );

    return (
      <CodeViewer
        ref={ref}
        caption={caption}
        aria-label={normalizedAriaLabel ?? defaultAriaLabel}
        aria-labelledby={normalizedAriaLabelledBy}
        {...rest}
        data-content-kind={formattedValue.isMessage ? 'message' : 'json'}
        language={formattedValue.isMessage ? undefined : 'json'}
        showLineNumbers={formattedValue.isMessage ? false : showLineNumbers}
        wrap={formattedValue.isMessage ? true : wrap}
      >
        {formattedValue.content}
      </CodeViewer>
    );
  },
);

JsonViewer.displayName = 'JsonViewer';

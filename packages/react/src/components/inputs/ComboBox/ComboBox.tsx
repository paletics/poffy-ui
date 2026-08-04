'use client';

import { forwardRef } from 'react';
import { ComboBoxProps } from './ComboBox.types';
import { ComboBoxRoot } from './ComboBoxRoot';
import { ComboBoxInput } from './ComboBoxInput';
import { ComboBoxList } from './ComboBoxList';
import { ComboBoxItem } from './ComboBoxItem';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';

const ComboBoxBase = forwardRef<HTMLInputElement, ComboBoxProps>((props, ref) => {
  const {
    label,
    placeholder,
    options = [],
    locale,
    messages: overrides,
    isLoading,
    loadingContent,
    emptyContent,
    ...rest
  } = props;
  const providerLocale = useOptionalLocale()?.locale;
  const messages = getCommonMessages(locale ?? providerLocale);
  return (
    <ComboBoxRoot options={options} locale={locale} isLoading={isLoading} {...rest}>
      <ComboBoxInput
        ref={ref}
        label={label}
        placeholder={placeholder ?? overrides?.placeholder ?? messages.selectOption}
        toggleLabel={overrides?.toggleOptions ?? messages.toggleOptions}
      />
      <ComboBoxList loadingContent={loadingContent} emptyContent={emptyContent}>
        {options.map((option, optionIndex) => (
          <ComboBoxItem
            key={`${option.value}-${optionIndex}`}
            value={option.value}
            label={option.label}
            disabled={option.disabled}
          />
        ))}
      </ComboBoxList>
    </ComboBoxRoot>
  );
});

ComboBoxBase.displayName = 'ComboBox';

/**
 * Default searchable single-value ComboBox composition.
 *
 * It renders Root, Input, List, and one Item for each supplied option. Use the compound parts
 * when option presentation or loading/empty content must be composed differently; the facade owns
 * its children.
 */
export const ComboBox = Object.assign(ComboBoxBase, {
  Root: ComboBoxRoot,
  Input: ComboBoxInput,
  List: ComboBoxList,
  Item: ComboBoxItem,
});

'use client';

import { ReorderTransition } from '@/components/animations';
import { Tag } from '@/components/data-display/Tag';
import { css } from '@/styled-system/css';
import type { ReactNode } from 'react';
import type { MultiSelectOption, MultiSelectRenderTagProps } from './MultiSelect.types';

const tagTransitionClass = css({
  display: 'contents',
});

/**
 * Props for the tag list inside the MultiSelect control area.
 */
interface MultiSelectTagsProps {
  values: string[];
  options: MultiSelectOption[];
  disabled: boolean;
  onRemove: (value: string) => void;
  renderTag?: (props: MultiSelectRenderTagProps) => ReactNode;
}

/**
 * Renders the selected-value tags inside the MultiSelect input area.
 *
 * ### AI Context & Architecture
 * - Extracted from MultiSelect to keep that file under 200 lines.
 * Each tag has a remove button that calls `onRemove` with the tag's value.
 */
export const MultiSelectTags = ({
  values,
  options,
  disabled,
  onRemove,
  renderTag,
}: MultiSelectTagsProps) => (
  <ReorderTransition className={tagTransitionClass} animationType="fade" data-multiselect-tags>
    {values.map((val) => {
      const opt = options.find((o) => o.value === val);
      const display = opt ? opt.label : val;
      const removeLabel = `Remove ${display}`;
      const tagProps: MultiSelectRenderTagProps = {
        value: val,
        label: display,
        option: opt,
        disabled,
        removeLabel,
        onRemove: () => {
          if (!disabled) onRemove(val);
        },
      };

      if (renderTag) {
        return (
          <ReorderTransition.Item key={val} asChild data-multiselect-tag>
            <span>{renderTag(tagProps)}</span>
          </ReorderTransition.Item>
        );
      }

      return (
        <ReorderTransition.Item key={val} asChild data-multiselect-tag>
          <Tag size="sm" appearance="soft" intent="primary">
            <Tag.Label data-multiselect-tag-label>{display}</Tag.Label>
            <Tag.CloseButton
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                tagProps.onRemove();
              }}
              aria-label={removeLabel}
              isDisabled={disabled}
            />
          </Tag>
        </ReorderTransition.Item>
      );
    })}
  </ReorderTransition>
);

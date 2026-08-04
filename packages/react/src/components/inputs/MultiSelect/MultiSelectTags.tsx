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
  getRemoveLabel: (label: string) => string;
}


export const MultiSelectTags = ({
  values,
  options,
  disabled,
  onRemove,
  renderTag,
  getRemoveLabel,
}: MultiSelectTagsProps) => (
  <ReorderTransition className={tagTransitionClass} animationType="fade" data-multiselect-tags>
    {values.map((val) => {
      const opt = options.find((o) => o.value === val);
      const display = opt ? opt.label : val;
      const removeLabel = getRemoveLabel(display);
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
            <span data-multiselect-custom-tag>{renderTag(tagProps)}</span>
          </ReorderTransition.Item>
        );
      }

      return (
        <ReorderTransition.Item key={val} asChild data-multiselect-tag>
          <Tag data-multiselect-default-tag size="sm" appearance="soft" intent="primary">
            <Tag.Label data-multiselect-tag-label>{display}</Tag.Label>
            <Tag.CloseButton
              data-multiselect-tag-remove
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

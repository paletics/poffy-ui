import { useEffect, useRef, type UIEvent } from 'react';
import type { WheelPickerColumn, WheelPickerValue } from './WheelPicker.types';

const scrollCommitDelay = 180;

type ElementRefMap = Record<string, HTMLDivElement | null>;

interface UseWheelPickerScrollOptions {
  columns: WheelPickerColumn[];
  commitValue: (columnId: string, nextOptionValue: string) => void;
  disabled: boolean;
  readOnly: boolean;
  selectedValue: WheelPickerValue;
}

/**
 * Handles WheelPicker scroll centering and scroll-to-select behavior.
 */
export const useWheelPickerScroll = ({
  columns,
  commitValue,
  disabled,
  readOnly,
  selectedValue,
}: UseWheelPickerScrollOptions) => {
  const optionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const viewportRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollTimeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout> | undefined>>({});
  const programmaticScrollRefs = useRef<Record<string, boolean>>({});

  useEffect(() => {
    for (const column of columns) {
      centerSelectedOption({
        columnId: column.id,
        optionRefs: optionRefs.current,
        programmaticScrollRefs: programmaticScrollRefs.current,
        selectedValue,
        viewportRefs: viewportRefs.current,
      });
    }
  }, [columns, selectedValue]);

  useEffect(
    () => () => {
      for (const timeoutId of Object.values(scrollTimeoutRefs.current)) {
        clearTimeout(timeoutId);
      }
    },
    [],
  );

  const commitNearestScrolledOption = (viewport: HTMLDivElement, columnId: string) => {
    if (disabled || readOnly) return;

    const column = columns.find((item) => item.id === columnId);
    if (!column) return;

    const nearest = findNearestScrolledOption(viewport, column, optionRefs.current);

    if (nearest && nearest.value !== selectedValue[columnId]) {
      commitValue(columnId, nearest.value);
    }
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>, columnId: string) => {
    if (programmaticScrollRefs.current[columnId]) return;

    clearTimeout(scrollTimeoutRefs.current[columnId]);
    const viewport = event.currentTarget;
    scrollTimeoutRefs.current[columnId] = setTimeout(() => {
      commitNearestScrolledOption(viewport, columnId);
    }, scrollCommitDelay);
  };

  return {
    handleScroll,
    setOptionRef: (key: string, node: HTMLDivElement | null) => {
      optionRefs.current[key] = node;
    },
    setViewportRef: (columnId: string, node: HTMLDivElement | null) => {
      viewportRefs.current[columnId] = node;
    },
  };
};

const centerSelectedOption = ({
  columnId,
  optionRefs,
  programmaticScrollRefs,
  selectedValue,
  viewportRefs,
}: {
  columnId: string;
  optionRefs: ElementRefMap;
  programmaticScrollRefs: Record<string, boolean>;
  selectedValue: WheelPickerValue;
  viewportRefs: ElementRefMap;
}) => {
  const optionValue = selectedValue[columnId];
  const node = optionRefs[`${columnId}:${optionValue}`];
  const viewport = viewportRefs[columnId];
  if (!node || !viewport) return;

  const nextScrollTop = node.offsetTop - viewport.clientHeight / 2 + node.offsetHeight / 2;
  if (Math.abs(viewport.scrollTop - nextScrollTop) <= 1) return;

  programmaticScrollRefs[columnId] = true;
  viewport.scrollTop = nextScrollTop;
  requestAnimationFrame(() => {
    programmaticScrollRefs[columnId] = false;
  });
};

const findNearestScrolledOption = (
  viewport: HTMLDivElement,
  column: WheelPickerColumn,
  optionRefs: ElementRefMap,
) => {
  const viewportRect = viewport.getBoundingClientRect();
  const viewportCenter = viewportRect.top + viewportRect.height / 2;

  return column.options
    .filter((option) => !option.disabled)
    .map((option) => {
      const node = optionRefs[`${column.id}:${option.value}`];
      if (!node) return undefined;
      const rect = node.getBoundingClientRect();
      return {
        option,
        distance: Math.abs(rect.top + rect.height / 2 - viewportCenter),
      };
    })
    .filter((item): item is { option: (typeof column.options)[number]; distance: number } =>
      Boolean(item),
    )
    .sort((a, b) => a.distance - b.distance)[0]?.option;
};

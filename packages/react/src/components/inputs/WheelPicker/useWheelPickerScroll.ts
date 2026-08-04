import { useCallback, useEffect, useLayoutEffect, useRef, type UIEvent } from 'react';
import type { WheelPickerColumn, WheelPickerValue } from './WheelPicker.types';

const scrollCommitDelay = 180;
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type OptionRefMap = Map<string, Map<string, HTMLDivElement>>;
type ViewportRefMap = Map<string, HTMLDivElement>;
type AnimationFrameMap = Map<string, { frameId: number; ownerWindow: Window }>;
type ResizeObserverMap = Map<string, { observer: ResizeObserver; ownerWindow: Window }>;

const getColumnsSemanticKey = (columns: WheelPickerColumn[]) =>
  JSON.stringify(
    columns.map((column) => ({
      id: column.id,
      label: column.label,
      options: column.options.map(({ disabled, label, placeholder, value }) => ({
        disabled: disabled === true,
        label,
        placeholder: placeholder === true,
        value,
      })),
    })),
  );

const getSelectionSemanticKey = (selectedValue: WheelPickerValue) =>
  JSON.stringify(
    Object.entries(selectedValue).sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey)),
  );

interface UseWheelPickerScrollOptions {
  columns: WheelPickerColumn[];
  commitValue: (columnId: string, nextOptionValue: string) => void;
  disabled: boolean;
  layoutKey: string;
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
  layoutKey,
  readOnly,
  selectedValue,
}: UseWheelPickerScrollOptions) => {
  const optionRefs = useRef<OptionRefMap>(new Map());
  const viewportRefs = useRef<ViewportRefMap>(new Map());
  const scrollTimeoutRefs = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const programmaticScrollRefs = useRef(new Map<string, boolean>());
  const releaseFrameRefs = useRef<AnimationFrameMap>(new Map());
  const centerFrameRefs = useRef<AnimationFrameMap>(new Map());
  const resizeObserverRefs = useRef<ResizeObserverMap>(new Map());
  const columnsSemanticKey = getColumnsSemanticKey(columns);
  const selectionSemanticKey = getSelectionSemanticKey(selectedValue);
  const blocked = [disabled, readOnly].some(Boolean);
  const latestStateRef = useRef({
    columns,
    commitValue,
    disabled,
    readOnly,
    selectedValue,
  });
  const centeringStateRef = useRef<{
    blocked: boolean;
    columnsSemanticKey: string;
    layoutKey: string;
    selectedValue: WheelPickerValue;
  } | null>(null);

  useIsomorphicLayoutEffect(() => {
    latestStateRef.current = { columns, commitValue, disabled, readOnly, selectedValue };
  }, [columns, commitValue, disabled, readOnly, selectedValue]);

  const centerColumn = useCallback((columnId: string) => {
    const timeoutId = scrollTimeoutRefs.current.get(columnId);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      scrollTimeoutRefs.current.delete(columnId);
    }

    const latestState = latestStateRef.current;
    centerSelectedOption({
      columnId,
      animationFrameRefs: releaseFrameRefs.current,
      optionRefs: optionRefs.current,
      programmaticScrollRefs: programmaticScrollRefs.current,
      selectedValue: latestState.selectedValue,
      viewportRefs: viewportRefs.current,
    });
  }, []);

  const scheduleCenter = useCallback(
    (columnId: string) => {
      const viewport = viewportRefs.current.get(columnId);
      const ownerWindow = viewport?.ownerDocument.defaultView;
      if (!viewport || !ownerWindow) return;

      const timeoutId = scrollTimeoutRefs.current.get(columnId);
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        scrollTimeoutRefs.current.delete(columnId);
      }

      const previousFrame = centerFrameRefs.current.get(columnId);
      if (previousFrame) {
        if (previousFrame.ownerWindow === ownerWindow) return;
        previousFrame.ownerWindow.cancelAnimationFrame(previousFrame.frameId);
      }

      const frame = { frameId: 0, ownerWindow };
      centerFrameRefs.current.set(columnId, frame);
      frame.frameId = ownerWindow.requestAnimationFrame(() => {
        if (centerFrameRefs.current.get(columnId) !== frame) return;
        centerFrameRefs.current.delete(columnId);
        centerColumn(columnId);
      });
    },
    [centerColumn],
  );

  useIsomorphicLayoutEffect(() => {
    const latestState = latestStateRef.current;
    const previous = centeringStateRef.current;
    const recenterAll =
      previous === null ||
      previous.blocked !== blocked ||
      previous.columnsSemanticKey !== columnsSemanticKey ||
      previous.layoutKey !== layoutKey;
    const columnsToCenter = recenterAll
      ? latestState.columns
      : latestState.columns.filter(
          (column) => previous.selectedValue[column.id] !== latestState.selectedValue[column.id],
        );

    centeringStateRef.current = {
      blocked,
      columnsSemanticKey,
      layoutKey,
      selectedValue: { ...latestState.selectedValue },
    };
    for (const column of columnsToCenter) centerColumn(column.id);
  }, [blocked, centerColumn, columnsSemanticKey, layoutKey, selectionSemanticKey]);

  useEffect(
    () => () => {
      for (const timeoutId of scrollTimeoutRefs.current.values()) {
        clearTimeout(timeoutId);
      }
      for (const { frameId, ownerWindow } of releaseFrameRefs.current.values()) {
        ownerWindow.cancelAnimationFrame(frameId);
      }
      for (const { frameId, ownerWindow } of centerFrameRefs.current.values()) {
        ownerWindow.cancelAnimationFrame(frameId);
      }
      for (const { observer } of resizeObserverRefs.current.values()) observer.disconnect();
      releaseFrameRefs.current.clear();
      centerFrameRefs.current.clear();
      resizeObserverRefs.current.clear();
      programmaticScrollRefs.current.clear();
    },
    [],
  );

  const commitNearestScrolledOption = useCallback((viewport: HTMLDivElement, columnId: string) => {
    const latestState = latestStateRef.current;
    if (latestState.disabled || latestState.readOnly) return;

    const column = latestState.columns.find((item) => item.id === columnId);
    if (!column) return;

    const nearest = findNearestScrolledOption(viewport, column, optionRefs.current);
    const nearestValue = nearest?.value;

    if (nearestValue !== undefined && nearestValue !== latestState.selectedValue[columnId]) {
      latestState.commitValue(columnId, nearestValue);
    }
  }, []);

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>, columnId: string) => {
      if (programmaticScrollRefs.current.get(columnId)) return;

      clearTimeout(scrollTimeoutRefs.current.get(columnId));
      const viewport = event.currentTarget;
      scrollTimeoutRefs.current.set(
        columnId,
        setTimeout(() => {
          scrollTimeoutRefs.current.delete(columnId);
          commitNearestScrolledOption(viewport, columnId);
        }, scrollCommitDelay),
      );
    },
    [commitNearestScrolledOption],
  );

  const setOptionRef = useCallback(
    (columnId: string, optionValue: string, node: HTMLDivElement | null) => {
      const columnRefs = optionRefs.current.get(columnId);
      const previousNode = columnRefs?.get(optionValue);
      const observerRecord = resizeObserverRefs.current.get(columnId);
      if (previousNode) observerRecord?.observer.unobserve(previousNode);

      if (node) {
        const nextColumnRefs = columnRefs ?? new Map<string, HTMLDivElement>();
        nextColumnRefs.set(optionValue, node);
        optionRefs.current.set(columnId, nextColumnRefs);
        if (node.ownerDocument.defaultView === observerRecord?.ownerWindow) {
          observerRecord.observer.observe(node);
        }
      } else if (columnRefs) {
        columnRefs.delete(optionValue);
        if (columnRefs.size === 0) optionRefs.current.delete(columnId);
      }
      scheduleCenter(columnId);
    },
    [scheduleCenter],
  );

  const setViewportRef = useCallback(
    (columnId: string, node: HTMLDivElement | null) => {
      resizeObserverRefs.current.get(columnId)?.observer.disconnect();
      resizeObserverRefs.current.delete(columnId);

      const previousCenterFrame = centerFrameRefs.current.get(columnId);
      if (previousCenterFrame) {
        previousCenterFrame.ownerWindow.cancelAnimationFrame(previousCenterFrame.frameId);
        centerFrameRefs.current.delete(columnId);
      }
      const previousReleaseFrame = releaseFrameRefs.current.get(columnId);
      if (previousReleaseFrame) {
        previousReleaseFrame.ownerWindow.cancelAnimationFrame(previousReleaseFrame.frameId);
        releaseFrameRefs.current.delete(columnId);
      }
      const timeoutId = scrollTimeoutRefs.current.get(columnId);
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        scrollTimeoutRefs.current.delete(columnId);
      }
      programmaticScrollRefs.current.delete(columnId);

      if (!node) {
        viewportRefs.current.delete(columnId);
        return;
      }

      viewportRefs.current.set(columnId, node);
      const ownerWindow = node.ownerDocument.defaultView;
      const ResizeObserverConstructor = ownerWindow?.ResizeObserver;
      if (ownerWindow && typeof ResizeObserverConstructor === 'function') {
        const observer = new ResizeObserverConstructor(() => {
          if (resizeObserverRefs.current.get(columnId)?.observer !== observer) return;
          scheduleCenter(columnId);
        });
        const observerRecord = { observer, ownerWindow };
        resizeObserverRefs.current.set(columnId, observerRecord);
        observer.observe(node);
        for (const option of optionRefs.current.get(columnId)?.values() ?? []) {
          if (option.ownerDocument.defaultView === ownerWindow) observer.observe(option);
        }
      }
      scheduleCenter(columnId);
    },
    [scheduleCenter],
  );

  return {
    handleScroll,
    setOptionRef,
    setViewportRef,
  };
};

const centerSelectedOption = ({
  columnId,
  animationFrameRefs,
  optionRefs,
  programmaticScrollRefs,
  selectedValue,
  viewportRefs,
}: {
  columnId: string;
  animationFrameRefs: AnimationFrameMap;
  optionRefs: OptionRefMap;
  programmaticScrollRefs: Map<string, boolean>;
  selectedValue: WheelPickerValue;
  viewportRefs: ViewportRefMap;
}) => {
  const optionValue = selectedValue[columnId];
  const node = optionRefs.get(columnId)?.get(optionValue);
  const viewport = viewportRefs.get(columnId);
  if (!node || !viewport) return;

  const nextScrollTop = node.offsetTop - viewport.clientHeight / 2 + node.offsetHeight / 2;
  if (Math.abs(viewport.scrollTop - nextScrollTop) <= 1) return;

  const previousFrame = animationFrameRefs.get(columnId);
  if (previousFrame) {
    previousFrame.ownerWindow.cancelAnimationFrame(previousFrame.frameId);
    animationFrameRefs.delete(columnId);
  }
  programmaticScrollRefs.set(columnId, true);
  viewport.scrollTop = nextScrollTop;
  const ownerWindow = viewport.ownerDocument.defaultView;
  if (!ownerWindow) {
    programmaticScrollRefs.set(columnId, false);
    return;
  }

  const frame = { frameId: 0, ownerWindow };
  animationFrameRefs.set(columnId, frame);
  frame.frameId = ownerWindow.requestAnimationFrame(() => {
    if (animationFrameRefs.get(columnId) !== frame) return;
    animationFrameRefs.delete(columnId);
    programmaticScrollRefs.set(columnId, false);
  });
};

const findNearestScrolledOption = (
  viewport: HTMLDivElement,
  column: WheelPickerColumn,
  optionRefs: OptionRefMap,
) => {
  const viewportRect = viewport.getBoundingClientRect();
  if (viewportRect.height <= 0) return undefined;
  const viewportCenter = viewportRect.top + viewportRect.height / 2;

  return column.options
    .filter((option) => !option.disabled)
    .map((option) => {
      const node = optionRefs.get(column.id)?.get(option.value);
      if (!node) return undefined;
      const rect = node.getBoundingClientRect();
      if (rect.height <= 0) return undefined;
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

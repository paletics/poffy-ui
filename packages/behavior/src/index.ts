/**
 * Poffy UI's complete behavior public API.
 *
 * This root entry re-exports the stable interaction helpers and React hooks. Prefer a feature
 * subpath such as `@poffy-ui/behavior/calendar` or `@poffy-ui/behavior/hooks` when consumers need
 * a narrower dependency boundary. Behavioral edge cases and controlled-state contracts are
 * documented at each exported function, hook, and type in those feature modules.
 */
export {
  createDisabledActivationHandlers,
  guardActivationHandlers,
  guardDisabledActivationHandlers,
  useButtonKeyboardActivation,
} from './activation';
export type {
  ActivationGuardHandlers,
  ActivationHandlers,
  ButtonKeyboardActivationHandlers,
  DisabledActivationHandlers,
  UseButtonKeyboardActivationOptions,
} from './activation';
export { useAccordionState } from './accordion';
export type {
  ControlledMultipleUseAccordionStateProps,
  ControlledSingleUseAccordionStateProps,
  UncontrolledMultipleUseAccordionStateProps,
  UncontrolledSingleUseAccordionStateProps,
  UseAccordionStateProps,
  UseAccordionStateReturn,
} from './accordion';
export {
  buildCalendarGrid,
  getCalendarInitialSelection,
  getInitialCalendarFocusDate,
  getInitialCalendarMonth,
  getNextCalendarFocusDate,
  getNextCalendarSelection,
  isCalendarDateSelected,
  isCalendarRangeEnd,
  isCalendarRangeMiddle,
  isCalendarRangeStart,
  normalizeCalendarSelection,
} from './calendar';
export type {
  CalendarDatePredicateOptions,
  CalendarDateRange,
  CalendarGrid,
  CalendarSelectionMode,
  CalendarSelectionValue,
  GetInitialCalendarDateOptions,
  GetNextCalendarFocusDateOptions,
  GetNextCalendarSelectionOptions,
} from './calendar';
export {
  getComboBoxKeyboardIntent,
  getDuplicateComboBoxValues,
  getUnambiguousComboBoxOptions,
  useComboBoxState,
} from './combobox';
export type {
  ComboBoxKeyboardIntent,
  ComboBoxOptionLike,
  GetComboBoxKeyboardIntentOptions,
  UseComboBoxStateOptions,
  UseComboBoxStateReturn,
} from './combobox';
export { copyToClipboard } from './clipboard';
export type { CopyToClipboardOptions } from './clipboard';
export { sanitizeNavigationUrl } from './url';
export type { SanitizeNavigationUrlOptions } from './url';
export {
  coreScreenExtension,
  createScreenRegistry,
  defineScreen,
  screenGridMinimumWidths,
  screenGridModes,
  screenLayoutGaps,
  validateScreenDocument,
} from './screen-composer';
export type {
  ScreenDocument,
  ScreenExtension,
  ScreenGridMinimumWidth,
  ScreenGridMode,
  ScreenLayoutGap,
  ScreenNode,
  ScreenNodeDefinition,
  ScreenRegistry,
  ScreenSchemaIssue,
} from './screen-composer';
export {
  filterCommandMenuItems,
  getCommandMenuActiveDescendant,
  getCommandMenuItemSearchText,
  getCommandMenuOptionId,
  getNextCommandMenuHighlight,
  groupCommandMenuItems,
  getCommandMenuKeyboardIntent,
  registerCommandMenuShortcut,
  useCommandMenuState,
} from './command-menu';
export type {
  CommandMenuBehaviorItem,
  CommandMenuGroup,
  CommandMenuHighlightDirection,
  CommandMenuKeyboardInput,
  CommandMenuKeyboardIntent,
  CommandMenuShortcutRegistration,
  ControlledUseCommandMenuOpenState,
  ControlledUseCommandMenuQueryState,
  UncontrolledUseCommandMenuOpenState,
  UncontrolledUseCommandMenuQueryState,
  UseCommandMenuOpenState,
  UseCommandMenuQueryState,
  UseCommandMenuStateOptions,
  UseCommandMenuStateReturn,
} from './command-menu';
export { useCollapsibleState } from './collapsible';
export type {
  ControlledUseCollapsibleStateProps,
  UncontrolledUseCollapsibleStateProps,
  UseCollapsibleStateProps,
  UseCollapsibleStateReturn,
} from './collapsible';
export { useContextMenu, useContextMenuTrigger } from './context-menu';
export type {
  ContextMenuFloatingProps,
  ContextMenuPosition,
  UseContextMenuParams,
  UseContextMenuReturn,
  UseContextMenuTriggerReturn,
} from './context-menu';
export {
  compareDateDay,
  formatDateFormValue,
  formatDateISO,
  isDateUnavailable,
  isSameDay,
  isValidDate,
  normalizeDateFormatOptions,
  parseDateISO,
} from './date';
export type { DateConstraintOptions, DateFormValueFormat } from './date';
export { useDatePickerState } from './date/react';
export type { UseDatePickerStateOptions, UseDatePickerStateReturn } from './date/react';
export {
  formatDateTimeFormValue,
  formatDateTimeValue,
  formatLocalDateTimeValue,
  mergeDateAndTime,
  mergeTimeValueIntoDate,
} from './datetime';
export { useDropdown } from './dropdown';
export type { DropdownCollectionItem, UseDropdownOptions, UseDropdownReturn } from './dropdown';
export {
  acceptsFileUpload,
  createFileUploadItems,
  filterAcceptedFiles,
  formatFileSize,
  getFileUploadRejectionReasons,
  normalizeFileUploadCandidates,
  resolveFileUploadSelection,
} from './file-upload';
export type {
  FileUploadAcceptOptions,
  FileUploadCandidate,
  FileUploadItem,
  FileUploadItemState,
  FileUploadRejection,
  FileUploadRejectionReason,
  FileUploadSelectionRejectionReason,
} from './file-upload';
export { useFileUploadState } from './file-upload/react';
export type { UseFileUploadStateOptions, UseFileUploadStateReturn } from './file-upload/react';
export { isSerializationLimitExceeded, serializeJson } from './json';
export {
  filterListboxOptions,
  getDuplicateListboxOptionValues,
  getEnabledListboxIndices,
  getFirstEnabledListboxIndex,
  getListboxHighlightedIndex,
  getListboxHighlightedValue,
  getLastEnabledListboxIndex,
  getNextEnabledListboxIndex,
  getPreviousEnabledListboxIndex,
  getUnambiguousListboxOptions,
  getListboxSelectOptionIdentity,
  getListboxSelectOptionIndex,
  getListboxSelectSelectedIndex,
  reconcileListboxSelectSelection,
} from './listbox';
export type { ListboxFilterOptions, ListboxOptionLike, ListboxValueOptionLike } from './listbox';
export { useListboxSelectState } from './listbox/react';
export type {
  ListboxSelectKeyboardInput,
  ListboxSelectOptionIdentity,
  ListboxSelectOptionLike,
  ReconcileListboxSelectSelectionOptions,
  ReconciledListboxSelectSelection,
  UseListboxSelectStateOptions,
  UseListboxSelectStateReturn,
} from './listbox/react';
export { parseMarkdown, sanitizeMarkdownUrl } from './markdown';
export type {
  MarkdownBlockNode,
  MarkdownBlockquoteNode,
  MarkdownCodeNode,
  MarkdownDocument,
  MarkdownHeadingNode,
  MarkdownImageNode,
  MarkdownInlineCodeNode,
  MarkdownInlineNode,
  MarkdownLinkNode,
  MarkdownListItemNode,
  MarkdownListNode,
  MarkdownParagraphNode,
  MarkdownTextNode,
  MarkdownThematicBreakNode,
  ParseMarkdownOptions,
} from './markdown';
export { getMultiSelectKeyboardIntent, useMultiSelectInteractionState } from './multi-select';
export type {
  GetMultiSelectKeyboardIntentOptions,
  MultiSelectKeyboardIntent,
  MultiSelectOptionLike,
  UseMultiSelectInteractionStateOptions,
  UseMultiSelectInteractionStateReturn,
} from './multi-select';
export {
  DEFAULT_CHART_MARGIN,
  assignRef,
  focusAdjacentTabStop,
  getDeepActiveElement,
  getDOMTreeRoot,
  getTreeElementById,
  mergeRefs,
  useChartDimensions,
  useControllableState,
  useDimensions,
  useEventListener,
  useImage,
  useMediaQuery,
  useMergeRefs,
  useMousePosition,
  useAnimationPause,
  useScrollProgress,
  useScrollPosition,
  useWindowSize,
} from './hooks';
export type {
  ChartDimensions,
  ChartMargin,
  DOMTreeRoot,
  FocusAdjacentTabStopOptions,
  UseControllableStateOptions,
  UseControllableStateReturn,
  Dimensions,
  ImageStatus,
  MousePosition,
  ReactRef,
  ScrollProgress,
  ScrollProgressAxis,
  ScrollPosition,
  UseAnimationPauseOptions,
  UseImageProps,
  UseImageReturn,
  UseMediaQueryOptions,
  UseScrollProgressOptions,
  WindowSize,
} from './hooks';
export {
  canDecrementNumberInput,
  canIncrementNumberInput,
  clampNumberInputValue,
  decrementNumberInputValue,
  getNextNumberInputStepValue,
  getPreviousNumberInputStepValue,
  incrementNumberInputValue,
  normalizeNumberInputBounds,
  normalizeNumberInputStep,
} from './number-input';
export type { NumberInputBounds, StepNumberInputValueOptions } from './number-input';
export {
  applyOtpBackspace,
  applyOtpInputChange,
  applyOtpPaste,
  applyOtpPasteAtIndex,
  normalizeOtpDigits,
  normalizeOtpSegments,
  resizeOtpSegments,
  toOtpSegments,
} from './otp-input';
export type {
  OtpInputBackspaceResult,
  OtpInputChangeResult,
  OtpInputPasteResult,
} from './otp-input';
export { useOtpInputState } from './otp-input/react';
export type {
  OtpInputKeyboardInput,
  OtpInputKeyboardResult,
  UseOtpInputStateOptions,
  UseOtpInputStateReturn,
} from './otp-input/react';
export { buildPaginationItems } from './pagination';
export type { BuildPaginationItemsOptions, PaginationEllipsis, PaginationItem } from './pagination';
export { useRadioGroupState } from './radio-group';
export type { UseRadioGroupStateOptions, UseRadioGroupStateReturn } from './radio-group';
export {
  clampRangeSliderThumb,
  getClosestRangeSliderThumb,
  getNextRangeSliderValue,
  getRangeSliderKeyboardAction,
  getRangeSliderPercent,
  getRangeSliderThumbBounds,
  normalizeRangeSliderValue,
  roundRangeSliderValue,
} from './range-slider';
export type {
  GetNextRangeSliderValueOptions,
  RangeSliderKeyboardAction,
  RangeSliderOptions,
  RangeSliderThumb,
  RangeSliderValue,
} from './range-slider';
export { useRangeSliderState } from './range-slider/react';
export type { UseRangeSliderStateOptions, UseRangeSliderStateReturn } from './range-slider/react';
export { MIN_SCROLL_AREA_THUMB_SIZE, calcScrollAreaThumb, useScrollArea } from './scroll-area';
export type { ScrollAreaThumbMetrics, UseScrollAreaReturn } from './scroll-area';
export { useSplitButton } from './split-button';
export type {
  SplitButtonBehaviorItem,
  UseSplitButtonOptions,
  UseSplitButtonReturn,
} from './split-button';
export {
  applyDisplayHour,
  applyMeridiem,
  buildTimeClockHourOptions,
  buildTimeUnitRange,
  clampTimeUnit,
  compareTimeParts,
  fallbackTimeParts,
  formatTimeParts,
  getTimeClockUnitValue,
  getTimeClockHourRing,
  getTimeClockHourRingFromPoint,
  getTimeClockValueAngle,
  getTimeClockValueFromPoint,
  isTimeUnavailable,
  padTimeUnit,
  parseTimeValue,
  toDisplayHour,
  toMeridiem,
} from './time';
export { useControllableTimeValue } from './time';
export type {
  TimeClockRect,
  TimeClockHourRing,
  TimeClockUnit,
  TimeConstraintOptions,
  TimeFormat,
  TimeMeridiem,
  TimeParts,
  UseControllableTimeValueOptions,
  UseControllableTimeValueReturn,
} from './time';
export { getNextToggleButtonPressed } from './toggle-button';
export {
  DEFAULT_MAX_TREE_VIEW_DATA_DEPTH,
  getTreeViewKeyboardIntent,
  prepareTreeViewData,
  prepareTreeViewDataWithMetadata,
  useTreeViewState,
} from './tree-view';
export type {
  GetTreeViewKeyboardIntentOptions,
  PreparedTreeViewData,
  TreeViewDataNode,
  TreeViewKeyboardIntent,
  UseTreeViewStateOptions,
  UseTreeViewStateReturn,
} from './tree-view';
export {
  getDuplicateWheelPickerColumnIds,
  getDuplicateWheelPickerOptionValues,
  getEnabledWheelPickerOptions,
  getNextWheelPickerOption,
  getWheelPickerSelectedOption,
  isWheelPickerColumnValueComplete,
  normalizeWheelPickerValue,
  getUnambiguousWheelPickerColumns,
} from './wheel-picker';
export type {
  WheelPickerColumn,
  WheelPickerNavigationOptions,
  WheelPickerOption,
  WheelPickerValue,
} from './wheel-picker';
export { getWheelPickerKeyboardAction, useWheelPickerState } from './wheel-picker/react';
export type {
  UseWheelPickerStateOptions,
  UseWheelPickerStateReturn,
  WheelPickerKeyboardInput,
} from './wheel-picker/react';

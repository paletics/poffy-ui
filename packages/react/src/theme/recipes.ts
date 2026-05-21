/*
 * Component Recipes Registry
 *
 * ### AI Context & Architecture
 * This file serves as the central registry for all component styles (recipes) in Poffy UI.
 * It consolidates atomic recipes and slot recipes (multi-part) for Panda CSS configuration.
 *
 * Patterns:
 * - recipes: Standard single-element components (e.g., Button, Badge).
 * - slotRecipes: Complex components with multiple internal parts (e.g., Modal, Tabs).
 */

// --- Data Display ---
import { avatarRecipe } from '../components/data-display/Avatar/Avatar.recipe';
import { avatarGroupRecipe } from '../components/data-display/AvatarGroup/AvatarGroup.recipe';
import { badgeRecipe } from '../components/data-display/Badge/Badge.recipe';
import { diffViewerRecipe } from '../components/data-display/DiffViewer/DiffViewer.recipe';
import { listRecipe } from '../components/data-display/List/List.recipe';
import { referenceRecipe } from '../components/data-display/Reference/Reference.recipe';
import { statRecipe } from '../components/data-display/Stat/Stat.recipe';
import { tableRecipe } from '../components/data-display/Table/Table.recipe';
import { tagRecipe } from '../components/data-display/Tag/Tag.recipe';

// --- Feedback ---
import { alertRecipe } from '../components/feedback/Alert/Alert.recipe';
import { circleProgressRecipe } from '../components/feedback/CircleProgress/CircleProgress.recipe';
import { spinnerRecipe } from '../components/feedback/Spinner/Spinner.recipe';
import { emptyStateRecipe } from '../components/feedback/EmptyState/EmptyState.recipe';
import { progressBarRecipe } from '../components/feedback/ProgressBar/ProgressBar.recipe';
import { puffRecipe } from '../components/feedback/Puff/Puff.recipe';
import { resultRecipe } from '../components/feedback/Result/Result.recipe';
import { skeletonRecipe } from '../components/feedback/Skeleton/Skeleton.recipe';

// --- Inputs ---
import { buttonRecipe } from '../components/inputs/Button/Button.recipe';
import { inputGroupRecipe } from '../components/inputs/InputGroup/InputGroup.recipe';
import { dateTimePickerRecipe } from '../components/inputs/DateTimePicker/DateTimePicker.recipe';
import { numberInputRecipe } from '../components/inputs/NumberInput/NumberInput.recipe';
import { buttonGroupRecipe } from '../components/inputs/ButtonGroup/ButtonGroup.recipe';
import { calendarRecipe } from '../components/inputs/Calendar/Calendar.recipe';
import { checkboxRecipe } from '../components/inputs/Checkbox/Checkbox.recipe';
import { closeButtonRecipe } from '../components/inputs/CloseButton/CloseButton.recipe';
import { comboBoxRecipe } from '../components/inputs/ComboBox/ComboBox.recipe';
import { copyButtonRecipe } from '../components/inputs/CopyButton/CopyButton.recipe';
import { directionalButtonRecipe } from '../components/inputs/DirectionalButton/DirectionalButton.recipe';
import { fileUploaderRecipe } from '../components/inputs/FileUploader/FileUploader.recipe';
import { formControlRecipe } from '../components/inputs/FormControl/FormControl.recipe';
import { iconButtonRecipe } from '../components/inputs/IconButton/IconButton.recipe';
import { inputRecipe } from '../components/inputs/Input/Input.recipe';
import { listboxSelectRecipe } from '../components/inputs/ListboxSelect/ListboxSelect.recipe';
import { multiSelectRecipe } from '../components/inputs/MultiSelect/MultiSelect.recipe';
import { otpInputRecipe } from '../components/inputs/OTPInput/OTPInput.recipe';
import { radioRecipe } from '../components/inputs/RadioGroup/Radio.recipe';
import { radioGroupRecipe } from '../components/inputs/RadioGroup/RadioGroup.recipe';
import { selectRecipe } from '../components/inputs/Select/Select.recipe';
import { sliderRecipe } from '../components/inputs/Slider/Slider.recipe';
import { splitButtonRecipe } from '../components/inputs/SplitButton/SplitButton.recipe';
import { switchRecipe } from '../components/inputs/Switch/Switch.recipe';
import { textareaRecipe } from '../components/inputs/Textarea/Textarea.recipe';
import { timeClockRecipe } from '../components/inputs/TimeClock/TimeClock.recipe';
import { timePickerRecipe } from '../components/inputs/TimePicker/TimePicker.recipe';
import { toggleButtonRecipe } from '../components/inputs/ToggleButton/ToggleButton.recipe';
import { wheelPickerRecipe } from '../components/inputs/WheelPicker/WheelPicker.recipe';

// --- Layout ---
import { aspectRatioRecipe } from '../components/layout/AspectRatio/AspectRatio.recipe';
import { boxRecipe } from '../components/layout/Box/Box.recipe';
import { centerRecipe } from '../components/layout/Center/Center.recipe';
import { containerRecipe } from '../components/layout/Container/Container.recipe';
import { dividerRecipe } from '../components/layout/Divider/Divider.recipe';
import { flexRecipe } from '../components/layout/Flex/Flex.recipe';
import { gridRecipe } from '../components/layout/Grid/Grid.recipe';
import { simpleGridRecipe } from '../components/layout/SimpleGrid/SimpleGrid.recipe';
import { stackRecipe } from '../components/layout/Stack/Stack.recipe';
import { scrollAreaRecipe } from '../components/layout/ScrollArea/ScrollArea.recipe';

// --- Navigation ---
import { breadcrumbsRecipe } from '../components/navigation/Breadcrumbs/Breadcrumbs.recipe';
import { dropdownRecipe } from '../components/navigation/Dropdown/Dropdown.recipe';
import { navbarRecipe } from '../components/navigation/Navbar/Navbar.recipe';
import { paginationRecipe } from '../components/navigation/Pagination/Pagination.recipe';
import { sidebarRecipe } from '../components/navigation/Sidebar/Sidebar.recipe';
import { stepperRecipe } from '../components/navigation/Stepper/Stepper.recipe';
import { tabsRecipe } from '../components/navigation/Tabs/Tabs.recipe';

// --- Overlay ---
import { contextMenuRecipe } from '../components/overlay/ContextMenu/ContextMenu.recipe';
import { backdropRecipe } from '../components/overlay/Backdrop/Backdrop.recipe';
import { drawerRecipe } from '../components/overlay/Drawer/Drawer.recipe';
import { modalRecipe } from '../components/overlay/Modal/Modal.recipe';
import { popoverRecipe } from '../components/overlay/Popover/Popover.recipe';
import { tooltipRecipe } from '../components/overlay/Tooltip/Tooltip.recipe';

// --- Surfaces ---
import { accordionRecipe } from '../components/surfaces/Accordion/Accordion.recipe';
import { cardRecipe } from '../components/surfaces/Card/Card.recipe';

// --- Tree View ---
import { treeViewRecipe } from '../components/tree-view/TreeView.recipe';

// --- Typography ---
import { codeRecipe } from '../components/typography/Code/Code.recipe';
import { headingRecipe } from '../components/typography/Heading/Heading.recipe';
import { linkRecipe } from '../components/typography/Link/Link.recipe';
import { textRecipe } from '../components/typography/Text/Text.recipe';

// --- Media ---
import { iconRecipe } from '../components/media/Icon/Icon.recipe';
import { imageRecipe } from '../components/media/Image/Image.recipe';
import { pictureRecipe } from '../components/media/Picture/Picture.recipe';

// --- Animations ---
import { textRevealTransitionRecipe } from '../components/animations/TextRevealTransition/TextRevealTransition.recipe';

/**
 * Standard recipes (Single-element components)
 *
 * ### Notes
 * Keys in this object are Panda recipe names. Changing them is a
 * public styling API change because generated recipe functions and static CSS
 * references depend on the names.
 *
 * ### AI Usage
 * - **DO**: Register single-root component recipes here.
 * - **DON'T**: Register slot/multipart recipes here; use `slotRecipes`.
 */
export const recipes = {
  input: inputRecipe,
  textarea: textareaRecipe,
  button: buttonRecipe,
  badge: badgeRecipe,
  iconButton: iconButtonRecipe,
  copyButton: copyButtonRecipe,
  closeButton: closeButtonRecipe,
  toggleButton: toggleButtonRecipe,
  buttonGroup: buttonGroupRecipe,
  splitButton: splitButtonRecipe,
  stackStyle: stackRecipe,
  boxStyle: boxRecipe,
  centerStyle: centerRecipe,
  containerStyle: containerRecipe,
  gridStyle: gridRecipe,
  flexStyle: flexRecipe,
  simpleGrid: simpleGridRecipe,
  dividerStyle: dividerRecipe,
  aspectRatioStyle: aspectRatioRecipe,
  text: textRecipe,
  heading: headingRecipe,
  link: linkRecipe,
  avatar: avatarRecipe,
  avatarGroup: avatarGroupRecipe,
  skeleton: skeletonRecipe,
  image: imageRecipe,
  picture: pictureRecipe,
  icon: iconRecipe,
  backdrop: backdropRecipe,
};

/**
 * Slot recipes (Multi-part components)
 *
 * ### Notes
 * Keys in this object are Panda slot recipe names. Keep them aligned
 * with generated imports from `@/styled-system/recipes` and with `staticCss`.
 *
 * ### AI Usage
 * - **DO**: Register multi-part component recipes here.
 * - **DON'T**: Rename existing keys without updating generated usage and docs.
 */
export const slotRecipes = {
  tooltip: tooltipRecipe,
  modal: modalRecipe,
  drawer: drawerRecipe,
  popover: popoverRecipe,
  progressBar: progressBarRecipe,
  circleProgress: circleProgressRecipe,
  spinner: spinnerRecipe,
  puff: puffRecipe,
  code: codeRecipe,
  calendar: calendarRecipe,
  checkbox: checkboxRecipe,
  radio: radioRecipe,
  list: listRecipe,
  reference: referenceRecipe,
  diffViewer: diffViewerRecipe,
  table: tableRecipe,
  comboBox: comboBoxRecipe,
  formControl: formControlRecipe,
  radioGroup: radioGroupRecipe,
  multiSelect: multiSelectRecipe,
  otpInput: otpInputRecipe,
  fileUploader: fileUploaderRecipe,
  listboxSelect: listboxSelectRecipe,
  select: selectRecipe,
  slider: sliderRecipe,
  switchControl: switchRecipe,
  alert: alertRecipe,
  breadcrumbs: breadcrumbsRecipe,
  navbar: navbarRecipe,
  pagination: paginationRecipe,
  sidebar: sidebarRecipe,
  stepper: stepperRecipe,
  tabs: tabsRecipe,
  tag: tagRecipe,
  stat: statRecipe,
  emptyState: emptyStateRecipe,
  result: resultRecipe,
  contextMenu: contextMenuRecipe,
  directionalButton: directionalButtonRecipe,
  numberInput: numberInputRecipe,
  inputGroup: inputGroupRecipe,
  timeClock: timeClockRecipe,
  timePicker: timePickerRecipe,
  wheelPicker: wheelPickerRecipe,
  dateTimePicker: dateTimePickerRecipe,
  scrollArea: scrollAreaRecipe,
  accordion: accordionRecipe,
  card: cardRecipe,
  dropdown: dropdownRecipe,
  treeView: treeViewRecipe,
  textRevealTransition: textRevealTransitionRecipe,
};

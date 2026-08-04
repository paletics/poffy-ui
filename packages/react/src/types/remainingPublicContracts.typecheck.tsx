import { StatArrow } from '@/components/data-display/Stat';
import { ComboBoxInput, ComboBoxItem, ComboBoxList } from '@/components/inputs/ComboBox';
import {
  Drawer,
  type ControlledDrawerProps,
  type UncontrolledDrawerProps,
} from '@/components/overlay/Drawer';
import {
  Modal,
  type ControlledModalProps,
  type UncontrolledModalProps,
} from '@/components/overlay/Modal';
import {
  Tooltip,
  type ControlledTooltipProps,
  type UncontrolledTooltipProps,
} from '@/components/overlay/Tooltip';
import { createRef, type ComponentProps } from 'react';

const validComboBoxInput = <ComboBoxInput aria-label="Search" placeholder="Search…" />;
// @ts-expect-error ComboBox.Root owns the editable value.
const comboBoxInputValue = <ComboBoxInput value="owned" />;
// @ts-expect-error ComboBox.Root owns the initial editable value.
const comboBoxInputDefaultValue = <ComboBoxInput defaultValue="owned" />;
// @ts-expect-error ComboBox.Input reports changes through ComboBox.Root.
const comboBoxInputChange = <ComboBoxInput onChange={() => undefined} />;
// @ts-expect-error ComboBox.Root owns disabled state.
const comboBoxInputDisabled = <ComboBoxInput disabled />;
// @ts-expect-error ComboBox.Root owns read-only state.
const comboBoxInputReadOnly = <ComboBoxInput readOnly />;
// @ts-expect-error ComboBox owns the input id.
const comboBoxInputId = <ComboBoxInput id="custom-input" />;
// @ts-expect-error ComboBox.Input owns the combobox role.
const comboBoxInputRole = <ComboBoxInput role="searchbox" />;
const comboBoxInputExpanded = {
  // @ts-expect-error ComboBox.Input derives expanded state from its root.
  'aria-expanded': true,
} satisfies ComponentProps<typeof ComboBoxInput>;

const validComboBoxList = <ComboBoxList data-testid="options" />;
// @ts-expect-error ComboBox owns the listbox id.
const comboBoxListId = <ComboBoxList id="custom-list" />;
// @ts-expect-error ComboBox.List owns the listbox role.
const comboBoxListRole = <ComboBoxList role="menu" />;
const comboBoxListLabelledBy = {
  // @ts-expect-error ComboBox.List is labelled by its managed input.
  'aria-labelledby': 'custom-label',
} satisfies ComponentProps<typeof ComboBoxList>;

const validComboBoxItem = <ComboBoxItem value="one" label="One" disabled />;
// @ts-expect-error Option indices are internal implementation details.
const comboBoxItemIndex = <ComboBoxItem value="one" label="One" optionIndex={0} />;
// @ts-expect-error ComboBox.Item owns its option id.
const comboBoxItemId = <ComboBoxItem value="one" label="One" id="custom-option" />;
// @ts-expect-error ComboBox.Item owns the option role.
const comboBoxItemRole = <ComboBoxItem value="one" label="One" role="menuitem" />;
const comboBoxItemSelected = {
  value: 'one',
  label: 'One',
  // @ts-expect-error ComboBox.Item derives selected state from the root.
  'aria-selected': true,
} satisfies ComponentProps<typeof ComboBoxItem>;

const spanRef = createRef<HTMLSpanElement>();
const svgRef = createRef<SVGSVGElement>();
const validDecorativeArrow = <StatArrow ref={spanRef} type="increase" />;
const validMeaningfulArrow = (
  <StatArrow ref={spanRef} decorative={false} type="decrease" aria-label="Revenue decreased" />
);
const validLabelledArrow = (
  <StatArrow ref={spanRef} decorative={false} aria-labelledby="trend-description" />
);
const validSvgArrow = (
  <StatArrow ref={svgRef} asChild decorative={false} aria-label="Revenue increased">
    <svg />
  </StatArrow>
);
// @ts-expect-error Meaningful arrows require an accessible name.
const unnamedMeaningfulArrow = <StatArrow decorative={false} />;
// @ts-expect-error Decorative arrows cannot expose an accessible name.
const namedDecorativeArrow = <StatArrow aria-label="increase" />;
// @ts-expect-error StatArrow owns its image semantics.
const statArrowRole = <StatArrow role="img" />;
const statArrowHidden = {
  // @ts-expect-error StatArrow owns its hidden state.
  'aria-hidden': false,
} satisfies ComponentProps<typeof StatArrow>;
// @ts-expect-error The default StatArrow forwards a span ref.
const wrongDefaultArrowRef = <StatArrow ref={svgRef} />;
const wrongSvgArrowRef = (
  // @ts-expect-error Slotted StatArrow forwards an SVG ref.
  <StatArrow ref={spanRef} asChild>
    <svg />
  </StatArrow>
);

const controlledModal = {
  open: true,
  onOpenChange: (_open: boolean) => undefined,
} satisfies ControlledModalProps;
const uncontrolledModal = { defaultOpen: true } satisfies UncontrolledModalProps;
<Modal {...controlledModal} />;
<Modal {...uncontrolledModal} />;
// @ts-expect-error Controlled Modal requires onOpenChange.
<Modal open />;
// @ts-expect-error Controlled Modal cannot also receive defaultOpen.
<Modal open onOpenChange={() => undefined} defaultOpen />;

const controlledDrawer = {
  open: true,
  onOpenChange: (_open: boolean) => undefined,
} satisfies ControlledDrawerProps;
const uncontrolledDrawer = { defaultOpen: true } satisfies UncontrolledDrawerProps;
<Drawer {...controlledDrawer} />;
<Drawer {...uncontrolledDrawer} />;
// @ts-expect-error Controlled Drawer requires onOpenChange.
<Drawer open />;
// @ts-expect-error Controlled Drawer cannot also receive defaultOpen.
<Drawer open onOpenChange={() => undefined} defaultOpen />;

const controlledTooltip = {
  content: 'Details',
  open: true,
  onOpenChange: (_open: boolean) => undefined,
} satisfies ControlledTooltipProps;
const uncontrolledTooltip = { content: 'Details' } satisfies UncontrolledTooltipProps;
<Tooltip {...controlledTooltip} />;
<Tooltip {...uncontrolledTooltip} />;
// @ts-expect-error Controlled Tooltip requires onOpenChange.
<Tooltip content="Details" open />;

void validComboBoxInput;
void comboBoxInputValue;
void comboBoxInputDefaultValue;
void comboBoxInputChange;
void comboBoxInputDisabled;
void comboBoxInputReadOnly;
void comboBoxInputId;
void comboBoxInputRole;
void comboBoxInputExpanded;
void validComboBoxList;
void comboBoxListId;
void comboBoxListRole;
void comboBoxListLabelledBy;
void validComboBoxItem;
void comboBoxItemIndex;
void comboBoxItemId;
void comboBoxItemRole;
void comboBoxItemSelected;
void validDecorativeArrow;
void validMeaningfulArrow;
void validLabelledArrow;
void validSvgArrow;
void unnamedMeaningfulArrow;
void namedDecorativeArrow;
void statArrowRole;
void statArrowHidden;
void wrongDefaultArrowRef;
void wrongSvgArrowRef;

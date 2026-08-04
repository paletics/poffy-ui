---
'@poffy-ui/react': minor
'@poffy-ui/system': minor
'@poffy-ui/behavior': minor
'@poffy-ui/types': minor
---

Stabilize responsive, form, overlay, motion, and accessibility contracts across the
component system.

This pre-1.0 minor release intentionally tightens several public React contracts:

- controlled click and manual Popovers now require paired `open` and
  `onOpenChange` props; untyped `open`-only usage falls back to an unfrozen
  uncontrolled initial state with a development warning;
- React and behavior Dropdown contracts now require `onOpenChange` whenever
  `open` is supplied and provide the same safe fallback for untyped callers;
- Modal, Drawer, and Tooltip publish explicit controlled and uncontrolled
  branches; untyped `open`-only usage falls back to an unfrozen uncontrolled
  initial state with a development warning; MessageModal preserves the same
  branch correlation instead of flattening Modal's union;
- AlertDialog and HoverCard adopt the same state split, while CommandMenu
  independently pairs controlled `open` and `query` values with their change
  callbacks and safely initializes untyped unpaired values;
- Collapsible publishes matching controlled and uncontrolled state branches in
  React and behavior; untyped `open`-only usage becomes an unfrozen
  uncontrolled initial state with a development warning, and delegated roots
  expose an `Element` ref instead of claiming `HTMLDivElement`;
- Accordion publishes single/multiple controlled and uncontrolled branches in
  React and behavior, uses `null` for a closed single value, and owns trigger
  button/disclosure semantics; Tabs and both TreeView state axes adopt the same
  paired-value contract; malformed value-only Tabs remain controlled and
  read-only instead of becoming an uncontrolled fallback;
- Tabs validates directly inspectable trigger/panel topology before rendering so
  duplicate values, misplaced slots, and ambiguous wrappers fail closed during
  SSR; mounted registration restores supported client-only wrappers while
  preserving server-proven IDs;
- RangeSlider, ToggleButton, MultiSelect, DatePicker, DateTimePicker,
  NumberInput, WheelPicker, Checkbox roots and groups, RadioGroup, OTPInput,
  TimeClock, and TimePicker require update callbacks for controlled values,
  reject simultaneous controlled/default values, and fail closed for malformed
  untyped controlled props;
- MultiSelect and Checkbox.Group canonicalize malformed collections, while
  time, date, range, wheel, and number inputs suppress semantic no-op callbacks
  and preserve canonical controlled-to-uncontrolled handoff;
- Checkbox.Group required validation now follows mounted, enabled,
  unambiguous checkbox inputs instead of accepting orphan or disabled selected
  values, while Pagination suppresses current-page no-op callbacks;
- open ContextMenus require a coordinate or element anchor, while closed menus may
  mount before an anchor exists;
- Calendar localization dictionaries include the unavailable-date validation message;
  Calendar also owns a fixed div root, removes duplicate multiple days, and
  orders range endpoints chronologically;
- Image requires explicit alternative text or decorative intent;
- Icon `asChild` accepts only SVG hosts;
- OTPInput uses fixed-position segment arrays for controlled and default values,
  preserves empty positions, suppresses no-op updates, and removes its ignored
  `asChild` prop;
- read-only required Switch, standalone Checkbox, and RadioGroup controls retain
  announced required semantics while native constraint validation is suspended;
- FileUploader and TreeView.Content remove their ignored `asChild` props while
  retaining fixed semantic hosts;
- Breadcrumbs, Sidebar, and ScrollArea remove ignored fixed-host `asChild`
  props, end their staged migration warnings while still consuming untyped
  removed props safely, and replace `FixedSemanticProps` with `NativeProps`;
- input-family recipe `variant` aliases move to responsive canonical
  `appearance` values, including `flushed` and supported `neo` appearances;
- NumberInput removes `type` and `role` overrides, owns fixed number/spinbutton
  semantics, and permanently enforces minimum 24 by 24 pixel stepper targets;
- composite inputs, Slider, Switch, DatePicker, DateTimePicker, RangeSlider,
  WheelPicker, ButtonGroup, Stepper, Tabs, block Code, Popover,
  and ContextMenu remove overrides and internal association props for roles and
  ARIA relationships that their runtime behavior owns; block Code also removes
  its ignored `asChild` prop while inline Code retains delegation;
- TimePicker and TimeClock remove outer-group `aria-readonly` and
  `aria-required` overrides while retaining the derived state on applicable
  descendant controls;
- Dropdown trigger, menu, and item slots own their roles, relationships,
  identities, and roving-focus state; link-like custom Dropdown and Popover
  triggers fall back to accessible native buttons and delegated state props
  cannot override disabled/focus semantics, while Dropdown labels and separators
  accept only passive native hosts;
- InputGroup.Input, Radio, and Checkbox.Input remove state, form, and sizing
  props owned by their compound roots; current Breadcrumb links and normal
  Skeleton placeholders no longer accept ignored interactive content;
- Accordion and Collapsible fail closed for duplicate trigger/content parts,
  Checkbox groups fail closed for duplicate item values, and FormLabel plus
  Checkbox.Control/Label use fixed semantic hosts;
- Modal, Drawer, and AlertDialog triggers remove caller overrides for their
  managed button, popup relationship, focus, and disabled semantics, and unsafe
  delegated hosts fall back to an accessible native button;
- overlay trigger and close controls keep native button-only form attributes on
  their default button branch; delegated hosts no longer receive them.
  AlertDialog Action and Cancel now publish host-accurate default-button and
  delegated-HTMLElement ref/event branches;
- HoverCard trigger-level `disabled` is removed because disabling hover and
  focus interactions is owned by `HoverCard`; move the prop to the root;
- ComboBox.Input, ComboBox.List, and ComboBox.Item remove root-owned native,
  ARIA, data-state, and option-index props; the list ref targets the outer
  listbox host, and delegated Input/ComboBox input children cannot override
  FormControl/model-owned state;
- ComboBox's flat facade no longer accepts compound children; advanced
  composition uses `ComboBox.Root`. Option values must be unique, ambiguous
  duplicates fail closed, and Enter keeps native form submission behavior when
  no open highlighted option can be selected. Selection and filter text now
  publish independent paired controlled/uncontrolled contracts, and a selected
  value is cleared when its option leaves the collection;
- ComboBox resets controlled and uncontrolled selection/text axes
  independently without emitting change callbacks, RadioGroup duplicate
  values fail closed from SSR onward, and ListboxSelect preserves the selected
  occurrence of duplicate native option values while keeping display,
  submission, and validity aligned after collection changes;
- RadioGroup omits its internal generated name from server markup; consumers
  that require native SSR or no-JavaScript grouping, validation, or submission
  must provide an explicit name;
- HStack and VStack remove their ignored direction prop, while EmptyState.Icon
  publishes branch-specific div/SVG ref contracts, rejects activation/focus
  props, and isolates unsafe icon subtrees from interaction;
- Spacer is a fixed decorative div, rejects `asChild`, children, focusability,
  and accessibility overrides, and always owns `aria-hidden`;
- Stack, HStack, and VStack publish separate default-div and delegated-Element
  ref branches;
- Box, Flex, Wrap, Center, Container, Grid, AspectRatio, Heading, and Text publish
  separate default-host and delegated-Element ref branches;
- SimpleGrid, Card, Alert, VisuallyHidden, InputGroup roots and slots,
  Accordion roots/items, and List icon/text slots publish matching default-host
  and delegated-Element ref branches;
- FormControl, Avatar, Skeleton, Link and Navbar links, Button,
  ButtonPrimitive, PressablePrimitive, DropdownItem, TabTrigger, and InputGroup slots publish
  host-accurate default/delegated ref and event contracts; unsupported
  delegation falls back to safe owned hosts; DropdownItem also excludes native
  form props from delegated hosts and preserves semantic `<li>` menu items;
- IconButton, DisclosureIconButton, DirectionalButtonGroup, FormHelperText,
  and FormErrorMessage publish host-accurate delegated contracts and restrict
  delegation to hosts that preserve their action, grouping, or message
  semantics; Link and Navbar links also preserve custom router `to`
  destinations without converting them to `href`;
- Reference discriminates destination anchors from passive spans, Skeleton
  delegates only to static div/output/span hosts and owns hidden/inert
  semantics, ProgressBar owns its progress role and numeric ARIA values, and
  ScrollArea moves region naming, focus, and scroll events to its viewport;
- custom Brand and Theme providers require a palette atomically, reject invalid
  runtime mutations, and use `setCustomBrand` as the sole API for activating
  custom colors;
- Button and ToggleButton rename physical `leftIcon`/`rightIcon` props to
  logical `startIcon`/`endIcon`, and fixed non-submit actions remove `type`;
- legacy visual aliases across Card, Accordion, Tabs, Sidebar, TreeView, Result,
  EmptyState, progress indicators, Skeleton, Tag, and Alert move to logical
  canonical `appearance`, `intent`, and accent values;
- exported Navbar, OTPInput, Accordion, Pagination, Stepper, Sidebar, and Avatar
  wrapper variant types now match their component contracts instead of raw
  recipe inputs;
- InputGroup removes physical Left/Right slot aliases in favor of logical
  Start/End slots, and Portal removes `scopeMotion` in favor of
  `scopeProviders`;
- Popover becomes a dialog-only primitive with focus management enabled by
  default, while Alert, DateTimePicker, EmptyState.Icon, StatArrow, and
  TreeView.Item adopt safer omitted-prop defaults; meaningful StatArrow icons
  require an accessible name and own their image semantics;
- custom DatePicker mode now renders an input-styled button with dialog
  semantics, button text for its displayed value, an `HTMLButtonElement` ref,
  localized required and invalid descriptions, and no duplicate same-day
  updates; `native={true}` retains its `HTMLInputElement` contract;
- ProgressBar custom hosts are a formal HTML flow-container forwarding
  contract rather than a staged legacy Slot path; visual label content moves
  from `children` to `label`, reserving `children` for an `asChild` host and
  publishing host-accurate ref/event branches;
- CloseButton, CopyButton, DirectionalButton, and ToggleButton publish
  host-accurate default/delegated ref and event contracts. Action-only close,
  copy, and toggle controls reject link-like delegated hosts, while
  DirectionalButton explicitly retains navigation-link delegation;
- Button, ButtonPrimitive, and DirectionalButton align their runtime delegated
  host sanitization with their public types. DirectionalButton no longer sends
  native button attributes to router-link hosts, and SidebarItem applies the
  same destination-aware anchor ownership as Link and NavbarLink;
- Collapsible moves disabled ownership to its root and publishes
  host-accurate trigger ref/event branches. Action-only button delegates strip
  native form-only props, require custom hosts to forward owned button
  semantics, and remove disabled navigation destinations;
- Slider removes `required` and `aria-required` because native range controls
  have no meaningful empty state;
- behavior pagination and calendar aliases, Dropdown's incremental disabled
  updater, the compatibility-only behavior `logic` entrypoint, ContextMenu's
  unimplemented submenu shape, its redundant `ContextMenuCombinedProps` name,
  Popover's empty `PopoverVariants` alias, and deprecated prop-type aliases are
  removed;
- Calendar defaults are discriminated by selection mode, Calendar and
  DatePicker share date-only formatting options, Code's DOM-changing variant
  is scalar, and modified DiffViewer lines require complete original and
  changed content;
- ContextMenu action labels are textual so every menuitem has a stable
  accessible name; non-text presentation belongs in the icon field;
- Table `asChild` slots only preserve matching native table elements, and header cells
  use `Table.HeaderCell` with an explicit `scope`.
- Pagination fills its parent inline size and its monolithic form keeps current,
  previous, and next navigation visible through a compact narrow-container
  presentation. Horizontal Stepper reflows its inner visual layout vertically
  when the public root is 30rem or narrower; wider layouts retain local
  horizontal scrolling. Stepper now renders its Step children inside a
  `[data-stepper-layout]` wrapper while preserving the public root ref, props,
  and layout-item sizing.
- ButtonGroup adds an explicit `wrap` option for non-connected horizontal
  groups. Connected and vertical groups treat it as a no-op, and wrapped
  full-width groups keep long actions inside their parent.
- ComboBox preserves full-width form layouts while enforcing a practical
  intrinsic minimum for shrink-to-fit roots. OTPInput, TimeClock, and
  TimePicker expose their complete repeated controls through bounded local
  overflow instead of clipping later segments.
- `core.grid@1` keeps legacy `{ columns }` documents fixed while adding bounded
  responsive and explicit fixed modes. New documents can select `sm`, `md`, or
  `lg` minimum child-width tokens without embedding arbitrary CSS.
- JsonViewer renders serialization-limit and invalid-value prose as wrapping
  messages without JSON syntax presentation. Wrapped Reference rows keep their
  marker and label together and move descriptions to a readable second row;
  constrained Tag labels prefer natural word boundaries, and Result reduces
  inline padding in narrow containers.
- Kbd now renders an internal label span so truncation produces a visible
  ellipsis and wrap mode can break key chords after `+`. Update selectors that
  relied on Kbd text being a direct child.
- The default body and heading font stacks add common Japanese system fonts and
  Noto CJK fallbacks; font files remain an application/runtime dependency. The
  browser QA surface now renders a Japanese typography sample and verifies the
  platform font that Chromium actually uses for its glyphs.
- TimeClock documents its size-preserving local overflow contract and directs
  compact forms that need a complete inline control to TimePicker's segment
  input mode.
- DiffViewer adds an explicit `captionDisclosure` for optional supporting
  context while keeping a visible identifying caption and stable table name.
  Table keeps its native caption concise and documents external Collapsible
  composition for progressive supporting details.
- Alert, MultiSelect, SearchInput, InputGroup, and CircleProgress document
  practical readable-width guidance separately from their below-minimum
  containment guarantees. Browser QA now covers representative Chromium
  forced-colors emulation, 320px reflow, and 200% root text resizing.
- Custom brand semantic variants now resolve main, contrast, interaction,
  surface, tint, border, and accent roles from the supplied light and dark
  palette instead of falling back to the built-in blue palette.
- Stepper now counts only direct `Step` children; wrap auxiliary content with
  `StepperAuxiliary`. List no longer inserts implicit `li` wrappers around
  opaque component output while retaining semantic safety wrappers for known
  invalid children, and Divider removes `asChild` in favor of its fixed `hr`.
- SearchInput owns its search-input structure and rejects InputGroup-managed
  slots. MultiSelect and WheelPicker fail closed for ambiguous duplicate
  option or column identities, and MultiSelect preserves native form submission
  when Enter has no valid selection or custom-value intent.
- `FileUploader.Root` no longer accepts the shorthand-only `helperText`; place
  helper text on `FileUploader.Zone` in compound composition. The shorthand
  `FileUploader` continues to accept `helperText` and now rejects children it
  never rendered.
- custom form controls resolve reset and form-data ownership from native
  form-associated anchors at event time, including late or replaced external
  forms and disabled fieldsets. Reset defaults are synchronized before parent
  layout effects.
- portaled ComboBox, MultiSelect, and custom DatePicker overlays close and
  reject interaction when a native fieldset disables their form anchor.
  TreeView checkbox changes are cancellable through the consumer change event.
- WheelPicker layout recentering is column-scoped, and RangeSlider reserves
  endpoint space for both its responsive thumb and focus ring.
- TimeClock and clock-mode TimePicker derive disabled interaction from native
  fieldset ancestry at event time and cancel active pointer capture when disabled.
- CommandMenu moves query, open, highlight, keyboard, and selection behavior into
  `@poffy-ui/behavior/command-menu`; shared shortcut targets now select the highest
  `globalShortcutPriority`, with stable latest-registration ownership for ties.
- ListboxSelect, RangeSlider, DatePicker, WheelPicker, OTPInput, and FileUploader
  move reusable value, selection, reconciliation, keyboard, and commit
  transactions into dedicated `@poffy-ui/behavior/*/react` entries while React
  retains DOM, geometry, focus, and native-form adapters. Their sibling feature
  utility entries remain server-safe.
- Badge, Stat, AvatarGroup, CircleProgress, Spinner, and motion wrappers publish
  host-accurate delegated ref and DOM-event contracts. Unsafe custom progress
  and avatar-group hosts are rejected.
- Puff separates public display props from provider-managed lifecycle props;
  standalone `id` once again targets the rendered DOM element.
- DirectionalButton and CodeViewer reuse materialized iterable content for
  accessibility inspection and rendering, ProgressBar reuses one label tree
  for display and measurement, and tooltip/menu/progress/status sanitizers no
  longer allow nested interactive content to bypass them through generators or
  opaque object nodes. Opaque ProgressBar label components are reduced to
  explicit passive children or omitted.
- ProgressBar and shared overflow focusability keep observer subscriptions
  stable across value and subtree updates. Viewport-fixed overlays diagnose
  custom portal roots that establish an incompatible fixed containing block.
- scoped color and animation providers resolve system media preferences from
  their explicit owner document realm, while Breadcrumbs re-reveals the current
  item after responsive/current changes without overriding a user's scroll.

It also adds provider-aware portals, constrained-width behavior, native form
integration, constraint-only validation proxies with localized required-state
descriptions, tree-scoped form reset and focus preservation, viewport-bounded
tooltips, localized accessible fallbacks, and expanded component APIs.

It also adds the `@poffy-ui/behavior/combobox`,
`@poffy-ui/behavior/json`, `@poffy-ui/behavior/multi-select`,
`@poffy-ui/behavior/tree-view`, `@poffy-ui/behavior/screen-composer` and
`@poffy-ui/react/screen-composer` public subpaths. They provide fail-closed,
ComboBox state/keyboard behavior, JSON-only screen validation, and explicit
host composition of Core, Tier, and application extensions; actions remain
host-owned.

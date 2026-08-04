const interactiveRoles = new Set([
  'button',
  'checkbox',
  'combobox',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'textbox',
  'treeitem',
]);

const activationHandlerNames = new Set([
  'onAuxClick',
  'onClick',
  'onContextMenu',
  'onDoubleClick',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onMouseDown',
  'onMouseUp',
  'onPointerDown',
  'onPointerUp',
  'onTouchEnd',
  'onTouchStart',
]);

const isActivationHandler = (name: string) => {
  const baseName = name.endsWith('Capture') ? name.slice(0, -'Capture'.length) : name;
  return activationHandlerNames.has(baseName);
};

type PassiveMessagePropsRecord = Record<string, unknown> & {
  contentEditable?: unknown;
  role?: unknown;
  tabIndex?: unknown;
};

/** Removes attributes that would turn a fallback message container into an action. */
export const getPassiveMessageProps = <Props extends Record<string, unknown>>(
  props: Props,
): Partial<Props> => {
  const safeProps: PassiveMessagePropsRecord = { ...props };

  for (const [name, value] of Object.entries(safeProps)) {
    if (isActivationHandler(name) && typeof value === 'function') delete safeProps[name];
  }

  if (safeProps.tabIndex !== undefined) delete safeProps.tabIndex;
  if (
    safeProps.contentEditable !== undefined &&
    safeProps.contentEditable !== false &&
    safeProps.contentEditable !== 'false'
  ) {
    delete safeProps.contentEditable;
  }
  if (
    typeof safeProps.role === 'string' &&
    safeProps.role
      .trim()
      .split(/\s+/)
      .some((role) => interactiveRoles.has(role))
  ) {
    delete safeProps.role;
  }

  return safeProps as Partial<Props>;
};

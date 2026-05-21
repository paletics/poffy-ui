/**
 * Panda static CSS generation matrix for recipe variant combinations.
 *
 * ### Notes
 * Panda only emits CSS for variants it can discover statically. Keep
 * this matrix in sync with public recipe variant props whenever a component
 * accepts dynamic variant names from runtime code or documentation examples.
 *
 * ### AI Usage
 * - **DO**: Add new public recipe variant axes here when components expose them as props.
 * - **DON'T**: Add component-local animation or state values that are not Panda recipe variants.
 *
 * Related APIs: `recipes`, `slotRecipes`.
 */
export const staticCss = {
  recipes: {
    button: [
      { intent: ['*'], appearance: ['*'] },
      { shape: ['*'] },
      { size: ['*'] },
      { glow: ['*'] },
      { isGrow: ['*'] },
    ],
    iconButton: [{ intent: ['*'], appearance: ['*'] }, { shape: ['*'] }, { size: ['*'] }],
    directionalButton: [
      { intent: ['*'], appearance: ['*'] },
      { shape: ['*'] },
      { size: ['*'] },
      { orientation: ['*'] },
      { connected: ['*'] },
      { direction: ['*'] },
    ],
    toggleButton: [
      { intent: ['*'] },
      { variant: ['*'] },
      { shape: ['*'] },
      { size: ['*'] },
      { pressed: ['*'] },
    ],
    splitButton: [
      { intent: ['*'] },
      { variant: ['*'] },
      { shape: ['*'] },
      { size: ['*'] },
      { isOpen: ['*'] },
    ],
    dividerStyle: [{ orientation: ['*'] }, { variant: ['*'] }],
    stackStyle: [
      { direction: ['*'] },
      { align: ['*'] },
      { justify: ['*'] },
      { gap: ['*'] },
      { wrap: ['*'] },
      { motion: ['*'] },
    ],
    flexStyle: [
      { direction: ['*'] },
      { align: ['*'] },
      { justify: ['*'] },
      { gap: ['*'] },
      { wrap: ['*'] },
    ],
    gridStyle: [{ ratio: ['*'] }, { gap: ['*'] }],
    simpleGrid: [{ columns: ['*'] }, { gap: ['*'] }],
    badge: [{ intent: ['*'] }, { size: ['*'] }, { placement: ['*'] }],
    icon: [{ size: ['*'] }],
    alert: [{ status: ['*'] }, { variant: ['*'] }, { closable: ['*'] }],
    circleProgress: [{ variant: ['*'] }, { animation: ['*'] }],
    spinner: [{ variant: ['*'] }, { animation: ['*'] }],
    puff: [{ intent: ['*'] }, { appearance: ['*'] }, { point: ['*'] }, { size: ['*'] }],
    progressBar: [
      { variant: ['*'] },
      { appearance: ['*'] },
      { shape: ['*'] },
      { pattern: ['*'] },
      { animationType: ['*'] },
      { borderType: ['*'] },
      { labelPosition: ['*'] },
    ],
    result: [{ status: ['*'] }, { appearance: ['*'] }],
    card: [{ appearance: ['*'] }, { intent: ['*'] }, { shape: ['*'] }],
    tag: [{ size: ['*'] }, { appearance: ['*'] }, { intent: ['*'] }, { shape: ['*'] }],
    closeButton: [{ size: ['*'] }, { appearance: ['*'] }, { shape: ['*'] }],
    buttonGroup: [
      { orientation: ['*'] },
      { spacing: ['*'] },
      { connected: ['*'] },
      { fullWidth: ['*'] },
    ],
    avatar: [{ size: ['*'] }, { shape: ['*'] }],
    skeleton: [{ variant: ['*'] }, { shape: ['*'] }, { animation: ['*'] }],
    stat: [{ size: ['*'] }, { type: ['*'] }, { intent: ['*'] }],
    input: [{ variant: ['*'] }, { size: ['*'] }, { error: ['*'] }],
    textarea: [{ variant: ['*'] }, { size: ['*'] }, { error: ['*'] }],
    select: [{ variant: ['*'] }, { size: ['*'] }, { error: ['*'] }],
    comboBox: [{ variant: ['*'] }, { size: ['*'] }, { error: ['*'] }],
    multiSelect: [{ variant: ['*'] }, { size: ['*'] }, { error: ['*'] }],
    numberInput: [{ variant: ['*'] }, { size: ['*'] }, { error: ['*'] }],
    otpInput: [{ appearance: ['*'] }, { size: ['*'] }],
    fileUploader: [{ appearance: ['*'] }, { intent: ['*'] }],
    switchControl: [{ size: ['*'] }, { intent: ['*'] }],
    checkbox: [{ size: ['*'] }, { intent: ['*'] }, { error: ['*'] }],
    radioGroup: [{ orientation: ['*'] }],
    slider: [{ size: ['*'] }, { intent: ['*'] }],
    timePicker: [{ size: ['*'] }],
    navbar: [{ appearance: ['*'] }, { sticky: ['*'] }, { justify: ['*'] }],
    pagination: [{ appearance: ['*'] }, { size: ['*'] }],
    sidebar: [{ appearance: ['*'] }, { collapsed: ['*'] }, { variant: ['*'] }],
    tabs: [{ size: ['*'] }, { variant: ['*'] }],
    dropdown: [{ appearance: ['*'] }, { size: ['*'] }],
    drawer: [{ appearance: ['*'] }, { placement: ['*'] }, { size: ['*'] }],
    modal: [{ appearance: ['*'] }, { size: ['*'] }, { scrollBehavior: ['*'] }],
    accordion: [{ appearance: ['*'] }],
    treeView: [{ appearance: ['*'] }],
  },
};

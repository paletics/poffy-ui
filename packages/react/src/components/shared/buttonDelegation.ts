/** Native attributes that belong to a button host rather than a delegated wrapper. */
export type NativeButtonOnlyProp =
  | 'form'
  | 'formAction'
  | 'formEncType'
  | 'formMethod'
  | 'formNoValidate'
  | 'formTarget'
  | 'name'
  | 'type'
  | 'value';

/** Removes native button ownership attributes from an `asChild` branch. */
export type DelegatedButtonHostProps<Props> = Omit<Props, NativeButtonOnlyProp>;

/**
 * Runtime counterpart to `DelegatedButtonHostProps`.
 *
 * The delegated child's own props remain untouched; only attributes supplied to
 * the polymorphic wrapper are removed before Radix Slot merges wrapper props.
 */
export const omitNativeButtonOnlyProps = <Props extends object>(
  props: Props,
): Omit<Props, NativeButtonOnlyProp> => {
  const {
    form: _form,
    formAction: _formAction,
    formEncType: _formEncType,
    formMethod: _formMethod,
    formNoValidate: _formNoValidate,
    formTarget: _formTarget,
    name: _name,
    type: _type,
    value: _value,
    ...delegatedProps
  } = props as Props & Record<NativeButtonOnlyProp, unknown>;

  return delegatedProps;
};

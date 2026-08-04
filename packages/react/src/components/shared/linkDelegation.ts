/** Native attributes that are meaningful only on an anchor host. */
export type NativeAnchorOnlyProp =
  | 'download'
  | 'href'
  | 'hrefLang'
  | 'media'
  | 'ping'
  | 'referrerPolicy'
  | 'rel'
  | 'target'
  | 'type';

/** Anchor attributes that cannot safely be supplied before a child destination is known. */
export type ChildDestinationUnsafeAnchorProp =
  | 'download'
  | 'hrefLang'
  | 'media'
  | 'ping'
  | 'referrerPolicy'
  | 'type';

type NeverProps<Keys extends PropertyKey> = Partial<Record<Keys, never>>;

/**
 * Preserves the full anchor API when the wrapper owns `href`, while requiring
 * child-derived destinations to keep host-specific attributes on the child.
 */
export type DestinationAwareAsChildProps<Props> =
  | (Omit<Props, 'href'> & { href: string })
  | (Omit<Props, 'href' | ChildDestinationUnsafeAnchorProp> & {
      href?: never;
    } & NeverProps<ChildDestinationUnsafeAnchorProp>);

/** Removes native anchor ownership attributes from a passive fallback host. */
export const omitNativeAnchorOnlyProps = <Props extends object>(
  props: Props,
): Omit<Props, NativeAnchorOnlyProp> => {
  const {
    download: _download,
    href: _href,
    hrefLang: _hrefLang,
    media: _media,
    ping: _ping,
    referrerPolicy: _referrerPolicy,
    rel: _rel,
    target: _target,
    type: _type,
    ...passiveProps
  } = props as Props & Record<NativeAnchorOnlyProp, unknown>;

  return passiveProps;
};

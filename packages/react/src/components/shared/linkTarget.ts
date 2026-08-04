const ASCII_WHITESPACE = /[\t\n\f\r ]+/;

const isBlankTarget = (target: string | undefined) => target?.toLowerCase() === '_blank';

interface DelegatedLinkChildProps {
  href?: string | null;
  to?: unknown;
}

export const resolveDelegatedLinkDestination = (
  href: string | null | undefined,
  child: { type: unknown; props: DelegatedLinkChildProps } | null,
) => {
  const effectiveHref = href ?? child?.props.href ?? undefined;
  const hasHref = effectiveHref !== undefined;
  const hasRouterDestination =
    !hasHref &&
    child !== null &&
    typeof child.type !== 'string' &&
    child.props.to !== undefined &&
    child.props.to !== null;

  return {
    effectiveHref,
    hasDestination: hasHref ? true : hasRouterDestination,
    hasHref,
  };
};

export const resolveSafeLinkRel = (target: string | undefined, rel: string | undefined) => {
  if (!isBlankTarget(target)) return rel;

  const tokens: string[] = [];
  const normalizedTokens = new Set<string>();

  for (const token of (rel ?? '').split(ASCII_WHITESPACE)) {
    if (!token) continue;

    const normalizedToken = token.toLowerCase();
    if (normalizedTokens.has(normalizedToken)) continue;

    tokens.push(token);
    normalizedTokens.add(normalizedToken);
  }

  for (const securityToken of ['noopener', 'noreferrer']) {
    if (!normalizedTokens.has(securityToken)) tokens.push(securityToken);
  }

  return tokens.join(' ');
};

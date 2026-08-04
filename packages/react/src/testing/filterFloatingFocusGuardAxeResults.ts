interface AxeViolationNodeLike {
  html: string;
}

interface AxeViolationLike<TNode extends AxeViolationNodeLike> {
  id: string;
  nodes: TNode[];
}

interface AxeResultsLike<TViolation> {
  violations: TViolation[];
}

const FLOATING_FOCUS_GUARD_ATTRIBUTE = 'data-floating-ui-focus-guard';

const isFloatingFocusGuardNode = (node: AxeViolationNodeLike) => {
  const openingTagEnd = node.html.indexOf('>');
  const openingTag = openingTagEnd >= 0 ? node.html.slice(0, openingTagEnd) : node.html;
  return (
    /^<span(?:\s|$)/i.test(openingTag) &&
    new RegExp(`\\s${FLOATING_FOCUS_GUARD_ATTRIBUTE}(?:\\s|=|$)`, 'i').test(openingTag) &&
    /\sdata-type=(?:"(?:inside|outside)"|'(?:inside|outside)')/i.test(openingTag)
  );
};

/**
 * Keeps axe strict for application controls while ignoring Floating UI's
 * intentionally unnamed Safari/VoiceOver focus sentinels.
 */
export const filterFloatingFocusGuardAxeResults = <
  TNode extends AxeViolationNodeLike,
  TViolation extends AxeViolationLike<TNode>,
  TResults extends AxeResultsLike<TViolation>,
>(
  results: TResults,
): TResults => {
  const violations = results.violations.flatMap((violation) => {
    if (violation.id !== 'aria-command-name') return [violation];

    const nodes = violation.nodes.filter((node) => !isFloatingFocusGuardNode(node));

    return nodes.length > 0 ? [{ ...violation, nodes } as TViolation] : [];
  });

  return { ...results, violations };
};

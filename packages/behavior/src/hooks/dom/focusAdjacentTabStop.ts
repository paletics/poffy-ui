import { getDeepActiveElement, type DOMTreeRoot } from './domTree';

const NATURALLY_TABBABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'audio[controls]',
  'button',
  'embed',
  'iframe',
  'input',
  'object',
  'select',
  'summary',
  'textarea',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
].join(',');

/** Options for moving focus through the composed tab sequence. */
export interface FocusAdjacentTabStopOptions {
  /** Element whose position in the document tab sequence is used as the origin. */
  origin: HTMLElement;
  /**
   * Moves to the previous tab stop instead of the next one.
   *
   * @defaultValue `false`
   */
  reverse?: boolean;
  /** Excludes a portalled surface and all of its descendants from the sequence. */
  excludeRoot?: HTMLElement | null;
}

const isDisabled = (element: HTMLElement) => element.matches(':disabled');

const isHidden = (element: HTMLElement) => {
  const visibleSummaryOwners = new Set<Element>();
  for (let current: HTMLElement | null = element; current; ) {
    if (
      current.hidden ||
      current.hasAttribute('inert') ||
      current.getAttribute('aria-hidden') === 'true'
    ) {
      return true;
    }

    if (current.tagName === 'SUMMARY' && current.parentElement?.tagName === 'DETAILS') {
      const details: HTMLElement = current.parentElement;
      const firstSummary: Element | undefined = Array.from(details.children).find(
        (child) => child.tagName === 'SUMMARY',
      );
      if (current === firstSummary) visibleSummaryOwners.add(details);
    }
    if (
      current.tagName === 'DETAILS' &&
      !current.hasAttribute('open') &&
      !visibleSummaryOwners.has(current)
    ) {
      return true;
    }

    const style = current.ownerDocument.defaultView?.getComputedStyle(current);
    if (
      style?.display === 'none' ||
      style?.visibility === 'hidden' ||
      style?.visibility === 'collapse'
    ) {
      return true;
    }

    if (current.assignedSlot) {
      current = current.assignedSlot;
      continue;
    }

    if (current.parentElement) {
      current = current.parentElement;
      continue;
    }

    const currentRoot: Node = current.getRootNode();
    const host: Element | null =
      currentRoot.nodeType === 11 && 'host' in currentRoot
        ? (currentRoot as ShadowRoot).host
        : null;
    const HTMLElementConstructor: typeof HTMLElement | undefined =
      current.ownerDocument.defaultView?.HTMLElement;
    current =
      HTMLElementConstructor && host instanceof HTMLElementConstructor
        ? (host as HTMLElement)
        : null;
  }

  return false;
};

const isBaseTabbable = (element: HTMLElement, excludeRoot?: HTMLElement | null) =>
  element.isConnected &&
  element.tabIndex >= 0 &&
  !isDisabled(element) &&
  !isHidden(element) &&
  !(excludeRoot && isComposedDescendant(excludeRoot, element));

const isRadioTabbable = (
  element: HTMLElement,
  candidates: HTMLElement[],
  excludeRoot?: HTMLElement | null,
) => {
  if (element.tagName !== 'INPUT') return true;
  const radio = element as HTMLInputElement;
  if (radio.type !== 'radio' || radio.name === '') return true;

  const group = candidates.filter((candidate) => {
    if (candidate.tagName !== 'INPUT') return false;
    const input = candidate as HTMLInputElement;
    return (
      input.type === 'radio' &&
      input.name === radio.name &&
      input.form === radio.form &&
      input.getRootNode() === radio.getRootNode() &&
      isBaseTabbable(input, excludeRoot)
    );
  }) as HTMLInputElement[];
  const checked = group.find((candidate) => candidate.checked);

  return checked ? checked === radio : group[0] === radio;
};

/**
 * Focuses the next or previous tab stop relative to an element in its owner document.
 *
 * Portalled descendants can be excluded so their physical DOM position does not
 * disturb the logical sequence around the trigger that opened them. The sequence follows positive
 * `tabindex`, skips hidden or disabled controls, treats a radio group as one stop, and traverses
 * open shadow roots and slots in composed-tree order. Returns `false` when no adjacent control can
 * receive focus; this includes a disconnected origin and either end of the sequence.
 */
export const focusAdjacentTabStop = ({
  origin,
  reverse = false,
  excludeRoot,
}: FocusAdjacentTabStopOptions): boolean => {
  const adjacent = findAdjacentTabStop(origin.ownerDocument, origin, reverse, excludeRoot);
  if (!adjacent) return false;

  adjacent.focus();
  const activeElement = getDeepActiveElement(adjacent.ownerDocument);
  if (activeElement === adjacent) return true;
  return isComposedDescendant(adjacent, activeElement);
};

const isComposedDescendant = (ancestor: Element, descendant: Element | null): boolean => {
  for (let current: Element | null = descendant; current; ) {
    if (current === ancestor) return true;
    if (current.assignedSlot) {
      current = current.assignedSlot;
      continue;
    }
    if (current.parentElement) {
      current = current.parentElement;
      continue;
    }
    const root = current.getRootNode();
    current = root.nodeType === 11 && 'host' in root ? (root as ShadowRoot).host : null;
  }
  return false;
};

interface ComposedTabSequence {
  candidates: HTMLElement[];
  elements: HTMLElement[];
}

const collectComposedTabSequence = (
  root: DOMTreeRoot,
  excludeRoot?: HTMLElement | null,
): ComposedTabSequence => {
  const elements: HTMLElement[] = [];
  interface ScopeEntry {
    candidates: HTMLElement[];
    documentIndex: number;
    tabIndex: number;
  }

  const buildScope = (scopeElements: Element[]): HTMLElement[] => {
    const entries: ScopeEntry[] = [];
    const visitElement = (element: Element) => {
      const HTMLElementConstructor = element.ownerDocument.defaultView?.HTMLElement;
      if (!HTMLElementConstructor || !(element instanceof HTMLElementConstructor)) return;
      const htmlElement = element as HTMLElement;
      const documentIndex = elements.length;
      elements.push(htmlElement);
      const tabIndexAttribute = htmlElement.getAttribute('tabindex')?.trim();
      const hasValidTabIndexAttribute =
        tabIndexAttribute !== undefined && /^[+-]?\d+$/.test(tabIndexAttribute);
      let matchesTabbableSelector = htmlElement.matches(NATURALLY_TABBABLE_SELECTOR);
      if (!matchesTabbableSelector && hasValidTabIndexAttribute) {
        matchesTabbableSelector = htmlElement.matches('[tabindex]');
      }
      const ownCandidate =
        matchesTabbableSelector && isBaseTabbable(htmlElement, excludeRoot) ? [htmlElement] : [];
      const suppressOwnedScope = hasValidTabIndexAttribute && Number(tabIndexAttribute) < 0;

      if (htmlElement.tagName === 'SLOT') {
        const slot = htmlElement as HTMLSlotElement;
        const assignedNodes = slot.assignedNodes({ flatten: true });
        const renderedElements =
          assignedNodes.length > 0
            ? assignedNodes.filter((node): node is Element => node.nodeType === 1)
            : Array.from(slot.children);
        entries.push({
          candidates: [
            ...ownCandidate,
            ...(suppressOwnedScope ? [] : buildScope(renderedElements)),
          ],
          documentIndex,
          tabIndex: htmlElement.tabIndex,
        });
        return;
      }

      if (htmlElement.shadowRoot) {
        entries.push({
          candidates: [
            ...ownCandidate,
            ...(suppressOwnedScope ? [] : buildScope(Array.from(htmlElement.shadowRoot.children))),
          ],
          documentIndex,
          tabIndex: htmlElement.tabIndex,
        });
        return;
      }

      if (ownCandidate.length > 0) {
        entries.push({
          candidates: ownCandidate,
          documentIndex,
          tabIndex: htmlElement.tabIndex,
        });
      }
      Array.from(htmlElement.children).forEach(visitElement);
    };

    scopeElements.forEach(visitElement);
    return entries
      .sort((left, right) => {
        const leftOrder = left.tabIndex > 0 ? left.tabIndex : Number.MAX_VALUE;
        const rightOrder = right.tabIndex > 0 ? right.tabIndex : Number.MAX_VALUE;
        const orderDifference = leftOrder - rightOrder;
        return orderDifference !== 0 ? orderDifference : left.documentIndex - right.documentIndex;
      })
      .flatMap((entry) => entry.candidates);
  };

  const candidates = buildScope(Array.from(root.children));
  return { candidates, elements };
};

const findAdjacentTabStop = (
  root: DOMTreeRoot,
  origin: Element,
  reverse: boolean,
  excludeRoot?: HTMLElement | null,
): HTMLElement | undefined => {
  const { candidates: unfilteredCandidates, elements: composedElements } =
    collectComposedTabSequence(root, excludeRoot);
  const candidates = unfilteredCandidates.filter((candidate) =>
    isRadioTabbable(candidate, unfilteredCandidates, excludeRoot),
  );
  const candidateEntries = candidates.map((candidate) => ({
    candidate,
    documentIndex: composedElements.indexOf(candidate),
  }));
  const originIndex = candidates.findIndex((candidate) => candidate === origin);
  let adjacent = originIndex < 0 ? undefined : candidates[originIndex + (reverse ? -1 : 1)];

  // A logical trigger may deliberately use tabIndex=-1 while its portalled
  // surface is open. It is absent from the tab sequence in that state, but its
  // DOM position still defines where focus should leave the surface.
  if (!adjacent && originIndex < 0 && origin.isConnected) {
    const originDocumentIndex = composedElements.indexOf(origin as HTMLElement);
    if (originDocumentIndex >= 0) {
      const entriesInDocumentOrder = [...candidateEntries].sort(
        (left, right) => left.documentIndex - right.documentIndex,
      );
      adjacent = reverse
        ? entriesInDocumentOrder
            .reverse()
            .find((entry) => entry.documentIndex < originDocumentIndex)?.candidate
        : entriesInDocumentOrder.find((entry) => entry.documentIndex > originDocumentIndex)
            ?.candidate;
    }
  }

  if (!adjacent && originIndex < 0 && origin.isConnected) {
    const precedingOrFollowing = candidateEntries.filter(({ candidate }) => {
      const relation = origin.compareDocumentPosition(candidate);
      const NodeConstructor = origin.ownerDocument.defaultView?.Node;
      if (!NodeConstructor) return false;
      return reverse
        ? Boolean(relation & NodeConstructor.DOCUMENT_POSITION_PRECEDING)
        : Boolean(relation & NodeConstructor.DOCUMENT_POSITION_FOLLOWING);
    });
    adjacent = reverse
      ? precedingOrFollowing[precedingOrFollowing.length - 1]?.candidate
      : precedingOrFollowing[0]?.candidate;
  }

  return adjacent;
};

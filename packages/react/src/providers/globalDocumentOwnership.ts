/** Opaque registration handle whose creation order determines last-owner precedence. */
interface GlobalDocumentOwner {
  id: symbol;
  order: number;
}

/**
 * Internal document-scoped ownership coordinator for one global provider concern.
 *
 * A stack isolates owners by `Document`, applies the effective state while any owner remains, and
 * restores the original document snapshot after the final owner unregisters.
 */
export interface GlobalDocumentOwnerStack<TState> {
  createOwner: () => GlobalDocumentOwner;
  register: (targetDocument: Document, owner: GlobalDocumentOwner, state: TState) => void;
  update: (targetDocument: Document, owner: GlobalDocumentOwner, state: TState) => void;
  unregister: (targetDocument: Document, owner: GlobalDocumentOwner) => void;
}

/**
 * Adapters for capturing, applying, and restoring one document-level concern.
 *
 * `resolveState` is used when concurrently mounted owners compose instead of
 * selecting only the newest owner; `captureAdditional` preserves host values
 * for keys first introduced by a later owner.
 */
interface GlobalDocumentOwnerStackOptions<TState, TSnapshot> {
  capture: (targetDocument: Document) => TSnapshot;
  apply: (targetDocument: Document, state: TState, snapshot: TSnapshot) => void;
  restore: (targetDocument: Document, snapshot: TSnapshot) => void;
  /** Resolves the effective state when independent owners should compose. */
  resolveState?: (owners: readonly { order: number; state: TState }[]) => TState;
  /**
   * Extends the initial snapshot with state that is introduced after the first
   * owner registers. This is useful for dynamic CSS variable key sets.
   */
  captureAdditional?: (
    targetDocument: Document,
    snapshot: TSnapshot,
    states: readonly TState[],
  ) => TSnapshot;
  onActiveChange?: (targetDocument: Document, state: TState) => void;
}

interface PerDocumentOwners<TState, TSnapshot> {
  owners: Map<symbol, { order: number; state: TState }>;
  initialSnapshot?: TSnapshot;
  hasInitialSnapshot: boolean;
}

/** Coordinates a document-level concern independently for every Document realm. */
export const createGlobalDocumentOwnerStack = <TState, TSnapshot>(
  options: GlobalDocumentOwnerStackOptions<TState, TSnapshot>,
): GlobalDocumentOwnerStack<TState> => {
  const documents = new WeakMap<Document, PerDocumentOwners<TState, TSnapshot>>();
  let nextOrder = 0;

  const getDocumentOwners = (targetDocument: Document) => {
    const existing = documents.get(targetDocument);
    if (existing) return existing;
    const created: PerDocumentOwners<TState, TSnapshot> = {
      owners: new Map(),
      hasInitialSnapshot: false,
    };
    documents.set(targetDocument, created);
    return created;
  };

  const synchronize = (
    targetDocument: Document,
    documentOwners: PerDocumentOwners<TState, TSnapshot>,
  ) => {
    const owners = [...documentOwners.owners.values()];
    const active = owners.reduce<{ order: number; state: TState } | undefined>(
      (latest, entry) => (!latest || entry.order > latest.order ? entry : latest),
      undefined,
    );
    if (!active) {
      if (documentOwners.hasInitialSnapshot) {
        options.restore(targetDocument, documentOwners.initialSnapshot as TSnapshot);
        documentOwners.initialSnapshot = undefined;
        documentOwners.hasInitialSnapshot = false;
      }
      documents.delete(targetDocument);
      return;
    }
    if (documentOwners.hasInitialSnapshot && options.captureAdditional) {
      documentOwners.initialSnapshot = options.captureAdditional(
        targetDocument,
        documentOwners.initialSnapshot as TSnapshot,
        owners.map((entry) => entry.state),
      );
    }
    const state = options.resolveState ? options.resolveState(owners) : active.state;
    options.apply(targetDocument, state, documentOwners.initialSnapshot as TSnapshot);
    options.onActiveChange?.(targetDocument, state);
  };

  return {
    createOwner: () => ({ id: Symbol('poffy-global-owner'), order: nextOrder++ }),
    register: (targetDocument, owner, state) => {
      const documentOwners = getDocumentOwners(targetDocument);
      if (documentOwners.owners.size === 0) {
        documentOwners.initialSnapshot = options.capture(targetDocument);
        documentOwners.hasInitialSnapshot = true;
      }
      documentOwners.owners.set(owner.id, { order: owner.order, state });
      synchronize(targetDocument, documentOwners);
    },
    update: (targetDocument, owner, state) => {
      const documentOwners = documents.get(targetDocument);
      const existing = documentOwners?.owners.get(owner.id);
      if (!documentOwners || !existing) return;
      documentOwners.owners.set(owner.id, { ...existing, state });
      synchronize(targetDocument, documentOwners);
    },
    unregister: (targetDocument, owner) => {
      const documentOwners = documents.get(targetDocument);
      if (!documentOwners) return;
      documentOwners.owners.delete(owner.id);
      synchronize(targetDocument, documentOwners);
    },
  };
};

/** Opaque internal owner token passed only to a matching GlobalDocumentOwnerStack. */
export type { GlobalDocumentOwner };

interface RuntimeEnv {
  process?: { env?: Record<string, string | undefined> };
}

/** Current shortcut eligibility and callback for one command-menu owner. */
export interface CommandMenuShortcutRegistration {
  /** Whether this owner can receive a Ctrl/Cmd+K shortcut. */
  enabled: boolean;
  /** Higher finite values win; non-finite values resolve to `0`. */
  priority: number;
  /** Called synchronously after the registry claims the shortcut. */
  requestOpen: () => void;
}

interface ShortcutOwner {
  getRegistration: () => CommandMenuShortcutRegistration;
  order: number;
}

interface ShortcutRegistry {
  listener: EventListener;
  owners: Map<object, ShortcutOwner>;
  warnedCollision: string | null;
}

const registries = new WeakMap<EventTarget, ShortcutRegistry>();
let nextRegistrationOrder = 0;

const isShortcutEvent = (event: KeyboardEvent) =>
  !event.defaultPrevented &&
  !event.isComposing &&
  event.keyCode !== 229 &&
  event.key.toLowerCase() === 'k' &&
  (event.metaKey ? true : event.ctrlKey);

const getPriority = (registration: CommandMenuShortcutRegistration) =>
  Number.isFinite(registration.priority) ? registration.priority : 0;

/**
 * Registers a Ctrl/Cmd+K owner on an event target.
 *
 * The highest enabled finite priority wins; ties resolve to the latest registration and emit a
 * development warning. Already-prevented events and IME composition events are ignored. The
 * returned cleanup is safe after a same-token registration has been replaced and removes the
 * shared listener after its last owner unregisters.
 *
 * @param target Event target on which one shared `keydown` listener is installed.
 * @param token Stable owner identity; registering it again replaces its callback without changing
 * tie-break order.
 * @param getRegistration Reads the current eligibility, priority, and open callback at key time.
 */
export const registerCommandMenuShortcut = (
  target: EventTarget,
  token: object,
  getRegistration: () => CommandMenuShortcutRegistration,
) => {
  let registry = registries.get(target);
  if (!registry) {
    const owners = new Map<object, ShortcutOwner>();
    const nextRegistry: ShortcutRegistry = {
      listener: () => undefined,
      owners,
      warnedCollision: null,
    };
    const listener: EventListener = (rawEvent) => {
      const event = rawEvent as KeyboardEvent;
      if (!isShortcutEvent(event)) return;
      const candidates = [...owners.values()]
        .map((owner) => ({ ...owner, registration: owner.getRegistration() }))
        .filter(({ registration }) => registration.enabled);
      if (candidates.length === 0) return;
      const highestPriority = Math.max(
        ...candidates.map(({ registration }) => getPriority(registration)),
      );
      const winners = candidates.filter(
        ({ registration }) => getPriority(registration) === highestPriority,
      );
      const collisionSignature = winners.map(({ order }) => order).join(':');
      if (
        winners.length > 1 &&
        nextRegistry.warnedCollision !== collisionSignature &&
        (globalThis as RuntimeEnv).process?.env?.['NODE_ENV'] !== 'production'
      ) {
        nextRegistry.warnedCollision = collisionSignature;
        console.warn(
          '[CommandMenu] Multiple global shortcuts share a target and priority; the latest registered menu owns the shortcut.',
        );
      }
      const winner = winners.reduce((latest, candidate) =>
        candidate.order > latest.order ? candidate : latest,
      );
      event.preventDefault();
      winner.registration.requestOpen();
    };
    nextRegistry.listener = listener;
    registry = nextRegistry;
    registries.set(target, registry);
    target.addEventListener('keydown', listener);
  }

  const existing = registry.owners.get(token);
  const owner = {
    getRegistration,
    order: existing?.order ?? ++nextRegistrationOrder,
  };
  registry.owners.set(token, owner);

  return () => {
    const currentRegistry = registries.get(target);
    if (!currentRegistry) return;
    if (currentRegistry.owners.get(token) !== owner) return;
    currentRegistry.owners.delete(token);
    currentRegistry.warnedCollision = null;
    if (currentRegistry.owners.size > 0) return;
    target.removeEventListener('keydown', currentRegistry.listener);
    registries.delete(target);
  };
};

import { createContext, createElement, useContext } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createGlobalDocumentOwnerStack } from './globalDocumentOwnership';
import { useGlobalDocumentOwner } from './useGlobalDocumentOwner';

/**
 * Runtime values for Poffy-scoped CSS custom properties.
 *
 * This API does not register Panda tokens. Add application-specific tokens
 * through Panda's build-time `theme.extend` when generated utilities and
 * types must discover them.
 */
export type ThemeTokenOverrides = Readonly<Record<`--poffy-${string}`, string>>;

type StyleVariableSnapshot = {
  value: string;
  priority: string;
};

type TokenOverrideSnapshot = Record<string, StyleVariableSnapshot>;

type ThemeTokenOverrideStyle = CSSProperties & Record<`--poffy-${string}`, string>;

const CUSTOM_BRAND_VARIABLE_PREFIX = '--poffy-custom-';

const restoreVariable = (
  element: HTMLElement,
  variable: string,
  snapshot: StyleVariableSnapshot,
) => {
  if (snapshot.value) element.style.setProperty(variable, snapshot.value, snapshot.priority);
  else element.style.removeProperty(variable);
};

/** Removes invalid and brand-reserved variables before they reach the DOM. */
export const normalizeThemeTokenOverrides = (
  overrides: ThemeTokenOverrides | undefined,
): ThemeTokenOverrides => {
  if (!overrides) return {};
  return Object.fromEntries(
    Object.entries(overrides).filter(
      ([variable, value]) =>
        variable.startsWith('--poffy-') &&
        !variable.startsWith(CUSTOM_BRAND_VARIABLE_PREFIX) &&
        typeof value === 'string',
    ),
  ) as ThemeTokenOverrides;
};

/** Produces the inline custom-property style used by local ThemeBoundary scopes. */
export const getThemeTokenOverrideStyle = (
  overrides: ThemeTokenOverrides,
): ThemeTokenOverrideStyle => overrides as ThemeTokenOverrideStyle;

const ThemeTokenOverrideContext = createContext<ThemeTokenOverrides>({});

/** Makes runtime CSS variable overrides available to portalled Poffy content. */
export const ThemeTokenOverrideProvider = ({
  children,
  overrides,
}: {
  children: ReactNode;
  overrides: ThemeTokenOverrides;
}) => createElement(ThemeTokenOverrideContext.Provider, { value: overrides }, children);

/** Returns the nearest boundary's resolved runtime CSS variable overrides. */
export const useThemeTokenOverrides = (): ThemeTokenOverrides =>
  useContext(ThemeTokenOverrideContext);

const tokenOverrideOwnerStack = createGlobalDocumentOwnerStack<
  ThemeTokenOverrides,
  TokenOverrideSnapshot
>({
  capture: () => ({}),
  resolveState: (owners) =>
    Object.assign(
      {},
      ...[...owners]
        .sort((first, second) => first.order - second.order)
        .map((owner) => owner.state),
    ) as ThemeTokenOverrides,
  captureAdditional: (targetDocument, snapshot, states) => {
    const element = targetDocument.documentElement;
    const variables = new Set(states.flatMap((state) => Object.keys(state)));
    const nextSnapshot = { ...snapshot };
    for (const variable of variables) {
      if (nextSnapshot[variable]) continue;
      nextSnapshot[variable] = {
        value: element.style.getPropertyValue(variable),
        priority: element.style.getPropertyPriority(variable),
      };
    }
    return nextSnapshot;
  },
  apply: (targetDocument, overrides, snapshot) => {
    const element = targetDocument.documentElement;
    for (const [variable, original] of Object.entries(snapshot)) {
      const value = overrides[variable as `--poffy-${string}`];
      if (value === undefined) restoreVariable(element, variable, original);
      else element.style.setProperty(variable, value);
    }
  },
  restore: (targetDocument, snapshot) => {
    const element = targetDocument.documentElement;
    for (const [variable, original] of Object.entries(snapshot)) {
      restoreVariable(element, variable, original);
    }
  },
});

/** Synchronizes root-level token overrides while preserving other provider owners and host styles. */
export const useGlobalThemeTokenOverrides = (
  overrides: ThemeTokenOverrides,
  enabled: boolean,
  ownerDocument?: Document,
) => {
  useGlobalDocumentOwner(tokenOverrideOwnerStack, overrides, enabled, ownerDocument);
};

'use client';

import { cx } from '@/styled-system/css';
import { tabs } from '@/styled-system/recipes';
import {
  getDeepActiveElement,
  getDOMTreeRoot,
  useControllableState,
} from '@poffy-ui/behavior/hooks';
import { LayoutGroup } from 'motion/react';
import {
  Children,
  Fragment,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { RegisteredTabContent, RegisteredTabTrigger, TabsProps } from './Tabs.types';
import { TabsContext } from './TabsContext';
import { useOptionalDirection } from '@/providers/DirectionProvider';
import {
  buildServerTabAssociations,
  buildTabAssociations,
  preserveServerTabAssociationIds,
} from './tabAssociations';
import { TabContent } from './TabContent';
import { TabList } from './TabList';
import { TabTrigger } from './TabTrigger';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface RuntimeEnv {
  process?: { env?: { NODE_ENV?: string } };
}

/** @internal Builds the conservative server-visible Tabs topology. */
export const inspectTabStructure = (children: ReactNode) => {
  const triggers: { value: string; disabled: boolean }[] = [];
  const contentValues: string[] = [];
  let hasOpaqueSlots = false;
  let invalidPlacement = false;
  let tabListCount = 0;

  const visit = (node: ReactNode, insideTabList: boolean): void => {
    Children.forEach(node, (child) => {
      if (!isValidElement<{ children?: ReactNode; disabled?: unknown; value?: unknown }>(child)) {
        if (child !== null && typeof child === 'object') hasOpaqueSlots = true;
        return;
      }

      if (child.type === TabTrigger) {
        if (!insideTabList) invalidPlacement = true;
        if (typeof child.props.value === 'string') {
          triggers.push({
            value: child.props.value,
            disabled: child.props.disabled === true,
          });
        } else hasOpaqueSlots = true;
        return;
      }
      if (child.type === TabContent) {
        if (insideTabList) invalidPlacement = true;
        if (typeof child.props.value === 'string') contentValues.push(child.props.value);
        else hasOpaqueSlots = true;
        return;
      }

      if (child.type === TabList) {
        tabListCount += 1;
        if (insideTabList) invalidPlacement = true;
        visit(child.props.children, true);
        return;
      }
      if (child.type === Fragment || typeof child.type === 'string') {
        visit(child.props.children, insideTabList);
        return;
      }

      // A component wrapper may hide tabs that cannot be known during SSR.
      hasOpaqueSlots = true;
    });
  };

  visit(children, false);
  if (tabListCount !== 1) invalidPlacement = true;
  return { triggers, contentValues, hasOpaqueSlots, invalidPlacement };
};

/**
 * Organizes peer views with the WAI-ARIA Tabs pattern. Every TabTrigger value needs matching
 * TabContent; supply `value` and `onValueChange` when routing or URL state owns selection.
 *
 * Arrow keys, Home, and End move focus among enabled triggers without selecting them; activation
 * occurs through each trigger. Invalid or removed uncontrolled selections resolve to the first
 * enabled tab. `asChild` is unavailable because Tabs owns the root and compound relationships.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
  const {
    children,
    defaultValue,
    value: controlledValue,
    onValueChange,
    appearance = 'ghost',
    size,
    orientation = 'horizontal',
    lazyMount,
    indicatorAnimation = 'stable',
    className,
    dir,
    asChild: _unsupportedAsChild,
    ...rest
  } = props as TabsProps & { asChild?: boolean };
  const { variant: _unsupportedVariant, ...safeRest } = rest as typeof rest & {
    variant?: unknown;
  };
  const providerDirection = useOptionalDirection()?.dir;
  const resolvedDirection = dir ?? providerDirection;

  const triggerRegistry = useRef(new Map<string, RegisteredTabTrigger>());
  const contentRegistry = useRef(new Map<string, RegisteredTabContent>());
  const focusedTriggerIdRef = useRef<string | undefined>(undefined);
  const hasResolvedSelectionRef = useRef(false);
  const lastInvalidControlledResolution = useRef<
    { fallbackValue: string; requestedValue: string } | undefined
  >(undefined);
  const [registeredTriggers, setRegisteredTriggers] = useState<RegisteredTabTrigger[]>([]);
  const [registeredContents, setRegisteredContents] = useState<RegisteredTabContent[]>([]);
  const tabRelationshipBaseId = useId();
  // Inspect and render the same recursively materialized tree. This covers nested
  // single-use iterables while allowing mutable reusable iterables to update.
  const materializedChildren = materializeReactNodeTree(children);
  const serverTabStructure = useMemo(
    () => inspectTabStructure(materializedChildren),
    [materializedChildren],
  );
  const serverTabAssociations = useMemo(
    () => buildServerTabAssociations(tabRelationshipBaseId, serverTabStructure),
    [serverTabStructure, tabRelationshipBaseId],
  );
  const runtimeTabAssociations = useMemo(
    () => buildTabAssociations(registeredTriggers, registeredContents),
    [registeredContents, registeredTriggers],
  );
  const tabAssociations = useMemo(
    () => preserveServerTabAssociationIds(runtimeTabAssociations, serverTabAssociations),
    [runtimeTabAssociations, serverTabAssociations],
  );
  const getTabAssociation = useCallback(
    (tabValue: string) =>
      tabAssociations.get(tabValue) ??
      serverTabAssociations.get(tabValue) ?? {
        hasMatchingTrigger: false,
        hasMatchingPanel: false,
        invalid: serverTabStructure.hasOpaqueSlots,
      },
    [serverTabAssociations, serverTabStructure.hasOpaqueSlots, tabAssociations],
  );
  const enabledTriggers = useMemo(
    () =>
      registeredTriggers
        .filter(
          (trigger) =>
            !trigger.disabled &&
            !tabAssociations.get(trigger.value)?.invalid &&
            trigger.node.isConnected,
        )
        .sort((a, b) =>
          a.node.compareDocumentPosition(b.node) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
        ),
    [registeredTriggers, tabAssociations],
  );
  const resolvedOnValueChange = typeof onValueChange === 'function' ? onValueChange : undefined;
  const hasControlledPair = controlledValue !== undefined && resolvedOnValueChange !== undefined;
  const isControlled = controlledValue !== undefined;
  const canResolveStaticSelection =
    !serverTabStructure.hasOpaqueSlots && !serverTabStructure.invalidPlacement;
  const staticEnabledValues = canResolveStaticSelection
    ? serverTabStructure.triggers
        .filter(
          (trigger) => !trigger.disabled && !serverTabAssociations.get(trigger.value)?.invalid,
        )
        .map((trigger) => trigger.value)
    : [];
  const resolveStaticValue = (requestedValue: string | undefined) =>
    requestedValue && staticEnabledValues.includes(requestedValue)
      ? requestedValue
      : (staticEnabledValues[0] ?? '');
  const hasMountedTriggerTopology = registeredTriggers.length > 0;
  const controlledValueIsEnabled = enabledTriggers.some(
    (trigger) => trigger.value === controlledValue,
  );
  const resolvedControlledValue =
    isControlled && hasMountedTriggerTopology
      ? controlledValueIsEnabled
        ? controlledValue
        : (enabledTriggers[0]?.value ?? '')
      : isControlled && canResolveStaticSelection
        ? resolveStaticValue(controlledValue)
        : controlledValue;
  const { value, setValue: setStateValue } = useControllableState({
    value: isControlled ? (resolvedControlledValue ?? '') : undefined,
    defaultValue: canResolveStaticSelection
      ? resolveStaticValue(defaultValue)
      : (defaultValue ?? ''),
  });
  const indicatorId = useId();
  const resolvedVariant: 'line' | 'enclosed' | 'pill' =
    appearance === 'soft' ? 'pill' : appearance === 'outline' ? 'enclosed' : 'line';

  const setValue = useCallback(
    (newValue: string) => {
      setStateValue(newValue);
      resolvedOnValueChange?.(newValue);
    },
    [resolvedOnValueChange, setStateValue],
  );

  useEffect(() => {
    if (controlledValue === undefined || hasControlledPair) return;
    const nodeEnv = (globalThis as RuntimeEnv).process?.env?.NODE_ENV;
    if (nodeEnv === 'production') return;
    console.warn(
      '[Tabs] controlled `value` requires a callable `onValueChange`; the supplied value remains read-only.',
    );
  }, [controlledValue, hasControlledPair]);

  const registerTrigger = useCallback((trigger: RegisteredTabTrigger) => {
    triggerRegistry.current.set(trigger.registrationKey, trigger);
    setRegisteredTriggers(Array.from(triggerRegistry.current.values()));

    return () => {
      if (triggerRegistry.current.get(trigger.registrationKey) !== trigger) return;
      triggerRegistry.current.delete(trigger.registrationKey);
      setRegisteredTriggers(Array.from(triggerRegistry.current.values()));
    };
  }, []);

  const registerContent = useCallback((content: RegisteredTabContent) => {
    contentRegistry.current.set(content.registrationKey, content);
    setRegisteredContents(Array.from(contentRegistry.current.values()));

    return () => {
      if (contentRegistry.current.get(content.registrationKey) !== content) return;
      contentRegistry.current.delete(content.registrationKey);
      setRegisteredContents(Array.from(contentRegistry.current.values()));
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (isControlled) {
      if (enabledTriggers.some((trigger) => trigger.value === value)) {
        hasResolvedSelectionRef.current = true;
      }
      return;
    }

    if (enabledTriggers.length === 0) return;
    if (enabledTriggers.some((trigger) => trigger.value === value)) {
      hasResolvedSelectionRef.current = true;
      return;
    }

    const fallbackValue = enabledTriggers[0].value;
    const shouldNotify = hasResolvedSelectionRef.current;
    hasResolvedSelectionRef.current = true;
    setStateValue(fallbackValue);
    if (shouldNotify) resolvedOnValueChange?.(fallbackValue);
  }, [enabledTriggers, isControlled, resolvedOnValueChange, setStateValue, value]);

  useIsomorphicLayoutEffect(() => {
    const triggerNode = enabledTriggers[0]?.node;
    const ownerDocument = triggerNode?.ownerDocument;
    const treeActiveElement = triggerNode
      ? getDeepActiveElement(getDOMTreeRoot(triggerNode))
      : null;
    const documentActiveElement = ownerDocument ? getDeepActiveElement(ownerDocument) : null;
    const activeElement = treeActiveElement ?? documentActiveElement;
    const focusedTrigger = Array.from(triggerRegistry.current.values()).find(
      (trigger) => trigger.node === activeElement,
    );
    if (focusedTrigger) {
      focusedTriggerIdRef.current = focusedTrigger.registrationKey;
    } else if (activeElement && activeElement !== ownerDocument?.body) {
      focusedTriggerIdRef.current = undefined;
    }

    const focusedTriggerId = focusedTriggerIdRef.current;
    if (!focusedTriggerId) return;
    const registeredTrigger = triggerRegistry.current.get(focusedTriggerId);
    if (
      registeredTrigger &&
      !registeredTrigger.disabled &&
      !tabAssociations.get(registeredTrigger.value)?.invalid &&
      registeredTrigger.node.isConnected
    )
      return;

    const fallbackTrigger =
      enabledTriggers.find((trigger) => trigger.value === value) ?? enabledTriggers[0];
    if (!fallbackTrigger) return;

    fallbackTrigger.node.focus();
    focusedTriggerIdRef.current = fallbackTrigger.registrationKey;
  }, [enabledTriggers, tabAssociations, value]);

  useEffect(() => {
    if (!hasControlledPair) {
      lastInvalidControlledResolution.current = undefined;
      return;
    }

    const fallbackValue = enabledTriggers[0]?.value;
    if (controlledValue === undefined || controlledValueIsEnabled || fallbackValue === undefined) {
      if (controlledValue === undefined || controlledValueIsEnabled) {
        lastInvalidControlledResolution.current = undefined;
      }
      return;
    }

    const previousResolution = lastInvalidControlledResolution.current;
    if (
      previousResolution?.requestedValue === controlledValue &&
      previousResolution.fallbackValue === fallbackValue
    ) {
      return;
    }

    lastInvalidControlledResolution.current = {
      fallbackValue,
      requestedValue: controlledValue,
    };
    resolvedOnValueChange?.(fallbackValue);
  }, [
    controlledValue,
    controlledValueIsEnabled,
    enabledTriggers,
    hasControlledPair,
    resolvedOnValueChange,
  ]);

  useEffect(() => {
    const nodeEnv = (globalThis as RuntimeEnv).process?.env?.NODE_ENV;
    if (nodeEnv === undefined || nodeEnv === 'production') return;

    const triggerValues = registeredTriggers.map((trigger) => trigger.value);
    if (new Set(triggerValues).size !== triggerValues.length) {
      console.warn(
        '[Tabs] TabTrigger values must be unique within a Tabs instance. Duplicate values produce ambiguous tab and panel relationships.',
      );
    }
    const contentValues = registeredContents.map((content) => content.value);
    if (new Set(contentValues).size !== contentValues.length) {
      console.warn(
        '[Tabs] TabContent values must be unique within a Tabs instance. Duplicate values produce ambiguous tab and panel relationships.',
      );
    }
  }, [registeredContents, registeredTriggers]);

  const classes = useMemo(
    () => tabs({ variant: resolvedVariant, size, orientation }),
    [orientation, resolvedVariant, size],
  );
  const contextValue = useMemo(
    () => ({
      value,
      setValue,
      classes,
      lazyMount,
      variant: resolvedVariant,
      indicatorId,
      indicatorAnimation,
      orientation,
      registerTrigger,
      registerContent,
      getTabAssociation,
    }),
    [
      value,
      classes,
      lazyMount,
      setValue,
      resolvedVariant,
      indicatorId,
      indicatorAnimation,
      orientation,
      registerContent,
      registerTrigger,
      getTabAssociation,
    ],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <LayoutGroup id={indicatorId}>
        <div
          ref={ref}
          className={cx(classes.root, className)}
          {...safeRest}
          data-orientation={orientation}
          dir={resolvedDirection}
        >
          {materializedChildren}
        </div>
      </LayoutGroup>
    </TabsContext.Provider>
  );
});

Tabs.displayName = 'Tabs';

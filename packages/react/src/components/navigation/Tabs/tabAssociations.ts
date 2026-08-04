import type { RegisteredTabContent, RegisteredTabTrigger, TabAssociation } from './Tabs.types';

/** Builds unambiguous mounted trigger/panel relationships by public tab value. */
export const buildTabAssociations = (
  triggers: readonly RegisteredTabTrigger[],
  contents: readonly RegisteredTabContent[],
): Map<string, TabAssociation> => {
  const triggersByValue = new Map<string, RegisteredTabTrigger[]>();
  const contentsByValue = new Map<string, RegisteredTabContent[]>();
  for (const trigger of triggers) {
    triggersByValue.set(trigger.value, [...(triggersByValue.get(trigger.value) ?? []), trigger]);
  }
  for (const content of contents) {
    contentsByValue.set(content.value, [...(contentsByValue.get(content.value) ?? []), content]);
  }

  const associations = new Map<string, TabAssociation>();
  const values = new Set([...triggersByValue.keys(), ...contentsByValue.keys()]);
  for (const value of values) {
    const valueTriggers = triggersByValue.get(value) ?? [];
    const valueContents = contentsByValue.get(value) ?? [];
    const invalid = [valueTriggers.length > 1, valueContents.length > 1].some(Boolean);
    associations.set(value, {
      triggerId: invalid ? undefined : valueTriggers[0]?.domId,
      panelId: invalid ? undefined : valueContents[0]?.domId,
      hasMatchingTrigger: !invalid && valueTriggers.length === 1,
      hasMatchingPanel: !invalid && valueContents.length === 1,
      invalid,
    });
  }
  return associations;
};

/**
 * Supplies stable server-rendered relationships before mounted registries exist.
 *
 * Direct, validated slots retain these IDs after registration. Opaque
 * compatibility slots use their own mounted IDs instead.
 */
export const getServerTabAssociation = (baseId: string, index: number): TabAssociation => {
  return {
    triggerId: `${baseId}-trigger-${index}`,
    panelId: `${baseId}-panel-${index}`,
    hasMatchingTrigger: true,
    hasMatchingPanel: true,
    invalid: false,
  };
};

export interface StaticTabStructure {
  triggers: readonly { value: string; disabled: boolean }[];
  contentValues: readonly string[];
  hasOpaqueSlots: boolean;
  invalidPlacement: boolean;
}

/**
 * Builds the association map used during SSR and the first hydration render.
 *
 * The root can only prove a structure safe when every slot is directly
 * inspectable. Opaque component wrappers therefore fail the whole structure
 * closed until mounted registration can establish the real topology.
 */
export const buildServerTabAssociations = (
  baseId: string,
  structure: StaticTabStructure,
): Map<string, TabAssociation> => {
  const triggerValues = structure.triggers.map((trigger) => trigger.value);
  const values = new Set([...triggerValues, ...structure.contentValues]);
  const associations = new Map<string, TabAssociation>();

  let associationIndex = 0;
  for (const value of values) {
    const triggerCount = triggerValues.filter((triggerValue) => triggerValue === value).length;
    const contentCount = structure.contentValues.filter(
      (contentValue) => contentValue === value,
    ).length;
    const invalid = [
      structure.hasOpaqueSlots,
      structure.invalidPlacement,
      triggerCount > 1,
      contentCount > 1,
    ].some(Boolean);
    const optimistic = getServerTabAssociation(baseId, associationIndex);
    associationIndex += 1;

    associations.set(value, {
      triggerId: [invalid, triggerCount !== 1].some(Boolean) ? undefined : optimistic.triggerId,
      panelId: [invalid, contentCount !== 1].some(Boolean) ? undefined : optimistic.panelId,
      hasMatchingTrigger: !invalid && triggerCount === 1,
      hasMatchingPanel: !invalid && contentCount === 1,
      invalid,
    });
  }

  return associations;
};

/**
 * Keeps server-proven relationship IDs stable once direct slots register.
 * Opaque compatibility slots continue to use their mounted DOM IDs.
 */
export const preserveServerTabAssociationIds = (
  runtimeAssociations: ReadonlyMap<string, TabAssociation>,
  serverAssociations: ReadonlyMap<string, TabAssociation>,
): Map<string, TabAssociation> => {
  const associations = new Map<string, TabAssociation>();
  for (const [value, runtime] of runtimeAssociations) {
    const server = serverAssociations.get(value);
    if (runtime.invalid || !server || server.invalid) {
      associations.set(value, runtime);
      continue;
    }
    associations.set(value, {
      ...runtime,
      triggerId:
        runtime.hasMatchingTrigger && server.hasMatchingTrigger
          ? server.triggerId
          : runtime.triggerId,
      panelId:
        runtime.hasMatchingPanel && server.hasMatchingPanel ? server.panelId : runtime.panelId,
    });
  }
  return associations;
};

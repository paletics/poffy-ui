/** Localized singular and plural accessible fallback labels for reference components. */
export interface ReferenceMessages {
  reference: string;
  references: string;
}

const referenceMessages: Record<'en' | 'ja', ReferenceMessages> = {
  en: {
    reference: 'Reference',
    references: 'References',
  },
  ja: {
    reference: '参照',
    references: '参照一覧',
  },
};

export function getReferenceMessages(
  locale?: string,
  overrides?: Partial<ReferenceMessages>,
): ReferenceMessages {
  const language = locale?.toLowerCase().startsWith('ja') ? 'ja' : 'en';
  return { ...referenceMessages[language], ...overrides };
}

/** Localized fallback text for code blocks and safe Markdown rendering failures. */
export interface MarkdownViewerMessages {
  codeBlock: (language: string | undefined, index: number) => string;
  oversizedSource: string;
  parseError: string;
}

const markdownViewerMessages: Record<'en' | 'ja', MarkdownViewerMessages> = {
  en: {
    codeBlock: (language, index) => `${language || 'Code'} block ${index}`,
    oversizedSource: 'Markdown content exceeds the rendering limit.',
    parseError: 'Markdown content could not be rendered safely.',
  },
  ja: {
    codeBlock: (language, index) =>
      language ? `${language} コードブロック ${index}` : `コードブロック ${index}`,
    oversizedSource: 'Markdown コンテンツがレンダリング上限を超えています。',
    parseError: 'Markdown コンテンツを安全にレンダリングできませんでした。',
  },
};

export function getMarkdownViewerMessages(
  locale?: string,
  overrides?: Partial<MarkdownViewerMessages>,
): MarkdownViewerMessages {
  const language = locale?.toLowerCase().startsWith('ja') ? 'ja' : 'en';
  return { ...markdownViewerMessages[language], ...overrides };
}

const SIDEBAR_NAVIGATION_LABELS: Record<string, string> = {
  en: 'Sidebar navigation',
  ja: 'サイドバーナビゲーション',
};
const { en: DEFAULT_SIDEBAR_NAVIGATION_LABEL = 'Sidebar navigation' } = SIDEBAR_NAVIGATION_LABELS;

/** Resolves the default accessible name for the Sidebar landmark. */
export const getSidebarNavigationLabel = (locale = 'en-US'): string => {
  const normalized = locale.toLowerCase();
  return (
    SIDEBAR_NAVIGATION_LABELS[normalized] ??
    SIDEBAR_NAVIGATION_LABELS[normalized.split('-')[0]] ??
    DEFAULT_SIDEBAR_NAVIGATION_LABEL
  );
};

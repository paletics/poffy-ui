const BREADCRUMB_NAVIGATION_LABELS: Record<string, string> = {
  en: 'Breadcrumb',
  ja: 'パンくずリスト',
};
const { en: DEFAULT_BREADCRUMB_NAVIGATION_LABEL = 'Breadcrumb' } = BREADCRUMB_NAVIGATION_LABELS;

/** Resolves the Breadcrumbs navigation label without expanding shared common-message contracts. */
export const getBreadcrumbNavigationLabel = (locale = 'en-US'): string => {
  const normalized = locale.toLowerCase();
  return (
    BREADCRUMB_NAVIGATION_LABELS[normalized] ??
    BREADCRUMB_NAVIGATION_LABELS[normalized.split('-')[0]] ??
    DEFAULT_BREADCRUMB_NAVIGATION_LABEL
  );
};

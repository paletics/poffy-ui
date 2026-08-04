import type { PaginationLabels } from './Pagination.types';

const ENGLISH_PAGINATION_LABELS: PaginationLabels = {
  navigation: 'pagination',
  previous: 'Prev',
  next: 'Next',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  morePages: 'more pages',
};

const PAGINATION_LABELS: Record<string, PaginationLabels> = {
  en: ENGLISH_PAGINATION_LABELS,
  ja: {
    navigation: 'ページネーション',
    previous: '前へ',
    next: '次へ',
    previousPage: '前のページへ移動',
    nextPage: '次のページへ移動',
    morePages: 'その他のページ',
  },
};

export const getPaginationLabels = (
  locale = 'en-US',
  overrides?: Partial<PaginationLabels>,
): PaginationLabels => ({
  ...(PAGINATION_LABELS[locale.toLowerCase()] ??
    PAGINATION_LABELS[locale.toLowerCase().split('-')[0]] ??
    ENGLISH_PAGINATION_LABELS),
  ...overrides,
});

export const getDefaultPageAriaLabel = (
  locale: string,
  isCurrent: boolean,
  formattedPage: string,
): string =>
  locale.toLowerCase().split('-')[0] === 'ja'
    ? isCurrent
      ? `${formattedPage}ページ目`
      : `${formattedPage}ページ目へ移動`
    : isCurrent
      ? `Page ${formattedPage}`
      : `Go to page ${formattedPage}`;

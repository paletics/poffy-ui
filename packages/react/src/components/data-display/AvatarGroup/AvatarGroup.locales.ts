export interface AvatarGroupLabels {
  group: string;
  showMore: (count: number) => string;
}

const ENGLISH_LABELS: AvatarGroupLabels = {
  group: 'Avatar group',
  showMore: (count) => (count === 1 ? 'Show 1 more avatar' : `Show ${count} more avatars`),
};

const LABELS: Record<string, AvatarGroupLabels> = {
  en: ENGLISH_LABELS,
  ja: {
    group: 'アバターグループ',
    showMore: (count) => `他${count}件のアバターを表示`,
  },
};

export const getAvatarGroupLabels = (locale = 'en-US'): AvatarGroupLabels =>
  LABELS[locale.toLowerCase()] ??
  LABELS[locale.toLowerCase().split('-')[0]] ??
  ENGLISH_LABELS;

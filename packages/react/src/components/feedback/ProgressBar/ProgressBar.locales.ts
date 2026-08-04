interface ProgressBarLabels {
  loading: string;
  loadingProgress: string;
  progress: string;
}

const ENGLISH_LABELS: ProgressBarLabels = {
  loading: 'Loading',
  loadingProgress: 'Loading progress',
  progress: 'Progress',
};

const LABELS: Record<string, ProgressBarLabels> = {
  en: ENGLISH_LABELS,
  ja: { loading: '読み込み中', loadingProgress: '読み込み状況', progress: '進捗' },
};

export const getProgressBarLabels = (locale = 'en-US'): ProgressBarLabels =>
  LABELS[locale.toLowerCase()] ?? LABELS[locale.toLowerCase().split('-')[0]] ?? ENGLISH_LABELS;

export interface CommonMessages {
  close: string;
  dismissAlert: string;
  clearSearch: string;
  copyToClipboard: string;
  copyFailed: string;
  copied: (label: string) => string;
  toggleOptions: string;
  selectOption: string;
  selectOptions: string;
  removeOption: (label: string) => string;
  commandMenu: string;
  contextMenu: string;
  commandPlaceholder: string;
  noCommands: string;
  commandResults: (label: string) => string;
  dialog: string;
  drawer: string;
  alertDialog: string;
  hoverCard: string;
  popover: string;
  loading: string;
  progress: string;
  codeBlock: string;
  sourceCode: string;
  scrollableTable: string;
  scrollableContent: string;
  tabPanel: (value: string) => string;
  increase: string;
  decrease: string;
  confirm: string;
  cancel: string;
  step: (number: number) => string;
  jsonData: string;
  invalidJson: string;
  oversizedJson: string;
  notSet: string;
  resultActions: string;
  emptyStateActions: string;
  completed: string;
  required: string;
}

const ENGLISH_MESSAGES: CommonMessages = {
  close: 'Close',
  dismissAlert: 'Dismiss alert',
  clearSearch: 'Clear search',
  copyToClipboard: 'Copy to clipboard',
  copyFailed: 'Copy failed',
  copied: (label) => `${label} copied`,
  toggleOptions: 'Toggle options',
  selectOption: 'Select option...',
  selectOptions: 'Select options...',
  removeOption: (label) => `Remove ${label}`,
  commandMenu: 'Command menu',
  contextMenu: 'Context menu',
  commandPlaceholder: 'Type a command or search...',
  noCommands: 'No commands found.',
  commandResults: (label) => `${label} results`,
  dialog: 'Dialog',
  drawer: 'Drawer',
  alertDialog: 'Alert dialog',
  hoverCard: 'Hover card',
  popover: 'Popover',
  loading: 'Loading',
  progress: 'Progress',
  codeBlock: 'Code block',
  sourceCode: 'Source code',
  scrollableTable: 'Scrollable table',
  scrollableContent: 'Scrollable content',
  tabPanel: (value) => `Tab panel: ${value}`,
  increase: 'increase',
  decrease: 'decrease',
  confirm: 'OK',
  cancel: 'Cancel',
  step: (number) => `Step ${number}`,
  jsonData: 'JSON data',
  invalidJson: 'Unable to serialize JSON value.',
  oversizedJson: 'JSON content exceeds the serialization limit.',
  notSet: 'Not set',
  resultActions: 'Result actions',
  emptyStateActions: 'Empty state actions',
  completed: 'Completed',
  required: 'Required',
};

const MESSAGES: Record<string, CommonMessages> = {
  en: ENGLISH_MESSAGES,
  ja: {
    close: '閉じる',
    dismissAlert: '通知を閉じる',
    clearSearch: '検索をクリア',
    copyToClipboard: 'クリップボードにコピー',
    copyFailed: 'コピーに失敗しました',
    copied: (label) => `${label}：コピーしました`,
    toggleOptions: '選択肢を開閉',
    selectOption: '選択してください...',
    selectOptions: '選択してください...',
    removeOption: (label) => `${label}を削除`,
    commandMenu: 'コマンドメニュー',
    contextMenu: 'コンテキストメニュー',
    commandPlaceholder: 'コマンドを入力または検索...',
    noCommands: 'コマンドが見つかりません。',
    commandResults: (label) => `${label}の検索結果`,
    dialog: 'ダイアログ',
    drawer: 'ドロワー',
    alertDialog: '警告ダイアログ',
    hoverCard: 'ホバーカード',
    popover: 'ポップオーバー',
    loading: '読み込み中',
    progress: '進捗',
    codeBlock: 'コードブロック',
    sourceCode: 'ソースコード',
    scrollableTable: 'スクロール可能な表',
    scrollableContent: 'スクロール可能なコンテンツ',
    tabPanel: (value) => `タブパネル: ${value}`,
    increase: '増加',
    decrease: '減少',
    confirm: 'OK',
    cancel: 'キャンセル',
    step: (number) => `ステップ${number}`,
    jsonData: 'JSONデータ',
    invalidJson: 'JSON値をシリアライズできません。',
    oversizedJson: 'JSONコンテンツがシリアライズ上限を超えています。',
    notSet: '未設定',
    resultActions: '結果の操作',
    emptyStateActions: '空の状態の操作',
    completed: '完了',
    required: '必須',
  },
};

export const getCommonMessages = (
  locale = 'en-US',
  overrides?: Partial<CommonMessages>,
): CommonMessages => {
  const normalized = locale.toLowerCase();
  const defaults = MESSAGES[normalized] ?? MESSAGES[normalized.split('-')[0]] ?? ENGLISH_MESSAGES;
  return { ...defaults, ...overrides };
};

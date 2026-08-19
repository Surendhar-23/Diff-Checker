export const VIEW_MODES = {
  SPLIT: 'split',
  UNIFIED: 'unified',
  EDITOR: 'editor',
};

export const DIFF_TYPES = {
  LINE: 'line',
  WORD: 'word',
  CHAR: 'char',
  JSON: 'json',
};

export const LINE_STATUS = {
  UNCHANGED: 'unchanged',
  ADDED: 'added',
  DELETED: 'deleted',
  MODIFIED: 'modified',
  EMPTY: 'empty',
};

export const DEFAULT_DIFF_OPTIONS = {
  diffType: DIFF_TYPES.LINE,
  ignoreWhitespace: false,
  ignoreCase: false,
  ignorePunctuation: false,
  trimLines: false,
  sortJsonKeys: false,
};

export const DEFAULT_SETTINGS = {
  fontSize: 13,
  fontFamily: 'JetBrains Mono',
  tabSize: 2,
  wrapLines: false,
  showLineNumbers: true,
  syncScroll: true,
  collapseUnchanged: false,
  collapseThreshold: 8,
  contextLineCount: 3,
  highlightWords: true,
  themeMode: 'dark', // 'light' | 'dark' | 'system'
  autoDetectLanguage: true,
};

export const SUPPORTED_LANGUAGES = [
  { id: 'plaintext', name: 'Plain Text', ext: '.txt' },
  { id: 'javascript', name: 'JavaScript', ext: '.js' },
  { id: 'typescript', name: 'TypeScript', ext: '.ts' },
  { id: 'json', name: 'JSON', ext: '.json' },
  { id: 'html', name: 'HTML / XML', ext: '.html' },
  { id: 'css', name: 'CSS', ext: '.css' },
  { id: 'python', name: 'Python', ext: '.py' },
  { id: 'sql', name: 'SQL', ext: '.sql' },
  { id: 'markdown', name: 'Markdown', ext: '.md' },
  { id: 'yaml', name: 'YAML', ext: '.yaml' },
  { id: 'java', name: 'Java', ext: '.java' },
  { id: 'cpp', name: 'C / C++', ext: '.cpp' },
];

export const STORAGE_KEYS = {
  DIFF_HISTORY: 'snddiffx_history_v1',
  USER_SETTINGS: 'snddiffx_settings_v1',
  SAVED_PRESETS: 'snddiffx_presets_v1',
  THEME_MODE: 'snddiffx_theme_mode_v1',
  DRAFT_ORIGINAL: 'snddiffx_draft_original_v1',
  DRAFT_MODIFIED: 'snddiffx_draft_modified_v1',
};

export const isMacPlatform = () => {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPod|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || '');
};

export const MODIFIER_KEY = isMacPlatform() ? '⌥' : 'Alt';
export const MODIFIER_LABEL = isMacPlatform() ? 'Option' : 'Alt';

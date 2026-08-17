import { createContext } from 'react';
import { DEFAULT_SETTINGS } from '../core/constants';

export const DiffContext = createContext(null);

export const HistoryContext = createContext({
  history: [],
  addHistoryItem: () => {},
  removeHistoryItem: () => {},
  clearHistory: () => {},
  togglePinItem: () => {},
});

export const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
  resetSettings: () => {},
});

export const ThemeContext = createContext({
  mode: 'dark',
  toggleTheme: () => {},
  setMode: () => {},
});

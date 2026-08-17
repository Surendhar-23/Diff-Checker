import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '../theme';
import { STORAGE_KEYS } from '../core/constants';
import { ThemeContext } from './contexts';

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  const setMode = (newMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, newMode);
  };

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

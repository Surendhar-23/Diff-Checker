import { useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '../theme';
import { STORAGE_KEYS } from '../core/constants';
import { ThemeContext } from './contexts';

function getSystemTheme() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // localStorage unavailable in some sandboxes
    }
    return getSystemTheme();
  });

  const setMode = useCallback((newMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, newMode);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
  }, [mode, setMode]);

  // Sync data-theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  // Dynamically respond to OS system theme changes if user hasn't explicitly saved a preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
        if (!saved) {
          setModeState(e.matches ? 'dark' : 'light');
        }
      } catch {
        setModeState(e.matches ? 'dark' : 'light');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemChange);
      return () => mediaQuery.removeListener(handleSystemChange);
    }
  }, []);

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

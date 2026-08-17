import { createTheme, alpha } from '@mui/material/styles';

export const createAppTheme = (mode = 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#3b82f6', // Tailwind blue 500
        light: '#60a5fa',
        dark: '#2563eb',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#8b5cf6',
        light: '#a78bfa',
        dark: '#7c3aed',
      },
      background: {
        default: isDark ? '#090d16' : '#f8fafc',
        paper: isDark ? '#111827' : '#ffffff',
        editor: isDark ? '#0d1117' : '#ffffff',
        gutter: isDark ? '#161b22' : '#f6f8fa',
        activeRow: isDark ? alpha('#3b82f6', 0.08) : alpha('#3b82f6', 0.05),
      },
      text: {
        primary: isDark ? '#f3f4f6' : '#1e293b',
        secondary: isDark ? '#9ca3af' : '#64748b',
        disabled: isDark ? '#6b7280' : '#94a3b8',
      },
      diff: {
        addedBg: isDark ? 'rgba(46, 160, 67, 0.15)' : '#e6ffec',
        addedText: isDark ? '#7ee787' : '#1b4721',
        addedWord: isDark ? 'rgba(46, 160, 67, 0.35)' : '#abf2bc',
        deletedBg: isDark ? 'rgba(248, 81, 73, 0.15)' : '#ffebe9',
        deletedText: isDark ? '#ff7b72' : '#7a1d1d',
        deletedWord: isDark ? 'rgba(248, 81, 73, 0.35)' : '#ffc0c0',
        modifiedBg: isDark ? 'rgba(217, 119, 6, 0.15)' : '#fef3c7',
        modifiedText: isDark ? '#fbbf24' : '#92400e',
        gutterBg: isDark ? '#161b22' : '#f6f8fa',
        gutterText: isDark ? '#6e7681' : '#8c959f',
        borderColor: isDark ? '#30363d' : '#d0d7de',
      },
      divider: isDark ? '#1f2937' : '#e2e8f0',
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      h6: {
        fontWeight: 600,
        fontSize: '1.05rem',
        letterSpacing: '-0.01em',
      },
      subtitle1: {
        fontSize: '0.875rem',
      },
      body2: {
        fontSize: '0.8125rem',
      },
      caption: {
        fontSize: '0.75rem',
        letterSpacing: '0.02em',
      },
      code: {
        fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 6,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? '#1f2937' : '#334155',
            color: '#ffffff',
            fontSize: '0.75rem',
            borderRadius: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};

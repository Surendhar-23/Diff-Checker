import { useState } from 'react';
import { Box } from '@mui/material';

import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { HistoryProvider } from './context/HistoryContext';
import { DiffProvider } from './context/DiffContext';
import { useDiff } from './hooks/useDiff';

import { AppHeader } from './components/layout/AppHeader';
import { DiffToolbar } from './components/layout/DiffToolbar';
import { DiffStatsBar } from './components/layout/DiffStatsBar';
import { DiffViewer } from './components/viewer/DiffViewer';
import { AppFooter } from './components/layout/AppFooter';

import { HistoryDrawer } from './components/modals/HistoryDrawer';
import { ExportModal } from './components/modals/ExportModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ShortcutsDialog } from './components/modals/ShortcutsDialog';
import { SamplePickerModal } from './components/modals/SamplePickerModal';
import { ToastSnackbar } from './components/common/ToastSnackbar';

import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { VIEW_MODES } from './core/constants';

function DiffAppContent() {
  const {
    toastMessage,
    setToastMessage,
    goToNextChange,
    goToPrevChange,
    swapTexts,
    setViewMode,
  } = useDiff();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [samplesOpen, setSamplesOpen] = useState(false);

  // Bind power-user keyboard shortcuts
  useKeyboardShortcuts({
    onNextChange: goToNextChange,
    onPrevChange: goToPrevChange,
    onSwap: swapTexts,
    onViewSplit: () => setViewMode(VIEW_MODES.SPLIT),
    onViewUnified: () => setViewMode(VIEW_MODES.UNIFIED),
    onViewEditor: () => setViewMode(VIEW_MODES.EDITOR),
    onHelp: () => setShortcutsOpen(true),
    onEscape: () => {
      setHistoryOpen(false);
      setExportOpen(false);
      setSettingsOpen(false);
      setShortcutsOpen(false);
      setSamplesOpen(false);
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* Top Header */}
      <AppHeader
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenExport={() => setExportOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        onOpenSamples={() => setSamplesOpen(true)}
      />

      {/* Diff Controls & Granularity Toolbar */}
      <DiffToolbar />

      {/* Live Statistics & Similarity Bar */}
      <DiffStatsBar />

      {/* Main Diff Content Container */}
      <DiffViewer />

      {/* Footer / Status Bar */}
      <AppFooter onOpenShortcuts={() => setShortcutsOpen(true)} />

      {/* Drawers & Modals */}
      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <ShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <SamplePickerModal open={samplesOpen} onClose={() => setSamplesOpen(false)} />

      {/* Toast Feedback */}
      <ToastSnackbar
        open={Boolean(toastMessage)}
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <HistoryProvider>
          <DiffProvider>
            <DiffAppContent />
          </DiffProvider>
        </HistoryProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

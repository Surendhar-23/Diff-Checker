import { useEffect } from 'react';

/**
 * Global keyboard shortcuts hook for power users
 */
export function useKeyboardShortcuts(shortcuts = {}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid firing when user is typing inside textareas or inputs unless modifier key is pressed
      const target = e.target;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Handle Escape
      if (e.key === 'Escape' && shortcuts.onEscape) {
        shortcuts.onEscape();
        return;
      }

      // Handle shortcuts with Alt or Cmd/Ctrl
      if (e.altKey && !e.shiftKey && !cmdOrCtrl) {
        if (e.key === 'n' || e.key === 'N' || e.key === 'ArrowDown') {
          e.preventDefault();
          shortcuts.onNextChange?.();
        } else if (e.key === 'p' || e.key === 'P' || e.key === 'ArrowUp') {
          e.preventDefault();
          shortcuts.onPrevChange?.();
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          shortcuts.onSwap?.();
        } else if (e.key === '1') {
          e.preventDefault();
          shortcuts.onViewSplit?.();
        } else if (e.key === '2') {
          e.preventDefault();
          shortcuts.onViewUnified?.();
        } else if (e.key === '3') {
          e.preventDefault();
          shortcuts.onViewEditor?.();
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          shortcuts.onSearch?.();
        }
      }

      // Help shortcut (? key when not typing)
      if (e.key === '?' && !isInput && !cmdOrCtrl && !e.altKey) {
        e.preventDefault();
        shortcuts.onHelp?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

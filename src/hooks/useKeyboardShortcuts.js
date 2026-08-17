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

      // Handle Escape (always closes modal or clears search)
      if (e.key === 'Escape' && shortcuts.onEscape) {
        shortcuts.onEscape();
        return;
      }

      // Modifier Detection:
      // Option/Alt key on Mac/Win (e.altKey) OR Cmd/Ctrl (e.metaKey / e.ctrlKey)
      const hasAlt = e.altKey;
      const hasCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (hasAlt) {
        // Use e.code because macOS converts Option+Letter into special characters on e.key
        switch (e.code) {
          case 'KeyN':
          case 'ArrowDown':
            e.preventDefault();
            shortcuts.onNextChange?.();
            break;
          case 'KeyP':
          case 'ArrowUp':
            e.preventDefault();
            shortcuts.onPrevChange?.();
            break;
          case 'KeyS':
            e.preventDefault();
            shortcuts.onSwap?.();
            break;
          case 'Digit1':
          case 'Numpad1':
            e.preventDefault();
            shortcuts.onViewSplit?.();
            break;
          case 'Digit2':
          case 'Numpad2':
            e.preventDefault();
            shortcuts.onViewUnified?.();
            break;
          case 'Digit3':
          case 'Numpad3':
            e.preventDefault();
            shortcuts.onViewEditor?.();
            break;
          case 'KeyF':
            e.preventDefault();
            shortcuts.onSearch?.();
            break;
          default:
            break;
        }
      }

      // Also support Cmd+Shift+F or Ctrl+Shift+F for diff search
      if (hasCmdOrCtrl && e.shiftKey && e.code === 'KeyF') {
        e.preventDefault();
        shortcuts.onSearch?.();
      }

      // Help shortcut (? key when not typing in an input)
      if ((e.key === '?' || (e.shiftKey && e.code === 'Slash')) && !isInput && !hasCmdOrCtrl && !hasAlt) {
        e.preventDefault();
        shortcuts.onHelp?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

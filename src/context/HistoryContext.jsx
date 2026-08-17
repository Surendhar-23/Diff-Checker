import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../core/constants';
import { HistoryContext } from './contexts';

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DIFF_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DIFF_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  const addHistoryItem = (item) => {
    if (!item.original?.trim() && !item.modified?.trim()) return;

    setHistory((prev) => {
      // Check if identical item already exists at the top
      const existsIndex = prev.findIndex(
        (h) => h.original === item.original && h.modified === item.modified
      );

      let updated = [...prev];
      if (existsIndex !== -1) {
        // Remove existing duplicate
        const isPinned = updated[existsIndex].isPinned;
        updated.splice(existsIndex, 1);
        updated.unshift({
          ...item,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          isPinned: isPinned || false,
        });
      } else {
        updated.unshift({
          ...item,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          isPinned: false,
        });
      }

      // Limit to max 35 items (keeping pinned ones)
      if (updated.length > 35) {
        const unpinnedCount = updated.filter((x) => !x.isPinned).length;
        if (unpinnedCount > 25) {
          const lastUnpinnedIdx = updated.findLastIndex((x) => !x.isPinned);
          if (lastUnpinnedIdx !== -1) {
            updated.splice(lastUnpinnedIdx, 1);
          }
        }
      }
      return updated;
    });
  };

  const removeHistoryItem = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const togglePinItem = (id) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item))
    );
  };

  const clearHistory = () => {
    // Retain only pinned items
    setHistory((prev) => prev.filter((item) => item.isPinned));
  };

  return (
    <HistoryContext.Provider
      value={{ history, addHistoryItem, removeHistoryItem, clearHistory, togglePinItem }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

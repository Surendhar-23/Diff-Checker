import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { DEFAULT_DIFF_OPTIONS, DIFF_TYPES, VIEW_MODES, STORAGE_KEYS } from '../core/constants';
import { computeDiff } from '../core/diffEngine';
import { formatJsonString, detectLanguage } from '../core/formatters';
import { decodeDiffFromUrl } from '../core/urlState';
import { useHistory } from '../hooks/useHistory';
import { DiffContext } from './contexts';

export function DiffProvider({ children }) {
  const { addHistoryItem } = useHistory();

  // Check URL state first, then localStorage drafts, or start fresh in Edit mode
  const initialUrlState = useMemo(() => decodeDiffFromUrl(), []);

  const [originalText, setOriginalTextState] = useState(() => {
    if (initialUrlState?.original) return initialUrlState.original;
    const saved = localStorage.getItem(STORAGE_KEYS.DRAFT_ORIGINAL);
    return saved !== null ? saved : '';
  });

  const [modifiedText, setModifiedTextState] = useState(() => {
    if (initialUrlState?.modified) return initialUrlState.modified;
    const saved = localStorage.getItem(STORAGE_KEYS.DRAFT_MODIFIED);
    return saved !== null ? saved : '';
  });

  const [originalTitle, setOriginalTitle] = useState('Original');
  const [modifiedTitle, setModifiedTitle] = useState('Modified');

  const [options, setOptions] = useState(() => {
    if (initialUrlState?.diffType) {
      return { ...DEFAULT_DIFF_OPTIONS, diffType: initialUrlState.diffType };
    }
    return DEFAULT_DIFF_OPTIONS;
  });

  const [viewMode, setViewMode] = useState(() => {
    if (initialUrlState?.original || initialUrlState?.modified) return VIEW_MODES.SPLIT;
    const savedOriginal = localStorage.getItem(STORAGE_KEYS.DRAFT_ORIGINAL);
    const savedModified = localStorage.getItem(STORAGE_KEYS.DRAFT_MODIFIED);
    if (savedOriginal?.trim() || savedModified?.trim()) {
      return VIEW_MODES.SPLIT;
    }
    return VIEW_MODES.EDITOR;
  });
  const [currentChangeIndex, setCurrentChangeIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Shared scroll position ratio across Split, Unified, and Editor views
  const scrollRatioRef = useRef(0);

  const updateScrollRatio = useCallback((ratio) => {
    if (typeof ratio === 'number' && !isNaN(ratio)) {
      scrollRatioRef.current = Math.max(0, Math.min(1, ratio));
    }
  }, []);

  const getScrollRatio = useCallback(() => {
    return scrollRatioRef.current || 0;
  }, []);

  // Sync drafts to local storage
  const setOriginalText = useCallback((val) => {
    setOriginalTextState(val);
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFT_ORIGINAL, val);
    } catch {
      // quota or private mode
    }
  }, []);

  const setModifiedText = useCallback((val) => {
    setModifiedTextState(val);
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFT_MODIFIED, val);
    } catch {
      // quota or private mode
    }
  }, []);

  const updateOption = useCallback((key, val) => {
    setOptions((prev) => ({ ...prev, [key]: val }));
  }, []);

  // Compute Diff (Memoized)
  const diffResult = useMemo(() => {
    return computeDiff(originalText, modifiedText, options);
  }, [originalText, modifiedText, options]);

  // Language auto-detection
  const detectedLanguage = useMemo(() => {
    const origLang = detectLanguage(originalText);
    const modLang = detectLanguage(modifiedText);
    return origLang !== 'plaintext' ? origLang : modLang;
  }, [originalText, modifiedText]);

  // Debounced auto-save to History
  const historySaveTimerRef = useRef(null);
  useEffect(() => {
    if (historySaveTimerRef.current) {
      clearTimeout(historySaveTimerRef.current);
    }

    if (!originalText && !modifiedText) return;

    historySaveTimerRef.current = setTimeout(() => {
      addHistoryItem({
        title: `${originalTitle} vs ${modifiedTitle}`,
        original: originalText,
        modified: modifiedText,
        options,
        stats: diffResult.stats,
        language: detectedLanguage,
      });
    }, 2500);

    return () => {
      if (historySaveTimerRef.current) clearTimeout(historySaveTimerRef.current);
    };
  }, [originalText, modifiedText, originalTitle, modifiedTitle, options, diffResult.stats, detectedLanguage, addHistoryItem]);

  // Change navigation actions
  const totalChanges = diffResult.totalChanges;

  const goToNextChange = useCallback(() => {
    if (totalChanges === 0) return;
    setCurrentChangeIndex((prev) => {
      const next = prev >= totalChanges ? 1 : prev + 1;
      return next;
    });
  }, [totalChanges]);

  const goToPrevChange = useCallback(() => {
    if (totalChanges === 0) return;
    setCurrentChangeIndex((prev) => {
      const next = prev <= 1 ? totalChanges : prev - 1;
      return next;
    });
  }, [totalChanges]);

  const goToChangeIndex = useCallback((idx) => {
    setCurrentChangeIndex(idx);
  }, []);

  // Quick Action Utilities
  const swapTexts = useCallback(() => {
    setOriginalTextState((orig) => {
      setModifiedTextState(orig);
      try {
        localStorage.setItem(STORAGE_KEYS.DRAFT_MODIFIED, orig);
      } catch (_err) {
        // ignore
      }
      return modifiedText;
    });
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFT_ORIGINAL, modifiedText);
    } catch (_err) {
      // ignore
    }

    setOriginalTitle((ot) => {
      setModifiedTitle(ot);
      return modifiedTitle;
    });
    setToastMessage('Swapped Left and Right texts');
  }, [modifiedText, modifiedTitle]);

  const clearAll = useCallback(() => {
    setOriginalText('');
    setModifiedText('');
    setOriginalTitle('Original');
    setModifiedTitle('Modified');
    setToastMessage('Cleared all content');
  }, [setOriginalText, setModifiedText]);

  const beautifyOriginal = useCallback(() => {
    try {
      const formatted = formatJsonString(originalText, !!options.sortJsonKeys);
      setOriginalText(formatted);
      setToastMessage('Formatted Left text as JSON');
    } catch (_err) {
      setToastMessage('Could not parse Left text as JSON');
    }
  }, [originalText, options.sortJsonKeys, setOriginalText]);

  const beautifyModified = useCallback(() => {
    try {
      const formatted = formatJsonString(modifiedText, !!options.sortJsonKeys);
      setModifiedText(formatted);
      setToastMessage('Formatted Right text as JSON');
    } catch (_err) {
      setToastMessage('Could not parse Right text as JSON');
    }
  }, [modifiedText, options.sortJsonKeys, setModifiedText]);

  const loadSample = useCallback((sample) => {
    if (!sample) return;
    setOriginalText(sample.original);
    setModifiedText(sample.modified);
    setOriginalTitle(`${sample.name} (v1)`);
    setModifiedTitle(`${sample.name} (v2)`);
    if (sample.language === 'json') {
      updateOption('diffType', DIFF_TYPES.JSON);
    }
    setViewMode(VIEW_MODES.SPLIT);
    setToastMessage(`Loaded sample: ${sample.name}`);
  }, [setOriginalText, setModifiedText, updateOption]);

  const restoreFromHistory = useCallback((item) => {
    if (!item) return;
    setOriginalText(item.original || '');
    setModifiedText(item.modified || '');
    if (item.options) setOptions(item.options);
    setOriginalTitle('Original (Restored)');
    setModifiedTitle('Modified (Restored)');
    setViewMode(VIEW_MODES.SPLIT);
    setToastMessage('Restored session from history');
  }, [setOriginalText, setModifiedText]);

  return (
    <DiffContext.Provider
      value={{
        originalText,
        setOriginalText,
        modifiedText,
        setModifiedText,
        originalTitle,
        setOriginalTitle,
        modifiedTitle,
        setModifiedTitle,
        options,
        setOptions,
        updateOption,
        viewMode,
        setViewMode,
        diffResult,
        detectedLanguage,
        currentChangeIndex,
        goToNextChange,
        goToPrevChange,
        goToChangeIndex,
        searchQuery,
        setSearchQuery,
        swapTexts,
        clearAll,
        beautifyOriginal,
        beautifyModified,
        loadSample,
        restoreFromHistory,
        toastMessage,
        setToastMessage,
        updateScrollRatio,
        getScrollRatio,
      }}
    >
      {children}
    </DiffContext.Provider>
  );
}

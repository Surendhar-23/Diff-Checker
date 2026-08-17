import { useState, useCallback } from 'react';

export function useClipboard(timeout = 2000) {
  const [hasCopied, setHasCopied] = useState(false);

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), timeout);
        return true;
      } catch (_err) {
        // Fallback for older browsers or if permissions denied
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setHasCopied(true);
          setTimeout(() => setHasCopied(false), timeout);
          return true;
        } catch {
          setHasCopied(false);
          return false;
        }
      }
    },
    [timeout]
  );

  return { hasCopied, copy };
}

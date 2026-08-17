/**
 * Encodes diff state to URL hash
 */
export function encodeDiffToUrl(original, modified, options = {}) {
  try {
    const payload = {
      o: original,
      m: modified,
      t: options.diffType || 'line',
    };
    const jsonStr = JSON.stringify(payload);
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    return `${window.location.origin}${window.location.pathname}#diff=${encoded}`;
  } catch {
    return window.location.href;
  }
}

/**
 * Decodes diff state from URL hash if present
 */
export function decodeDiffFromUrl() {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.includes('#diff=')) return null;

    const encoded = hash.split('#diff=')[1];
    if (!encoded) return null;

    const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
    const payload = JSON.parse(jsonStr);

    return {
      original: payload.o || '',
      modified: payload.m || '',
      diffType: payload.t || 'line',
    };
  } catch {
    return null;
  }
}

/**
 * Deep sorts the keys of a JSON object or array recursively
 */
export function deepSortJsonKeys(value) {
  if (Array.isArray(value)) {
    return value.map(deepSortJsonKeys);
  }
  if (value !== null && typeof value === 'object') {
    const sorted = {};
    Object.keys(value)
      .sort()
      .forEach((key) => {
        sorted[key] = deepSortJsonKeys(value[key]);
      });
    return sorted;
  }
  return value;
}

/**
 * Pretty prints JSON string, optionally sorting keys
 */
export function formatJsonString(raw, sortKeys = true, indent = 2) {
  if (!raw || !raw.trim()) return '';
  try {
    const parsed = JSON.parse(raw);
    const normalized = sortKeys ? deepSortJsonKeys(parsed) : parsed;
    return JSON.stringify(normalized, null, indent);
  } catch {
    return raw; // Return raw text if not valid JSON
  }
}

/**
 * Checks if a string is valid JSON
 */
export function isValidJson(raw) {
  if (!raw || typeof raw !== 'string') return false;
  const trimmed = raw.trim();
  if ((!trimmed.startsWith('{') || !trimmed.endsWith('}')) && (!trimmed.startsWith('[') || !trimmed.endsWith(']'))) {
    return false;
  }
  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

/**
 * Preprocesses a single line according to diff options
 */
export function normalizeLineForComparison(line, options = {}) {
  let result = line;

  if (options.ignoreCase) {
    result = result.toLowerCase();
  }

  if (options.ignorePunctuation) {
    result = result.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'<>]/g, '');
  }

  if (options.ignoreWhitespace) {
    result = result.replace(/\s+/g, ' ').trim();
  } else if (options.trimLines) {
    result = result.trim();
  }

  return result;
}

/**
 * Heuristically detects programming language of a text snippet
 */
export function detectLanguage(text) {
  if (!text || !text.trim()) return 'plaintext';
  const trimmed = text.trim();

  // JSON check
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // not strict json
    }
  }

  // HTML / XML
  if (/^<!DOCTYPE html|<html|<div|<head|<body|<xml/i.test(trimmed) || /<[a-z][\s\S]*>/i.test(trimmed)) {
    return 'html';
  }

  // SQL
  if (/\b(SELECT|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE|ALTER TABLE|JOIN|WHERE|GROUP BY)\b/i.test(trimmed)) {
    return 'sql';
  }

  // Python
  if (/\b(def\s+\w+\(|import\s+\w+|from\s+\w+\s+import|class\s+\w+:|elif\s+|if\s+__name__\s*==)/.test(trimmed)) {
    return 'python';
  }

  // CSS
  if (/[.#][a-zA-Z_-][\w-]*\s*\{[\s\S]*\}/.test(trimmed) || /@(media|keyframes|import)/.test(trimmed)) {
    return 'css';
  }

  // JavaScript / TypeScript
  if (/\b(const|let|var|function|import\s+.*from|export\s+(default|const|function)|=>|console\.log)\b/.test(trimmed)) {
    return 'javascript';
  }

  // YAML
  if (/^---|\b[\w-]+:\s+["'\w]/m.test(trimmed)) {
    return 'yaml';
  }

  // Markdown
  if (/^#+\s+|^>\s+|^-\s+\[[ x]\]|```/m.test(trimmed)) {
    return 'markdown';
  }

  return 'plaintext';
}

/**
 * Formats file size in readable human format
 */
export function formatBytes(bytes, decimals = 1) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

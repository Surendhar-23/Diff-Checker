import { generateGitPatch } from './diffEngine';

/**
 * Triggers a browser download of a generated text/blob file
 */
export function downloadFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Exports git patch file (.patch)
 */
export function exportPatchFile(original, modified, originalName = 'original.txt', modifiedName = 'modified.txt') {
  const patch = generateGitPatch(originalName, modifiedName, original, modified);
  downloadFile(`diff_${Date.now()}.patch`, patch, 'text/x-diff;charset=utf-8');
  return patch;
}

/**
 * Exports a standalone, beautiful HTML comparison report
 */
export function exportHtmlReport(original, modified, stats, _options = {}) {
  const patch = generateGitPatch('original.txt', 'modified.txt', original, modified);
  const now = new Date().toLocaleString();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SNDDiffX - Comparison Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; background: #0f172a; color: #f8fafc; }
    .header { margin-bottom: 24px; border-bottom: 1px solid #334155; padding-bottom: 16px; }
    h1 { margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #38bdf8; }
    .timestamp { font-size: 13px; color: #94a3b8; }
    .stats-card { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat { background: #1e293b; padding: 12px 20px; border-radius: 8px; border: 1px solid #334155; }
    .stat-label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 600; }
    .stat-val { font-size: 20px; font-weight: 700; margin-top: 4px; }
    .add { color: #4ade80; }
    .del { color: #f87171; }
    .mod { color: #fbbf24; }
    .sim { color: #38bdf8; }
    .code-container { background: #090d16; border-radius: 8px; border: 1px solid #334155; overflow: hidden; }
    pre { margin: 0; padding: 16px; font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 13px; line-height: 1.5; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
  </style>
</head>
<body>
  <div class="header">
    <h1>SNDDiffX — Diff Report</h1>
    <div class="timestamp">Generated on: ${now}</div>
  </div>
  <div class="stats-card">
    <div class="stat"><div class="stat-label">Similarity</div><div class="stat-val sim">${stats?.similarityScore ?? 0}%</div></div>
    <div class="stat"><div class="stat-label">Additions (+)</div><div class="stat-val add">+${stats?.additions ?? 0}</div></div>
    <div class="stat"><div class="stat-label">Deletions (-)</div><div class="stat-val del">-${stats?.deletions ?? 0}</div></div>
    <div class="stat"><div class="stat-label">Modifications (~)</div><div class="stat-val mod">~${stats?.modifications ?? 0}</div></div>
  </div>
  <div class="code-container">
    <pre>${escapeHtml(patch)}</pre>
  </div>
</body>
</html>`;

  downloadFile(`diff_report_${Date.now()}.html`, html, 'text/html;charset=utf-8');
}

/**
 * Generates and copies markdown diff format
 */
export function generateMarkdownDiff(original, modified, stats) {
  const patch = generateGitPatch('original.txt', 'modified.txt', original, modified);
  return `### Diff Summary
- **Similarity**: ${stats?.similarityScore ?? 0}%
- **Additions**: +${stats?.additions ?? 0} lines
- **Deletions**: -${stats?.deletions ?? 0} lines
- **Modifications**: ~${stats?.modifications ?? 0} lines

\`\`\`diff
${patch}
\`\`\``;
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
